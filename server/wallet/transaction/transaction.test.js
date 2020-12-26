const Transaction = require("./Transaction");
const Wallet = require("../wallet/Wallet");
const { verifySignature } = require("../../util/ellyptic-curve");
const { REWARD_INPUT, MINING_REWARD } = require("../../config");

describe("Transaction", () => {
  let transaction, senderWallet, recipient, amount;

  beforeEach(() => {
    senderWallet = new Wallet();
    recipient = "any public-key";
    amount = 40;
    transaction = new Transaction({ senderWallet, recipient, amount });
  });

  it("has an `id`", () => {
    expect(transaction).toHaveProperty("id");
  });

  describe("outputMap", () => {
    it("has an `outputMap` ", () => {
      expect(transaction).toHaveProperty("outputMap");
    });

    it("outputs the amount to the recipient", () => {
      expect(transaction.outputMap[recipient]).toEqual(amount);
    });

    it("outputs the remaining balance for the `senderWallet", () => {
      expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
        senderWallet.balance - amount
      );
    });

    describe("input", () => {
      it("has an `input`  ", () => {
        expect(transaction).toHaveProperty("input");
      });
      it("has `timestamp` in the input ", () => {
        expect(transaction.input).toHaveProperty("timestamp");
      });

      it("sets the `amount` to the  `senderWallet` balance ", () => {
        expect(transaction.input.amount).toEqual(senderWallet.balance);
      });

      it("sets the `address` to the `senderWallet` publicKey", () => {
        expect(transaction.input.address).toEqual(senderWallet.publicKey);
      });

      it("signs the input", () => {
        const verified = verifySignature({
          publicKey: senderWallet.publicKey,
          data: transaction.outputMap,
          signature: transaction.input.signature,
        });
        expect(verified).toBe(true);
      });
      describe("validTransaction()", () => {
        let errorMock, logMock;

        beforeEach(() => {
          errorMock = jest.fn();
          logMock = jest.fn();
          global.console.error = errorMock;
          global.console.log = logMock;
        });
        describe("when the transaction is valid", () => {
          it("returns true", () => {
            expect(Transaction.validTransaction(transaction)).toBe(true);
          });
        });
        describe("when the transaction is invalid", () => {
          describe("and a  transaction outputMap is invalid", () => {
            it("returns false and logs the error", () => {
              transaction.outputMap.field = "any-field";
              expect(Transaction.validTransaction(transaction)).toBe(false);
              expect(errorMock).toHaveBeenCalled();
            });
          });

          describe("and the transaction input signature is invalid", () => {
            it("returns false and logs error", () => {
              transaction.input.signature = new Wallet().sign();
              expect(Transaction.validTransaction(transaction)).toBe(false);
              expect(errorMock).toHaveBeenCalled();
            });
          });
        });
      });
      // adds a new amount for a new recipient in an existing transactions outputMap
      describe("update()", () => {
        let originalSignature, originalSenderOutput, nextRecipient, nextAmount;
        describe("and the amount is invalid", () => {
          it("throws an error", () => {
            expect(() =>
              transaction.update({
                senderWallet,
                recipient: "foo",
                amount: 77777,
              })
            ).toThrow("amount exceeds balance");
          });
        });
        describe("and the amount is valid", () => {
          beforeEach(() => {
            originalSignature = transaction.input.signature;
            originalSenderOutput =
              transaction.outputMap[senderWallet.publicKey];
            nextRecipient = "any-recipient";
            nextAmount = 40;

            transaction.update({
              senderWallet,
              recipient: nextRecipient,
              amount: nextAmount,
            });
          });
          it("outputs the amount to the next recipient", () => {
            expect(transaction.outputMap[nextRecipient]).toEqual(nextAmount);
          });

          it("substracts the amount from the original sender output amount ", () => {
            expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
              originalSenderOutput - nextAmount
            );
          });

          it("maintains a total output that mathces the input amount", () => {
            const totalOutputAmount = Object.values(
              transaction.outputMap
            ).reduce((total, outputAmount) => {
              return total + outputAmount;
            });

            expect(totalOutputAmount).toEqual(transaction.input.amount);
          });

          it("resigns the transaction", () => {
            expect(transaction.input.signature).not.toEqual(originalSignature);
          });
          describe("and another update for the same recipieint", () => {
            let addedAmount;
            beforeEach(() => {
              addedAmount = 80;
              // this is second update() for nextRecipient
              transaction.update({
                senderWallet,
                recipient: nextRecipient,
                amount: addedAmount,
              });
            });
            it("adds to the recipient amount ", () => {
              expect(transaction.outputMap[nextRecipient]).toEqual(
                nextAmount + addedAmount
              );
            });
            it("substracts the amount from the original sender", () => {
              expect(transaction.outputMap[senderWallet.publicKey]).toEqual(
                originalSenderOutput - nextAmount - addedAmount
              );
            });
          });
        });
      });

      describe("rewardTransaction()", () => {
        let rewardTransaction, minerWallet;
        beforeEach(() => {
          minerWallet = new Wallet();
          rewardTransaction = Transaction.rewardTransaction({ minerWallet });
        });

        it("creates a transaction with the reward input", () => {
          expect(rewardTransaction.input).toEqual(REWARD_INPUT);
        });

        it("creates ones transaction for the miner with the `MINING_REWARD`", () => {
          expect(rewardTransaction.outputMap[minerWallet.publicKey]).toEqual(
            MINING_REWARD
          );
        });
      });
    });
  });
});

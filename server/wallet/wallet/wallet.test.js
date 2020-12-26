const Wallet = require("./Wallet");
const { verifySignature } = require("../../util/ellyptic-curve");
const Transaction = require("../transaction/Transaction");
const Blockchain = require("../../blockchain/blockchain/Blockchain");
const { STARTING_BALANCE } = require("../../config");

describe("Wallet", () => {
  let wallet;
  beforeEach(() => {
    wallet = new Wallet();
  });
  it("has a `balance`", () => {
    expect(wallet).toHaveProperty("balance");
  });
  it("has a `publicKey` ", () => {
    // we have to tell jest we are using node env in package.json
    expect(wallet).toHaveProperty("publicKey");
  });

  describe("signing data", () => {
    const data = "it can be anything";
    it("verifies a signature", () => {
      const verified = verifySignature({
        publicKey: wallet.publicKey,
        data,
        signature: wallet.sign(data),
      });

      expect(verified).toBe(true);
    });

    it("does not verify invalid signature", () => {
      const result = verifySignature({
        publicKey: wallet.publicKey,
        data,
        signature: new Wallet().sign(data),
      });
      expect(result).toBe(false);
    });

    // needs senderWallet, amount and recipient
    describe("create Transaction", () => {
      describe("and the amount exceeds the balance", () => {
        it("throws an error", () => {
          expect(() =>
            wallet.createTransaction({ amount: 1111, recipient: "anyone" })
          ).toThrow("Amount exceeds balance");
        });
      });
      describe("and the amount is valid ", () => {
        let transaction, amount, recipient;
        beforeEach(() => {
          amount = 50;
          recipient = "anything";
          transaction = wallet.createTransaction({ amount, recipient });
        });
        it("creates an instance of Transaction", () => {
          expect(transaction instanceof Transaction).toBe(true);
        });
        it("matches the transaction input with the wallet ", () => {
          expect(transaction.input.address).toEqual(wallet.publicKey);
        });
        it("outputs the amount to the recipient", () => {
          expect(transaction.outputMap[recipient]).toEqual(amount);
        });
      });
    });
    describe("calculate Balance", () => {
      let blockchain;
      beforeEach(() => {
        blockchain = new Blockchain();
      });
      describe("there are no outputs for the wallet", () => {
        it("returns the starting baalnce", () => {
          const balance = Wallet.calculateBalance({
            chain: blockchain.chain,
            address: wallet.publicKey,
          });
          expect(balance).toEqual(STARTING_BALANCE);
        });
      });
      describe("and there are outputs for the wallet", () => {
        let transactionOne, transactionTwo;

        beforeEach(() => {
          transactionOne = new Wallet().createTransaction({
            recipient: wallet.publicKey,
            amount: 50,
          });

          transactionTwo = new Wallet().createTransaction({
            recipient: wallet.publicKey,
            amount: 60,
          });

          blockchain.addBlock({ data: [transactionOne, transactionTwo] });
        });
        it("adds the sum of all outputs to the wallet balance", () => {
          expect(
            Wallet.calculateBalance({
              chain: blockchain.chain,
              address: wallet.publicKey,
            })
          ).toEqual(
            STARTING_BALANCE +
              transactionOne.outputMap[wallet.publicKey] +
              transactionTwo.outputMap[wallet.publicKey]
          );
        });
      });
    });
  });
});

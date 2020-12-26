const Transaction = require("../transaction/Transaction");
const TransactionPool = require("./TransactionPool");
const Wallet = require("../wallet/Wallet");
const Blockchain = require("../../blockchain/blockchain/Blockchain");

describe("TransactionPool", () => {
  let transactionPool, transaction, senderWallet;

  beforeEach(() => {
    transactionPool = new TransactionPool();
    senderWallet = new Wallet();
    transaction = new Transaction({
      senderWallet: senderWallet,
      recipient: "anyone",
      amount: 50,
    });
  });

  describe("setTransaction()", () => {
    it("adds a transaction", () => {
      transactionPool.setTransaction(transaction);
      // transactio is an object. if its properties change, js will treat it as the same object.
      // Since we want the unodiefied objec there, we choose the toBe to be strictly precise
      expect(transactionPool.transactionMap[transaction.id]).toBe(transaction);
    });
  });

  describe("existingTransaction()", () => {
    it("returns an existing transaction given an input addres", () => {
      transactionPool.setTransaction(transaction);
      const existingTransaction = transactionPool.existingTransaction({
        inputAddress: senderWallet.publicKey,
      });
      expect(existingTransaction).toBe(transaction);
    });
  });

  describe("validTransactions()", () => {
    let validTransactions, errorMock;
    beforeEach(() => {
      validTransactions = [];
      errorMock = jest.fn();
      global.console.error = errorMock;

      // creating an array, some of transactions are valid some are not
      for (let i = 0; i < 10; i++) {
        transaction = new Transaction({
          senderWallet,
          recipient: "any-recipient",
          amount: 30,
        });

        if (i % 3 === 0) {
          transaction.input.amount = 999999;
        } else if (i % 3 === 1) {
          // making transaction invalid with wrong signature
          transaction.input.signature = new Wallet().sign("foo");
        } else {
          validTransactions.push(transaction);
        }

        transactionPool.setTransaction(transaction);
      }
    });
    it("returns valid transactions", () => {
      expect(transactionPool.validTransactions()).toEqual(validTransactions);
    });

    it("logs errors for the invalid transaction", () => {
      transactionPool.validTransactions();
      expect(errorMock).toHaveBeenCalled();
    });
  });

  describe("clear()", () => {
    it("clears the transaction", () => {
      transactionPool.clear();
      expect(transactionPool.transactionMap).toEqual({});
    });
  });

  describe("clearBlockchainTransactions()", () => {
    it("clears the pool of any existing blockchain transactions", () => {
      const blockchain = new Blockchain();
      const expectedTransactionMap = {};

      for (let i = 0; i < 6; i++) {
        const transaction = new Wallet().createTransaction({
          recipient: "foo",
          amount: 20,
        });

        transactionPool.setTransaction(transaction);

        if (i % 2 === 0) {
          blockchain.addBlock({ data: [transaction] });
        } else {
          expectedTransactionMap[transaction.id] = transaction;
        }
      }

      transactionPool.clearBlockchainTransactions({ chain: blockchain.chain });

      expect(transactionPool.transactionMap).toEqual(expectedTransactionMap);
    });
  });
});

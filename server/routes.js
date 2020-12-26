const express = require("express");
const router = express.Router();

const Blockchain = require("./blockchain/blockchain/Blockchain");
const PubSub = require("./pub-sub/PubSub");
const TransactionPool = require("./wallet/transaction-pool/TransactionPool");
const Wallet = require("./wallet/wallet/Wallet");
const TransactionMiner = require("./blockchain/TransactionMiner");

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const wallet = new Wallet();
const pubsub = new PubSub({ blockchain, transactionPool });
const transactionMiner = new TransactionMiner({
  blockchain,
  transactionPool,
  wallet,
  pubsub,
});

router.get("/api/blocks", (req, res) => {
  res.json(blockchain.chain);
});

router.get("/api/transaction-pool-map", (req, res) => {
  res.json(transactionPool.transactionMap);
});

router.post("/api/mine", (req, res) => {
  const { data } = req.body;
  blockchain.addBlock({ data });
  pubsub.broadcastChain();
  //postman automatically redirects
  res.redirect("/api/blocks");
});

router.get("/api/mine-transactions", (req, res) => {
  transactionMiner.mineTransactions();

  res.redirect("/api/blocks");
});

router.get("/api/wallet-info", (req, res) => {
  const address = wallet.publicKey;
  res.json({
    address,
    balance: Wallet.calculateBalance({
      chain: blockchain.chain,
      address,
    }),
  });
});

router.get("/api/my-transactions", (req, res) => {
  const address = wallet.publicKey;
  const chain = blockchain.chain;
  const transactions = wallet.getMyTransactions({ address, chain });
  res.status(200).send(transactions);
});

router.post("/api/transact", async (req, res) => {
  const { amount, recipient } = req.body;
  let transaction = transactionPool.existingTransaction({
    inputAddress: wallet.publicKey,
  });
  try {
    if (transaction) {
      transaction.update({ senderWallet: wallet, recipient, amount });
    } else {
      transaction = wallet.createTransaction({
        recipient,
        amount,
        chain: blockchain.chain,
      });
    }
  } catch (e) {
    return res.status(400).json({ type: "error", message: e.message });
  }
  transactionPool.setTransaction(transaction);
  await pubsub.broadcastTransaction(transaction);

  res.json({ type: "success", transaction });
});

module.exports = router;

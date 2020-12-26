const app = require("./server");
const Blockchain = require("./blockchain/blockchain/Blockchain");
const PubSub = require("./pub-sub/PubSub");
const syncChain = require("./util/synchronization");
const TransactionPool = require("./wallet/transaction-pool/TransactionPool");

const blockchain = new Blockchain();
const transactionPool = new TransactionPool();
const DEFAULT_PORT = process.env.PORT || 4500;

let PEER_PORT;
if (process.env.BLOCKCHAIN_PEER_PORT === "true") {
  PEER_PORT = DEFAULT_PORT + Math.ceil(Math.random() * 1000);
}

const port = PEER_PORT || DEFAULT_PORT;
// getting the blockchain
const getBlocksUrl = `http://localhost:${DEFAULT_PORT}/api/blocks`;
// getting the transaction pool
const transactionPoolUrl = `http://localhost:${DEFAULT_PORT}/api/transaction-pool-map`;

app.listen(port, async () => {
  console.log(`listening on port ${port}`);
  await syncChain(
    getBlocksUrl,
    transactionPoolUrl,
    blockchain,
    transactionPool
  );
});

module.exports = DEFAULT_PORT;

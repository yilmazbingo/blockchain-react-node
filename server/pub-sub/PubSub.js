// ------------------REDIS WORKS WITH STRING VALUES--------------
const redis = require("redis");

const CHANNELS = {
  BLOCKCHAIN: "BLOCKCHAIN",
  TRANSACTION: "TRANSACTION",
};

// unlike socket, we do not need to know the address of otehr nodes

// ---------------------------HERE IS BROADCASTING STATION---------------------
// it writes multiple processes to communicate over channels.
// we sometimes put methods in constructor because we need to access local variables
class PubSub {
  constructor({ blockchain, transactionPool }) {
    // it is able to broadcast its chain and replacing the valid chain
    this.blockchain = blockchain;
    this.transactionPool = transactionPool;

    this.publisher = redis.createClient();
    this.subscriber = redis.createClient();
    this.subscribeToChannels();
    // this.subscriber.on("message", (channel, message) => {
    //   return this.handleMessage(channel, message);
    // });
    this.subscriber.on("message", (channel, message) =>
      this.handleMessage(channel, message)
    );
  }

  // we are listening all channels
  subscribeToChannels() {
    Object.values(CHANNELS).forEach((channel) => {
      this.subscriber.subscribe(channel);
    });
  }

  publish({ channel, message }) {
    //we unsubscrive so we dont send message to ourselves
    // we subscribe again to receive messages
    this.subscriber.unsubscribe(channel, () => {
      this.publisher.publish(channel, message, () => {
        this.subscriber.subscribe(channel);
      });
    });
  }

  // ------THIS IS WHERE BROADCASTING DONE-------------
  handleMessage(channel, message) {
    console.log(`Message received. Channel: ${channel}. Message: ${message}.`);
    const parsedMessage = JSON.parse(message);
    switch (channel) {
      case CHANNELS.BLOCKCHAIN:
        this.blockchain.replaceChain(parsedMessage, true, () => {
          // we need to clear local transaction pool becasue we got a new chain
          this.transactionPool.clearBlockchainTransactions({
            chain: parsedMessage,
          });
        });
        break;
      case CHANNELS.TRANSACTION:
        console.log("this in pubsusb", this.transactionPool);
        this.transactionPool.setTransaction(parsedMessage);

        break;
      default:
        return;
    }
  }

  broadcastChain() {
    this.publish({
      channel: CHANNELS.BLOCKCHAIN,
      message: JSON.stringify(this.blockchain.chain),
    });
  }

  broadcastTransaction(transaction) {
    this.publish({
      channel: CHANNELS.TRANSACTION,
      message: JSON.stringify(transaction),
    });
  }
}

module.exports = PubSub;

const Block = require("../block/Block");
const Transaction = require("../../wallet/transaction/Transaction");
const Wallet = require("../../wallet/wallet/Wallet");
const cryptoHash = require("../../util/crypto-hash");
const { REWARD_INPUT, MINING_REWARD } = require("../../config");

class Blockchain {
  constructor() {
    // chain has to be validated all the time. new block should be legit
    this.chain = [Block.getGenesisBlock()];
    this.getLastBlock = function () {
      return this.chain[this.chain.length - 1];
    };
  }

  addBlock({ data }) {
    // check mineBlock()
    const newBlock = Block.mineBlock({
      lastBlock: this.chain[this.chain.length - 1],
      data,
    });
    this.chain.push(newBlock);
  }

  // onSuccess is a callback
  replaceChain(chain,validateTransactions, onSuccess) {
    if (chain.length <= this.chain.length) {
      console.error("incoming chain must be longer");
      return;
    }

    if (!Blockchain.isValidChain(chain)) {
      console.error("incoming chain must be valid");
      return;
    }

    if (validateTransactions && !this.validTransactionData({ chain })) {
      console.error('The incoming chain has invalid data');
      return;
    }
    // we call this in pubsub. if we made it so far, that means it passed all the checks
    if (onSuccess) onSuccess();
    console.log("replacing chain with", chain);

    this.chain = chain;
  }

  
    
  validTransactionData({ chain }) {
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const transactionSet = new Set();
      let rewardTransactionCount = 0;

      // each block should have only 1 reward
      for (let transaction of block.data) {
        if (transaction.input.address === REWARD_INPUT.address) {
          rewardTransactionCount += 1;

          if (rewardTransactionCount > 1) {
            console.error("Miner rewards exceed limit");
            return false;
          }

          if (Object.values(transaction.outputMap)[0] !== MINING_REWARD) {
            console.error("Miner reward amount is invalid");
            return false;
          }
        } else {
          if (!Transaction.validTransaction(transaction)) {
            console.error("Invalid transaction");
            return false;
          }

          const trueBalance = Wallet.calculateBalance({
            chain: this.chain,
            address: transaction.input.address,
          });

          if (transaction.input.amount !== trueBalance) {
            console.error("Invalid input amount");
            return false;
          }

          // prevent duplicate transaction
          if (transactionSet.has(transaction)) {
            console.error(
              "An identical transaction appears more than once in the block"
            );
            return false;
          } else {
            transactionSet.add(transaction);
          }
        }
      }
    }

    return true;
  }

  // ------------------------BLOCKCHAIN VALIDATE BLOCK------
  static isValidChain(chain) {
    // their genesis block should be same. simple but essential rule
    // two objects cannot be equal. we stringify
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.getGenesisBlock())) {
      return false;
    }

    //we skip the genesis block
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const previousBlockHash = chain[i - 1].hash;
      const { timestamp, lastBlockHash, hash, nonce, difficulty, data } = block;

      // we have safeguard the increased by 1. if increased more, network will slow down
      const lastDifficulty = chain[i - 1].difficulty;
      if (Math.abs(lastDifficulty - difficulty) > 1) return false;

      if (lastBlockHash !== previousBlockHash) return false;

      // The block timestamp is less than two hours in the future (allowing for time errors
      //---------------------FIX THIS LATER
      // if (
      //   Date.now() - this.chain[this.chain.length - 1].timestamp >
      //   2 * 60 * 60 * 1000
      // )
      //   return false;

      const validatedHash = cryptoHash(
        timestamp,
        lastBlockHash,
        nonce,
        difficulty,
        data
      );
      if (hash !== validatedHash) return false;
    }
    return true;
  }
}

module.exports = Blockchain;

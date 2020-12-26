const hexToBinary = require("hex-to-binary");
const { GENESIS_DATA, MINE_RATE } = require("../../config");
const cryptoHash = require("../../util/crypto-hash");

class Block {
  //if there are many args, it is better wrap them up with object
  //so we do not need to remember order of the arguments
  // that si why new Block({object})
  constructor({ lastBlockHash, hash, timestamp, data, nonce, difficulty }) {
    this.timestamp = timestamp;
    this.lastBlockHash = lastBlockHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty;
  }
  // genesis block is the origin of the blockchain
  // in static methods, we can refer to class name. new Block({})
  // this is a factory method, creating an instance of a class. we are not using constructor method
  // The static method are not called on the instance of class they are made to call directly on the class.

  //---------------------------------------------------------GENESIS----------------------------------------------------------------
  static getGenesisBlock() {
    // return new Block(GENESIS_DATA);
    return new Block(GENESIS_DATA);
  }

  // -------------------------------------------------------MINEBLOCK---------------------------------------------------------------

  // since creating a block is expensive, it is called mining
  // it will be added to the blockchian by the Blockchain class
  // block will be MINED  when miner finds the NONCE
  static mineBlock({ lastBlock, data }) {
    let timestamp, binaryFormOfHash, hash;
    // const timestamp = Date.now();
    const lastBlockHash = lastBlock.hash;
    let { difficulty } = lastBlock;
    let nonce = 0;

    //This loop will always be executed at least once, even if the condition is false, because the code block is executed before the condition is tested:
    do {
      nonce++;
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty({
        originalBlock: lastBlock,
        timestamp,
      });
      hash = cryptoHash(timestamp, nonce, lastBlockHash, data, difficulty);
      binaryFormOfHash = hexToBinary(hash);
    } while (
      binaryFormOfHash.substring(0, difficulty) !== "0".repeat(difficulty)
    );
    // difficulty > 0

    // creating a new block
    return new this({
      timestamp,
      lastBlockHash,
      data,
      difficulty,
      hash,
      nonce,
      // hash: cryptoHash(timestamp, lastBlockHash, data, nonce, difficulty),
    });
  }

  //-----------------------------------------------ADJUST DIFFICULTY--------------------------------------------------------------
  // original block is the last block before mining
  static adjustDifficulty({ originalBlock, timestamp }) {
    const { difficulty } = originalBlock;
    // we do not want difficulty goes below 1
    if (difficulty < 1) return 1;

    const newBlockCreationTime = timestamp - originalBlock.timestamp;
    if (newBlockCreationTime > MINE_RATE) {
      return difficulty - 1;
    } else {
      return difficulty + 1;
    }
  }
}

module.exports = Block;

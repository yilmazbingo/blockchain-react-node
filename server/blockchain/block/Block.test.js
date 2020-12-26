const Block = require("./Block");
const { GENESIS_DATA, MINE_RATE } = require("../../config");
const cryptoHash = require("../../util/crypto-hash");
const hexToBinary = require("hex-to-binary");

describe("Block", () => {
  const timestamp = "1000";
  const lastBlockHash = "dadas";
  const hash = "dadas";
  const data = "dsada";
  const difficulty = 4;
  const nonce = 12;
  const block = new Block({
    timestamp,
    lastBlockHash,
    hash,
    data,
    difficulty,
    nonce,
  });

  it("has a timestamp, lastBlockHash,hash,data,nonce and difficulty properties", () => {
    expect(block.timestamp).toEqual(timestamp);
    expect(block.lastBlockHash).toEqual(lastBlockHash);
    expect(block.hash).toEqual(hash);
    expect(block.data).toEqual(data);
    expect(block.nonce).toEqual(nonce);
    expect(block.difficulty).toEqual(difficulty);
  });

  describe("genesis()", () => {
    const genesisBlock = Block.getGenesisBlock();
    it("returns a Block instance", () => {
      expect(genesisBlock instanceof Block).toBe(true);
    });
    it("returns the genesis data", () => {
      expect(genesisBlock).toEqual(GENESIS_DATA);
    });
  });

  describe("mineBlock()", () => {
    // it can be any block
    const lastBlock = Block.getGenesisBlock();
    const data = "anything";
    const minedBlock = Block.mineBlock({
      lastBlock,
      data,
    });
    it("returns a Block instance", () => {
      expect(minedBlock instanceof Block).toBe(true);
    });
    it("sets the `lastBlockHash` to be the `hash` of the lastBlock", () => {
      expect(minedBlock.lastBlockHash).toBe(lastBlock.hash);
    });
    it("sets the `data`", () => {
      expect(minedBlock.data).toEqual(data);
    });
    it("sets a `timestamp`", () => {
      expect(minedBlock.timestamp).not.toEqual(undefined);
    });
    it("sets a `hash` that matches the difficulty criteria", () => {
      expect(
        hexToBinary(minedBlock.hash).substring(0, minedBlock.difficulty)
      ).toEqual("0".repeat(minedBlock.difficulty));
    });
    it("creates a sha256 `hash` ", () => {
      expect(minedBlock.hash).toEqual(
        cryptoHash(
          minedBlock.timestamp,
          minedBlock.lastBlockHash,
          minedBlock.difficulty,
          minedBlock.nonce,
          minedBlock.data
        )
      );
    });
    describe("adjustDifficulty", () => {
      // we can set the timestamp staticcally
      it("raises the difficuty for a quickly mined block", () => {
        expect(
          Block.adjustDifficulty({
            originalBlock: block,
            timestamp: block.timestamp + MINE_RATE - 400,
          })
        ).toBe(block.difficulty + 1);
      });

      it("lowers the difficulty for a slowly mined block", () => {
        expect(
          Block.adjustDifficulty({
            originalBlock: block,
            timestamp: block.timestamp + MINE_RATE + 70,
          })
        ).toBe(block.difficulty - 1);
      });
    });
  });
});

const Blockchain = require("./Blockchain");
const Block = require("../block/Block");
const cryptoHash = require("../../util/crypto-hash");

describe("Blockchain", () => {
  let blockchain, newBlockChain, originalChain;

  beforeEach(() => {
    blockchain = new Blockchain();
    newBlockChain = new Blockchain();
    originalChain = blockchain.chain;
  });
  it("it is instance of Blockchain", () => {
    expect(blockchain instanceof Blockchain).toBe(true);
  });
  it("containt `chain` array instance", () => {
    expect(blockchain.chain instanceof Array).toBe(true);
  });
  it("starts with genesis Block", () => {
    expect(blockchain.chain[0]).toEqual(Block.getGenesisBlock());
  });
  // when we are adding block, we call Block.mineBlock()
  it("adds a new block to chain", () => {
    const newBlockData = "datala";
    blockchain.addBlock({ data: newBlockData });
    expect(blockchain.getLastBlock().data).toEqual(newBlockData);
  });

  describe("isValidChain()", () => {
    describe("when the chain does not start with the genesis block", () => {
      it("returns false", () => {
        // we modified the genesis block here. Next test will also use this modified data
        // we need to use beforeEach() to get the new instance of blockchain
        blockchain.chain[0] = { time: "anyting" };
        expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
      });
    });
    describe("when the chain starts with the genesis block and has multiple blocks", () => {
      beforeEach(() => {
        blockchain.addBlock({ data: "Anything" });
        blockchain.addBlock({ data: "Athing" });
        blockchain.addBlock({ data: "Anytng" });
      });
      describe("and lastBlockHash reference has changed", () => {
        it("returns false", () => {
          blockchain.getLastBlock().lastBlockHash = "changed";
          expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
        });
        describe("and the chain has a block with jumped difficulty", () => {
          it("returns false", () => {
            const lastBlock = blockchain.getLastBlock();
            const lastBlockHash = lastBlock.hash;
            const timestamp = Date.now();
            const nonce = 0;
            const data = [];
            const difficulty = lastBlock.difficulty + 10;
            const hash = cryptoHash(
              lastBlockHash,
              timestamp,
              nonce,
              data,
              difficulty
            );
            const modifiedBlock = Block.mineBlock({
              lastBlock: {
                lastBlockHash,
                timestamp,
                nonce,
                difficulty,
                hash,
              },
              data,
            });
            blockchain.chain.push(modifiedBlock);
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
          });
        });
        describe("and the chain contains block with an invalid field", () => {
          it("returns false", () => {
            blockchain.getLastBlock().data = "changed";
            expect(Blockchain.isValidChain(blockchain.chain)).toBe(false);
          });
          describe("and the chain does not contain any invalid block ", () => {
            it("returns true", () => {
              expect(Blockchain.isValidChain(blockchain.chain)).toBe(true);
            });
          });
        });
      });
    });
  });
  describe(`replaceChain()`, () => {
    //-----------terminal will show only the test results-----
    let errorMock, logMock;
    beforeEach(() => {
      errorMock = jest.fn();
      logMock = jest.fn();
      global.console.error = errorMock;
      global.console.log = logMock;
    });
    describe("when newChain is not longer", () => {
      it("does not replace the chain", () => {
        // if we did not add this, newBlockChain would be same as originalChain
        newBlockChain.chain[0] = { makeItDifferentChain: true };
        blockchain.replaceChain(newBlockChain.chain);
        expect(blockchain.chain).toEqual(originalChain);
      });
    });
    describe("when the new chain is longer", () => {
      beforeEach(() => {
        newBlockChain.addBlock({
          timestamp: Date.now(),
          lastHash: "-----",
          hash: "hash-one",
          difficulty: 2,
          nonce: 0,
          data: "fo",
        });
      });
      describe("and the chain is invalid", () => {
        it("does not replace the chain", () => {
          newBlockChain.chain[1].hash = "I tampered the hash";

          blockchain.replaceChain(newBlockChain.chain);
          expect(blockchain.chain).toEqual(originalChain);
        });
      });
      describe("and the chain is valid", () => {
        it("should replace the chain", () => {
          blockchain.replaceChain(newBlockChain.chain);
          expect(blockchain.chain).toEqual(newBlockChain.chain);
        });
      });
    });
  });
});

// keep it shorter for developing environemnt
const MINE_RATE = 1000;

// can be any value
const INITIAL_DIFFICULTY = 3;

const GENESIS_DATA = {
  timestamp: 1,
  lastBlockHash: "-----",
  hash: "hash-one",
  difficulty: INITIAL_DIFFICULTY,
  nonce: 0,
  data: [],
};

// to start a transaction, you need balance
const STARTING_BALANCE = 1000;

// coinbase
const REWARD_INPUT = { address: "coinbase transaction" };

const MINING_REWARD = 12.5;

module.exports = {
  GENESIS_DATA,
  MINE_RATE,
  STARTING_BALANCE,
  REWARD_INPUT,
  MINING_REWARD,
};

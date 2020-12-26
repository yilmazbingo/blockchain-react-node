const Transaction = require("../transaction/Transaction");
const { STARTING_BALANCE } = require("../../config");
const { ec } = require("../../util/ellyptic-curve");
const cryptoHash = require("../../util/crypto-hash");

// it has to sign data and also able to verify the signatures of other wallets
// we do not accept transactions unless wallet gives a proper signature with its private key
// wallet is a keychain. it does not store the currency
// in real world keys are store in wallet.dat file
class Wallet {
  constructor() {
    this.balance = STARTING_BALANCE;
    this.keyPair = ec.genKeyPair();
    // ec returns x,y points of elliptic curve. so we convert it to hex.
    this.publicKey = this.keyPair.getPublic().encode("hex");
  }

  // in asymmetric-encryption we need digital fingerprint-hash before sign it
  sign(data) {
    return this.keyPair.sign(cryptoHash(data));
  }

  createTransaction({ recipient, amount, chain }) {
    if (chain) {
      this.balance = Wallet.calculateBalance({
        chain,
        address: this.publicKey,
      });
    }
    if (amount > this.balance) {
      throw new Error("Amount exceeds balance");
    }

    return new Transaction({ senderWallet: this, recipient, amount });
  }

  getMyTransactions({ chain, address }) {
    let myTransactions = [];
    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];
      // outputMap has recipientAddress for tx and senderAddress for change
      for (let transaction of block.data) {
        const outputMapKeys = Object.keys(transaction.outputMap);
        outputMapKeys.map((address) => address === address).length > 1
          ? myTransactions.push(transaction)
          : "";
      }
    }
    return myTransactions;
  }
  static calculateBalance({ chain, address }) {
    let hasConductedTransaction = false;
    let outputsTotal = 0;
    for (let i = chain.length - 1; i > 0; i--) {
      const block = chain[i];
      // for/of - loops through the values of an iterable object
      for (let transaction of block.data) {
        if (transaction.input.address === address) {
          hasConductedTransaction = true;
        }
        const addressOutput = transaction.outputMap[address];
        if (addressOutput) {
          outputsTotal = outputsTotal + addressOutput;
        }
      }
      if (hasConductedTransaction) {
        break;
      }
    }
    return hasConductedTransaction
      ? outputsTotal
      : STARTING_BALANCE + outputsTotal;
  }
}

// const w = new Wallet();
// console.log(w);
module.exports = Wallet;

const { v1: uuidv1 } = require("uuid"); //timestamp
const { verifySignature } = require("../../util/ellyptic-curve");
const { REWARD_INPUT, MINING_REWARD } = require("../../config");

class Transaction {
  // if outputMap and input are defined, we overwrite this.outputMap and this.input
  // outMap and input are created for the reward transactions. check "static rewardTransaction"
  constructor({ senderWallet, recipient, amount, outputMap, input }) {
    this.id = uuidv1();
    this.outputMap =
      outputMap || this.createOutputMap({ senderWallet, recipient, amount });
    // input SIGNS
    this.input =
      input || this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  createOutputMap({ senderWallet, recipient, amount }) {
    // contains amount of bitcoin and a cryptographic puzzle:LOCKING SCRIPT, mostly P2PKH=pay-to-public-key-hash
    // In reality there is no address. public key is the address to unlock the Locking Script
    // Locking Script specifies the conditons that must be met to spend the output
    // setting obj in this case will be ok instead of new Map()
    const outputMap = {};
    // [recipient] and [senderWallet.publicKey] are computed properties
    outputMap[recipient] = amount;
    // this is sent to the sender itself as a change.
    // in real life, i can send only if i get btc before and i can send only this amount as whole. i cannot divide it.
    // If you purchased an item that costs 5 bitcoin but only had a 20 bitcoin input to use, you would send one output of 5 bitcoin to the store owner and one out‐ put of 15 bitcoin back to yourself as change (less any applicable transaction fee).
    //Different wallets may use different strategies when aggregating inputs to make a payment requested by the user. They might aggregate many small inputs, or use one that is equal to or larger than the desired payment.
    outputMap[senderWallet.publicKey] = senderWallet.balance - amount;
    return outputMap;
  }

  // each input refers to previously existing UTXO:Unspent Transaction Outputs
  // wallet owner is reporting its wealth and account number and signing the amount s/he wants to give up
  // transactions move value from transaction inputs to transaction outputs.
  createInput({ senderWallet, outputMap }) {
    return {
      timestamp: Date.now(),
      amount: senderWallet.balance,
      address: senderWallet.publicKey,
      // Unlocking Script = scriptSig
      signature: senderWallet.sign(outputMap),
    };
  }

  // we are updating the properties of outPutMap, but it is still referencing same object in the memory.
  // two references to the same object in js always treated as equal, even if the properties in that object has changed in one of the references.
  update({ senderWallet, recipient, amount }) {
    if (amount > this.outputMap[senderWallet.publicKey]) {
      throw new Error("amount exceeds balance");
    }

    if (!this.outputMap[recipient]) {
      this.outputMap[recipient] = amount;
    } else {
      this.outputMap[recipient] = this.outputMap[recipient] + amount;
    }
    this.outputMap[senderWallet.publicKey] =
      this.outputMap[senderWallet.publicKey] - amount;
    // createInput signs the transaction. Since output is still same even though its properties changed, signature will be same
    // two references to the same object in javascript are treated as equal
    // so, in test case, we are not going to have different signature because "signature: senderWallet.sign(outputMap)"
    // in  cryptoHasy, we map the args and create a new inputs
    this.input = this.createInput({ senderWallet, outputMap: this.outputMap });
  }

  // ******moved this to the transaction pool
  // clearBlockchainTransactions({ chain }) {
  //   // skip the genesis block
  //   for (let i = 1; i < chain.length; i++) {
  //     const block = chain[i];
  //     // block.data is an array of objects. transactionMap is the transactionPool
  //     for (let transaction of block.data) {
  //       if (this.transactionMap[transaction.id]) {
  //         delete this.transactionMap[transaction.id];
  //       }
  //     }
  //   }
  // }

  static rewardTransaction({ minerWallet }) {
    return new this({
      input: REWARD_INPUT,
      // computed property
      outputMap: { [minerWallet.publicKey]: MINING_REWARD },
    });
  }

  static validTransaction(transaction) {
    const {
      input: { address, amount, signature },
      outputMap,
    } = transaction;

    // If no initialValue is supplied, the first element in the array will be used as the initial accumulator
    const outputTotal = Object.values(outputMap).reduce(
      (total, outputAmount) => total + outputAmount
    );

    if (amount !== outputTotal) {
      console.error(`Invalid transaction from ${address}`);
      return false;
    }

    if (!verifySignature({ publicKey: address, data: outputMap, signature })) {
      console.error(`Invalid signature from ${address}`);
      return false;
    }

    return true;
  }
}

module.exports = Transaction;

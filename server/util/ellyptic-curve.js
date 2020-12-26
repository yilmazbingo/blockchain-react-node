const EC = require("elliptic").ec;
const cryptoHash = require("../util/crypto-hash");

// use a prime number to generate the curve. that p i 256 bits.
//  ec works better with hashed values. we always hash the data.
const ec = new EC("secp256k1");

const verifySignature = ({ publicKey, data, signature }) => {
  // we use publicKey in hex from inside the Wallet]
  const keyFromPublic = ec.keyFromPublic(publicKey, "hex");
  // verify() is only available inside a key object.
  // we create a temporary keyFromPublic key object
  return keyFromPublic.verify(cryptoHash(data), signature);
};

module.exports = { ec, verifySignature };

const crypto = require("crypto");

module.exports = (...args) => {
  // this is an instance of Hash class
  const hash = crypto.createHash("sha256");

  //creates hash value. args should be string
  // if object properties changed, hash value will be change too.
  // objects are unordered so everytime the order of the object keys would be different
  hash.update(
    args
      .map((arg) => JSON.stringify(arg))
      .sort()
      .join(" ")
  );

  //digest means the result of the hash. 4 bits=1hex
  return hash.digest("hex");
};

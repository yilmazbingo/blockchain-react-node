const axios = require("axios");

module.exports = async (
  getBlocksUrl,
  transactionPoolUrl,
  blockchain,
  transactionPool
) => {
  try {
    await Promise.all([
      axios
        .get(getBlocksUrl)
        .then((res) => blockchain.replaceChain(res.data))
        .catch((e) => console.log("get blocks request failed", e.messsage)),

      axios
        .get(transactionPoolUrl)
        .then((res) => {
          // const rootTransactionPoolMap = JSON.parse(res.data);
          console.log("replacing pool map on a sync", res.data);
          transactionPool.setMap(res.data);
        })
        .catch((e) => console.log("error in syncChain", e.message)),
    ]);
  } catch (e) {
    console.log("error while synching", e.message);
  }
};

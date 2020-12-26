// sagas are middlewares that if actions comes in function format, they invoke them
// saga is a function that conditionally runs

import { all, call } from "redux-saga/effects";
// all is an effect creator. it returns an object called effect./
import { walletSagas } from "./wallet-info/wallet.saga";
import { blocksSagas } from "./blocks/blocks.saga";
import { transactionsSagas } from "./transactions/transactions.saga";
// all concurrently intializes all actions
export default function* rootSaga() {
  // all tells the saga to run all sagas passed to it concurrently and wait for them all to complete
  yield all([call(walletSagas), call(blocksSagas), call(transactionsSagas)]);
}

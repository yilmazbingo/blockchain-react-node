import { all, call, takeLatest, put } from "redux-saga/effects";
// Effects are plain JavaScript objects which contain instructions to be fulfilled by the middleware.
import axios from "axios";
import {
  fetchWalletInfoSuccess,
  fetchWalletInfoFailure,
} from "./wallet.actions";
import { WalletActionTypes } from "./wallet.types";

//Sagas are implemented as Generator functions that yield objects to the redux-saga middleware. The yielded objects are a kind of instruction to be interpreted by the middleware. When a Promise is yielded to the middleware, the middleware will suspend the Saga until the Promise completes.
// this is the watcher saga
export function* fetchWalletInfoStart() {
  yield takeLatest(
    WalletActionTypes.FETCH_WALLET_INFO_START,
    fetchWalletInfoAsync
  );
}

// this is the handler saga
export function* fetchWalletInfoAsync() {
  try {
    const res = yield axios.get(`${document.location.origin}/api/wallet-info`);
    console.log("Resss", res.data);
    // "put" is sending the info the reducer
    yield put(fetchWalletInfoSuccess(res.data));
  } catch (e) {
    yield put(fetchWalletInfoFailure(e.message));
  }
}

// this communicates with the rootsaga
// we yield the function invocation with "call"
export function* walletSagas() {
  yield all([call(fetchWalletInfoStart)]);
}

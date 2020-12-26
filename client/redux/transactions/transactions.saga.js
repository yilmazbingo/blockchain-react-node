import { put, all, takeLatest, call } from "redux-saga/effects";
import axios from "axios";
import { transactionTypes } from "./transactions.types";
import {
  postTransactionSuccess,
  postTransactionFailure,
} from "./transactions.actions";

// this is listening for the action
export function* postTransactionStart(action) {
  yield takeLatest(
    transactionTypes.POST_TRANSACTION_START,
    call(postTransactionAsyncStart)
  );
}

export function* postTransactionAsyncStart(postData) {
  try {
    const res = yield axios.post(
      `${document.location.origin}/api/transact`,
      postData
    );
    yield put(postTransactionSuccess(res.data));
  } catch (e) {
    yield put(postTransactionFailure(e.message));
  }
}

export function* transactionsSagas(postData) {
  yield all([call(postTransactionStart)]);
}

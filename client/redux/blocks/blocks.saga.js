import { call, takeLatest, put, all } from "redux-saga/effects";
import axios from "axios";
import { blocksActionTypes } from "./blocks.types";
import { fetchBlocksSuccess, fetchBlocksFailure } from "./blocks.actions";

//this is watcher saga which triggers handler sagas
export function* fetchBlocksStart() {
  yield takeLatest(blocksActionTypes.FETCH_BLOCKS_START, fetchBlocksAsync);
}

// this is a handler saga
export function* fetchBlocksAsync() {
  try {
    const res = yield axios.get(`${document.location.origin}/api/blocks`);
    yield put(fetchBlocksSuccess(res.data));
  } catch (e) {
    yield put(fetchBlocksFailure(e.message));
  }
}

export function* blocksSagas() {
  yield all([call(fetchBlocksStart)]);
}

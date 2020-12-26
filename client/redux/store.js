import { createStore, applyMiddleware } from "redux";
import createSagaMiddleware from "redux-saga";
import logger from "redux-logger";
import thunk from "redux-thunk";
import rootReducer from "./root-reducer";
import rootSaga from "./root-saga";

// createSagaMiddleware() is a factory function
const sagaMiddleware = createSagaMiddleware();

// we connected the saga to the store
const middlewares = [sagaMiddleware];

if (process.env.NODE_ENV === "development") {
  middlewares.push(logger);
}

const store = createStore(rootReducer, applyMiddleware(...middlewares));

// we are activating the sagas
//rootSaga that is responsible for starting our other Sagas.
sagaMiddleware.run(rootSaga);

export default store;

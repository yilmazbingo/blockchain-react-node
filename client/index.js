import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import store from "./redux/store";
import AppRouter from "./Router";
// import "normalize.css/normalize.css";
import "./main.scss";
console.log("process-", process.env.NODE_ENV);

ReactDOM.render(
  <Provider store={store}>
    <AppRouter></AppRouter>
  </Provider>,

  document.querySelector("#root")
);

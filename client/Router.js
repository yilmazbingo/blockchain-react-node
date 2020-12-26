import React from "react";
import { Route, BrowserRouter, Switch } from "react-router-dom";
import Home from "./pages/home/Home";
import Blocks from "./pages/blocks/Blocks";
import Wallet from "./pages/wallet/Wallet";
import TransactionPool from "./pages/transaction-pool/TransactionPool";
const AppRouter = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/blocks" component={Blocks} />
        <Route path="/wallet" component={Wallet} />
        <Route path="/transactions-pool" component={TransactionPool} />
      </Switch>
    </BrowserRouter>
  );
};

export default AppRouter;

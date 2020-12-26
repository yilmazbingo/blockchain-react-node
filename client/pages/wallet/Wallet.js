// in React we do not let DOM hold any data

import React, { useEffect } from "react";
import { connect } from "react-redux";
import { fetchWalletInfoStart } from "../../redux/wallet-info/wallet.actions";
import { selectWalletInfo } from "../../redux/wallet-info/wallet.selector";
import {
  selectOverviewComponent,
  selectSendComponent,
  selectReceiveComponent,
} from "../../redux/display-wallet-components/wallet-components.selectors";
import { createStructuredSelector } from "reselect";
import BaseLayout from "../../components/base-layout/BaseLayout";
import SideMenu from "../../components/wallet-components/side-menu/SIdeMenu";
import Overview from "../../components/wallet-components/overview/Overview";
import Send from "../../components/wallet-components/send/Send";
import Receive from "../../components/wallet-components/receive/Receive";
import "./wallet.scss";

const Wallet = (props) => {
  // when user lands in this page, I should already populate the store
  useEffect(() => {
    fetchWalletInfoStart();
    return console.log("I am unmounting Wallet");
  }, []);
  const {
    overviewComponent,
    sendComponent,
    receiveComponent,
    walletInfo,
    fetchWalletInfoStart,
  } = props;
  console.log("walletinfooo", walletInfo);
  return (
    <BaseLayout className="wallet-page">
      <div className="wallet-container">
        <SideMenu />
        <div className="main-box">
          {overviewComponent ? <Overview wallet={walletInfo} /> : ""}
          {sendComponent ? <Send /> : ""}
          {receiveComponent ? <Receive wallet={walletInfo} /> : ""}
        </div>
      </div>
    </BaseLayout>
  );
};

const mapStateToProps = createStructuredSelector({
  overviewComponent: selectOverviewComponent,
  sendComponent: selectSendComponent,
  receiveComponent: selectReceiveComponent,
  walletInfo: selectWalletInfo,
});

export default connect(mapStateToProps, { fetchWalletInfoStart })(Wallet);

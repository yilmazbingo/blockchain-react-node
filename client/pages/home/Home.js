import React, { useEffect } from "react";
import { connect } from "react-redux";
import Spinner from "../../components/spinner/spinner";
import {
  selectWalletInfo,
  fetchingWallet,
} from "../../redux/wallet-info/wallet.selector";
import { createStructuredSelector } from "reselect";
import { fetchWalletInfoStart } from "../../redux/wallet-info/wallet.actions";
import BaseLayout from "../../components/base-layout/BaseLayout";
import TechStack from "../../components/typed/Typed";
import "./home-style.scss";

const Home = (props) => {
  const { fetchWalletInfoStart, walletInfo, isFetching } = props;
  useEffect(() => {
    // redux saga is already running and waiting for this action
    // store is dispatching this action
    fetchWalletInfoStart();
    return console.log("I unmounted from Home page");
  }, []);

  return (
    <BaseLayout className="home-page" headerType="home">
      {isFetching ? (
        <Spinner />
      ) : (
        <>
          <div>
            <TechStack />{" "}
          </div>
        </>
      )}
    </BaseLayout>
  );
};

const mapStateToProps = createStructuredSelector({
  walletInfo: selectWalletInfo,
  isFetching: fetchingWallet,
});

export default connect(mapStateToProps, { fetchWalletInfoStart })(Home);

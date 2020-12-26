import React from "react";
import { connect } from "react-redux";
import { GiMiner, GiReceiveMoney } from "react-icons/gi";
import { IoMdSend } from "react-icons/io";
import { GrTransaction } from "react-icons/gr";
import {
  displaySendComponent,
  displayOverviewComponent,
  displayReceiveComponent,
} from "../../../redux/display-wallet-components/wallet-components.actions";
import "./side-menu.scss";

const SideMenu = ({
  displaySendComponent,
  displayOverviewComponent,
  displayComponent,
  displayReceiveComponent,
}) => {
  const { overviewComponent, sendComponent } = displayComponent;

  return (
    <aside className="sideBar">
      <div onClick={displayOverviewComponent}>
        {overviewComponent ? <div className="clicked"></div> : ""}
        <GiMiner />
        <h5> Overview</h5>
      </div>
      <div onClick={displaySendComponent}>
        {sendComponent ? <div className="clicked"></div> : ""}
        <IoMdSend />
        <h5>Send</h5>
      </div>
      <div onClick={displayReceiveComponent}>
        <GiReceiveMoney />
        <h5>Receive</h5>
      </div>
      <div>
        <GrTransaction />
        <h5>Transactions</h5>
      </div>
    </aside>
  );
};

const mapStateToProps = ({ walletComponents }) => ({
  displayComponent: walletComponents,
});

export default connect(mapStateToProps, {
  displaySendComponent,
  displayOverviewComponent,
  displayReceiveComponent,
})(SideMenu);

import React from "react";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectTransactionsData } from "../../../redux/transactions/transactions.selector";
import "./overview.scss";

const Overview = (props) => {
  const { wallet, transactions } = props;
  const renderSentTransactions = ({ transactions }) => {
    return transactions.map(({ transaction }, index) => (
      <tr key={index}>
        <td>To:{transaction.outputMap[0]}</td>
        <td>Amount:{}</td>
      </tr>
    ));
  };
  return (
    <section>
      <div className="balance">
        <span>Balance :</span>
        <h3 className="amount"> {wallet ? wallet.balance : "calculating"}</h3>
        <br />
      </div>

      <div className="recent-transactions">
        {transactions ? (
          <table>
            {" "}
            <tbody>{renderSentTransactions({ transactions })}</tbody>
          </table>
        ) : (
          ""
        )}
      </div>
    </section>
  );
};

const mapStateToProps = createStructuredSelector({
  transactions: selectTransactionsData,
});

export default connect(mapStateToProps)(Overview);

import React, { useEffect } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { createStructuredSelector } from "reselect";
import { selectTransactionsData } from "../../redux/transactions/transactions.selector";
import { clearTransactions } from "../../redux/transactions/transactions.actions";
import Button from "../../components/button/Button";
import BaseLayout from "../../components/base-layout/BaseLayout";

const TransactionPool = (props) => {
  const { transactions, clearTransactions } = props;
  console.log("transacitons in transaction-poll", transactions[0]);

  const mineBlock = async (transactions) => {
    try {
      await axios.get(`${document.location.origin}/api/mine-transactions`);
      clearTransactions();
    } catch (e) {
      console.log(e.message);
    }
  };

  const renderTransactionPool = (transactions) => {
    return (
      <div>
        {transactions.map(({ transaction }) => (
          <li key={transaction.id}> {transaction.amount}</li>
        ))}
        <Button
          onClick={() => {
            mineBlock(transactions);
            console.log("mined");
          }}
        >
          Mine Transactions
        </Button>
      </div>
    );
  };

  return (
    <BaseLayout>
      {transactions.length ? renderTransactionPool(transactions) : "nothing"}
    </BaseLayout>
  );
};

const mapStatoToProps = createStructuredSelector({
  transactions: selectTransactionsData,
});

export default connect(mapStatoToProps, { clearTransactions })(TransactionPool);

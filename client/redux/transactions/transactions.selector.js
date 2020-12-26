import { createSelector } from "reselect";

const selectTransactions = (state) => state.transactions;

export const selectTransactionsData = createSelector(
  [selectTransactions],
  (transactions) => transactions.transactions
);

export const selectSuccessTransaction = createSelector(
  [selectTransactions],
  (transactions) => transactions.success
);

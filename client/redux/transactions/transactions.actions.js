import { transactionTypes } from "./transactions.types";

export const postTransactionStart = (formValues) => ({
  type: transactionTypes.POST_TRANSACTION_START,
  payload: formValues,
});

export const postTransactionSuccess = (transactions) => ({
  type: transactionTypes.POST_TRANSACTION_SUCCESS,
  payload: transactions,
});

export const postTransactionFailure = (error) => ({
  type: transactionTypes.POST_TRANSACTION_FAILURE,
  payload: error,
});

export const clearTransactions = () => ({
  type: transactionTypes.CLEAR_TRANSACTIONS,
});

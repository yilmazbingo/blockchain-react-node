import { transactionTypes } from "./transactions.types";

const INITIAL_STATE = {
  transactions: [],
  isFetching: false,
  success: false,
  error: undefined,
};

// do not use push method. it returns a new array
const transactionsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case transactionTypes.POST_TRANSACTION_START:
      return { ...state, isFetching: true };
    case transactionTypes.POST_TRANSACTION_SUCCESS:
      return {
        ...state,
        isFetching: false,
        transactions: state.transactions.concat(action.payload),
        success: true,
      };
    case transactionTypes.POST_TRANSACTION_FAILURE:
      return { ...state, isFetching: false, error: action.payload };
    case transactionTypes.CLEAR_TRANSACTIONS:
      return { ...INITIAL_STATE };
    default:
      return state;
  }
};

export default transactionsReducer;

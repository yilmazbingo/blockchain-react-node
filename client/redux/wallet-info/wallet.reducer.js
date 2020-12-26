import { WalletActionTypes } from "./wallet.types";

const INITIAL_STATE = {
  walletInfo: null,
  isFetching: false,
  errorMessage: undefined,
};

const walletReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case WalletActionTypes.FETCH_WALLET_INFO_START:
      return { ...state, isFetching: true };

    case WalletActionTypes.FETCH_WALLET_INFO_SUCCESS:
      return { ...state, isFetching: false, walletInfo: action.payload };

    case WalletActionTypes.FETCH_WALLET_INFO_FAILURE:
      return { ...state, isFetching: false, errorMessage: action.payload };

    default:
      return state;
  }
};

export default walletReducer;

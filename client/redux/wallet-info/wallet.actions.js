import { WalletActionTypes } from "./wallet.types";

// actions are plain objects
export const fetchWalletInfoStart = () => ({
  type: WalletActionTypes.FETCH_WALLET_INFO_START,
});

export const fetchWalletInfoSuccess = (walletInfo) => ({
  type: WalletActionTypes.FETCH_WALLET_INFO_SUCCESS,
  payload: walletInfo,
});

export const fetchWalletInfoFailure = (error) => ({
  type: WalletActionTypes.FETCH_WALLET_INFO_FAILURE,
  payload: error,
});

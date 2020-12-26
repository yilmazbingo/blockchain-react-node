// a selector is a design pattern utilized in Redux where we create a function which is passed the state and simply returns a small piece of it
import { createSelector } from "reselect";

const selectWallet = (state) => state.wallet;

export const selectWalletInfo = createSelector(
  [selectWallet],
  (wallet) => wallet.walletInfo
);

export const fetchingWallet = createSelector(
  [selectWallet],
  (wallet) => wallet.isFetching
);

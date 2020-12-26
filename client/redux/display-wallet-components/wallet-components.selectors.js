import { createSelector } from "reselect";

const selectWalletComponents = (state) => state.walletComponents;

export const selectOverviewComponent = createSelector(
  [selectWalletComponents],
  (walletComponents) => walletComponents.overviewComponent
);

export const selectSendComponent = createSelector(
  [selectWalletComponents],
  (walletComponents) => walletComponents.sendComponent
);

export const selectReceiveComponent = createSelector(
  [selectWalletComponents],
  (walletComponents) => walletComponents.receiveComponent
);

import { walletComponentActionsTypes } from "./wallet-components.types";

export const displaySendComponent = () => ({
  type: walletComponentActionsTypes.DISPLAY_SEND,
});

export const displayOverviewComponent = () => ({
  type: walletComponentActionsTypes.DISPLAY_OVERVIEW,
});

export const displayReceiveComponent = () => ({
  type: walletComponentActionsTypes.DISPLAY_RECEIVE,
});

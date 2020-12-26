import { walletComponentActionsTypes } from "./wallet-components.types";

const INITIAL_STATE = {
  overviewComponent: true,
  sendComponent: false,
  receiveComponent: false,
};

const walletComponentsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case walletComponentActionsTypes.DISPLAY_OVERVIEW:
      return INITIAL_STATE;
    case walletComponentActionsTypes.DISPLAY_SEND:
      return {
        ...state,
        sendComponent: true,
        receiveComponent: false,
        overviewComponent: false,
      };
    case walletComponentActionsTypes.DISPLAY_RECEIVE:
      return {
        ...state,
        overviewComponent: false,
        sendComponent: false,
        receiveComponent: true,
      };
    default:
      return state;
  }
};

export default walletComponentsReducer;

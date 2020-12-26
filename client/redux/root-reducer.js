import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import walletReducer from "./wallet-info/wallet.reducer";
import blocksReducer from "./blocks/blocks.reducer";
import transactionReducer from "./transactions/transactions.reducer";
import walletComponentsReducer from "./display-wallet-components/wallet-components.reducer";

// key for the redux-form has to be "form"
export default combineReducers({
  wallet: walletReducer,
  blocks: blocksReducer,
  transactions: transactionReducer,
  walletComponents: walletComponentsReducer,
  form: formReducer,
});

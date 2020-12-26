import { blocksActionTypes } from "./blocks.types";

const INITIAL_STATE = {
  blocks: [],
  isFetching: false,
  errorMessage: undefined,
};

const blocksReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case blocksActionTypes.FETCH_BLOCKS_START:
      return { ...state, isFetching: true };
    case blocksActionTypes.FETCH_BLOCKS_SUCCESS:
      return { ...state, isFetching: false, blocks: action.payload };
    case blocksActionTypes.FETCH_BLOCKS_FAILURE:
      return { ...state, isFetching: false, errorMessage: action.payload };
    default:
      return state;
  }
};

export default blocksReducer;

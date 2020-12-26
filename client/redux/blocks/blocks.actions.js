import { blocksActionTypes } from "./blocks.types";

export const fetchBlocksStart = () => ({
  type: blocksActionTypes.FETCH_BLOCKS_START,
});

export const fetchBlocksSuccess = (blocks) => ({
  type: blocksActionTypes.FETCH_BLOCKS_SUCCESS,
  payload: blocks,
});

export const fetchBlocksFailure = (error) => ({
  type: blocksActionTypes.FETCH_BLOCKS_FAILURE,
  payload: error,
});

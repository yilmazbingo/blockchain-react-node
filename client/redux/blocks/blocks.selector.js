import { createSelector } from "reselect";

const selectBlocks = (state) => state.blocks;

export const selectBlocksArray = createSelector(
  [selectBlocks],
  (blocks) => blocks.blocks
);

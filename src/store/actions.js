import {
  generateBlocks,
  clearBlocks 
} from '../helpers/utils.js';

const GENERATE_BLOCKS = context => {
  const generatedBlocks = generateBlocks(10);

  context.commit('SET_BLOCKS', generatedBlocks);
};

const REMOVE_WEIGHTS = context => {
  const clearedBlocks = clearBlocks(context.getters.BLOCKS);

  context.commit('SET_BLOCKS', clearedBlocks);
};

const CHANGE_BLOCK_ROW = (context, payload) => {
  const { moveTo } = payload;
  const moveFromIndex = context.getters.ROW_INDEX_WITH_ANIMATION;
  let moveToIndex;

  switch (moveTo) {
    case 'left':
      moveToIndex = moveFromIndex - 1;
      break;
    case 'right':
      moveToIndex = moveFromIndex + 1;
      break;
    default:
      return;
  }

  context.commit('MOVE_ANIMATION', { moveToIndex, moveFromIndex });
};

const DECRECE_BLOCK_TOP = context => {
  let animatedBlockTop = context.getters.ANIMATED_BLOCK_TOP;
  const animatedBlockIndex = context.getters.ROW_INDEX_WITH_ANIMATION;

  animatedBlockTop--;
  context.commit('UPDATE_ANIMATED_BLOCK', { index: animatedBlockIndex, top: animatedBlockTop });
};

export default {
  GENERATE_BLOCKS,
  REMOVE_WEIGHTS,
  CHANGE_BLOCK_ROW,
  DECRECE_BLOCK_TOP
}
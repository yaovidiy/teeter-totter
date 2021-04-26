const BLOCKS = state => {
  return state.blocks;
};

const ROW_WITH_ANIMATION = state => {
  return state.blocks.find(block => block.animated.length);
};

const ROW_INDEX_WITH_ANIMATION = state => {
  return state.blocks.findIndex(block => block.animated.length);
};

const  ANIMATED_BLOCK_TOP = state => {
  return state.blocks.find(block => block.animated.length).animated[0].top;
}

export default {
  BLOCKS,
  ROW_WITH_ANIMATION,
  ROW_INDEX_WITH_ANIMATION,
  ANIMATED_BLOCK_TOP
}
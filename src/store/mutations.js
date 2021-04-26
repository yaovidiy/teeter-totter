import { prognozeForce } from '../helpers/utils.js';

const UPDATE_ANIMATED_BLOCK = (state, payload) => {
  const { index, top } = payload;

  state.blocks[index].animated[0].top = top;
};

const SET_BLOCKS = (state, payload) => {
  state.blocks = payload;
};

const ADD_BLOCK = (state, payload) => {
  const {index, block} = payload;

  state.blocks[index].weights.unshift(block);
};

const ADD_ANIMATION =  (state, payload) => {
  const { index, block } = payload;

  state.blocks[index].animated.push(block);
};

const MOVE_ANIMATION = (state, payload) => {
  const { moveToIndex, moveFromIndex} = payload;
  const block = state.blocks[moveFromIndex].animated.shift();

  block.prognozedForce = prognozeForce(block.weight, moveToIndex);
  state.blocks[moveToIndex].animated.push(block);
};

const PLACE_BLOCK = (state, payload) => {
  const block = state.blocks[payload.index].animated.shift();

  state.blocks[payload.index].weights.unshift(block);
};

export default {
  UPDATE_ANIMATED_BLOCK,
  SET_BLOCKS,
  ADD_BLOCK,
  ADD_ANIMATION,
  MOVE_ANIMATION,
  PLACE_BLOCK
}
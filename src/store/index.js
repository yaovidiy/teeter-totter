import Vue from 'vue';
import Vuex from 'vuex';
import {
  generateBlocks,
  prognozeForce,
  clearBlocks 
} from '../helpers/utils.js';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    blocks: []
  },
  getters: {
    BLOCKS: state => {
      return state.blocks;
    },
    ROW_WITH_ANIMATION: state => {
      return state.blocks.find(block => block.animated.length);
    },
    ROW_INDEX_WITH_ANIMATION: state => {
      return state.blocks.findIndex(block => block.animated.length);
    },
    ANIMATED_BLOCK_TOP: state => {
      return state.blocks.find(block => block.animated.length).animated[0].top;
    }
  },
  mutations: {
    UPDATE_ANIMATED_BLOCK: (state, payload) => {
      const { index, top } = payload;

      state.blocks[index].animated[0].top = top;
    },
    SET_BLOCKS: (state, payload) => {
      state.blocks = payload;
    },
    ADD_BLOCK: (state, payload) => {
      const {index, block} = payload;

      state.blocks[index].weights.unshift(block);
    },
    ADD_ANIMATION: (state, payload) => {
      const { index, block } = payload;

      state.blocks[index].animated.push(block);
    },
    MOVE_ANIMATION: (state, payload) => {
      const { moveToIndex, moveFromIndex} = payload;
      const block = state.blocks[moveFromIndex].animated.shift();

      block.prognozedForce = prognozeForce(block.weight, moveToIndex);
      state.blocks[moveToIndex].animated.push(block);
    },
    PLACE_BLOCK: (state, payload) => {
      const block = state.blocks[payload.index].animated.shift();

      state.blocks[payload.index].weights.unshift(block);
    }
  },
  actions: {
    GENERATE_BLOCKS: (context) => {
      const generatedBlocks = generateBlocks(10);

      context.commit('SET_BLOCKS', generatedBlocks);
    },
    CLEAR_BLOCKS: (context) => {
      const clearedBlocks = clearBlocks(context.getters.BLOCKS);

      context.commit('SET_BLOCKS', clearedBlocks);
    },
    CHANGE_BLOCK_ROW: (context, payload) => {
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
    },
    DECRECE_BLOCK_TOP: context => {
      let animatedBlockTop = context.getters.ANIMATED_BLOCK_TOP;
      const animatedBlockIndex = context.getters.ROW_INDEX_WITH_ANIMATION;
  
      animatedBlockTop--;
      context.commit('UPDATE_ANIMATED_BLOCK', { index: animatedBlockIndex, top: animatedBlockTop });
    }
  }
});
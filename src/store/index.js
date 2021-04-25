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
    }
  },
  mutations: {
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
      const { newIndex, oldIndex} = payload;
      const block = { ...state.blocks[oldIndex].animated[0] };

      block.prognozedForce = prognozeForce(block.weight, newIndex);
      state.blocks[oldIndex].animated = [];
      state.blocks[newIndex].animated.push(block);
    },
    PLACE_BLOCK: (state, payload) => {
      const block = { ...state.blocks[payload.index].animated[0] };

      state.blocks[payload.index].animated = [];
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
    }
  },
});
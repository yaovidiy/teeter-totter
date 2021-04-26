<template>
  <div id="app">
    <Stats
      :degree="forceDifference"
      :gameType="gameType"
      :isGameStarted="isGameStarted"
      @changeGameType="changeGameType"
    ></Stats>
    <Controls
      :isGameStarted="isGameStarted"
      :isGamePaused="isGamePaused"
      :isGameOver="isGameOver"
      @pause="pauseGame"
      @resume="resumeGame"
      @restart="restartGame"
      @start="startGame"
    >
    </Controls>
    <Plank
      :blocks="blocks"
      :degree="forceDifference"
      :transitionTime="transitionTime"
      :isGameOver="isGameOver"
    >
    </Plank>
    <div class="stand"></div>
  </div>
</template>

<script>
import Stats from './components/Stats.vue';
import Controls from './components/Controls.vue';
import Plank from './components/Plank.vue';
import { generateWeightBlock, countForceDifference } from './helpers/utils.js';

export default {
  name: 'App',
  components: {
    Stats,
    Controls,
    Plank
  },
  data() {
    return {
      isGameOver: false,
      isGameStarted: false,
      isGamePaused: false,
      gameType: 'player',
      index: 0,
      interval: null
    }
  },
  computed: {
    animatedBlockIndex() {
      return this.$store.getters.ROW_INDEX_WITH_ANIMATION;
    },
    animatedBlockTop() {
      return this.$store.getters.ANIMATED_BLOCK_TOP;
    },
    blocks() {
      return this.$store.getters.BLOCKS;
    },
    forceDifference() {
      return countForceDifference(this.blocks);
    },
    transitionTime() {
      return 1 - (Math.abs(this.forceDifference) / 100);
    }
  },
  methods: {
    changeGameType: function(value) {
      this.gameType = value;
    },
    startGame: function() {
      this.addRandomWeight();
      this.isGameStarted = true;

      setTimeout(()=> {
        this.drawWeight();
      }, 500);
    },
    pauseGame: function() {
      this.isGamePaused = true;
      clearInterval(this.interval);
      this.clearListeners();
    },
    resumeGame: function() {
      this.isGamePaused = false;
      this.startDescent();
    },
    restartGame: function() {
      this.removeWeights();
      this.isGameOver = false;
    },
    gameOver: function() {
      this.isGameOver = true;
      clearInterval(this.interval);
      this.clearListeners();
      this.removeWeights();
      this.isGameStarted = false;
      this.isGamePaused = false;
    },
    removeWeights: function() {
      this.$store.dispatch('REMOVE_WEIGHTS');
    },
    drawWeight: function() {
      if (this.isGameOver) {
        return;
      }

      const { index, block } = generateWeightBlock(true);

      this.addFallingWeight(index, block);
    },
    addKeyboardListeners: function() {
      window.addEventListener('keyup', this.keyPress);
    },
    clearListeners: function() {
      window.removeEventListener('keyup', this.keyPress);
    },
    keyPress: function(event) {
      switch(event.code) {
        case 'ArrowRight':
          if (this.animatedBlockIndex >= 4) {
            return;
          }

          this.$store.dispatch('CHANGE_BLOCK_ROW', { moveTo: 'right' });
          
          break;
        case 'ArrowLeft':
          if (this.animatedBlockIndex <= 0) {
            return;
          }

          this.$store.dispatch('CHANGE_BLOCK_ROW', { moveTo: 'left' });

          break;
        default:
          return;
      }
    },
    startDescent: function() {
      if (this.interval) {
        clearInterval(this.interval);
      }

      const $vm = this;

      this.addKeyboardListeners();
      this.interval = setInterval(() => {
        $vm.$store.dispatch('DECRECE_BLOCK_TOP');

        if ($vm.animatedBlockTop <= 0) {
          $vm.clearListeners();
          $vm.placeBlock();

          if ($vm.isGameOver || Math.abs($vm.forceDifference) >= 20) {
            return $vm.gameOver();
          }

          setTimeout(() => {
            $vm.drawWeight();
            
            setTimeout(() => {
              $vm.addRandomWeight();
            }, 1500);
          }, 200);

          clearInterval($vm.interval);
        }
      }, 50);
    },
    addFallingWeight: function(index, weight) {
      this.$store.commit('ADD_ANIMATION', { index, block: weight });
      this.startDescent();
    },
    addRandomWeight: function () {
      const {index, block} = generateWeightBlock(false);

      this.$store.commit('ADD_BLOCK', { index, block });
    },
    placeBlock: function() {
      this.$store.commit('PLACE_BLOCK', { index: this.animatedBlockIndex });
    },
  },
  mounted() {
    this.$store.dispatch('GENERATE_BLOCKS');
  },
  watch: {
    forceDifference(newForceDifference) {
      if (Math.abs(newForceDifference) >= 20) {
        return this.gameOver();
      }
    }
  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  margin: 0 auto;
  max-width: 600px;
  height: 400px;
}

.stand {
  width: 0; 
  height: 0; 
  border-left: 60px solid transparent;
  border-right: 60px solid transparent;
  border-bottom: 60px solid red;
}
</style>

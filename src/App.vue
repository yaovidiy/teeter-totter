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
    pauseGame: function() {
      this.isGamePaused = true;
      clearInterval(this.interval);
      this.clearListeners();
    },
    resumeGame: function() {
      this.isGamePaused = false;
      this.startAnimation();
    },
    restartGame: function() {
      this.clearBlocks();
      this.isGameOver = false;
    },
    gameOver: function() {
      this.isGameOver = true;
      clearInterval(this.interval);
      this.clearListeners();
      this.clearBlocks();
      this.isGameStarted = false;
      this.isGamePaused = false;
    },
    clearBlocks: function() {
      this.$store.dispatch('CLEAR_BLOCKS');
    },
    drawFigure: function() {
      if (this.isGameOver) {
        return;
      }

      const { index, block } = generateWeightBlock(true);

      this.addBlockAnimated(index, block);
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
    startAnimation: function() {
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
            $vm.drawFigure();
            
            setTimeout(() => {
              $vm.addRandomBlock();
            }, 1500);
          }, 200);

          clearInterval($vm.interval);
        }
      }, 50);
    },
    addBlockAnimated: function(index, figureObject) {
      this.$store.commit('ADD_ANIMATION', {index: index, block: figureObject});
      this.startAnimation();
    },
    startGame: function() {
      this.addRandomBlock();
      this.isGameStarted = true;

      setTimeout(()=> {
        this.drawFigure();
      }, 500);
    },
    addRandomBlock: function () {
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

<template>
  <div id="app">
    <div class="stats">
      <Stats
        :degree="degree"
        :gameType="gameType"
      ></Stats>
    </div>
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
      :degree="degree"
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
      interval: null,
      
    }
  },
  computed: {
    blocks() {
      return this.$store.getters.BLOCKS;
    },
    degree() {
      return countForceDifference(this.blocks);
    },
    transitionTime() {
      return 0.5 - (Math.abs(this.degree) / 100);
    }
  },
  methods: {
    changeGameType: function(event) {
      this.gameType = event.target.value;
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
      this.index = index;

      this.addBlockAnimated(block);
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
          if (this.index >= 4) {
            return;
          }

          this.moveAnimatedBlock(true);
          
          break;
        case 'ArrowLeft':
          if (this.index <= 0) {
            return;
          }

          this.moveAnimatedBlock(false);

          break;
        default:
          return;
      }
    },
    moveAnimatedBlock: function(inc) {
      if ((inc && this.index >= 4) || (!inc && this.index <= 0)) {
        return;
      }

      const oldIndex = this.index;
      const newIndex = inc ? ++this.index : --this.index;

      this.$store.commit('MOVE_ANIMATION', { newIndex, oldIndex });
    },
    startAnimation: function() {
      if (this.interval) {
        clearInterval(this.interval);
      }

      const $vm = this;

      this.addKeyboardListeners();
      this.interval = setInterval(() => {
        $vm.blocks[$vm.index].animated[0].top--;

        if ($vm.blocks[$vm.index].animated[0].top <= 0) {
          $vm.clearListeners();
          $vm.placeBlock();

          if ($vm.isGameOver || Math.abs($vm.degree) >= 20) {
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
    addBlockAnimated: function(figureObject) {
      this.$store.commit('ADD_ANIMATION', {index: this.index, block: figureObject});
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
      this.$store.commit('PLACE_BLOCK', { index: this.index });
    },
  },
  mounted() {
    this.$store.dispatch('GENERATE_BLOCKS');
  },
  watch: {
    degree(newDegree) {
      if (Math.abs(newDegree) >= 20) {
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

.planc {
  display: flex;
  width: 100%;
  height: 5px;
  background-color: green;
  transform: rotate(0deg);
  transition: all 1s;
}

.btn {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, 30%);
}

.planc .block {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  align-items: center;
  width: 10%;
  text-align: center;
  margin-bottom: 5px;
}

.animated div div {
  position: relative;  
}

.stand {
  width: 0; 
  height: 0; 
  border-left: 60px solid transparent;
  border-right: 60px solid transparent;
  border-bottom: 60px solid red;
}

.weights-enter,
.weights-leave-to {
  top: -200px;
}

.weights-leave-active {
  top: 0;
}

.game-over {
  animation: 2s linear 0s infinite gameOver;
}

.game-over-text {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.stats {
  float: right;
  position: absolute;
  top: 0;
  right: 0;
}

.animated div {
  position: relative;
}

.animated div span {
  position: absolute;
  top: -20px;
  display: inline;
  white-space: nowrap;
}

@keyframes gameOver {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>

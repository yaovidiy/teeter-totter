<template>
  <div id="app">
    <div class="stats">
      <fieldset>
        <legend>Game Type</legend>

        <input
          type="radio"
          id="auto"
          name="gameType"
          value="auto"
          :checked="gameType === 'auto'"
          @change="changeGameType"
        />
        <label for="auto">Auto game</label><br/>

        <input
          type="radio"
          id="player"
          name="gameType"
          value="player"
          :checked="gameType === 'player'"
          @change="changeGameType"
        />
        <label for="player">Manual game</label><br/>
      </fieldset>
      <fieldset>
        <legend>Game Stats</legend>

        <label>Bendage degree:</label>
        <span :style="{ color: `${Math.abs(degree) > 10 && Math.abs(degree) < 20 
          ? '#00ff00'
          : Math.abs(degree) > 20 && Math.abs(degree) < 25 
          ? '#FFA500' : Math.abs(degree) > 25 
          ? 'red' : '#000'}` }">{{ degree }}</span>
        <label></label>
        <label></label>
      </fieldset>
    </div>
    <button v-if="!isGameStarted && !isGameOver" @click="startGame" class="btn btn-add-block">Start Game</button>
    <button v-else-if="isGameStarted && !isGamePaused" @click="pauseGame" class="btn btn-add-block">Pause Game</button>
    <button v-else-if="isGameStarted && isGamePaused" @click="resumeGame" class="btn btn-add-block">Resume Game</button>
    <div v-else-if="isGameOver" class="game-over-text">
      <span>GAME OVER</span>
      <button @click="restartGame">Restart</button>
    </div>
    <div class="planc" 
      ref="planc"
      :class="{'game-over': isGameOver}"
      :style="{ 
          transform: `rotate(${degree}deg)`, 
          transition: `all ${transitionTime}s cubic-bezier(0.125, 0.885, 0.32, 1.275)` }">
      <div v-for="(block, index) in blocks" class="block" :key="block.id">
        <div v-if="block.animated && block.animated.length">
          <transition-group name="animated" :key="index" tag="div" class="animated">
            <div v-for="anim in block.animated"
              :key="anim.id"
              :style="{ top: `${-anim.top}px`, transform: `rotate(${-degree}deg)`}"
              :class="anim.class"
            >
              <span>{{ anim.prognozedForce }} kgm</span>
              {{ anim.weight }}
            </div>
          </transition-group>
        </div>
        <div v-if="block.weights.length">
          <transition-group name="weights" tag="div">
            <div v-for="weight in block.weights"
              :class="[weight.class]"
              :key="weight.id">
              {{ weight.weight }}
            </div>
          </transition-group>
        </div>
      </div>
    </div>
    <div class="stand"></div>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isGameOver: false,
      isGameStarted: false,
      isGamePaused: false,
      gameType: 'player',
      index: 0,
      interval: null,
      blocks: [
        {
          side: 'left',
          length: 5,
          weights: [],
          animated:[],
          id: this.guidGenerator()
        },
        {
          side: 'left',
          length: 4,
          weights: [],
          animated:[],
          id: this.guidGenerator()
        },
        {
          side: 'left',
          length: 3,
          weights: [],
          animated:[],
          id: this.guidGenerator()
        },
        {
          side: 'left',
          length: 2,
          weights: [],
          animated:[],
          id: this.guidGenerator()
        }, 
        {
          side: 'left',
          length: 1,
          weights: [],
          animated:[],
          id: this.guidGenerator()
        },
        {
          side: 'right',
          length: 1,
          weights: [],
          id: this.guidGenerator()
        },
        {
          side: 'right',
          length: 2,
          weights: [],
          id: this.guidGenerator()
        },
        {
          side: 'right',
          length: 3,
          weights: [],
          id: this.guidGenerator()
        },
        {
          side: 'right',
          length: 4,
          weights: [],
          id: this.guidGenerator()
        },
        {
          side: 'right',
          length: 5,
          weights: [],
          id: this.guidGenerator()
        }                                              
      ]
    }
  },
  computed: {
    degree() {
      const leftForce = this.blocks.reduce((acc, currItem) => {
        if (!currItem.weights.length || currItem.side !== 'left') {
          return acc;
        }

        const allWeight = currItem.weights.reduce((acc, currItem) => {
          return acc + currItem.weight;
        }, 0)

        const force = currItem.length * allWeight;

        return acc + force;

      }, 0);

      const rightForce = this.blocks.reduce((acc, currItem) => {
        if (!currItem.weights.length || currItem.side !== 'right') {
          return acc;
        }

        const allWeight = currItem.weights.reduce((acc, currItem) => {
          return acc + currItem.weight;
        }, 0)

        const force = currItem.length * allWeight;

        return acc + force;

      }, 0)

      return rightForce - leftForce;
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
      console.log('red');
      this.isGameOver = true;
      clearInterval(this.interval);
      this.clearListeners();
      this.clearBlocks();
      this.isGameStarted = false;
      this.isGamePaused = false;
    },
    clearBlocks: function() {
      this.blocks.forEach(block => {
        block.animated = [];
        block.weights = [];
      });
    },
    drawFigure: function() {
      this.index = Math.floor(Math.random() * 4);

      const length = [5, 4, 3, 2, 1];
      const figureClasses = [
        'weight-square',
        'weight-circle',
        'weight-triangle'
      ];
      const randomWeight = Math.floor(Math.random() * (10 - 1) + 1);
      const randomClass = figureClasses[Math.floor(Math.random() * 2)];
      const randomFigure = {
        weight: randomWeight,
        class: randomClass,
        type: 'circle',
        top: 200,
        id: this.guidGenerator(),
        prognozedForce: randomWeight * length[this.index]
      }

      this.addBlockAnimated(randomFigure);
    },
    guidGenerator() {
    const S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
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
      const length = [5, 4, 3, 2, 1];
      const blockToMove = {...this.blocks[this.index].animated[0]};

      this.blocks[this.index].animated = [];

      if (inc) {
        this.index++;
      } else {
        this.index--;
      }

      blockToMove.prognozedForce = length[this.index] * blockToMove.weight;
      this.blocks[this.index].animated.push(blockToMove);
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

          console.log($vm.degree);

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
      this.blocks[this.index].animated.push(figureObject);
      this.startAnimation();
    },
    startGame: function() {
      this.addRandomBlock();
      this.isGameStarted = true;

      if (this.isGameOver) {
        return;
      }

      setTimeout(()=> {
        this.drawFigure();
      }, 500);
    },
    addRandomBlock: function () {
      const randomIndex = Math.floor(Math.random() * (9 - 5) + 5);

      this.blocks[randomIndex].weights.unshift({
        type: 'square',
        class: 'weight-square',
        weight: Math.floor(Math.random() * (10 - 1) + 1),
        id: this.guidGenerator()
      });
    },
    placeBlock: function() {
      const blockToPlace = this.blocks[this.index].animated[0];

      this.blocks[this.index].animated = [];
      this.blocks[this.index].weights.unshift(blockToPlace);
    },
    addBlock: function(len, weight) {
      const index = this.blocks.findIndex((block, index) => {
        if (block.length === len && block.side === 'right') {
          return index;
        }
      });

      this.blocks[index].weights.unshift({
        type: 'circle',
        class: 'weight-circle',
        weight: weight,
        id: this.guidGenerator()
      });
    },
    equalize: function() {
      if (this.degree > 0) {
        return;
      }

      let weight = 1;
      let length = 1;

      if (this.degree >= -10) {
        weight = Math.abs(this.degree);
      } else {
        let newForce = this.findNeededForce(length, weight);

        if (!newForce) {
          return 'gameOver';
        }

        weight = newForce.weight;
        length = newForce.length;
      }

      this.addBlock(length, weight);
    },
    findNeededForce: function(l, w) {
      let currentForce = Math.abs(this.degree);
      let weight = w;
      let length = Math.floor(currentForce / weight);

      if (length > 0 && length <= 5) {
        return {
          weight: weight,
          length: length
        }
      }

      if (weight > 10) {
        return null;
      }

      return this.findNeededForce(l, w+1);
    }
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

.weight-square {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  position: relative;
  top: 0;
  text-align:center;
  border: 2px solid blue;
  transition: all .1s;
}

.weight-circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  position: relative;
  top: 0;
  border: 2px solid green;
  border-radius: 50%;
  background-color: transparent;
  transition: all .1s;
}

.weight-triangle {
  width: 0; 
  height: 0; 
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 30px solid red;
  margin: 0 auto;
  transition: all .1s;

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

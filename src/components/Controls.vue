<template>
  <button v-if="!isGameStarted && !isGameOver" @click="clickHandler('start')" class="btn btn-add-block">Start Game</button>
  <button v-else-if="isGameStarted && !isGamePaused" @click="clickHandler('pause')" class="btn btn-add-block">Pause Game</button>
  <button v-else-if="isGameStarted && isGamePaused" @click="clickHandler('resume')" class="btn btn-add-block">Resume Game</button>
  <div v-else-if="isGameOver" class="game-over-text">
    <span>GAME OVER</span>
    <button @click="clickHandler('restart')">Restart</button>
  </div>
</template>

<script>
export default {
  name: 'Controls',
  props: {
    isGameStarted: Boolean,
    isGameOver: Boolean,
    isGamePaused: Boolean
  },
  methods: {
    clickHandler: function(type) {
      this.$emit(type);
    }
  }
}
</script>

<style>
</style>
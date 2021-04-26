<template>
  <section class="stats">
    <fieldset>
      <legend>Game Type</legend>

      <input
        type="radio"
        id="auto"
        name="gameType"
        value="auto"
        :checked="gameType === 'auto'"
        @change="changeGameType"
        :readonly="isGameStarted"
      />
      <label for="auto">Auto game</label><br/>

      <input
        type="radio"
        id="player"
        name="gameType"
        value="player"
        :checked="gameType === 'player'"
        @change="changeGameType"
        :readonly="isGameStarted"
      />
      <label for="player">Manual game</label><br/>
    </fieldset>
    <fieldset>
      <legend>Game Stats</legend>
      <label>Weight difference:</label>
      <span :style="{ color: `${degreeColor()}` }">{{ degree }} kgm</span>
    </fieldset>
  </section>
</template>

<script>
export default {
  name: 'Stats',
  props: {
    degree: Number,
    gameType: String,
    isGameStarted: Boolean
  },
  methods: {
    changeGameType: function(event) {
      this.$emit('changeGameType', event.target.value);
    },
    degreeColor: function() {
      const currentDegree = Math.abs(this.degree);

      if (currentDegree >= 0 && currentDegree < 10) {
        return '#00ff00';
      } else if (currentDegree >= 10 && currentDegree < 15) {
        return '#FFA500';
      } else if (currentDegree > 15 && currentDegree < 20) {
        return 'red';
      } else {
        return '#000';
      }
    }
  }
}
</script>

<style>
.stats {
  position: absolute;
  right: 0;
  top: 0;
}
</style>
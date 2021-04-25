<template>
  <section>
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
  </section>
</template>

<script>
export default {
  name: 'Stats',
  props: {
    degree: Number,
    gameType: String
  },
  methods: {
    changeGameType: function(event) {
      this.gameType = event.target.value;
    }
  }
}
</script>

<style>
</style>
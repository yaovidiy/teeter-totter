<template>
  <section :style="{ top: `${-top}px`, transform: `rotate(${-degree}deg)`, position: 'relative' }">
    <span v-if="prognozed">{{ prognozed }} kgm</span>
    <div
      :class="[
        'weight-block',
        { 'weight-square': type === 'square' },
        { 'weight-circle': type === 'circle' },
        { 'weight-triangle': type === 'triangle' }
      ]">
      <span>{{ weight }}</span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Block',
  props: {
    type: String,
    prognozed: Number,
    weight: Number,
    top: {
      type: Number,
      default() {
        return 0;
      }
    },
    degree: {
      type: Number,
      default() {
        return 0;
      }
    }
  }
}
</script>

<style>
.weight-block {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  position: relative;
  top: 0;
  text-align:center;
  transition: all .1s;
}

.weight-square {
  border: 2px solid blue;
}

.weight-circle {
  border: 2px solid green;
  border-radius: 50%;
}

.weight-triangle {
  width: 0; 
  height: 0; 
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 30px solid red;
  margin: 0 auto;
}

.weight-triangle span {
  position: absolute;
  top: 10px;
  color: #fff;

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
</style>
<template>
  <div class="planc" 
    ref="planc"
    :class="{'game-over': isGameOver}"
    :style="{ 
      transform: `rotate(${degree}deg)`,
      transition: `all ${transitionTime}s cubic-bezier(0.125, 0.885, 0.32, 1.275)`
    }">
    <div v-for="block in blocks" class="block" :key="block.id">
      <Block v-for="anim in block.animated"
        :key="anim.id"
        :top="anim.top"
        :type="anim.type"
        :prognozed="anim.prognozedForce"
        :weight="anim.weight"
        :degree="degree"
      >
      </Block>
      <Block v-for="weight in block.weights"
        :type="weight.type"
        :key="weight.id"
        :weight="weight.weight"
      >
      </Block>
    </div>
  </div>
</template>

<script>
import Block from './Block.vue';

export default {
  name: 'Plank',
  components: {
    Block
  },
  props: {
    blocks: {
      type: Array,
      default() {
        return [];
      }
    },
    isGameOver: Boolean,
    degree: Number,
    transitionTime: Number
  }
}
</script>

<style>
</style>
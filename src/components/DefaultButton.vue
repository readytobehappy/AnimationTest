<template>
  <input :class="$style.default_button"
         type="button"
         :value="text"
         @click="$emit('click', $event)">
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'DefaultButton',
  props: {
    text: {
      type: String,
      default: ''
    }
  },
  emits: {
    click: (event: MouseEvent) => event
  }
});
</script>

<style lang="scss" module>
.default_button {
  user-select: none;
  height: 2rem;
  cursor: pointer;
  color: white;
  background-color: #0072bc;
  border: transparent;
  padding: 4px 12px;
  font-size: 14pt;
}
</style>

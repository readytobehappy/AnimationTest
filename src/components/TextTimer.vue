<template>
  <div v-text="text"
       :class="[$style.text_timer, isOver && $style.over]"/>
</template>

<script lang="ts">
import { formatTime } from '@/utils';
import { defineComponent, ref } from 'vue';

const OVER_ANIMATION_MS = 1000;

export default defineComponent({
  name: 'TextTimer',
  props: {
    delay: {
      type: Number,
      default: 1000
    },
    refreshTimeout: {
      type: Number,
      default: 100
    }
  },
  emits: {
    animationEnd: () => true
  },
  setup (props, { emit }) {
    const isOver = ref(false);
    const text = ref(formatTime(0));
    const prevTimePoint = performance.now();
    const timer = setInterval(() => {
      const nextTimePoint = performance.now();
      const time = nextTimePoint - prevTimePoint;
      text.value = formatTime(Math.min(props.delay, time));
      if (time < props.delay)
        return;

      clearInterval(timer);
      isOver.value = true;
      setTimeout(() => {
        emit('animationEnd');
      }, OVER_ANIMATION_MS);
    }, props.refreshTimeout);

    return {
      text,
      isOver,
      animationTimeout: `${OVER_ANIMATION_MS}ms`
    };
  }
});
</script>

<style lang="scss" module>
$animationtime: v-bind('animationTimeout');

.text_timer {
  user-select: none;
  font-size: 40pt;
  font-weight: bold;
  opacity: 1;
  color: #0072bc;
  position: relative;
}

.over {
  animation: flicker $animationtime ease-in-out normal;
}

@keyframes flicker {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 1;
  }

  62.5% {
    opacity: 0;
  }

  75% {
    opacity: 1;
  }

  81.25% {
    opacity: 0;
  }

  87.5% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}
</style>

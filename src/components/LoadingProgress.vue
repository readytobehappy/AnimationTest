<template>
  <div :class="$style.loading_progress"
       :style="componentStyle">
    <div :class="$style.container">
      <svg viewBox="0 0 200 200">
        <circle :class="$style.circle"
                r="90"
                cx="100"
                cy="100"
                stroke-width="20"/>
        <circle :class="$style.mask"
                r="90"
                cx="100"
                cy="100"
                :style="maskStyle"/>
        <text v-text="progressText"
              :class="$style.text"
              x="50%"
              y="50%"
              dy=".3em"
              text-anchor="middle"/>
      </svg>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, CSSProperties, defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'LoadingProgress',
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  emits: {
    completed: () => true
  },
  setup (props, { emit }) {
    const progressText = computed(() => `${Math.ceil(props.progress * 100)}%`);
    const maskStyle = computed<CSSProperties>(() => ({
      strokeDashoffset: `${565 * (1 - props.progress)}`
    }));

    const componentStyle = ref<CSSProperties>({});
    watch(progressText, value => {
      if (value === '100%') {
        componentStyle.value = {
          opacity: 0
        };
        setTimeout(() => {
          emit('completed');
        }, 1000);
      }
    });

    return {
      maskStyle,
      componentStyle,
      progressText
    };
  }
});
</script>

<style lang="scss" module>
$bgcolor: #eee;
$fgcolor: #0072bc;

.loading_progress {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  opacity: 1;
  transition: opacity 1s ease;
}

.container {
  width: 200px;
  height: 200px;
  position: relative;

  & svg {
    width: 200px;
    height: 200px;
  }
}

.circle {
  fill: none;
  stroke: $bgcolor;
}

.mask {
  fill: none;
  stroke: $fgcolor;
  stroke-width: 20;
  stroke-dasharray: 565;
  stroke-dashoffset: 565;
  transform: rotate(-90deg);
  transform-origin: 50% 50%;
  transition: stroke-dashoffset .1s linear;
}

.text {
  font-size: 2em;
  fill: $fgcolor;
}
</style>

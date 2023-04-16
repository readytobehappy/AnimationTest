<template>
  <div :class="[$style.images_list, animation === StartAnimationOption.WHOLE && $style.animation]"
       :style="componentStyle">
    <img v-for="(url, index) in urls"
         :key="index"
         :class="[$style.image, animation === StartAnimationOption.STEP_BY_STEP && $style.animation]"
         :style="{
           ...animation === StartAnimationOption.STEP_BY_STEP
             ? imageStyles[index]
             : {},
           ...getImageStyle(index)
         }"
         :src="url">
  </div>
</template>

<script lang="ts">
import { CSSProperties, defineComponent, PropType, ref } from 'vue';
import { StartAnimationOption, StartPlacementOption } from './OptionsPanel';

const DELTA_PX = 16;
const ANIMATION_TIMEOUT_MS = 1000;

export default defineComponent({
  name: 'ImagesList',
  props: {
    urls: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    placement: {
      type: String as PropType<StartPlacementOption>,
      default: StartPlacementOption.DELTA
    },
    animation: {
      type: String as PropType<StartAnimationOption>,
      default: StartAnimationOption.WHOLE
    }
  },
  emits: {
    animationEnd: () => true
  },
  setup (props, { emit }) {
    const getImageStyle = (index: number): CSSProperties => {
      if (props.placement === StartPlacementOption.DESK) {
        return {
        };
      }

      const count = props.urls.length;
      const maxDelta = DELTA_PX * count;
      const left = index * maxDelta;
      const top = index * maxDelta;

      return {
        position: 'relative',
        left: `${left}px`,
        top: `${top}px`,
        maxWidth: `calc(100% - ${maxDelta}px)`,
        maxHeight: `calc(100% - ${maxDelta}px)`
      };
    };

    const componentStyle = ref({
    });

    const imageStyles = ref(props.urls.map(() => ({})));

    const applyWholeAnimation = () => {
      setTimeout(() => {
        componentStyle.value = {
          opacity: 1
        };
        setTimeout(() => {
          emit('animationEnd');
        }, ANIMATION_TIMEOUT_MS);
      }, 200);
    };

    const applyStepByStepAnimation = () => {
      let imageIndex = 0;

      const animationHandler = () => {
        if (imageIndex >= props.urls.length) {
          return setTimeout(() => {
            emit('animationEnd');
          }, ANIMATION_TIMEOUT_MS);
        }
        imageStyles.value[imageIndex++] = {
          opacity: 1
        };
        setTimeout(animationHandler, ANIMATION_TIMEOUT_MS);
      };

      setTimeout(animationHandler, 200);
    };

    if (props.animation === StartAnimationOption.WHOLE)
      applyWholeAnimation();
    else
      applyStepByStepAnimation();

    return {
      getImageStyle,
      componentStyle,
      imageStyles,
      animationTimeout: `${ANIMATION_TIMEOUT_MS}ms`,
      StartAnimationOption
    };
  }
});
</script>

<style lang="scss" module>
$animationtime: v-bind('animationTimeout');

.images_list {
  user-select: none;
  display: grid;
  position: relative;
  width: 100%;
  height: 100%;
}

.animation {
  opacity: 0;
  transition: opacity $animationtime ease-out;
}

.image {
  max-width: 100%;
  max-height: 100%;
  grid-row: 1;
  grid-column: 1;
}
</style>

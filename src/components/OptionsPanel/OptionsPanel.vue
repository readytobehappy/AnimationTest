<template>
  <fieldset :class="$style.options_panel">
    <legend v-text="'Варианты запуска приложения'"/>
    <div v-text="'Источник картинок:'"/>
    <div>
      <input id="source_option_1"
             name="source"
             type="radio"
             :checked="options.source === StartSourceOption.ORIGINAL"
             @change="options.source = StartSourceOption.ORIGINAL">
      <label v-text="'Картинки из тестового задания'"
             for="source_option_1"/>
    </div>
    <div>
      <input id="source_option_2"
             name="source"
             type="radio"
             :checked="options.source === StartSourceOption.MY"
             @change="options.source = StartSourceOption.MY">
      <label v-text="'Мои тяжёлые картинки'"
             for="source_option_2"/>
    </div>
    <div v-text="'Размещение картинок:'"
         :class="$style.gap"/>
    <div>
      <input id="placement_option_1"
             name="placement"
             type="radio"
             :checked="options.placement === StartPlacementOption.DELTA"
             @change="options.placement = StartPlacementOption.DELTA">
      <label v-text="'Со смещением'"
             for="placement_option_1"/>
    </div>
    <div>
      <input id="placement_option_2"
             name="placement"
             type="radio"
             :checked="options.placement === StartPlacementOption.DESK"
             @change="options.placement = StartPlacementOption.DESK">
      <label v-text="'Поверх'"
             for="placement_option_2"/>
    </div>
    <div v-text="'Анимация картинок:'"
         :class="$style.gap"/>
    <div>
      <input id="animation_option_1"
             name="animation"
             type="radio"
             :checked="options.animation === StartAnimationOption.WHOLE"
             @change="options.animation = StartAnimationOption.WHOLE">
      <label v-text="'Все одновременно'"
             for="animation_option_1"/>
    </div>
    <div>
      <input id="animation_option_2"
             name="animation"
             type="radio"
             :checked="options.animation === StartAnimationOption.STEP_BY_STEP"
             @change="options.animation = StartAnimationOption.STEP_BY_STEP">
      <label v-text="'Друг за другом'"
             for="animation_option_2"/>
    </div>
  </fieldset>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { StartAnimationOption, StartOptions, StartPlacementOption, StartSourceOption } from './types';

export default defineComponent({
  name: 'OptionsPanel',
  props: {
    modelValue: {
      type: Object as PropType<StartOptions>,
      required: true
    }
  },
  emits: {
    'update:modelValue': (args: StartOptions) => args
  },
  setup (props, { emit }) {
    const options = ref(props.modelValue);

    watch(options, value => {
      emit('update:modelValue', value);
    }, { deep: true });

    return {
      StartSourceOption,
      StartPlacementOption,
      StartAnimationOption,
      options
    };
  }
});
</script>

<style lang="scss" module>
.options_panel {
  user-select: none;
  width: 300px;
  font-size: 11pt;
}

.gap {
  margin-top: 8px;
}
</style>

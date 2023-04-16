<template>
  <div :class="$style.app">
    <div v-if="areOptionsVisible || isStartButtonVisible"
         :class="$style.button_panel">
      <OptionsPanel v-if="areOptionsVisible"
                    v-model="options"/>
      <DefaultButton v-if="isStartButtonVisible"
                     :text="startButtonName"
                     @click="handleTrigger('startButton')"/>
    </div>
    <LoadingProgress v-if="isProgressVisible"
                     :progress="progress"
                     @completed="handleTrigger('loadComplete')"/>
    <div :class="[$style.panel, isTextImagesPanelVisible ? $style.visible : $style.hidden]">
      <ImagesList v-if="areImagesVisible"
                  :class="$style.center"
                  :urls="imageUrls"
                  :placement="options.placement"
                  :animation="options.animation"
                  @animationEnd="handleTrigger('images')"/>
      <TextTimer v-if="isTextTimerVisible"
                 :class="$style.center"
                 :delay="timerSeconds * 1000"
                 @animationEnd="handleTrigger('textTimer')"/>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { DefaultButton, getDefaultStartOptions, getImagesPathFromOption, ImagesList, LoadingProgress, OptionsPanel, StartOptions, TextTimer } from './components';
import { useLoader, useTaskQueue } from './hooks';
import { getIntegerRandomNumber, getRandomFilesFromUrl, wait } from './utils';

export default defineComponent({
  name: 'App',
  components: {
    DefaultButton,
    ImagesList,
    LoadingProgress,
    OptionsPanel,
    TextTimer
  },
  setup () {
    const options = ref<StartOptions>(getDefaultStartOptions());
    const {
      loadResources,
      clearResources,
      progress
    } = useLoader();

    const areOptionsVisible = ref(true);
    const isStartButtonVisible = ref(false);
    const isProgressVisible = ref(false);
    const areImagesVisible = ref(false);
    const isTextTimerVisible = ref(false);
    const isTextImagesPanelVisible = ref(true);
    const startButtonName = ref('Старт');

    const imageUrls = ref<string[]>([]);
    const timerSeconds = ref<number>(0);
    const {
      handleTrigger
    } = useTaskQueue([
      {
        action: () => {
          isStartButtonVisible.value = true;
          isTextImagesPanelVisible.value = true;
        }
      },
      {
        trigger: 'startButton',
        action: async () => {
          areOptionsVisible.value = false;
          isStartButtonVisible.value = false;
          isProgressVisible.value = true;
          const imagesPath = getImagesPathFromOption(options.value.source);
          const baseImageUrls = getRandomFilesFromUrl({
            imagesPath,
            min: 1,
            max: 8,
            count: 4
          });

          imageUrls.value = await loadResources(baseImageUrls);
        }
      },
      {
        trigger: 'loadComplete',
        action: () => {
          isProgressVisible.value = false;
          areImagesVisible.value = true;
        }
      },
      {
        trigger: 'images',
        action: () => {
          timerSeconds.value = getIntegerRandomNumber(3, 5);
          isTextTimerVisible.value = true;
        }
      },
      {
        trigger: 'textTimer',
        action: () => {
          isTextImagesPanelVisible.value = false;
        }
      },
      {
        action: async () => {
          await wait(1000);
        }
      },
      {
        action: () => {
          areImagesVisible.value = false;
          isTextTimerVisible.value = false;
          clearResources();
          startButtonName.value = 'Далее';
        }
      }
    ], true);

    return {
      options,
      imageUrls,
      areOptionsVisible,
      isStartButtonVisible,
      isProgressVisible,
      areImagesVisible,
      isTextTimerVisible,
      isTextImagesPanelVisible,
      startButtonName,
      timerSeconds,
      progress,
      handleTrigger
    };
  }
});
</script>

<style lang="scss" module>
.app {
  user-select: none;
  display: grid;
  width: 100%;
  height: 100%;
  grid-template: 1fr/1fr;
  align-items: center;
  justify-items: center;
}

.button_panel {
  display: grid;
  grid-template: auto auto / auto;
  gap: 16px;
  justify-items: center;
}

.panel {
  display: grid;
  grid-template: auto / auto;
  align-items: center;
  justify-items: center;
  transition: opacity 1s ease;
}

.visible {
  opacity: 1;
}

.hidden {
  opacity: 0;
}

.center {
  grid-row: 1;
  grid-column: 1;
}
</style>

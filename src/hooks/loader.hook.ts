import { computed, ref } from 'vue';

interface LoadingState {
  progress: number;
  objectUrl?: string;
}

export function useLoader () {
  const loadState = ref<Record<string, LoadingState>>({});
  const progress = computed(() => {
    const keys = Object.keys(loadState.value);
    return keys
      .reduce((acc, key) => acc + loadState.value[key].progress, 0)
        / keys.length;
  });

  async function loadResource (url: string) {
    if (loadState.value[url])
      return; // skip resource already being load

    loadState.value[url] = {
      progress: 0
    };

    const blob = await new Promise<Blob>((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.open('GET', url, true);
      xhr.responseType = 'blob';

      xhr.onprogress = event => {
        if (!event.lengthComputable)
          return;

        const progress = event.loaded / event.total;
        loadState.value[url].progress = progress;
      };

      xhr.onload = () => {
        if (xhr.status === 200)
          resolve(xhr.response as Blob);
        else
          reject(new Error(`Ошибка загрузки: ${xhr.statusText}`));
      };

      xhr.onerror = function () {
        reject(new Error('Ошибка сети'));
      };

      xhr.send();
    });

    loadState.value[url].objectUrl = blob
      ? URL.createObjectURL(blob)
      : '';
  }

  const loadResources = async (sourceUrls: string[]) => {
    clearResources();
    await Promise.allSettled(sourceUrls.map(url => loadResource(url)));
    return sourceUrls.map(url => loadState.value[url].objectUrl ?? '');
  };

  const clearResources = () => {
    Object
      .keys(loadState.value)
      .forEach(url => {
        const { objectUrl } = loadState.value[url];
        objectUrl && URL.revokeObjectURL(objectUrl);
      });
    loadState.value = {};
  };

  return {
    loadResources,
    clearResources,
    progress
  };
}

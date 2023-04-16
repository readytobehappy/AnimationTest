import { StartAnimationOption, StartPlacementOption, StartSourceOption } from './types';

export const getImagesPathFromOption = (option: StartSourceOption) => `/img/${option}/`;
export const getDefaultStartOptions = () => ({
  source: StartSourceOption.ORIGINAL,
  placement: StartPlacementOption.DELTA,
  animation: StartAnimationOption.WHOLE
});

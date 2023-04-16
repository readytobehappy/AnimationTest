export enum StartSourceOption {
  ORIGINAL = 'original',
  MY = 'my'
}

export enum StartPlacementOption {
  DELTA = 'delta',
  DESK = 'desk'
}

export enum StartAnimationOption {
  WHOLE = 'whole',
  STEP_BY_STEP = 'step_by_step'
}

export interface StartOptions {
  source: StartSourceOption;
  placement: StartPlacementOption;
  animation: StartAnimationOption;
}

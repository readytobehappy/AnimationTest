export function getIntegerRandomNumber (from: number, to: number) {
  from = Math.ceil(from);
  to = Math.floor(to);
  return Math.max(from, Math.min(to, Math.floor(from + Math.random() * (to - from + 1))));
}

export async function wait (milliseconds: number) {
  return new Promise(resolve => {
    setTimeout(resolve, milliseconds);
  });
}

export interface RandomFilesFromUrlArgs {
  imagesPath: string;
  min: number;
  max: number;
  count: number;
}

export function getRandomFilesFromUrl ({
  imagesPath,
  min = 1,
  max = 8,
  count = 4
}: RandomFilesFromUrlArgs) {
  const files: string[] = [];
  for (let index = 0; index < count; index++) {
    const randomFileName = getIntegerRandomNumber(min, max);
    files.push(`${imagesPath}${randomFileName}.png`);
  }
  return files;
}

export function formatTime (milliseconds: number) {
  const hours = Math.floor(milliseconds / (1000 * 60 * 60));
  const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((milliseconds % (1000 * 60)) / 1000);
  const tenths = Math.floor((milliseconds % 1000) / 100);

  const hoursText = (hours < 10) ? `0${hours}` : hours;
  const minutesText = (minutes < 10) ? `0${minutes}` : minutes;
  const secondsText = (seconds < 10) ? `0${seconds}` : seconds;

  return `${hoursText}:${minutesText}:${secondsText}.${tenths}`;
}


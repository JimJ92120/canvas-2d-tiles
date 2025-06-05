export function getScreenSize(maxSceneSize: number): number {
  const { width, height } = window.screen;
  let size = height <= width ? height : width;

  if (maxSceneSize < size) {
    size = maxSceneSize;
  }

  return size;
}

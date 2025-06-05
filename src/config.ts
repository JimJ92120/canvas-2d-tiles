type Config = {
  DEBUG: boolean;
  MAX_SCENE_SIZE: number;
  MINIMUM_FRAME_SIZE: [number, number];
  TILE_SIZE: [number, number];
  TILE_COLORS: { [key: number]: string };
  PLAYER_COLOR: string;
};

const MAX_SCENE_SIZE = 500;
const MINIMUM_FRAME_SIZE: [number, number] = [10, 10];

const CONFIG: Config = {
  DEBUG: true,
  MAX_SCENE_SIZE,
  MINIMUM_FRAME_SIZE,
  TILE_SIZE: [
    MAX_SCENE_SIZE / MINIMUM_FRAME_SIZE[0],
    MAX_SCENE_SIZE / MINIMUM_FRAME_SIZE[1],
  ],
  TILE_COLORS: {
    1: "grey",
    2: "blue",
    3: "green",
  },
  PLAYER_COLOR: "red",
};

export default CONFIG;

import "./style.css";

import App from "./App";

import Engine, {
  EngineOptions,
  FrameRecord,
  ObjectRecord,
  PromptOptions,
  RendererOptions,
} from "./engine";

import { LoadButtonEvents, loadKeyboardEvents } from "./components/events";
import { home, main } from "./components/frames";
import { player } from "./components/objects";

const SCENE_DIMENSION: number = 500;
const SCENE_SIZE: number = 10;

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App(document.querySelector("#app")!);
  app.render();
  app.$container.style.maxWidth = `${SCENE_DIMENSION}px`;

  const rendererOptions: RendererOptions = {
    $scene: app.$container.querySelector(".scene")!,
  };
  const promptOptions: PromptOptions = {
    $prompt: app.$container.querySelector(".prompt")!,
    activeClassName: "prompt--active",
  };
  const frameRecord: FrameRecord = {
    main,
    home,
  };
  const objectRecord: ObjectRecord = {
    player,
  };
  const options: EngineOptions = {
    renderer: {
      dimension: [SCENE_DIMENSION, SCENE_DIMENSION],
      size: [SCENE_SIZE, SCENE_SIZE],
    },
    prompt: {
      speed: 100,
    },
  };
  const engine = new Engine(
    rendererOptions,
    promptOptions,
    frameRecord,
    objectRecord,
    options
  );

  await engine.init("main", "player");
  engine.render("player");

  //
  loadKeyboardEvents(engine);
  LoadButtonEvents(
    engine,
    app.$container.querySelectorAll(".direction-button")!,
    app.$container.querySelector('.select-button[data-select="a"]')!,
    app.$container.querySelector('.select-button[data-select="b"]')!
  );

  setTimeout(() => {
    engine.typeToPrompt(["Hello World", "Welcome"]);
  }, 1000);
});

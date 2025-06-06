import "./style.css";

import App from "./App";

import Engine from "./engine";

import { getScreenSize } from "./helpers";

import { loadKeyboardEvents } from "./components/events";
import TypePrompt from "./animations/TypePrompt";
import { EngineOptions } from "./options";

const DEBUG: boolean = true;
const MAX_SCENE_SIZE: number = 500;
const MINIMUM_FRAME_SIZE: [number, number] = [10, 10];

document.addEventListener("DOMContentLoaded", async () => {
  const screenSize = getScreenSize(MAX_SCENE_SIZE);

  const app = new App(document.querySelector("#app")!);
  app.render();
  app.$container.style.maxWidth = `${screenSize}px`;

  if (DEBUG) {
    app.$container.classList.add("app--debug");
  }

  let options = EngineOptions(
    app.$container.querySelector(".scene")!,
    app.$container.querySelector(".debug-scene")!,
    app.$container.querySelector(".prompt")!,
    screenSize,
    MINIMUM_FRAME_SIZE,
    true
  );

  //
  const typePrompt = new TypePrompt(options.prompt.$prompt);
  options.prompt.animationRecord = {
    onShow: (_, content) =>
      new Promise(async (resolve) => {
        await typePrompt.type(content, 50);

        resolve();
      }),
    onHide: () =>
      new Promise((resolve) => {
        typePrompt.clear();

        resolve();
      }),
  };

  //
  const engine = new Engine(
    options.player,
    options.frameRecord,
    options.renderer,
    options.prompt
  );

  await engine.init();
  loadKeyboardEvents(engine);
});

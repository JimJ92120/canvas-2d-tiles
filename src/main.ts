import "./style.css";

import App from "./App";

import Engine from "./engine";
import Renderer from "./engine/Renderer";
import Prompt from "./engine/Prompt";
import Menu from "./engine/Menu";

import player from "./components/player";
import sceneRecord from "./components/sceneRecord";
import { loadPromptEvents, loadPlayerMoveEvents } from "./components/events";
import View from "./engine/View";

function getScreenSize(maxSceneSize: number): number {
  const { width, height } = window.screen;
  let size = height <= width ? height : width;

  if (maxSceneSize < size) {
    size = maxSceneSize;
  }

  return size;
}

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App(document.querySelector("#app")!);
  app.render();

  const maxSceneSize = getScreenSize(500);
  const engine = new Engine(
    new Renderer(
      app.$container.querySelector(".scene")!,
      [maxSceneSize, maxSceneSize],
      [10, 10],
      "grey"
    ),
    new Prompt(app.$container.querySelector(".prompt")!, 100),
    new View(app.$container.querySelector(".view")!),
    new Menu(app.$container.querySelector(".menu")!),
    player,
    sceneRecord
  );
  await engine.init([
    "Hello World!\nUse buttons or keyboard to move around and interact with the scene\n\nClick on A button, Enter key or Space key to show instructions",
    "Use A button, Enter key or Space key to slide through content (when available)\n\nUse B, Escape key or move the Player to hide dialogs",
  ]);
  engine.run();

  loadPlayerMoveEvents(
    engine,
    app.$container.querySelectorAll(".direction-button")!
  );
  loadPromptEvents(
    engine,
    app.$container.querySelector('.select-button[data-select="a"]')!,
    app.$container.querySelector('.select-button[data-select="b"]')!
  );
});

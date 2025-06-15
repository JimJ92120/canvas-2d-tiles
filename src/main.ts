import "./style.css";

import App from "./App";
import Engine from "./engine";
import Renderer from "./engine/Renderer";
import Prompt from "./engine/Prompt";

import player from "./components/player";
import sceneRecord from "./components/sceneRecord";
import { loadPromptEvents, loadPlayerMoveEvents } from "./components/events";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App(document.querySelector("#app")!);
  app.render();

  const engine = new Engine(
    new Renderer(
      app.$container.querySelector(".scene")!,
      [500, 500],
      [10, 10],
      "grey"
    ),
    new Prompt(app.$container.querySelector(".prompt")!, "prompt--active", 100),
    player,
    sceneRecord
  );
  await engine.init(["Hello World!\nWelcome to my Portfolio"]);
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

  // setTimeout(() => engine.stop(), 2000);
});

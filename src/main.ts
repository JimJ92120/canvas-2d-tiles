import "./style.css";

import App from "./App";
import Engine, { Direction } from "./engine";
import Renderer from "./engine/Renderer";
import Player from "./engine/components/Player";

import sceneRecord from "./components/sceneRecord";
import { loadPromptEvents, loadPlayerMoveEvents } from "./components/events";
import Prompt from "./engine/Prompt";

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
    new Player([0, 0], Direction.Down),
    sceneRecord
  );
  await engine.init();
  engine.run();

  loadPlayerMoveEvents(
    engine,
    app.$container.querySelectorAll(".direction-button")!
  );
  loadPromptEvents(engine);
});

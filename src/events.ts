import Engine from "./engine";

export function loadKeyboardEvents(engine: Engine): void {
  document.addEventListener("keyup", (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        engine.movePlayer(event.key.replace("Arrow", "").toLowerCase()) &&
          engine.render();

        break;

      case "Escape":
      case " ":
        engine.hidePrompt();
        break;

      default:
        break;
    }
  });
}

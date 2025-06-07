import Engine from "../engine";

export function loadKeyboardEvents(engine: Engine): void {
  document.addEventListener("keyup", async (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        await engine.move(
          "player",
          event.key.replace("Arrow", "").toLowerCase()
        );
        engine.render("player");

        break;

      case "Escape":
      case " ":
        await engine.nextOrHidePrompt();
        break;

      default:
        break;
    }
  });
}

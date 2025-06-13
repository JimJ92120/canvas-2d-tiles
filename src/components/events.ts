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

export function LoadButtonEvents(
  engine: Engine,
  $directionButtonList: NodeListOf<HTMLButtonElement>,
  $aButton: HTMLButtonElement,
  $bButton: HTMLButtonElement
) {
  Object.keys($directionButtonList).map((buttonKey: any) => {
    const $button = $directionButtonList[buttonKey];
    const directionKey = $button.getAttribute("data-direction") ?? "";

    $button.addEventListener("click", async () => {
      await engine.move("player", directionKey);
      engine.render("player");
    });
  });

  $aButton.addEventListener("click", async () => {
    await engine.nextOrHidePrompt();
  });

  $bButton.addEventListener("click", async () => {
    //
  });
}

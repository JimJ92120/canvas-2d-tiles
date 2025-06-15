import Engine, { Direction } from "../engine";

function keyToDirection(directionKey: string): Direction | null {
  switch (directionKey) {
    case "up":
      return Direction.Up;
    case "down":
      return Direction.Down;
    case "left":
      return Direction.Left;
    case "right":
      return Direction.Right;

    default:
      return null;
  }
}

export function loadPlayerMoveEvents(
  engine: Engine,
  $directionButtonList: NodeListOf<HTMLButtonElement>
): void {
  document.addEventListener("keyup", (event: KeyboardEvent) => {
    switch (event.key) {
      case "ArrowUp":
      case "ArrowDown":
      case "ArrowLeft":
      case "ArrowRight":
        const direction = keyToDirection(
          event.key.replace("Arrow", "").toLowerCase()
        );

        if (direction) {
          engine.movePlayer(direction);
        }
        break;
    }
  });

  Object.keys($directionButtonList).map((buttonKey: any) => {
    const $button = $directionButtonList[buttonKey];
    const directionKey = $button.getAttribute("data-direction") ?? "";

    $button.addEventListener("click", async () => {
      const direction = keyToDirection(directionKey);

      if (direction) {
        engine.movePlayer(direction);
      }
    });
  });
}

export function loadPromptEvents(
  engine: Engine,
  $aButton: HTMLButtonElement,
  $bButton: HTMLButtonElement
): void {
  document.addEventListener("keyup", async (event: KeyboardEvent) => {
    switch (event.key) {
      case "Escape":
        engine.hidePrompt();
        break;

      // space
      case " ":
      case "Enter":
        await engine.nextOrHidePrompt();
        break;
    }
  });

  $aButton.addEventListener("click", async () => {
    await engine.nextOrHidePrompt();
  });

  $bButton.addEventListener("click", async () => {
    engine.hidePrompt();
  });
}

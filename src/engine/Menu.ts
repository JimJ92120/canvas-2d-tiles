import { SceneEvent, SceneEventType } from "./components/Scene";

export type MenuItem = {
  title: string;
  event: SceneEvent;
};

export default class Menu {
  #$dialog: HTMLDialogElement;

  constructor($dialog: HTMLDialogElement) {
    this.#$dialog = $dialog;
  }

  get isShown(): boolean {
    return this.#$dialog.open;
  }

  render(
    menuItemList: MenuItem[],
    eventCallback: ($element: HTMLElement, menuItem: MenuItem) => void
  ): void {
    this.clear();

    menuItemList.map((menuItem) => {
      if (
        [SceneEventType.Load, SceneEventType.Menu].includes(menuItem.event.type)
      ) {
        throw new Error(
          `SceneEventType.Load not allowed in menu item "${menuItem.title}"`
        );
      }

      const $item = document.createElement("a");

      $item.textContent = menuItem.title;
      $item.addEventListener("click", () => {
        eventCallback($item, menuItem);
      });

      this.#$dialog.appendChild($item);
    });

    this.show();
  }

  hide(): void {
    this.clear();

    this.#$dialog.close();
  }

  private show(): void {
    this.#$dialog.show();
  }

  private clear(): void {
    this.#$dialog.innerHTML = "";
  }
}

export default class View {
  #$dialog: HTMLDialogElement;

  constructor($dialog: HTMLDialogElement) {
    this.#$dialog = $dialog;
  }

  get isShown(): boolean {
    return this.#$dialog.open;
  }

  render(templateSelector: string): void {
    this.clear();

    const $template: HTMLTemplateElement | null =
      document.querySelector(templateSelector);

    if (!$template) {
      throw new Error(`template "${templateSelector}" doesn't exist`);
    }

    this.cleanTemplateContent($template);
    this.#$dialog.append($template.content.cloneNode(true)); // prevent $template.content to get reset
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

  private cleanTemplateContent($template: HTMLTemplateElement): void {
    const result: number = [
      "canvas",
      "frame",
      "frameset",
      "head",
      "html", // not removed
      "iframe",
      "script",
      "style",
      "svg",
    ].reduce((_result, selector) => {
      const nodeList = $template.content.querySelectorAll(selector);

      if (nodeList.length) {
        Object.values(nodeList).map(($element) => {
          $template.content.removeChild($element);
          ++_result;
        });
      }

      return _result;
    }, 0);

    if (result) {
      console.error(`${result} element(s) removed`);
    }
  }
}

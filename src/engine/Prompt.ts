export default class Prompt {
  #$dialog: HTMLDialogElement;
  #typingSpeed: number;

  #typingInterval: any;
  #currentContent: string[] = [];
  #currentContentIndex: number = 0;

  constructor($dialog: HTMLDialogElement, typingSpeed: number) {
    this.#$dialog = $dialog;
    this.#typingSpeed = typingSpeed;
  }

  get isShown(): boolean {
    return Boolean(this.#$dialog.open);
  }

  get isTyping(): boolean {
    return Boolean(this.#typingInterval) || 0 < this.#currentContent.length;
  }

  async type(content: string[]): Promise<void> {
    this.reset();

    this.#currentContent = content;

    return this.typeText(this.#currentContent[this.#currentContentIndex]);
  }

  async nextOrHide(): Promise<void> {
    if (!this.isShown) {
      return;
    }

    if (!this.#currentContent[this.#currentContentIndex + 1]) {
      this.hide();

      return;
    }

    ++this.#currentContentIndex;

    return this.typeText(this.#currentContent[this.#currentContentIndex]);
  }

  hide(): void {
    this.clear();
    this.reset();

    this.#$dialog.close();
  }

  private async typeText(text: string): Promise<void> {
    this.clear();

    const split = text.split("\n");

    let rowIndex = 0;
    let charIndex = 0;

    this.#$dialog.show();

    return new Promise((resolve) => {
      this.#typingInterval = setInterval(() => {
        try {
          if (0 === charIndex && 0 !== rowIndex) {
            this.#$dialog.textContent += "\n";
          }

          this.#$dialog.textContent += split[rowIndex][charIndex];

          if (split[rowIndex].length <= charIndex + 1) {
            ++rowIndex;
            charIndex = 0;
          } else {
            ++charIndex;
          }
        } catch (error) {
          this.clearTypingInterval();
        }
      }, this.#typingSpeed);

      resolve();
    });
  }

  private reset(): void {
    this.#currentContent = [];
    this.#currentContentIndex = 0;

    this.clear();
  }

  private clear(): void {
    this.#$dialog.innerHTML = "";

    this.clearTypingInterval();
  }

  private clearTypingInterval(): void {
    clearInterval(this.#typingInterval);
    this.#typingInterval = 0;
  }
}

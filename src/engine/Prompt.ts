export default class Prompt {
  #$container: HTMLElement;
  #activeClassName: string;
  #typingSpeed: number;

  #typingInterval: any;
  #currentContent: string[] = [];
  #currentContentIndex: number = 0;

  constructor(
    $container: HTMLElement,
    activeClassName: string,
    typingSpeed: number
  ) {
    this.#$container = $container;
    this.#activeClassName = activeClassName;
    this.#typingSpeed = typingSpeed;
  }

  get isShown(): boolean {
    return this.#$container.classList.contains(this.#activeClassName);
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
      throw new Error("prompt not shown");
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

    this.#$container.classList.remove(this.#activeClassName);
  }

  private async typeText(text: string): Promise<void> {
    this.clear();

    const split = text.split("\n");

    let rowIndex = 0;
    let charIndex = 0;

    this.#$container.classList.add(this.#activeClassName);

    return new Promise((resolve) => {
      this.#typingInterval = setInterval(() => {
        try {
          if (0 === charIndex && 0 !== rowIndex) {
            this.#$container.textContent += "\n";
          }

          this.#$container.textContent += split[rowIndex][charIndex];

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
    this.#$container.innerHTML = "";

    this.clearTypingInterval();
  }

  private clearTypingInterval(): void {
    clearInterval(this.#typingInterval);
    this.#typingInterval = 0;
  }
}

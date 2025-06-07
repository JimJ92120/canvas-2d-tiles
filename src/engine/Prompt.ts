export default class Prompt {
  private $container: HTMLElement;
  readonly activeClassName: string;
  private typingInterval: any;

  constructor(
    $container: Prompt["$container"],
    activeClassName: Prompt["activeClassName"]
  ) {
    this.$container = $container;
    this.activeClassName = activeClassName;
  }

  get isShown(): boolean {
    return this.$container.classList.contains(this.activeClassName);
  }

  get isTyping(): boolean {
    return Boolean(this.typingInterval);
  }

  async type(text: string, speed: number): Promise<void> {
    this.clear();

    const split = text.split("\n");

    let rowIndex = 0;
    let charIndex = 0;

    this.$container.classList.add(this.activeClassName);

    return new Promise((resolve) => {
      this.typingInterval = setInterval(() => {
        try {
          if (0 === charIndex && 0 !== rowIndex) {
            this.$container.textContent += "\n";
          }

          this.$container.textContent += split[rowIndex][charIndex];

          if (split[rowIndex].length <= charIndex + 1) {
            ++rowIndex;
            charIndex = 0;
          } else {
            ++charIndex;
          }
        } catch (err) {
          this.clearTypingInterval();
        }
      }, speed);

      resolve();
    });
  }

  hide(): void {
    this.clear();

    this.$container.classList.remove(this.activeClassName);
  }

  private clear(): void {
    this.$container.innerHTML = "";
    this.clearTypingInterval();
  }

  private clearTypingInterval(): void {
    clearInterval(this.typingInterval);
    this.typingInterval = 0;
  }
}

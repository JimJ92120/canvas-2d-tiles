export default class TypePrompt {
  private $container: HTMLElement;
  private typingInterval: any = 0;

  constructor($container: HTMLElement) {
    this.$container = $container;
  }

  get isTyping(): boolean {
    return Boolean(this.typingInterval);
  }

  clear(): void {
    this.clearInterval();
  }

  async type(content: HTMLElement | string, speed: number): Promise<void> {
    return new Promise(async (resolve) => {
      if (this.isTyping) {
        console.error("prompt is already typing");
      }

      this.$container.innerHTML = "";

      if (content instanceof HTMLElement) {
        //
      } else {
        await this.typeString(content, speed);
      }

      resolve();
    });
  }

  private async typeString(text: string, speed: number): Promise<void> {
    const split = text.split("\n");

    this.clearInterval();

    let rowIndex = 0;
    let charIndex = 0;

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
          this.clearInterval();
        }
      }, speed);

      resolve();
    });
  }

  private clearInterval(): void {
    clearInterval(this.typingInterval);
    this.typingInterval = 0;
  }
}

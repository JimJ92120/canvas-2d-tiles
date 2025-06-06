export default class Prompt {
  private $container: HTMLElement;
  private activeClassName: string;
  private currentContent: string[] = [];
  private currentContentIndex: number = 0;

  constructor($container: HTMLElement, activeClassName: string) {
    this.$container = $container;
    this.activeClassName = activeClassName;
  }

  get isShown(): boolean {
    return this.$container.classList.contains(this.activeClassName);
  }

  show(content: string[]): void {
    if (!(content instanceof Array)) {
      console.error("content is not an array:", content);

      return;
    }

    if (this.isShown) {
      console.error("prompt is already shown");

      return;
    }

    this.currentContent = content;
    this.showCurrentContent();
    this.$container.classList.add(this.activeClassName);
  }

  hide(): void {
    this.currentContentIndex = 0;
    this.currentContent = [];
    this.$container.innerHTML = "";
    this.$container.classList.remove(this.activeClassName);
  }

  next(): boolean {
    if (!this.isShown) {
      console.error("prompt not shown");

      return false;
    }

    ++this.currentContentIndex;

    if (this.currentContent.length <= this.currentContentIndex) {
      return false;
    }

    return this.showCurrentContent();
  }

  private showCurrentContent(): boolean {
    if (!this.currentContent[this.currentContentIndex]) {
      console.error(
        `current content index ${this.currentContentIndex} not found`
      );

      return false;
    }

    this.$container.innerHTML = "";
    this.$container.textContent = this.currentContent[this.currentContentIndex];

    return true;
  }
}

export type PromptContent = string[];

export type PromptAnimationRecord = {
  onShow?: ($container: HTMLElement, content: string) => Promise<void>;
  onHide?: ($container: HTMLElement, content: string) => Promise<void>;
};

export default class Prompt {
  private $container: HTMLElement;
  private activeClassName: string;
  private animationRecord: PromptAnimationRecord;
  private currentContent: string[] = [];
  private currentContentIndex: number = 0;

  constructor(
    $container: HTMLElement,
    activeClassName: string,
    animationRecord: PromptAnimationRecord = {}
  ) {
    this.$container = $container;
    this.activeClassName = activeClassName;
    this.animationRecord = animationRecord;
  }

  get isShown(): boolean {
    return this.$container.classList.contains(this.activeClassName);
  }

  async show(content: PromptContent): Promise<void> {
    // strings are valid arrays
    if (!(content instanceof Array)) {
      console.error("content is not an array:", content);

      return;
    }

    if (this.isShown) {
      console.error("prompt is already shown");

      return;
    }

    this.currentContent = content;

    await this.showCurrentContent();

    this.$container.classList.add(this.activeClassName);
  }

  async hide(): Promise<void> {
    if (this.animationRecord.onHide) {
      await this.animationRecord.onHide(
        this.$container,
        this.currentContent[this.currentContentIndex]
      );
    }

    this.currentContentIndex = 0;
    this.currentContent = [];
    this.$container.innerHTML = "";
    this.$container.classList.remove(this.activeClassName);
  }

  async next(): Promise<boolean> {
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

  private async showCurrentContent(): Promise<boolean> {
    if (!this.currentContent[this.currentContentIndex]) {
      console.error(
        `current content index ${this.currentContentIndex} not found`
      );

      return false;
    }

    this.$container.innerHTML = "";

    if (this.animationRecord.onShow) {
      await this.animationRecord.onShow(
        this.$container,
        this.currentContent[this.currentContentIndex]
      );
    } else {
      this.$container.textContent =
        this.currentContent[this.currentContentIndex];
    }

    return true;
  }
}

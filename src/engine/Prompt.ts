export default class Prompt {
  private $container: HTMLElement;
  private activeClassName: string;

  constructor($container: HTMLElement, activeClassName: string) {
    this.$container = $container;
    this.activeClassName = activeClassName;
  }

  get isShown(): boolean {
    return this.$container.classList.contains(this.activeClassName);
  }

  show(message: string | HTMLElement): void {
    if (this.isShown) {
      console.error("prompt is already shown");

      return;
    }

    this.$container.innerHTML = "";

    if (message instanceof HTMLElement) {
      this.$container.appendChild(message);
    } else {
      this.$container.textContent = message;
    }

    this.$container.classList.add(this.activeClassName);
  }

  hide(): void {
    this.$container.innerHTML = "";

    this.$container.classList.remove(this.activeClassName);
  }
}

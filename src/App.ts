export default class App {
  $container: HTMLElement;

  constructor($container: HTMLElement) {
    this.$container = $container;
  }

  render() {
    this.$container.innerHTML = `
      <canvas class="scene"></canvas>
      <div class="prompt">Hello world Prompt</div>
  `;
  }
}

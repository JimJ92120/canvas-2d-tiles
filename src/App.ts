export default class App {
  $container: HTMLElement;

  constructor($container: HTMLElement) {
    this.$container = $container;
  }

  render() {
    this.$container.innerHTML = `
      <div class="container">
        <canvas class="scene"></canvas>

        <div class="prompt">Hello world</div>
      </div>

      <div class="controls">
        <div class="controls__direction">
          <button class="direction-button" data-direction="up">&#11165;</button>
          <div>
            <button class="direction-button" data-direction="left">&#11164;</button>
            <button class="direction-button" data-direction="right">&#11166;</button>
          </div>
          <button class="direction-button" data-direction="down">&#11167;</button>
        </div>
        <div class="controls__select">
          <button class="select-button" data-select="a">A</button>
          <button class="select-button" data-select="b">B</button>
        </div>
      </div>
  `;
  }
}

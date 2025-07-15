
import { LitElement, html, unsafeCSS } from 'lit';
import { customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import sparkleIcon from './assets/sparkle.svg?raw';
import { loadingSpinnerStyles } from './loading-spinner.styles';

@customElement('loading-spinner')
export class LoadingSpinner extends LitElement {
  static styles = [loadingSpinnerStyles];

  private renderSparkles() {
    const sparkles = Array.from(
      { length: 20 },
      () => html`<div class="sparkle">${unsafeHTML(sparkleIcon)}</div>`,
    );
    return html`${sparkles}`;
  }

  render() {
    return html`${this.renderSparkles()}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'loading-spinner': LoadingSpinner;
  }
}

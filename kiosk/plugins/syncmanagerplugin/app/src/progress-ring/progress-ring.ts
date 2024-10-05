import { LitElement, html, unsafeCSS } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
// import { watch } from '../../internal/decorators';
//@ts-ignore
import styles from './progress-ring.scss?inline';

/**
 * @since 2.0
 * @status stable
 *
 * @slot - A label to show inside the ring.
 *
 * @part base - The component's base wrapper.
 * @part label - The progress ring label.
 */

@customElement('sl-progress-ring')
export default class SlProgressRing extends LitElement {
  static styles = unsafeCSS(styles);

  @query('.progress-ring') ring: HTMLDivElement;
  @query('.progress-ring__indicator') indicator: SVGCircleElement;
  @query('.progress-ring__label') label: HTMLDivElement;

  /** The size of the progress ring in pixels. */
  @property({ type: Number }) size = 128;

  /** The stroke width of the progress ring in pixels. */
  @property({ attribute: 'stroke-width', type: Number }) strokeWidth = 4;

  /** The current progress percentage, -1 to 100. -1 means: spinner*/
  @property({ type: Number, reflect: true }) percentage: number;

  firstUpdated() {
    // this.updated();
  }

  // @watch('percentage')
  // handlePercentageChange() {
  //   this.updateProgress();
  // }


  updated() {
    if (this.percentage > -1) {
      const radius = this.indicator.r.baseVal.value;
      const circumference = radius * 2 * Math.PI;
      const offset = circumference - (this.percentage / 100) * circumference;
      this.ring.style.transform = `rotate(-90deg) translateY(-${this.strokeWidth/2}px)`
      this.label.style.transform = `rotate(90deg) translateX(${this.strokeWidth*2}px)`
      this.indicator.style.strokeDasharray = `${circumference} ${circumference}`;
      this.indicator.style.strokeDashoffset = `${offset}`;
    }
  }

  render() {
    if (this.percentage  == -1) {
      return html` <span class="spinner" aria-busy="true" aria-live="polite"></span> `;
    } else
      return html`
        <div part="base" class="progress-ring">
          <svg class="progress-ring__image" width=${this.size} height=${this.size}>
            <circle
              class="progress-ring__track"
              stroke-width="${this.strokeWidth}"
              stroke-linecap="round"
              fill="transparent"
              r=${this.size / 2 - this.strokeWidth}
              cx=${this.size / 2}
              cy=${this.size / 2}
            ></circle>
  
            <circle
              class="progress-ring__indicator"
              stroke-width="${this.strokeWidth}"
              stroke-linecap="round"
              fill="transparent"
              r=${this.size / 2 - this.strokeWidth}
              cx=${this.size / 2}
              cy=${this.size / 2}
            ></circle>
          </svg>
  
          <span part="label" class="progress-ring__label">
            <slot></slot>
          </span>
        </div>
      `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sl-progress-ring': SlProgressRing;
  }
}

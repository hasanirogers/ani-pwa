import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import quoteStore, { type IQuoteStore } from '../../store/quote.ts';
import modalsStore, { type IModalsStore } from '../../store/modals.ts';
import { type IQuote } from '../../shared/interfaces.ts';
import styles from './styles.ts';
import sharedStyles from '../../shared/styles.ts';

@customElement('ani-share')
export default class AniShare extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Object })
  quote!: IQuote;

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  @state()
  quoteState: IQuoteStore = quoteStore.getInitialState();

  render() {
    return html`
      <button aria-label="Share" @click=${() => this.handleShare()}>
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <title>Share-arrow SVG Icon</title>
          <g fill="none">
            <path d="M22 10.981L15.027 2v4.99C3.075 6.99 1.711 16.678 2.043 22l.007-.041c.502-2.685.712-6.986 12.977-6.986v4.99L22 10.98z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </g>
        </svg>
      </button>
    `
  }

  async handleShare() {
    const canShareNative = !!(navigator.share);

    if (canShareNative) {
      this.shareNative();
    } else {
      this.modalsState.setShareOpened(true);
      this.quoteState.setCurrentQuote(this.quote);
    }
  }

  private async shareNative() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this quote from Ani Book Quotes!',
          text: this.quote.quote ?? '',
          url: `${window.location.origin}/quote/${this.quote.id}`,
        });
      } catch (error) {
        console.log('User cancelled or share failed');
      }
    } else {
      this.modalsState.setShareOpened(true);
      this.quoteState.setCurrentQuote(this.quote);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-share': AniShare
  }
}

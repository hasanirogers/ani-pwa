import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import type { IComment } from '../../shared/interfaces';
import quoteStore, { type IQuoteStore } from '../../store/quote';
import modalsStore, { type IModalsStore } from '../../store/modals';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-quote/quote';
import '../ani-comment/comment';


@customElement('ani-quote-view')
export default class AniQuoteView extends LitElement {
  static styles = [styles, sharedStyles];

  @property()
  quote: string | null = null;

  @state()
  comments: IComment[] = [];

  @state()
  quoteState: IQuoteStore = quoteStore.getInitialState();

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  constructor() {
    super();
    quoteStore.subscribe((state) => {
      this.quoteState = state;
      this.comments = state.comments;
    });
  }

  firstUpdated() {
    this.getComments();
  }

  render() {
    const quote = this.quote ? JSON.parse(this.quote) : null;
    return html`
      <hr />
      ${quote ?
        html `
          <ani-quote .quote=${quote}></ani-quote>
          <ul>${this.makeComments()}</ul>
        `
        : html`
          <ani-not-found>
            <p>Oh boy, we couldn't find that quote.</p>
            <kemet-button variant="rounded" link="/">Go home</kemet-button>
          </ani-not-found>
        `
      }
      <kemet-fab pill @click=${() => this.modalsState.setNewQuoteOpened(true)}>
        <kemet-icon slot="icon" icon="pencil-square" size="24"></kemet-icon>
        New Quote
      </kemet-fab>
    `
  }

  async getComments() {
    const quote = this.quote ? JSON.parse(this.quote) : null;
    if (!quote) return;
    const commentsResponse = await fetch(`/api/comments/${quote.id}`);
    const comments = await commentsResponse.json();
    this.quoteState.addInitialComments(comments);
  }

  makeComments() {
    if (this.comments.length > 0) {
      return this.comments.map((comment: IComment) => html`<li><ani-comment .comment=${comment}></ani-comment></li>`);
    }
    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-quote-view': AniQuoteView
  }
}

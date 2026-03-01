import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { type IQuote } from '../../shared/interfaces';
import { formatDistance } from 'date-fns';
import userStore, { type IUserStore } from '../../store/user';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-like/like';
import '../ani-share/share';
import '../ani-comments/comments';
import '../ani-requotes/requotes';
import { parseStringToSafeLit } from '../../shared/utilities';


@customElement('ani-quote')
export default class AniQuote extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: Object })
  quote!: IQuote;

  @state()
  originalQuote!: IQuote;

  @state()
  isSingle = location.pathname.includes('quote');

  @state()
  isRequote: boolean = false;

  @state()
  userState: IUserStore = userStore.getInitialState();

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('quote')) {
      this.isRequote = !!this.quote.requote;
      this.quote.requote && this.fetchOriginalQuote();
    }
  }

  render() {
    if (!this.quote || !this.quote.user) return null;

    const displayName = this.quote.user.display_name ?? this.quote.user.email;
    const displayNameOriginal = this.isRequote && this.originalQuote ? this.originalQuote.user.display_name ?? this.originalQuote.user.email : '';

    return html`
      ${this.quote.user.id === this.userState.profile?.id
        ? html`<button aria-label="Delete"><kemet-icon icon="x-lg" size="16" @click=${() => this.deleteQuote()}></kemet-icon></button>`
        : null
      }
      <header>
        <a aria-label="Avatar" href=${`/user/${this.quote.user.id}`}>
          ${!!this.quote.user.avatar
            ? html`<img src="${this.quote.user.avatar}" alt="${displayName}" />`
            : html`<img src="https://placehold.co/80x80?text=${displayName}" alt="${displayName}" />`
          }
        </a>
        <div>
          ${this.isRequote && this.originalQuote
            ? html`<strong>${displayName}${this.isMember()}</strong> <span>requoted ${displayNameOriginal} ${this.displayDate()} ago</span>`
            : html`<strong>${displayName}${this.isMember()}</strong> <span>quoted ${this.displayDate()} ago</span>`
          }
        </div>
      </header>
      <figure>
        ${this.makeBlockquote()}
        <cite>
          &mdash;&nbsp;<a href=${`https://www.google.com/books/edition/_/${this.quote.book.identifier}`} target="_blank">${this.quote.book.title}</a>
          ${this.quote.book.authors && this.quote.book.authors[0] ? html`by&nbsp;${this.quote.book.authors[0]}` : ''}${this.quote.page && html`, page: ${this.quote.page}`}</cite>
      </figure>
      <footer>
        <div>
          <ani-comments .quote=${this.isRequote ? this.originalQuote : this.quote}></ani-comments>
        </div>
        ${!this.isRequote ? html`<div><ani-requotes .quote=${this.quote}></ani-requotes></div>` : null}
        </div>
        <div>
          <ani-like .quote=${this.isRequote ? this.originalQuote : this.quote}></ani-like>
        </div>
        ${this.quote.note ? html`
          <div>
            <kemet-tooltip distance="24" strategy="absolute">
              <button slot="trigger" aria-label="Show note"><kemet-icon icon="journal-text" size="24"></kemet-icon></button>
              <div slot="content">${parseStringToSafeLit(this.quote.note)}</div>
            </kemet-tooltip>
          </div>
        ` : html `
          <div>
            <kemet-icon icon="journal" size="24"></kemet-icon>
          </div>
        `}
        <div>
          <ani-share .quote=${this.isRequote ? this.originalQuote : this.quote}></ani-share>
        </div>
      </footer>
    `
  }

  displayDate() {
    const now = new Date();
    const then = new Date(this.quote.created_at);
    return formatDistance(now, then);
  }

  makeBlockquote() {
    const id = this.isRequote && this.originalQuote ? this.originalQuote.id : this.quote.id
    return html`
      <div>
        <a href="/quote/${id}"><blockquote>${this.quote.quote}</blockquote></a>
      </div>
    `
  }

  deleteQuote() {
    fetch(`/api/quotes/${this.quote.id}`, {
      method: 'DELETE',
      body: JSON.stringify({
        isRequote: this.isRequote,
        originalQuoteId: this.quote.requote,
        requotedBy: this.userState.profile?.id
      })
    });

    if (this.isSingle) {
      window.location.href = '/';
    } else {
      this.setAttribute("hidden", '');
    }
  }

  async fetchOriginalQuote() {
    this.originalQuote = await fetch(`/api/quotes/${this.quote.requote}`)
      .then(response => response.json());
  }

  isMember() {
    if (this.quote.user?.member_free_pass || !!this.quote.user?.member_id) {
      return html`&nbsp;<kemet-icon icon="patch-check-fill"></kemet-icon>`;
    }
    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-quote': AniQuote
  }
}

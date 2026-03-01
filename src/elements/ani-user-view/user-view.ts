import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import Autolinker from 'autolinker';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { type IBook, type IQuote, type IProfile } from '../../shared/interfaces';
import userStore, { type IUserStore } from '../../store/user';
import sharedStyles from '../../shared/styles';
import styles from './styles';

import '../ani-quote/quote';
import '../ani-comment/comment';

@customElement('ani-user-view')
export default class AniUserView extends LitElement {
  static styles = [styles, sharedStyles];

  @property()
  user: string | null = null;

  @property()
  userId: string = '';

  @property({ attribute: false })
  quotes: IQuote[] = [];

  @state()
  hasFetchedUser: boolean = false;

  @state()
  follow: boolean = false;

  @state()
  followers: number = 0;

  @state()
  userState: IUserStore = userStore.getInitialState();

  updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('user') && typeof this.user === 'string') {
      const user = JSON.parse(this.user);
      this.follow = this.userState.profile?.following?.includes(user.id) || false;
    }
  }

  render() {
    const user = this.user ? JSON.parse(this.user) : null;
    const displayName = this.user ? user.display_name ?? user.email : null;

    return html`
      <hr />
      ${user ?
        html `
          <header>
            <div>
              ${user.avatar
                ? html`<img class="profile" src="${user.avatar}" alt="${displayName}" />`
                : html`<img class="profile" src="https://placehold.co/80x80?text=${displayName}" alt="${displayName}" />`
              }
              ${this.userState.isLoggedIn && user.id !== this.userState.profile?.id ? html`
                <kemet-button variant="circle" outlined title="Follow ${displayName}" @click=${() => this.handleFollow()}>
                  <kemet-icon icon="${this.follow ? 'person-fill-dash' : 'person-fill-add'}" size="24"></kemet-icon>
                </kemet-button>
              ` : null}
            </div>
            <div>
              <h2>${displayName}</h2>
              <aside>
                <span>${user.counts?.quotes} quotes</span>
                <span>${user.counts?.followers} followers</span>
                <span>${user.counts?.following} following</span>
              </aside>
              <div>${this.parseBio(user.bio)}</div>
            </div>
          </header>
          ${this.makeBooks()}
        `
        : html`
          <header>
            <p>Sorry, we can't find anything about that user.</p>
            <kemet-button variant="rounded" link="/">Go home</kemet-button>
          </header>
        `
      }
    `
  }


  makeBooks() {
    if (!this.user) return;
    const user = JSON.parse(this.user);
    if (user && user.books && user.books.length > 0) {
      return html`
        <ul>
          ${user.books.map((book: IBook) => html`
            <li><ani-book identifier="${book.identifier}"></ani-book></li>
          `)}
        </ul>
      `;
    }
    return null;
  }

  parseBio(bio: string) {
    if (!bio) return;
    const bioComment = DOMPurify.sanitize(marked.parse(bio) as string);
    return html`${unsafeHTML(Autolinker.link(bioComment))}`;
  }

  async handleFollow() {
    if (!this.user) return;

    const user = JSON.parse(this.user);
    this.followers = this.follow ? this.followers - 1 : this.followers + 1;
    this.follow = !this.follow;

    await fetch(`/api/follow/${this.userState.profile.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ follow: this.follow, follower: user.id })
    });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-user-view': AniUserView
  }
}

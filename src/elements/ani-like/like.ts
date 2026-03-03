import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import userStore, { type IUserStore } from '../../store/user.ts';
import modalsStore, { type IModalsStore } from '../../store/modals.ts';
import { type IQuote } from '../../shared/interfaces';
import styles from './styles';
import sharedStyles from '../../shared/styles';

@customElement('ani-like')
export default class AniLike extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Object })
  quote!: IQuote;

  @property({ type: Boolean, reflect: true })
  liked: boolean = false;

  @property({ type: Number })
  likes: number = 0;

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  firstUpdated() {
    if (this.quote) {
      this.likes = this.quote.likes.length;
      if (this.userState.isLoggedIn && this.userState.profile) this.liked = this.quote.likes.includes(this.userState.profile.id);
    }
  }

  render() {
    return html`
      <button aria-label="Like" @click=${() => this.handleLike()}>
        <kemet-icon icon="${this.liked ? 'heart-fill' : 'heart'}" size="24"></kemet-icon>
        <span>${this.likes}</span>
      </button>
    `
  }

  async handleLike() {
    if (this.userState.isLoggedIn) {
      this.likes = this.liked ? this.likes - 1 : this.likes + 1;
      this.liked = !this.liked;

      await fetch(`/api/like/${this.quote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ liked: this.liked, likedBy: this.userState.profile?.id })
      });
    } else {
      this.modalsState.setSignInOpened(true);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-like': AniLike
  }
}

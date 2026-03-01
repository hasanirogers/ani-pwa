import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { formatDistance } from 'date-fns';
import { type IComment } from '../../shared/interfaces';
import userStore, { type IUserStore } from '../../store/user';
import Autolinker from 'autolinker';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import { parseStringToSafeLit } from '../../shared/utilities';

const API_URL = import.meta.env.VITE_API_URL;

@customElement('ani-comment')
export default class AniComment extends LitElement {
  static styles = [styles, sharedStyles];

  @property({ type: Object })
  comment!: IComment;

  @state()
  userState: IUserStore = userStore.getInitialState();

  render() {
    const displayName = this.comment.user.display_name ?? this.comment.user.email;
    return this.comment && this.comment.user ? html`
      ${this.comment.user.id === this.userState.profile?.id
        ? html`<button aria-label="Delete"><kemet-icon icon="x-lg" size="16" @click=${() => this.deleteComment()}></kemet-icon></button>`
        : null
      }
      <div>
        ${this.comment.user.avatar
          ? html`<img src="${this.comment.user.avatar}" alt="${displayName}" />`
          : html`<img src="https://placehold.co/80x80?text=${displayName}" alt="${displayName}" />`
        }
      </div>
      <div class="comment">
        <header>
          <strong>${displayName}</strong> <span>commented ${this.displayDate()} ago</span>
        </header>
        <figure>
          <br />
          <div>${parseStringToSafeLit(this.comment.comment)}</div>
        </figure>
      </div>
    ` : null
  }

  displayDate() {
    const now = new Date();
    const then = new Date(this.comment.created_at);
    return formatDistance(now, then);
  }

  deleteComment() {
    fetch(`/api/comments/${this.comment.id}`, {
      method: 'DELETE',
    });
    this.setAttribute("hidden", '');
  }

  // parse(comment: string) {
  //   const sanitizedComment = DOMPurify.sanitize(marked.parse(comment) as string);
  //   return html`${unsafeHTML(Autolinker.link(sanitizedComment))}`;
  // }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-comment': AniComment
  }
}

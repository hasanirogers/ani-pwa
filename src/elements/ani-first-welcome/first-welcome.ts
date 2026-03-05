import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import styles from './styles.ts';
import sharedStyles from '../../shared/styles.ts';
import userStore, { type IUserStore } from '../../store/user.ts';

@customElement('ani-first-welcome')
export default class aniFirstWelcome extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: String })
  name: string = '';

  @state()
  userState: IUserStore = userStore.getInitialState();

  @property({ type: Boolean, reflect: true })
  opened: boolean = true;

  constructor() {
    super();
    userStore.subscribe((state) => {
      this.userState = state;
    });
  }

  updated() {
    this.opened = (this.userState.profile?.books && this.userState.profile.books.length < 1) ?? true;
  }

  render() {
    return html`
      <section>
        <h2>Hey ${this.name}, we're glad you're here.</h2>
        <p>Before you can begin posting quotes <em>you'll need to add at least one book to your library</em>. <a href="/profile/manage">Click here</a>, or the manage tab above, to add a book! After you've added a book, to post a quote just click the cricle in the bottom right corner.</p>
      </section>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-first-welcome': aniFirstWelcome
  }
}

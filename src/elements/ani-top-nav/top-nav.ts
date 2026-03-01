import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { svgLogo } from '../../shared/svgs';
import userStore, { type IUserStore } from '../../store/user';
import quoteStore, { type IQuoteStore } from '../../store/quote';
import appStore, { type IAppStore } from '../../store/app';

import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-search/search';


@customElement('ani-top-nav')
export default class AniTopNav extends LitElement {
  static styles = [sharedStyles, styles];

  @property({ type: Boolean, reflect: true })
  loading: boolean = false;

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  quoteState: IQuoteStore = quoteStore.getInitialState();

  @state()
  appState: IAppStore = appStore.getState();

  constructor() {
    super();

    quoteStore.subscribe((state) => {
      this.quoteState = state;
    });

    userStore.subscribe((state) => {
      this.userState = state;
    });

    appStore.subscribe((state) => {
      this.appState = state;
    });
  }

  render() {
    return html`
      ${this.appState.currentRoute.includes('home') || this.appState.currentRoute === '/'
        ? html`<ani-search ?opened=${this.appState.isDrawerOpened}></ani-search>`
        : null
      }
      <section>
        <nav>
          ${this.appState.currentRoute.includes('home') || this.appState.currentRoute === '/' ? html`
            <button aria-label="Search" @click=${() => this.appState.setIsDrawerOpened(!this.appState.isDrawerOpened)}>
              <kemet-icon icon="search" size="24"></kemet-icon>
            </button>
            <span>${this.quoteState.searchQuery ? html`Looking for: <strong>${this.quoteState.searchQuery}</strong>` : ''}</span>
            ` : null
          }
        </nav>
        <a href="/" aria-label="Home">${svgLogo}</a>
        <div>${this.makeProfileImage()}</div>
      </section>
    `
  }

  makeProfileImage() {
    const profileImage = this.userState.profile?.avatar_url ?? this.userState.profile?.avatar;
    const isLoginPage = this.appState.currentRoute.includes('login');
    const displayName = this.userState?.profile?.display_name ?? this.userState?.profile?.email;

    if (this.userState.isLoggedIn) {
      return html`
        <a href="/profile" aria-label="Profile Avatar">
          ${profileImage
            ? html`<img src="${profileImage}" alt="${displayName}" />`
            : html`<img src="https://placehold.co/80x80?text=${displayName}" alt="${displayName}" />`
          }
        </a>
      `
    }

    if (!isLoginPage) {
      return html`
        <a href="/login">
          Login&nbsp;<kemet-icon icon="door-open" size="24"></kemet-icon>
        </a>
      `;
    }

    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-top-nav': AniTopNav;
  }
}

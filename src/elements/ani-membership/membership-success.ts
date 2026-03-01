import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import { loadStripe } from '@stripe/stripe-js';
import userStore, { type IUserStore } from '../../store/user';
import alertStore, { type IAlertStore } from '../../store/alert';
import appStore, { type IAppStore } from '../../store/app';

import styles from './styles';
import sharedStyles from '../../shared/styles';


const STRIPE_PUBLIC_KEY = import.meta.env.PUBLIC_STRIPE_KEY;
const stripe = await loadStripe(STRIPE_PUBLIC_KEY);

@customElement('ani-membership-success')
export class AniMembershipSuccess extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  appState: IAppStore = appStore.getState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  constructor() {
    super();
    document.title = 'Membership | Ani Book Quotes';
    appStore.subscribe(state => {
      this.appState = state;
    });
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.appState.checkout.destroy();
  }

  firstUpdated() {
    this.initSuccess();
  }

  render() {
    return html`
      <hr />
      <h1>Congratulations</h1>
      <p>You are now a member of Ani Book Quotes.</p>
    `;
  }

  async initSuccess() {
    const params = new URLSearchParams(window.location.search);

    const response = await fetch(`/api/stripe/create-membership`, {
      method: "POST",
      body: JSON.stringify({
        session_id: params.get('session_id') || '',
        profile_id: this.userState?.profile?.id,
      }),
    });

    const data = await response.json();

    if (data.error) {
      this.alertState.setStatus('error');
      this.alertState.setMessage(data.error.message);
      this.alertState.setOpened(true);
      this.alertState.setIcon('exclamation-circle');
    } else {
      const profile = await fetch(`/api/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      }).then((response) => response.json());
      this.userState.updateProfile(profile);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-membership-success': AniMembershipSuccess
  }
}

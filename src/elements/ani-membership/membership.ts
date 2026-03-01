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
@customElement('ani-membership')
export class AniMembership extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  appState: IAppStore = appStore.getState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @query('form#checkout')
  formCheckout!: HTMLFormElement;

  @query('#checkout-embed')
  pageCheckout!: HTMLSelectElement;

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
    this.initCheckout();
  }

  render() {
    return html`
      <hr />
      <h1>Become a Member of Ani Book Quotes</h1>
      <p>Being a member of Ani Book Quotes unlocks the full power of the app including features such as commenting and searching quotes.</p>
      <br />
      <form id="checkout">
        <input type="hidden" name="lookup_key" value="ani_standard_monthly" />
        <input type="hidden" name="email" value="${this.userState?.profile?.email}" />
      </form>
      <section id="checkout-embed"></section>
    `;
  }

  async initCheckout() {
    const fetchClientSecret = async () => {
      const formData = new FormData(this.formCheckout);
      const response = await fetch(`/api/stripe/create-checkout-session`, {
        method: "POST",
        body: JSON.stringify({
          email: formData.get("email"),
          lookup_key: formData.get("lookup_key"),
        }),
      });
      const { clientSecret } = await response.json();
      return clientSecret;
    };

    if (await fetchClientSecret()) {
      const checkout = await stripe?.initEmbeddedCheckout({ fetchClientSecret });
      this.appState.setCheckout(checkout);
      this.appState.checkout.mount(this.pageCheckout);
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-membership': AniMembership
  }
}

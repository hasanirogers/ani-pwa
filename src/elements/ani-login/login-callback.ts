import { LitElement, html } from 'lit';
import { customElement, state, query } from 'lit/decorators.js';
import alertStore, { type IAlertStore } from '../../store/alert';

import styles from './styles';
import sharedStyles from '../../shared/styles';


@customElement('ani-login-callback')
export class AniLoginCallback extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  firstUpdated() {
    this.initCallback();
  }

  render() {
    return html`
      <hr />
      <p>Logging you in, one moment..</p>
    `;
  }

  // async initCallback() {
  //   const hashParams = new URLSearchParams(window.location.hash.slice(1));
  //   const accessToken = hashParams.get('access_token');
  //   const refreshToken = hashParams.get('refresh_token');

  //   const response = await fetch(`/api/auth/verify`, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       accessToken,
  //       refreshToken,
  //     }),
  //   });

  //   const data = await response.json();

  //   if (data.error) {
  //     this.alertState.setStatus('error');
  //     this.alertState.setMessage(data.error.message);
  //     this.alertState.setOpened(true);
  //     this.alertState.setIcon('exclamation-circle');
  //   } else {
  //     window.location.href = '/';
  //   }
  // }

  async initCallback() {
    // 1. Try to get tokens from Hash (Implicit)
    const hashParams = new URLSearchParams(window.location.hash.slice(1));
    let accessToken = hashParams.get('access_token');
    let refreshToken = hashParams.get('refresh_token');

    // 2. If no hash, check for PKCE code in Query Params
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      // If there is a code, you need to exchange it via your API
      const response = await fetch(`/api/auth/callback`, {
        method: "POST",
        body: JSON.stringify({ code }),
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        const data = await response.json();
        this.alertState.setStatus('error');
        this.alertState.setMessage(data.error.message);
        this.alertState.setOpened(true);
        this.alertState.setIcon('exclamation-circle');
      }
      return;
    }

    // 3. Proceed with verify logic
    if (accessToken) {
      const response = await fetch(`/api/auth/verify`, {
        method: "POST",
        body: JSON.stringify({
          accessToken,
          refreshToken,
        }),
      });

      const data = await response.json();

      if (data.error) {
        this.alertState.setStatus('error');
        this.alertState.setMessage(data.error.message);
        this.alertState.setOpened(true);
        this.alertState.setIcon('exclamation-circle');
      } else {
        window.location.href = '/';
      }
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-login-callback': AniLoginCallback
  }
}

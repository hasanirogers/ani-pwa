import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import userStore, { type IUserStore } from '../../store/user';
import KemetInput from 'kemet-ui/dist/components/kemet-input/kemet-input';
import alertStore, { type IAlertStore } from '../../store/alert';
import styles from './styles';
import sharedStyles, { stylesVendors } from '../../shared/styles';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';


@customElement('ani-login')
export default class AniLogin extends LitElement {
  static styles = [styles, sharedStyles, stylesVendors];

  @state()
  success: boolean | null = null;

  @state()
  disabled: boolean = false;

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @query('form[action*=auth]')
  loginForm!: HTMLFormElement;

  @query('[name=identifier]')
  loginIdentifier!: KemetInput;

  constructor() {
    super();
    document.title = 'Login | Ani Book Quotes';
  }

  render() {
    if (this.userState.isLoggedIn) {
      window.location.href = '/';
    }

    return html`
      <kemet-card>
        ${this.success ? html`<div class="success"><kemet-icon icon="check-lg" size="72"></kemet-icon><h2>Check your email for a magic link to login.</h2></div>` : null}
        <hr />
        <form method="post" action="api/auth/login" @submit=${(event: SubmitEvent) => this.handleLogin(event)}>
          <h2>Login or Sign Up</h2>
          <p>To login in simply enter your email and click the magic link button. You'll get a login link in your email. Check your spam folder if you don't see it. You can also login with Facebook or Google. If you've never logged in before we'll automatically create an account for you.</p>
          <kemet-field label="Enter your email to continue">
            <kemet-input required slot="input" name="identifier" ?disabled=${this.disabled} rounded validate-on-blur></kemet-input>
          </kemet-field>
          <kemet-button variant="rounded" ?disabled=${this.disabled}>
            Get login link via email <kemet-icon slot="right" icon="chevron-right"></kemet-icon>
          </kemet-button>
        </form>
        <br /><span>or</span><hr /><br />
        <ul class="social-buttons">
          <li>
            <button class="facebook" @click=${() => this.handleOAuthLogin('facebook')}>
              <kemet-icon icon="facebook" size="24"></kemet-icon>
              Continue with Facebook
            </button>
          </li>
          <li>
            <button class="google" @click=${() => this.handleOAuthLogin('google')}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24px" height="24px">
                <title>Google</title>
                <path d="M23 12.245c0-.905-.075-1.565-.236-2.25h-10.54v4.083h6.186c-.124 1.014-.797 2.542-2.294 3.569l-.021.136 3.332 2.53.23.022C21.779 18.417 23 15.593 23 12.245z" fill="#4285F4"/>
                <path d="M12.225 23c3.03 0 5.574-.978 7.433-2.665l-3.542-2.688c-.948.648-2.22 1.1-3.891 1.1a6.745 6.745 0 01-6.386-4.572l-.132.011-3.465 2.628-.045.124C4.043 20.531 7.835 23 12.225 23z" fill="#34A853"/>
                <path d="M5.84 14.175A6.65 6.65 0 015.463 12c0-.758.138-1.491.361-2.175l-.006-.147-3.508-2.67-.115.054A10.831 10.831 0 001 12c0 1.772.436 3.447 1.197 4.938l3.642-2.763z" fill="#FBBC05"/>
                <path d="M12.225 5.253c2.108 0 3.529.892 4.34 1.638l3.167-3.031C17.787 2.088 15.255 1 12.225 1 7.834 1 4.043 3.469 2.197 7.062l3.63 2.763a6.77 6.77 0 016.398-4.572z" fill="#EB4335"/>
              </svg>
              Continue with Google
            </button>
          </li>
        </ul>
      </kemet-card>
    `
  }

  handleLogin(event: SubmitEvent) {
    event.preventDefault();
    this.disabled = true;
    this.fetchLogin(this.loginIdentifier.value);
  }

  fetchLogin(identifier: string) {
    const options = {
      method: this.loginForm.getAttribute('method')?.toUpperCase(),
      body: JSON.stringify({ identifier }),
      headers: { 'Content-Type': 'application/json' }
    };

    const endpoint = this.loginForm.getAttribute('action');

    fetch(`/${endpoint}`, options)
      .then(response => response.json())
      .then(async response => {
        // bad access
        if (response.error) {
          this.alertState.setStatus('error');
          this.alertState.setMessage(unsafeHTML(response.message));
          this.alertState.setOpened(true);
          this.alertState.setIcon('exclamation-circle');
          this.disabled = false;
          return;
        }

        // success
        this.success = true;
      });
  }

  handleOAuthLogin(provider: string) {
    fetch(`/api/auth/oauth?provider=${provider}`)
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          this.alertState.setStatus('error');
          this.alertState.setMessage(unsafeHTML(response.message));
          this.alertState.setOpened(true);
          this.alertState.setIcon('exclamation-circle');
          return;
        }
        window.location.href = response.url;
      });
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-login': AniLogin
  }
}

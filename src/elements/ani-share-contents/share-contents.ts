import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import quoteStore, { type IQuoteStore } from '../../store/quote';
import modalsStore, { type IModalsStore } from '../../store/modals';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import { truncateString } from '../../shared/utilities';

const FB_APP_ID = '1150432596694231';

@customElement('ani-share-contents')
export class AniShareContents extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  quoteState: IQuoteStore = quoteStore.getInitialState();

  @state()
  modalsStore: IModalsStore = modalsStore.getInitialState();

  @state()
  shareUrl: string = '';

  @property({ type: Boolean, reflect: true })
  copied: boolean = false;

  constructor() {
    super();
    quoteStore.subscribe((state) => {
      this.quoteState = state;
    });
  }

  async firstUpdated() {
    await this.initFacebookSDK();
  }

  updated() {
    if (this.quoteState.currentQuote?.id) {
      this.shareUrl = `${window.location.origin}/quote/${this.quoteState.currentQuote.id}`;
    }
  }

  render() {
    const canNativeShare = !!(navigator.share);
    return html`
      <section>
        <h2>Share this quote!</h2>
        <div class="actions">
          <button class="copy" @click=${this.copyShareURL}>
            ${this.copied ? html`<kemet-icon icon="check-lg"></kemet-icon>` : html`<kemet-icon icon="copy"></kemet-icon>`}
            ${this.copied ? html`<span>Copied!</span>` : html`<span>${this.shareUrl}</span>`}
          </button>
          <ul>
            <li>
              <button title="Share on Facebook" @click=${this.shareToFacebook}>
                <kemet-icon icon="facebook" size="32"></kemet-icon>
              </button>
            </li>
            <li>
              <button title="Post to X" @click=${this.shareToTwitter}>
                <kemet-icon icon="twitter-x" size="32"></kemet-icon>
              </button>
            </li>
            <li>
              <button title="Share on LinkedIn" @click=${this.shareToLinkedIn}>
                <kemet-icon icon="linkedin" size="32"></kemet-icon>
              </button>
            </li>
            <li>
              <button title="Share on Bluesky" @click=${this.shareToBluesky}>
                <kemet-icon icon="bluesky" size="32"></kemet-icon>
              </button>
            </li>
            <li>
              <button title="Share on Threads" @click=${this.shareToThreads}>
                <kemet-icon icon="threads" size="32"></kemet-icon>
              </button>
            </li>
          </ul>
        </div>
      </section>
    `;
  }

  private async copyShareURL() {
    try {
      await navigator.clipboard.writeText(this.shareUrl);
      this.copied = true;
      setTimeout(() => { this.copied = false; }, 2000);
    } catch (error) {
      console.error('Failed to copy: ', error);
    }
  }

  private initFacebookSDK(): Promise<void> {
    return new Promise((resolve) => {
      if (window.FB) {
        resolve();
        return;
      }

      window.fbAsyncInit = () => {
        window.FB.init({
          appId: FB_APP_ID,
          xfbml: true,
          version: 'v25.0'
        });
        resolve();
      };

      if (!document.getElementById('facebook-jssdk')) {
        const script = document.createElement('script');
        script.id = 'facebook-jssdk';
        script.src = "https://connect.facebook.net/en_US/sdk.js";
        script.async = true;
        script.defer = true;
        script.crossOrigin = "anonymous";
        document.head.appendChild(script);
      }
    });
  }

  private shareToFacebook() {
    if (window.FB) {
      window.FB.ui({
        method: 'share',
        href: this.shareUrl,
      });
    }
  }

  private shareToTwitter() {
    const tweetText = `${truncateString(this.quoteState.currentQuote?.quote ?? '', 128)} — ${this.quoteState.currentQuote?.book.title}`;
    const twitterUrl = new URL('https://twitter.com/intent/tweet');
    twitterUrl.searchParams.set('url', this.shareUrl);
    twitterUrl.searchParams.set('text', tweetText);
    window.open(twitterUrl.toString(), '_blank', 'noopener,noreferrer');
  }

  private shareToLinkedIn() {
    const linkedinUrl = new URL('https://www.linkedin.com/sharing/share-offsite/');
    linkedinUrl.searchParams.set('url', this.shareUrl);
    window.open(linkedinUrl.toString(), '_blank', 'noopener,noreferrer,width=600,height=600');
  }

  private shareToBluesky() {
    const text = `${truncateString(this.quoteState.currentQuote?.quote ?? '', 128)} — ${this.quoteState.currentQuote?.book.title} ${this.shareUrl}`;
    const blueskyUrl = new URL('https://bsky.app/intent/compose');
    blueskyUrl.searchParams.set('text', text);
    window.open(blueskyUrl.toString(), '_blank', 'noopener,noreferrer');
  }

  private shareToThreads() {
    const quoteText = this.quoteState.currentQuote?.quote ?? '';
    const safeText = truncateString(quoteText, 256);
    const fullMessage = `${safeText}\n\n${this.shareUrl}`;
    const threadsUrl = new URL('https://www.threads.net/intent/post');
    threadsUrl.searchParams.set('text', fullMessage);
    window.open(threadsUrl.toString(), '_blank', 'noopener,noreferrer');
  }
}


declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
  interface HTMLElementTagNameMap {
    'ani-share-contents': AniShareContents
  }
}

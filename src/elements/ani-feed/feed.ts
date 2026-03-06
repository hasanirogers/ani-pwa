import { LitElement, html } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import quoteStore, { type IQuoteStore } from '../../store/quote';
import styles from './styles';
import sharedStyles from '../../shared/styles';

import '../ani-quote/quote';
import '../ani-loader/loader';

@customElement('ani-feed')
export default class AniFeed extends LitElement {
  static styles = [sharedStyles, styles];

  private observer: IntersectionObserver | null = null;
  private unsubscribeQuoteStore: () => void;
  private abortController: AbortController | null = null;

  @property({ type: String })
  feed: string | null = null;

  @state()
  isLoading: boolean = false;

  @state()
  searchQuery: string = '';

  @state()
  hasLoaded: Record<string, boolean> = {
    all: false,
    following: false,
    mine: false,
    liked: false,
  };

  @state()
  pagination: any = {};

  @state()
  currentPage: number = 1;

  @state()
  quoteState: IQuoteStore = quoteStore.getState();

  @query('#sentinel')
  sentinel!: HTMLElement;

  constructor() {
    super();
    this.unsubscribeQuoteStore = quoteStore.subscribe((state) => {
      this.quoteState = state;
    });
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribeQuoteStore();
    this.observer?.disconnect();
    this.abortController?.abort();
  }

  firstUpdated() {
    this.setupObserver();
    this.getQuotes();
  }

  async updated(changedProperties: Map<string, unknown>) {
    if (changedProperties.has('feed')) {
      this.currentPage = 1;
      quoteStore.getState().clearQuotes(this.feed || 'all');
      this.getQuotes();
    }

    if (changedProperties.has('searchQuery') && this.searchQuery) {
      this.getQuotes();
    }

    // We wait for the update to complete so the DOM is ready
    await this.updateComplete;

    if (this.sentinel && this.observer) {
      // Re-observe whenever the list renders (since sentinel is inside the 'if')
      this.observer.observe(this.sentinel);
    }
  }

  setupObserver() {
    this.observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      const feedKey = this.feed || 'all';

      // Debug: Console log this to see why it might be failing
      const pagination = this.pagination[feedKey];
      const currentPage = Number(pagination?.page) || 1;
      const pageCount = Number(pagination?.pageCount) || 1;

      if (entry.isIntersecting && !this.isLoading && currentPage < pageCount) {
        console.log('Sentinel triggered! Loading page:', currentPage + 1);
        this.currentPage = currentPage + 1;
        this.getQuotes(true);
      }
    }, {
      rootMargin: '400px', // Increased margin so it loads BEFORE the user hits the bottom
      threshold: 0.1
    });
  }

  async getQuotes(isPagination = false) {
  const feedKey = this.feed;
  if (!feedKey) return;

  // 1. Prevent Race Conditions
  // If a request is already in flight for this specific feed, abort it
  // before starting a new one (e.g., user clicked "All" then "Mine" quickly)
  if (this.abortController) {
    this.abortController.abort();
  }
  this.abortController = new AbortController();

  this.isLoading = true;

  try {
    const quotesPerPage = '4';
    const searchParams = this.searchQuery ? `&search=${this.searchQuery}` : '';

    // 2. Fetch data using the dynamic feedKey
    const response = await fetch(
      `/api/quotes/${feedKey}?page=${this.currentPage}&pageSize=${quotesPerPage}${searchParams}`,
      { signal: this.abortController.signal }
    );

    if (!response.ok) throw new Error('Network response was not ok');

    const quotesResponse = await response.json();

    // 3. Update Pagination State
    // We use the spread operator to ensure Lit detects the object change
    this.pagination = {
      ...this.pagination,
      [feedKey]: quotesResponse.meta.pagination
    };

    // 4. Update the Zustand Store bucket
    // If it's pagination, we append. If it's the first load, we replace.
    if (isPagination) {
      quoteStore.getState().addQuotes(feedKey, quotesResponse.quotes);
    } else {
      quoteStore.getState().addInitialQuotes(feedKey, quotesResponse.quotes);
    }

    // 5. Mark as loaded for the UI empty-state logic
    this.hasLoaded = {
      ...this.hasLoaded,
      [feedKey]: true
    };

  } catch (error: any) {
    // If the error is an Abort, it's intentional, so we ignore it.
    if (error.name === 'AbortError') return;
    console.error(`Error fetching quotes for ${feedKey}:`, error);
  } finally {
    this.isLoading = false;
  }
}

  render() {
    const feedKey = this.feed || 'all';
    const quotes = this.quoteState.quotesByFeed[feedKey] || [];
    const hasQuotes = quotes.length > 0;
    const hasLoaded = this.hasLoaded[feedKey];

    // Priority 1: Show the list if we have data
    if (hasQuotes) {
      return html`
        <ul>
          ${repeat(
            quotes,
            (quote) => quote.id,
            (quote) => html`<li><ani-quote .quote=${quote}></ani-quote></li>`
          )}
        </ul>
        <div id="sentinel" style="height: 50px; background: transparent;"></div>
        ${this.isLoading ? html`<ani-loader loading></ani-loader>` : ''}
      `;
    }

    // Priority 2: Show the feed-specific empty message if loading is finished
    if (hasLoaded && !this.isLoading) {
      return this.renderEmptyMessage();
    }

    // Priority 3: Show the initial loader
    return html`<p><ani-loader loading></ani-loader></p>`;
  }

  private renderEmptyMessage() {
    const feedKey = this.feed || 'all';

    // If a search is active, show a specific search empty message
    if (this.searchQuery) {
      return html`
        <p class="empty-msg">
          We couldn't find any quotes matching "<strong>${this.searchQuery}</strong>".
        </p>`;
    }

    // Map your feed keys to specific empty state templates
    const messages: Record<string, any> = {
      mine: html`You haven't added any quotes yet. Why not share something?`,
      following: html`It's quiet here. Follow some people to see their latest quotes!`,
      liked: html`You haven't liked any quotes yet. Explore the feed to find favorites!`,
      all: html`Wow, it's awfully silent in here. Be the first to post!`,
    };

    return html`<p class="empty-msg">${messages[feedKey] || messages.all}</p>`;
  }
}

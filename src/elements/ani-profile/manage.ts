import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import userStore, { type IUserStore } from '../../store/user.ts';
import { libraryStyles } from './styles.ts';
import { type IBook } from '../../shared/interfaces.ts';
import KemetInput from 'kemet-ui/dist/components/kemet-input/kemet-input';
import sharedStyles from '../../shared/styles.ts';

import '../ani-book/book.ts';

@customElement('ani-manage')
export default class aniManage extends LitElement {
  static styles = [sharedStyles, libraryStyles];

  @state()
  searchID: number = 0;

  @state()
  books: IBook[] = [];

  @state()
  myBooks: IBook[] = [];

  @state()
  hasSearch: boolean = false;

  @state()
  userState: IUserStore = userStore.getInitialState();


  @query('[name="search"]')
  search!: KemetInput;

  constructor() {
    super();
    userStore.subscribe((state) => {
      this.userState = state;
    });
  }

  updated() {
    this.myBooks = this.userState.profile?.books as IBook[];
  }

  render() {
    return html`
      <p>Search for a book and click on it to add it to your library. Click again to remove it from your library.</p>
      <form method="get" action="" @submit=${() => this.handleBookSearch()}>
        <kemet-field slug="search" label="Search by author or book title">
          <kemet-input type="search" slot="input" name="search" rounded filled @kemet-input-input=${() => this.handleBookSearch()} @kemet-input-focused=${(event: CustomEvent) => this.handleBookSearchFocus(event)}></kemet-input>
        </kemet-field>
        ${this.makeBooks()}
      </form>
    `;
  }

  handleBookSearch() {
    clearTimeout(this.searchID);
    if (this.search) this.searchID = window.setTimeout(() => this.fetchBooks(), 500);
  }

  handleBookSearchFocus(event: CustomEvent) {
    const focused = event.detail;
    !focused && this.fetchBooks();
  }

  async fetchBooks() {
    if (this.search.value) {
      const response = await fetch(`/api/google/books/search?search=${this.search.value}`);
      const { items } = await response.json();
      this.hasSearch = true;
      this.books = items;
    }
  }

  makeBooks() {
    if (this.books && this.books.length > 0) {
      return html`
        <ul>
          ${this.books.map((book: IBook) => html`
            <li><ani-book identifier="${book.id}" selectable ?selected=${this.hasBook(book.id.toString())}></ani-book></li>
          `)}
        </ul>
      `;
    }

    if (this.hasSearch && this.books && this.books.length === 0) {
      return html`<p>Uh oh. We couldn't find any books. Try searching again.</p>`;
    }

    return null;
  }

  hasBook(identifier: string) {
    const books = this.userState.profile?.books as IBook[];
    return books?.some((book: IBook) => book.identifier === identifier);
  }

  makeMyBooks() {
    if (this.myBooks && this.myBooks.length > 0) {
      return html`
        <ul>
          ${this.myBooks.map((book: IBook) => html`
            <li><ani-book identifier="${book.identifier}"></ani-book></li>
          `)}
        </ul>
      `;
    }

    if (this.myBooks && this.myBooks.length === 0) {
      return html`<p>Looks like you haven't added any books yet.</p>`;
    }

    return null;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-manage': aniManage
  }
}

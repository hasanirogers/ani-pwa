import { LitElement, html } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';
import modalsStore, { type IModalsStore } from '../../store/modals';
import quoteStore, { type IQuoteStore } from '../../store/quote';
import userStore,{ type IUserStore } from '../../store/user';
import { type IBook } from '../../shared/interfaces';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import alertStore, { type IAlertStore } from '../../store/alert';
import KemetSelect from 'kemet-ui/dist/components/kemet-select/kemet-select';
import styles from './styles';
import sharedStyles from '../../shared/styles';
import KemetTextarea from 'kemet-ui/dist/components/kemet-textarea/kemet-textarea';
import KemetInput from 'kemet-ui/dist/components/kemet-input/kemet-input';

@customElement('ani-new-quote')
export default class AniNewQuote extends LitElement {
  static styles = [styles, sharedStyles];

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  quoteState: IQuoteStore = quoteStore.getInitialState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @query('kemet-select')
  userBook!: KemetSelect;

  @query('form')
  quoteForm!: HTMLFormElement;

  @query('[name=quote]')
  quoteInput!: KemetTextarea;

  @query('[name=page]')
  pageInput!: KemetInput;

  @query('[name=note]')
  noteInput!: KemetTextarea;

  constructor() {
    super();
    userStore.subscribe((state) => {
      this.userState = state;
    });
  }

  render() {
    const books = this.userState.profile?.books;
    const hasBooks = books && books.length > 0;

    if (this.userState.isLoggedIn) {
      return html`
        <form>
          ${!hasBooks ? html`
            <div class="no-books">
              <span class="error">You need to add a book to your library and select it before you can add a quote.</span>
              <kemet-button variant="pill" link="profile/manage" outlined>Add a book to your library</kemet-button>
            </div>` : null
          }
          <kemet-field slug="quote" label="The quote">
            <kemet-textarea slot="input" name="quote" filled rounded required ?disabled=${!hasBooks}></kemet-textarea>
            <kemet-count slot="component" message="characters remaining." limit="1000"></kemet-count>
          </kemet-field>
          ${hasBooks ? html`
            <div>
              <kemet-field slug="book" label="Book">
                <kemet-select slot="input" name="book" required filled rounded>
                  ${this.makeBookOptions()}
                </kemet-select>
              </kemet-field>
              <kemet-field slug="page" label="Page">
                <kemet-input slot="input" name="page" rounded filled></kemet-input>
              </kemet-field>
            </div>` : null
          }
          <kemet-field slug="note" label="Enter any notes you may have about this quote">
            <kemet-textarea slot="input" name="note" filled rounded ?disabled=${!hasBooks}></kemet-textarea>
            <kemet-count slot="component" message="characters remaining." limit="1000"></kemet-count>
          </kemet-field>
          <footer>
            <kemet-button type="submit" variant="rounded" @click=${() => this.handleCancel()}>
              Cancel
            </kemet-button>
            <kemet-button variant="circle" @click=${() => this.addQuote()} ?disabled=${!hasBooks} aria-label="Submit">
              <kemet-icon icon="send" size="24"></kemet-icon>
            </kemet-button>
          </footer>
        </form>
      `;
    }
    return null;
  }

  async addQuote() {
    const formData = new FormData(this.quoteForm);
    const userData = Object.fromEntries(formData);

    userData.book = this.userBook ? this.userBook.shadowRoot!.querySelector('select')?.value as string : '';

    const user = this.userState.profile;

    const payload = {
      quote: userData.quote,
      requote: '',
      requotes: [],
      user_id: user?.id,
      book_id: userData.book,
      page: userData.page,
      note: userData.note,
      private: false,
      likes: []
    }

    const newQuoteResponse = await fetch(`/api/quotes/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    }).then((response) => response.json());

    const { error, data: newData } = newQuoteResponse;

    if (error) {
      this.alertState.setStatus('error');
      this.alertState.setMessage(unsafeHTML(error.message));
      this.alertState.setOpened(true);
      this.alertState.setIcon('exclamation-circle');
    }

    this.modalsState.setNewQuoteOpened(false);
    newData && this.quoteState.addQuote(newData);
    newData && this.clearForm();
  }

  clearForm() {
    this.quoteInput.value = '';
    this.pageInput.value = '';
    this.noteInput.value = '';
  }

  makeBookOptions() {
    const books = this.userState.profile?.books as IBook[];
    return books.map((book: IBook) => html`<kemet-option label="${book.title}" value="${book.id}"></kemet-option>`)
  }

  handleCancel() {
    this.modalsState.setNewQuoteOpened(false)
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-new-quote': AniNewQuote
  }
}

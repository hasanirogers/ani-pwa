import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import userStore, { type IUserStore } from '../../store/user';
import modalsStore, { type IModalsStore } from '../../store/modals';
import { commentModalTemplate, signInModalTemplate, newQuoteModalTemplate, deleteUserModalTemplate, shareModalTemplate } from './templates';

import styles from './styles';
import sharedStyles from '../../shared/styles';

@customElement('ani-modal')
export class AniModal extends LitElement {
  static styles = [sharedStyles, styles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  constructor() {
    super();

    userStore.subscribe((state) => {
      this.userState = state;
    });

    modalsStore.subscribe((state) => {
      this.modalsState = state;
    });
  }

  render() {
    const { signInOpened, commentOpened, newQuoteOpened, deleteUserOpened, shareOpened } = this.modalsState;

    return html`
      <kemet-modal id="modal-sign-in" close-on-click rounded effect="fadein-scaleup" .opened=${signInOpened} @kemet-modal-closed=${() => modalsStore.setState({ signInOpened: false })}>
        ${signInModalTemplate}
      </kemet-modal>
      <kemet-modal id="modal-share" rounded close-on-click effect="fadein-scaleup" .opened=${shareOpened} @kemet-modal-closed=${() => modalsStore.setState({ shareOpened: false })}>
        ${shareModalTemplate}
      </kemet-modal>
      ${this.userState.isLoggedIn
        ? html`
          <kemet-modal id="modal-comment" rounded effect="fadein-scaleup" .opened=${commentOpened} @kemet-modal-closed=${() => modalsStore.setState({ commentOpened: false })}>
            ${commentModalTemplate}
          </kemet-modal>
          <kemet-modal id="modal-new-quote" rounded effect="fadein-scaleup" .opened=${newQuoteOpened} @kemet-modal-closed=${() => modalsStore.setState({ newQuoteOpened: false })}>
            ${newQuoteModalTemplate}
          </kemet-modal>
          <kemet-modal id="modal-delete-user" rounded close-on-click effect="fadein-scaleup" .opened=${deleteUserOpened} @kemet-modal-closed=${() => modalsStore.setState({ deleteUserOpened: false })}>
            ${deleteUserModalTemplate}
          </kemet-modal>
        ` : ''}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-modal': AniModal;
  }
}

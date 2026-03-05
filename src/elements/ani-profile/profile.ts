import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import userStore, { type IUserStore } from '../../store/user.ts';
import modalsStore, { type IModalsStore } from '../../store/modals.ts';
import sharedStyles from '../../shared/styles.ts';

import './information.ts';
import './manage.ts';
import './library.ts';

@customElement('ani-profile')
export default class aniProfile extends LitElement {
  static styles = [sharedStyles];

  @property()
  page: string = 'information';

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  modalsState: IModalsStore = modalsStore.getInitialState();

  constructor() {
    super();
    userStore.subscribe((state) => {
      this.userState = state;
    });
  }

  firstUpdated() {
    if (!this.userState.isLoggedIn) {
      window.location.href = '/';
    }
  }

  render() {
    return html`
      <kemet-tabs placement="top" selected=${this.page} divider>
        <kemet-tab slot="tab" link="information" @kemet-tab-selected=${() => this.handleTabSelected('information')}><kemet-icon icon="person" size="24"></kemet-icon>&nbsp;&nbsp;Profile</kemet-tab>
        <kemet-tab slot="tab" link="manage" @kemet-tab-selected=${() => this.handleTabSelected('manage')}><kemet-icon icon="collection" size="24"></kemet-icon>&nbsp;&nbsp;Manage</kemet-tab>
        <kemet-tab slot="tab" link="library" @kemet-tab-selected=${() => this.handleTabSelected('library')}><kemet-icon icon="book" size="24"></kemet-icon>&nbsp;&nbsp;Library</kemet-tab>
        <kemet-tab-panel slot="panel" panel="information">
          <ani-information></ani-information>
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel" panel="manage">
          <ani-manage></ani-manage>
        </kemet-tab-panel>
        <kemet-tab-panel slot="panel" panel="library">
          <ani-library></ani-library>
        </kemet-tab-panel>
      </kemet-tabs>

      <kemet-fab pill @click=${() => this.modalsState.setNewQuoteOpened(true)}>
        <kemet-icon slot="icon" icon="pencil-square" size="24"></kemet-icon>
        New Quote
      </kemet-fab>
    `;
  }

  handleTabSelected(tab: string) {
    window.history.pushState({}, "", `/profile/${tab}`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-profile': aniProfile
  }
}

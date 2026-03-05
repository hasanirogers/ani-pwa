import { LitElement, html } from 'lit';
import { customElement, query, queryAll, state } from 'lit/decorators.js';
import userStore, { type IUserStore } from '../../store/user.ts';
import alertStore, { type IAlertStore } from '../../store/alert.ts';
import modalsStore, { type IModalsStore } from '../../store/modals.ts';
import { filepondImagePreviewStyles, filepondStyles, informationStyles } from './styles.ts';
import sharedStyles from '../../shared/styles.ts';

import * as FilePond from 'filepond';
import FilePondPluginFileEncode from 'filepond-plugin-file-encode';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import FilePondPluginImageCrop from 'filepond-plugin-image-crop';
import FilePondPluginImageResize from 'filepond-plugin-image-resize';
import FilePondPluginImageTransform from 'filepond-plugin-image-transform';
import { setCookie } from '../../shared/utilities.ts';
import { ENUM_ALERT_STATUS } from '../../shared/enums.ts';
import KemetHTMLInputElement from 'kemet-ui/dist/components/kemet-input/kemet-input';

import '../../elements/ani-first-welcome/first-welcome';

FilePond.registerPlugin(
  FilePondPluginFileEncode,
  FilePondPluginFileValidateType,
  FilePondPluginImageExifOrientation,
  FilePondPluginImagePreview,
  FilePondPluginImageCrop,
  FilePondPluginImageResize,
  FilePondPluginImageTransform
);

@customElement('ani-information')
export default class AniInformation extends LitElement {
  static styles = [sharedStyles, informationStyles, filepondStyles, filepondImagePreviewStyles];

  @state()
  userState: IUserStore = userStore.getInitialState();

  @state()
  alertState: IAlertStore = alertStore.getInitialState();

  @state()
  modalsState: IModalsStore= modalsStore.getInitialState();

  @state()
  filePond: any;

  @state()
  showUploadProfileImage: boolean = false;

  @query('form')
  userForm!: HTMLFormElement;

  @query('input[name=filepond]')
  profileInput!: HTMLInputElement;

  @query('.filepond--root')
  filePondRoot!: any;

  @queryAll('[required]')
  requiredFields!: NodeListOf<HTMLElement>;

  constructor() {
    super();

    alertStore.subscribe((state) => {
      this.alertState = state;
    });

    userStore.subscribe((state) => {
      this.userState = state;
    });
  }

  updated(changedProperties: any) {
    if (changedProperties.has('showUploadProfileImage') && this.showUploadProfileImage) {
      this.initFilePond();
    }
  }

  render() {
    const displayName = this.userState?.profile?.display_name ?? this.userState?.profile?.email;
    return html`
      <kemet-card>
        <ani-first-welcome .name=${displayName}></ani-first-welcome>
        <nav>
          <kemet-button variant="text" link=${`/user/${this.userState?.profile?.id}`}>View public profile</kemet-button>
          ${this.userState.profile?.member_id
            ? html`<kemet-button variant="text" @click=${() => this.handleManageMembership()}>Manage Membership</kemet-button>`
            : html`<kemet-button variant="text" link="/membership/checkout">Become a Member</kemet-button>`
          }
        </nav>
        <hr />
        <form @submit=${(event: SubmitEvent) => this.updateProfile(event)}>
          <fieldset>
            ${this.userState.profile?.books && this.userState.profile.books.length > 0 ? html`<legend>Welcome, ${displayName}</legend>` : ''}
            <section class="profile">
              <div class="details">
                <br />
                <div>
                  <kemet-field label="* Display Name" slug="display_name">
                    <kemet-input slot="input" name="display_name" required rounded filled validate-on-blur value=${this.userState?.profile?.display_name}></kemet-input>
                  </kemet-field>
                  <kemet-tooltip strategy="absolute" distance="30">
                    <kemet-icon icon="info-circle-fill" slot="trigger" aria-label="Information"></kemet-icon>
                    <div slot="content">Your display name is required. It is how you are known to other users on Ani.</div>
                  </kemet-tooltip>
                </div>
                <div class="profile-image">${this.makeProfileImage()}</div>
                <div>
                  <kemet-field label="Profile Picture URL" slug="avatar_url">
                    <kemet-input slot="input" name="avatar_url" rounded filled value=${this.userState?.profile?.avatar_url}></kemet-input>
                  </kemet-field>
                  <kemet-tooltip strategy="absolute" distance="30">
                    <kemet-icon icon="info-circle-fill" slot="trigger" aria-label="Information"></kemet-icon>
                    <div slot="content">Enter a url here that you want to use as a profile picture. If you upload a photo as well we'll use that picture instead.</div>
                  </kemet-tooltip>
                </div>
                <div>
                  <kemet-field label="Bio" slug="bio">
                    <kemet-textarea slot="input" name="bio" rounded filled value=${this.userState?.profile?.bio}></kemet-textarea>
                    <kemet-count slot="component" message="characters remaining." limit="1000" validate-immediately></kemet-count>
                  </kemet-field>
                  <kemet-tooltip strategy="absolute" distance="30">
                    <kemet-icon icon="info-circle-fill" slot="trigger" aria-label="Information"></kemet-icon>
                    <div slot="content">Your bio shows up on your public profile page for other users to see.</div>
                  </kemet-tooltip>
                </div>
              </div>
              <br />
              <div class="name">
                <p>
                  <kemet-field label="First Name" slug="first-name">
                    <kemet-input slot="input" name="first_name" rounded filled value=${this.userState?.profile?.first_name}></kemet-input>
                  </kemet-field>
                </p>
                <p>
                  <kemet-field label="Last Name" slug="last-name">
                    <kemet-input slot="input" name="last_name" rounded filled value=${this.userState?.profile?.last_name}></kemet-input>
                  </kemet-field>
                </p>
              </div>
              <br />
              <small>We'll never use your real first and last name on the app and we'll only apply what you've entered here to fill out your membership signup form if you chose to join.</small>
            </section>
          </fieldset>
          <br />
          <div class="actions">
            <kemet-button variant="rounded">
              Update Profile <kemet-icon slot="right" icon="chevron-right"></kemet-icon>
            </kemet-button>
          </div>
        </form>
        <br /><hr /><br />
        <div class="actions">
          <kemet-button variant="text" @click=${() => this.userState.logout()}>Log Out</kemet-button>
          <kemet-button variant="text" @click=${() => this.modalsState.setDeleteUserOpened(true)}>
            Remove Account
          </kemet-button>
        </div>
      </kemet-card>
      <br />
    `;
  }

  initFilePond() {
    this.filePond = FilePond.create(this.profileInput, {
      labelIdle: `<span class="filepond--label-action">Upload Profile Picture</span>`,
      imagePreviewHeight: 170,
      imageCropAspectRatio: '1:1',
      imageResizeTargetWidth: 200,
      imageResizeTargetHeight: 200,
      stylePanelLayout: 'compact circle',
      styleLoadIndicatorPosition: 'center bottom',
      styleButtonRemoveItemPosition: 'center bottom'
    });
  }

  makeProfileImage() {
    const profileImage = this.userState.profile?.avatar;
    const profileImageIsUpload  = profileImage?.includes('supabase.co/storage');
    if (profileImage && !this.showUploadProfileImage && profileImageIsUpload) {
      return html`
        <button class="image" @click=${() => this.showUploadProfileImage = true}>
          <div class="profile-picture" style="background-image: url('${profileImage}')"></div>
        </button>
        <kemet-button variant="circle" class="delete" aria-label="delete" title="Delete profile image" outlined @click=${(event: SubmitEvent) => this.deleteProfileImage(event)}>
          <kemet-icon icon="trash" size="24"></kemet-icon>
        </kemet-button>
      `;
    }

    this.showUploadProfileImage = true;

    return html`
      <input type="file" class="filepond" name="filepond" accept="image/png, image/jpeg, image/gif"/>
    `;
  }

  async updateProfile(event: SubmitEvent) {
    event.preventDefault();

    if (!this.userState.profile || this.hasErrors()) {
      return;
    }

    window.localStorage.setItem('has_updated_profile', 'true');

    // Profile Information
    // -------------------
    const formData = new FormData(this.userForm) as any;
    const updatedInformation = Object.fromEntries(formData);
    console.log('updatedInformation', updatedInformation);
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedInformation)
    };

    const profile = await fetch(`/api/users/details/${this.userState.profile.id}`, options)
      .then((response) => {
        this.alertState.setStatus(ENUM_ALERT_STATUS.PRIMARY);
        this.alertState.setMessage('Profile updated!');
        this.alertState.setOpened(true);
        this.alertState.setIcon('info-circle');
        return response.json();
      })
      .catch((error) => {
        this.alertState.setStatus(ENUM_ALERT_STATUS.ERROR);
        this.alertState.setMessage("An error occurred while updating your profile.");
        this.alertState.setOpened(true);
        this.alertState.setIcon('exclamation-circle');
        console.error(error);
      });

    this.userState.updateProfile({
      ...profile.data,
      ...Object.fromEntries(formData)
    });

    setCookie('user-profile', profile.data, 7);

    // Upload Media
    // ---------------

    const hasFile = !!this.filePond?.getFile()?.file;
    const uploadFormData = new FormData();

    if (hasFile) {
      uploadFormData.append('files', this.filePond.getFile().file);
      uploadFormData.append('uuid', this.userState.profile.uuid);
    }

    const uploadOptions = {
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      body: uploadFormData
    }

    let avatar;

    if (hasFile) {
      avatar = await fetch(`/api/uploads/avatars/${this.userState.profile.id}`, uploadOptions)
        .then((response) => response.json())
        .catch((error) => console.error(error));
    }
  }

  async deleteProfileImage(event: SubmitEvent) {
    event.preventDefault();
    this.showUploadProfileImage = true;

    const deleteOptions = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    }

    await fetch(`/api/uploads/avatars/${this.userState.profile?.id}`, deleteOptions);
  }

  async handleManageMembership() {
    const response = await fetch(`/api/stripe/create-portal-session`, {
      method: "POST",
      body: JSON.stringify({
        member_id: this.userState.profile?.member_id || ''
      })
    });

    const { url, error, message } = await response.json();

    if (error) {
      this.alertState.setStatus('error');
      this.alertState.setMessage(message);
      this.alertState.setOpened(true);
      this.alertState.setIcon('exclamation-circle');
    } else {
      window.location.href = url;
    }
  }

  hasErrors(): boolean {
    const hasErrors = Array.from(this.requiredFields).some(field => (field as any).status === 'error');
    if (hasErrors) {
      this.alertState.setStatus('error');
      this.alertState.setMessage('Please fix any errors in the form before submitting.');
      this.alertState.setOpened(true);
      this.alertState.setIcon('exclamation-circle');
    }
    return hasErrors;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ani-information': AniInformation
  }
}

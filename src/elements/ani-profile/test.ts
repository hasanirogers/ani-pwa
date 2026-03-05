import { html, render } from 'lit';
import { expect, test, describe, vi, beforeEach, afterEach } from 'vitest';
import { page, userEvent } from '@vitest/browser/context';
import "@vitest/browser/matchers.d.ts";
import { fixtureUser } from '../ani-user-view/fixtures';
import { fixtureProfile } from './fixtures';
import { switchRoute } from '../../shared/utilities';

import AniInformation from './information';
import AniChangePassword from './change-password';
import AniLibrary from './manage';
import AniBook from '../ani-book/book';

import './information';
import './change-password';
import './manage';

import 'kemet-ui/dist/components/kemet-icon/kemet-icon';
import 'kemet-ui/dist/components/kemet-card/kemet-card';
import 'kemet-ui/dist/components/kemet-field/kemet-field';
import 'kemet-ui/dist/components/kemet-input/kemet-input';
import 'kemet-ui/dist/components/kemet-textarea/kemet-textarea';
import 'kemet-ui/dist/components/kemet-button/kemet-button';
import 'kemet-ui/dist/components/kemet-tabs/kemet-tabs';
import 'kemet-ui/dist/components/kemet-tabs/kemet-tab';
import 'kemet-ui/dist/components/kemet-tabs/kemet-tab-panel';

describe('Information', () => {
  beforeEach(() => {
    render(
      html`<ani-information></ani-information>`,
      document.body,
    );

    const component = document.querySelector('ani-information');
    component!.userState.user = { user: fixtureUser, jwt: 'token' };
    component!.userState.profile = fixtureProfile;

    render(
      html`<ani-information></ani-information>`,
      document.body,
    );

    vi.mock('../../shared/utilities', () => ({
      switchRoute: vi.fn(),
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('displays basic info about the profile', async () => {
    const emailInput = document.querySelector('ani-information')
      ?.shadowRoot?.querySelector('kemet-input[name="email"]')
      ?.shadowRoot?.querySelector('input') as HTMLInputElement;

    const bioInput = document.querySelector('ani-information')
      ?.shadowRoot?.querySelector('kemet-textarea[name="bio"]')
      ?.shadowRoot?.querySelector('textarea') as HTMLTextAreaElement;

    await expect.element(page.getByText(/Welcome, OgdoadPantheon/i)).toBeInTheDocument();

    expect(emailInput.value).toBe('ogdoad.pantheon@gmail.com');
    expect(bioInput.value).toBe('Developer. Creator. Cat lover. INTP since 1985.');
  });

  test('deletes profile image when delete button is clicked', async () => {
    const spyDeleteProfileImage = vi.spyOn(AniInformation.prototype, 'deleteProfileImage');

    // we need to re-render after updating the userState
    render(
      html`<ani-information></ani-information>`,
      document.body,
    );

    const deleteButton = page.getByLabelText(/delete/i);
    await deleteButton.click();

    expect(spyDeleteProfileImage).toHaveBeenCalled();
  });

  test('goes to the user profile page when "View Profile" button is clicked', async () => {
    const profileButton = page.getByText(/View Profile/i);
    await profileButton.click();
    expect(switchRoute).toBeCalledWith('/user/1');
  });

  // TODO figure out a way to test this without the page refreshing
  // test('logs out when "Logout" button is clicked', async () => {
  //   const spyLogout = vi.spyOn(AniInformation.prototype, 'logout');
  //   const logoutButton = page.getByText(/Log Out/i);
  //   await logoutButton.click();
  //   expect(spyLogout).toHaveBeenCalled();
  // });

  test('updates profile when form is submitted', async () => {
    const spyUpdateProfile = vi.spyOn(AniInformation.prototype, 'updateProfile');
    const profileButton = page.getByRole('button', { name: 'Update Profile'});
    await profileButton.click();
    expect(spyUpdateProfile).toHaveBeenCalled();
  });
});

describe('Change Password', () => {
  beforeEach(() => {
    render(
      html`<ani-change-password></ani-change-password>`,
      document.body,
    );
  });

  test('updates password when form is submitted', async () => {
    const spyChangePassword = vi.spyOn(AniChangePassword.prototype, 'changePassword');
    const passwordButton = page.getByRole('button', { name: 'Change Password'});
    await passwordButton.click();
    expect(spyChangePassword).toHaveBeenCalled();
  });
});

describe('Library', () => {
  beforeEach(() => {
    render(
      html`<ani-library></ani-library>`,
      document.body,
    );
  });

  // TODO this test relies on the actual API to work, consider finding a way to mock it
  // test('displays saved books', async () => {
  //   const bookJesusTheEgyptian = page.getByText(/Jesus the Egyptian/i);
  //   await expect.element(bookJesusTheEgyptian).toBeInTheDocument();
  // });

  test('is able to search for a book then select and deselect it', async () => {
    const spyHandleBookSearch = vi.spyOn(AniLibrary.prototype, 'handleBookSearchFocus');
    const searchInput = document.querySelector('ani-library')
      ?.shadowRoot?.querySelector('kemet-input')
      ?.shadowRoot?.querySelector('input');

    await userEvent.fill(searchInput!, 'Christ in Egypt');
    await userEvent.click(document.body);

    expect(spyHandleBookSearch).toHaveBeenCalled();

    setTimeout(async () => {
      const bookChristInEgypt = document.querySelector('ani-library')?.shadowRoot?.querySelector('ani-book[selectable][identifier="Iaqe9CG_s6cC"]') as AniBook;
      bookChristInEgypt?.click()
      expect(bookChristInEgypt.selected).toBe(false);
      bookChristInEgypt?.click();
      expect(bookChristInEgypt.selected).toBe(true);
    }, 1000);
  })
});

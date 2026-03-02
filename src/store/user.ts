import { createStore } from 'zustand/vanilla';
import appStore from '../store/app';
import { type IProfile } from '../shared/interfaces';

// Extend Window interface to include user property
declare global {
  interface Window {
    user?: IProfile;
  }
}

export interface IUserStore {
  profile: IProfile | null;
  updateProfile: (profile: IProfile) => void;
  isLoggedIn: boolean;
  logout: () => void;
}

// Get user data from window object set by Layout.astro
const getUserFromWindow = (): IProfile | null => {
  if (typeof window !== 'undefined' && window.user) {
    return window.user;
  }
  return null;
};

const store = createStore<IUserStore>(set => ({
  profile: getUserFromWindow(),
  updateProfile: (profile: IProfile) => set(() => ({ profile })),
  isLoggedIn: getUserFromWindow() !== null,
  logout: async () => {
    await fetch(`/api/auth/logout`);
    window.location.href = "/";
  }
}));

export default store;

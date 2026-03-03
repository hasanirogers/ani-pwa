import { createStore } from 'zustand/vanilla';
import { type IProfile } from '../shared/interfaces';
import { deleteCookie, getCookie } from '../shared/utilities';

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
    await fetch(`/api/auth/logout`, { method: 'POST' });
    const projectName = import.meta.env.PUBLIC_SUPABASE_PROJECT_ID;
    deleteCookie(`sb-${projectName}-auth-token`);
    deleteCookie(`sb-${projectName}-auth-token-refresh`);
    window.user = undefined;
    window.location.href = "/";
  }
}));

export default store;

import { createStore } from 'zustand/vanilla';
import { type IQuote } from '../shared/interfaces';

export interface IModalsStore {
  signInOpened: boolean;
  setSignInOpened: (opened: boolean) => void;
  commentOpened: boolean;
  setCommentOpened: (opened: boolean) => void;
  currentQuote: IQuote | null;
  setCurrentQuote: (currentQuote: IQuote) => void;
  newQuoteOpened: boolean;
  setNewQuoteOpened: (opened: boolean) => void;
  deleteUserOpened: boolean;
  setDeleteUserOpened: (opened: boolean) => void;
  shareOpened: boolean;
  setShareOpened: (opened: boolean) => void;
}

const store = createStore<IModalsStore>(set => ({
  signInOpened: false,
  setSignInOpened: (signInOpened: boolean) => set(() => { return { signInOpened } }),
  commentOpened: false,
  setCommentOpened: (commentOpened: boolean) => set(() => { return { commentOpened } }),
  currentQuote: null,
  setCurrentQuote: (currentQuote: IQuote) => set(() => { return { currentQuote }}),
  newQuoteOpened: false,
  setNewQuoteOpened: (newQuoteOpened: boolean) => set(() => { return { newQuoteOpened } }),
  deleteUserOpened: false,
  setDeleteUserOpened: (deleteUserOpened: boolean) => set(() => { return { deleteUserOpened } }),
  shareOpened: false,
  setShareOpened: (shareOpened: boolean) => set(() => { return { shareOpened } })
}));

export default store;

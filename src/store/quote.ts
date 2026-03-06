import { createStore } from 'zustand/vanilla';
import { type IComment, type IQuote } from '../shared/interfaces';

export interface IQuoteStore {
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Quotes organized by feed key (e.g., 'all', 'mine', 'liked')
  quotesByFeed: Record<string, IQuote[]>;

  // Updated actions to target specific feeds
  addQuote: (feed: string, quote: IQuote) => void;
  addQuotes: (feed: string, quotes: IQuote[]) => void;
  addInitialQuotes: (feed: string, quotes: IQuote[]) => void;

  // Comments usually belong to a single "current" quote context
  comments: IComment[];
  addComment: (comment: IComment) => void;
  addInitialComments: (comments: IComment[]) => void;

  currentQuote: IQuote | null;
  setCurrentQuote: (quote: IQuote | null) => void;

  clearQuotes: (feed?: string) => void;
}

const store = createStore<IQuoteStore>((set) => ({
  quotesByFeed: {
    all: [],
    following: [],
    mine: [],
    liked: [],
  },
  searchQuery: '',
  setSearchQuery: (query: string) => set({ searchQuery: query }),

  // Add a single quote to the top of a specific feed
  addQuote: (feed, quote) => set((state) => ({
    quotesByFeed: {
      ...state.quotesByFeed,
      [feed]: [quote, ...(state.quotesByFeed[feed] || [])]
    }
  })),

  // Append quotes (Pagination)
  addQuotes: (feed, quotes) => set((state) => ({
    quotesByFeed: {
      ...state.quotesByFeed,
      [feed]: [...(state.quotesByFeed[feed] || []), ...quotes]
    }
  })),

  // Replace quotes (Initial load or Refresh)
  addInitialQuotes: (feed, quotes) => set((state) => ({
    quotesByFeed: {
      ...state.quotesByFeed,
      [feed]: quotes
    }
  })),

  comments: [],
  addComment: (comment) => set((state) => ({ comments: [...state.comments, comment] })),
  addInitialComments: (comments) => set({ comments }),

  currentQuote: null,
  setCurrentQuote: (quote) => set({ currentQuote: quote }),

  // Clear specific feed or all feeds
  clearQuotes: (feed) => set((state) => {
    if (feed) {
      return { quotesByFeed: { ...state.quotesByFeed, [feed]: [] } };
    }
    return { quotesByFeed: { all: [], following: [], mine: [], liked: [] } };
  }),
}));

export default store;

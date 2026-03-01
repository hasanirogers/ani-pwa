export interface IQuote {
  id: number;
  quote: string;
  likes: number[];
  created_at: string;
  updated_at: string;
  published_at: string;
  requote: string | null;
  requotes: number[];
  page: string;
  note: string;
  private: boolean;
  comments?: IComment[];
  user: IProfile;
  book: IBook;
}

export interface IComment {
  id: number;
  quoteId: number;
  // documentId: string;
  comment: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  user: IProfile;
}

export interface IBook {
  id: number;
  documentId: string;
  created_at: string;
  updated_at: string;
  published_at: string;
  title: string;
  identifier: string;
  authors: string[];
}

export interface IGoogleBook {
  accessInfo: any;
  etag: string;
  id: string;
  kind: string;
  saleInfo: any;
  selfLink: string;
  volumeInfo: any;
}

export interface IUser {
  app_metadata: any;
  aud: string;
  confirmation_sent_at: string;
  confirmed_at: string;
  created_at: string;
  email: string;
  email_confirmed_at: string;
  id: string;
  identities: any;
  is_anonymous: boolean;
  last_sign_in_at: string;
  phone: string;
  role: string;
  updated_at: string;
  user_metadata: any;
}

export interface IProfile {
  id: number;
  uuid: string;
  display_name: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  created_at: string;
  updated_at: string;
  published_at: string;
  first_name: string;
  last_name: string;
  bio: string;
  following: number[],
  role?: IRole;
  books?: IBook[];
  counts?: { quotes: number, followers: number, following: number };
  avatar: string;
  avatar_url: string;
  member_id?: string;
  member_free_pass?: boolean;
}

// export interface IProfile extends IUser {}

export interface IRole {
  id: number;
  documentId: string;
  name: string;
  description: string;
  type: string;
  created_at: string;
  updated_at: string;
  published_at: string;
}

export interface IAvatar {
  id: number;
  documentId: string;
  name: string;
  alternativeText: string | null,
  caption: string | null,
  width: number;
  height: number;
  formats: any,
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null,
  provider: string;
  provider_metadata: string | null,
  created_at: string;
  updated_at: string;
  published_at: string;
}

// export interface IUserCookie {
//   user: IUser;
//   profile: IProfile;
// }

export interface IPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

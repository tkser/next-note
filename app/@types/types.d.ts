type UserRole = "admin" | "user";

type User = {
  username: string;
  user_id: string;
  role: UserRole;
};

type Note = {
  note_id: string;
  title: string;
  slug: string;
  summary: string;
  is_private: boolean;
  created_at: Date;
  updated_at: Date;
  user_id: string;
};

type PageDetail = {
  page_id: string;
  title: string;
  slug: string;
  position: number;
  is_private: boolean;
  created_at: Date;
  updated_at: Date;
  user_id: string;
  note_id: string;
};

type Page = PageDetail & {
  content: string;
};

type JWTPayload = User;

type ApiResponse<T = undefined> = {
  data?: T;
  meta: {
    status: number;
    message: string;
  };
};

type ApiDataUserResponse = {
  type: "user";
  user: User;
};

type ApiDataNoteResponse = {
  type: "note";
  note: Note;
};

type ApiDataPageResponse = {
  type: "page";
  page: Page;
};

type ApiDataPageDetailResponse = {
  type: "pageDetail";
  page: PageDetail;
};

type ApiDataAroundPagesResponse = {
  type: "aroundPages";
  prev: PageDetail | null;
  next: PageDetail | null;
};

type InitializeApiRequest = {
  username?: string;
  password?: string;
};

type UserDatabaseRow = {
  user_id: string;
  username: string;
  role: UserRole;
  password_hash: string;
  password_salt: string;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
};

type NoteDatabaseRow = {
  note_id: string;
  user_id: string;
  title: string;
  slug: string;
  summary: string;
  is_private: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
};

type NoteApiRequest = {
  title?: string;
  slug?: string;
  summary?: string;
  is_private?: boolean;
};

type PageApiRequest = {
  title?: string;
  slug?: string;
  content?: string;
  position?: number;
  is_private?: boolean;
  note_id?: string;
};

type PageDatabaseRow = {
  page_id: string;
  note_id: string;
  user_id: string;
  title: string;
  slug: string;
  content: string;
  position: number;
  is_private: boolean;
  is_deleted: boolean;
  created_at: Date;
  updated_at: Date;
};

type TableOfContent = {
  level: string;
  title: string;
  href: string;
};

type Article = {
  contentHtml: string;
  tableOfContents: TableOfContent[];
};

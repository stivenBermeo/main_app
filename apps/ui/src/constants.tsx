export interface Entry {
  id: number;
  title: string;
  body: string;
  timestamp: string;
}

export const BLOG_FIELDS = {
  id: 0,
  title: 1,
  body: 2,
  timestamp: 3,
  summary: 4
}
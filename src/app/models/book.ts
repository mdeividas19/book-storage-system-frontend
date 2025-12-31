export interface Author {
  name: string;
  surname: string;
}

export interface Book {
  id: number;
  title: string;
  pages: number;
  isbn: string;
  short_description: string | null;
  authors: Author[];
}
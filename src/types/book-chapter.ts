export interface BookChapter {
  chapterNumber: number;
  chapterTitle: string;
  pageNumbers: number[];
}

export interface BookTableOfContents {
  bookId: string;
  title: string;
  chapters: BookChapter[];
}

import { BookTableOfContents } from '@/types';

// 「現在のページ/総ページ数」を表す文字列を返す
export const getCurrentPageText = (
  bookTableOfContents: BookTableOfContents,
  chapterNumber: number,
  pageNumber: number
) => {
  // 章番号が見つからなかった場合でも chapterIndex は少なくとも1にする
  const chapterIndex = Math.max(
    1,
    bookTableOfContents.chapters.findIndex(
      (chapter) => chapter.chapterNumber === chapterNumber
    )
  );

  const totalPage =
    bookTableOfContents.chapters[chapterIndex]?.pageNumbers.length ?? 1;
  return `${pageNumber}/${totalPage}`;
};

// 現在のページが最初か最後かを判定する
export const getPagePosition = (
  bookTableOfContents: BookTableOfContents,
  chapterNumber: number,
  pageNumber: number
) => {
  const isFirstPage = chapterNumber === 1 && pageNumber === 1;
  const isLastPage =
    chapterNumber === bookTableOfContents.chapters.length &&
    pageNumber ===
      bookTableOfContents.chapters.find(
        (chapter) => chapter.chapterNumber === chapterNumber
      )?.pageNumbers.length;

  return { isFirstPage, isLastPage };
};

// 指定方向（次 or 前）のページのリンク先を返す
export const getPageLink = (
  bookTableOfContents: BookTableOfContents,
  chapterNumber: number,
  pageNumber: number,
  direction: 'next' | 'prev'
) => {
  const chapterIndex = bookTableOfContents.chapters.findIndex(
    (chapter) => chapter.chapterNumber === chapterNumber
  );

  if (chapterIndex === -1) {
    return `/read/${bookTableOfContents.bookId}/chapter/${chapterNumber}/page/${pageNumber}`;
  }

  const totalPages =
    bookTableOfContents.chapters[chapterIndex]?.pageNumbers.length ?? 1;
  const isMovingForward = direction === 'next';

  const isLastPage = pageNumber >= totalPages;
  const isFirstPage = pageNumber <= 1;
  const isLastChapter = chapterIndex >= bookTableOfContents.chapters.length - 1;
  const isFirstChapter = chapterIndex <= 0;

  let newChapterNumber = chapterNumber;
  let newPageNumber = pageNumber;

  if (isMovingForward) {
    if (isLastPage) {
      // 最終章の最後のページなら、それ以上進めない
      if (isLastChapter) {
        newPageNumber = totalPages; // 現在の最後のページのまま
      } else {
        // 次のチャプターの最初のページへ
        newChapterNumber = chapterNumber + 1;
        newPageNumber = 1;
      }
    } else {
      newPageNumber = pageNumber + 1;
    }
  } else {
    if (isFirstPage) {
      // 最初の章の最初のページなら、それ以上戻れない
      if (isFirstChapter) {
        newPageNumber = 1; // 現在の最初のページのまま
      } else {
        // 前のチャプターの最後のページへ
        newChapterNumber = chapterNumber - 1;
        newPageNumber =
          bookTableOfContents.chapters[chapterIndex - 1].pageNumbers.length;
      }
    } else {
      newPageNumber = pageNumber - 1;
    }
  }

  return `/read/${bookTableOfContents.bookId}/chapter/${newChapterNumber}/page/${newPageNumber}`;
};

/**
 * ページネーションのためのページ番号リストを生成する
 *
 * @param {number} page 現在のページ番号
 * @param {number} total 総ページ数
 * @returns {number[]} ページネーションに表示するページ番号の配列（省略部分は 0 として表現）
 *
 * @example
 * createPageNumbers(1, 10); // [1, 2, 3, 4, 5, 0, 10]
 * createPageNumbers(5, 10); // [1, 0, 4, 5, 6, 0, 10]
 * createPageNumbers(9, 10); // [1, 0, 6, 7, 8, 9, 10]
 */
export const createPageNumbers = (page: number, total: number) => {
  const pages = [];
  const maxPages = 7;

  if (page <= 4) {
    for (let i = 1; i <= Math.min(5, total); i++) {
      pages.push(i);
    }
    if (total > 5) {
      pages.push(0, total);
    }
  } else if (page >= total - 3) {
    pages.push(1, 0);
    for (let i = total - 4; i <= total; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1, 0);
    for (let i = page - 1; i <= page + 1; i++) {
      pages.push(i);
    }
    pages.push(0, total);
  }

  return pages.slice(0, maxPages);
};

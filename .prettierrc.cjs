module.exports = {
  singleQuote: true, // シングルクォートに統一
  trailingComma: 'es5', // ES5の範囲内でトレーリングカンマをつける（オブジェクト・配列・関数引数など）
  jsxSingleQuote: false, //  JSXではダブルクォート
  semi: true, // セミコロンをつける
  arrowParens: 'always', // アロー関数の引数に()を必ずつける

  // Prettierでimportを整理（未使用のインポートを並べ替え、結合、削除）
  // https://www.npmjs.com/package/prettier-plugin-organize-imports
  plugins: ['prettier-plugin-organize-imports'],
};

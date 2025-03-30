# React + TypeScript + Vite + Devcontainer

VSCodeのDevcontainerを使ったひな型

## Devcontainerに設定しているVSCode拡張機能

|名前|機能|devcontainer内の名前|
|---|---|---|
|Auto Rename Tag|関連するHTML/XMLタグを同時に自動リネームする|"formulahendry.auto-rename-tag"|
|Code Spell Checker|コード中の単語のスペルチェック|"streetsidesoftware.code-spell-checker"|
|ES7+ React/Redux/React-Native snippets|React/Reduxの便利なコードスニペット|"dsznajder.es7-react-js-snippets"|
|ESLint|JavaScript/TypeScriptのコード品質を自動でチェック|"dbaeumer.vscode-eslint"|
|Git Graph|Gitリポジトリの履歴を視覚的に表示するグラフ|"mhutchie.git-graph"|
|HTML CSS Support|HTML内で使用されるCSSクラスの補完とサポート|"ecmel.vscode-html-css"|
|indent-rainbow|インデントを色分けして可視化する|"oderwat.indent-rainbow"|
|Path Intellisense|ファイルパスを入力時に自動補完|"christian-kohler.path-intellisense"|
|Prettier - Code formatter|コードフォーマットツールPrettierをVSCode上で使用可能にする|"esbenp.prettier-vscode"|
|Tailwind CSS IntelliSense|Tailwind CSSのクラス名補完とサポート|"bradlc.vscode-tailwindcss"|
|Trailing Spaces|行末の不要なスペースを視覚的に表示し、削除|"shardulm94.trailing-spaces"|
|zenkaku|全角スペースを視覚的にマーク|"mosapride.zenkaku"|

## ESLint + Prettier

[ESLintとPrettierの競合をなくす](https://github.com/prettier/eslint-config-prettier)

- eslint-config-prettier

    「eslint.config.js」で設定

[Prettierでimportを整理（未使用のインポートを並べ替え、結合、削除）](https://www.npmjs.com/package/prettier-plugin-organize-imports)

- prettier-plugin-organize-imports

    「.prettierrc.cjs」で設定

## Tailwind

[Tailwindのクラス名の並び替え](https://github.com/francoismassart/eslint-plugin-tailwindcss?)

- eslint-plugin-tailwindcss

    「eslint.config.js」で設定

## 「@」始まりのパスエイリアス

[shadcn/uiのviteの設定参考](https://ui.shadcn.com/docs/installation/vite)

- @types/node

    「tsconfig.app.json」、「tsconfig.json」、「vite.config.ts」で設定

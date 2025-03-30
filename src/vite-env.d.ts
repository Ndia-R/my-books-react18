/// <reference types="vite/client" />

// 環境変数の型定義をして補完が効くようにする
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // エイリアス設定
  // https://zenn.dev/yuji6523/articles/react-absolute-path
  // shadcn/uiのviteの設定も参考
  // https://ui.shadcn.com/docs/installation/vite
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});

import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import monacoEditorPluginModule from 'vite-plugin-monaco-editor'

const monacoEditorPlugin =
  monacoEditorPluginModule.default ?? monacoEditorPluginModule

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const gitlabTarget = env.VITE_GITLAB_TARGET || 'http://210.217.178.98:32000'
  const mockTarget = env.VITE_MOCK_TARGET || 'http://localhost:3001'

  return {
    plugins: [
      vue(),
      monacoEditorPlugin({
        languageWorkers: ['editorWorkerService', 'typescript', 'json', 'html'],
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        // pnpm이 v-code-diff postinstall을 막으면 dist/index.es.js가 없어서 v3 빌드로 직접 연결
        'v-code-diff': fileURLToPath(
          new URL('./node_modules/v-code-diff/dist/v3/index.es.js', import.meta.url),
        ),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/variables" as *;`,
        },
      },
    },
    server: {
      port: 8080,
      proxy: {
        // GitLab API — /gitlab-api/projects/... → http://210.217.178.98:32000/api/v4/projects/...
        '/gitlab-api': {
          target: gitlabTarget,
          changeOrigin: true,
          secure: false,
          timeout: 60000,
          rewrite: (path) => `/api/v4${path.slice('/gitlab-api'.length)}`,
        },
        // json-server mock — /api/users → http://localhost:3001/users
        '/api': {
          target: mockTarget,
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})

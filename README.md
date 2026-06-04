# scc-fe-vite-sample

기존 `scc-fe` (Vue CLI + Webpack) 프로젝트를 참고하여 **Vue 3.5 + Vite** 로 구성한 샘플입니다.

## 마이그레이션 요약

| 기존 (Webpack / Vue CLI) | 샘플 (Vite) |
|--------------------------|-------------|
| `@vue/cli-service` | `vite` + `@vitejs/plugin-vue` |
| `webpack`, `sass-loader` | Vite 내장 번들러 / Sass |
| `monaco-editor-webpack-plugin` | `vite-plugin-monaco-editor` |
| `vue` ^3.2.13 | `vue` ^3.5.x |
| Vite 8 (rolldown) | Vite 6 (안정 빌드, Node 20 호환) |
| `@babel/*` (CLI 플러그인) | Vite esbuild 기반 변환 (별도 Babel 불필요) |

## 포함 라이브러리

- Vue Router, Pinia (+ persistedstate), vue-i18n
- vee-validate, yup, vue-chartjs, monaco-editor, v-code-diff
- lodash / lodash-es, sass, json-server (mock)

`vue3-excel-editor`는 package.json에 포함되어 있으나, 실제 화면 연동은 별도 컴포넌트 작업이 필요합니다.

## 실행

```bash
cd scc-fe-vite-sample
npm install
npm run dev
```

Mock API 테스트:

```bash
# 별도 터미널
npm run mock
```

브라우저에서 홈 → **Mock API 호출** 버튼으로 `/api/users` 프록시를 확인할 수 있습니다.

## 빌드

```bash
npm run build
npm run preview
```

## 샘플 페이지

- **홈**: Pinia persist, lodash debounce, mock API
- **폼 검증**: vee-validate + yup
- **차트**: vue-chartjs
- **Monaco**: 코드 에디터
- **Diff**: v-code-diff

## 실제 scc-fe 이전 시 체크리스트

1. `vue.config.js` → `vite.config.js` 로 설정 이전 (alias, proxy, define)
2. `require()` / Webpack-only 플러그인 제거 → ESM `import` 로 통일
3. 환경 변수: `VUE_APP_*` → `VITE_*`, 코드에서 `import.meta.env` 사용
4. 동적 public 경로: `process.env.BASE_URL` → `import.meta.env.BASE_URL`
5. Monaco, 대용량 에셋은 Vite 플러그인 또는 `import()` lazy 로딩 검토

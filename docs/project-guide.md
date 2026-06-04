# 프로젝트 구조 및 루트 파일 가이드

기존 `scc-fe` (Vue CLI + Webpack)를 **Vue 3.5 + Vite 6** 기반으로 재구성한 프론트엔드 샘플 프로젝트입니다.  
이 문서는 디렉터리 구조와 루트에 있는 설정·진입 파일들의 역할을 정리합니다.

---

## 전체 디렉터리 구조

```
fe-sample/
├── .vscode/              # VS Code / Cursor 에디터 설정
├── dist/                 # `npm run build` 결과물 (배포용 정적 파일)
├── docs/                 # 프로젝트 문서
├── mock/                 # json-server용 Mock API 데이터
├── node_modules/         # npm 의존성 (git 제외)
├── public/               # 빌드 시 그대로 복사되는 정적 파일
├── src/                  # 애플리케이션 소스 코드
├── .gitignore
├── eslint.config.js      # ESLint 설정 (flat config)
├── index.html            # Vite HTML 진입점
├── jsconfig.json         # IDE 경로 alias (@/*)
├── package.json          # 프로젝트 메타·스크립트·의존성
├── package-lock.json     # 의존성 잠금 파일
├── README.md             # 프로젝트 소개·실행 방법
└── vite.config.js        # Vite 빌드·개발 서버 설정
```

---

## 루트 파일 설명

### `package.json`

프로젝트 이름, 버전, npm 스크립트, 런타임/개발 의존성을 정의합니다.

| 스크립트 | 설명 |
|----------|------|
| `npm run dev` | Vite 개발 서버 실행 (기본 포트 8080) |
| `npm run build` | 프로덕션 빌드 → `dist/` 생성 |
| `npm run preview` | 빌드 결과물 로컬 미리보기 |
| `npm run lint` | ESLint 검사 및 자동 수정 |
| `npm run mock` | json-server Mock API (포트 3001) |

주요 라이브러리: Vue 3, Vue Router, Pinia, vue-i18n, vee-validate, chart.js, monaco-editor, v-code-diff, lodash 등.

### `package-lock.json`

`npm install` 시 설치되는 패키지 버전을 고정합니다. 팀원 간 동일한 의존성 트리를 보장하기 위해 커밋 대상입니다.

### `vite.config.js`

Vite 빌드 도구의 핵심 설정 파일입니다.

- **플러그인**: `@vitejs/plugin-vue`, `vite-plugin-monaco-editor` (Monaco Editor 워커 번들)
- **alias**: `@` → `src/` (예: `import X from '@/views/HomeView.vue'`)
- **SCSS**: 모든 `.scss` 파일에 `@/styles/variables` 자동 주입
- **개발 서버**: 포트 `8080`, `/api` 요청을 `localhost:3001` Mock 서버로 프록시

Webpack 시절의 `vue.config.js`에 해당하는 파일입니다.

### `index.html`

Vite는 Webpack과 달리 **HTML을 진입점**으로 사용합니다.

- `<div id="app">` — Vue 앱이 마운트되는 DOM
- `<script type="module" src="/src/main.js">` — ES 모듈로 앱 부트스트랩

개발·빌드 모두 이 파일을 기준으로 번들이 시작됩니다.

### `jsconfig.json`

VS Code / Cursor 등 IDE가 `@/` 경로 alias를 인식하도록 돕는 설정입니다.  
TypeScript가 아닌 JavaScript 프로젝트이므로 `tsconfig.json` 대신 사용합니다.

```json
"@/*": ["src/*"]
```

실제 번들 alias는 `vite.config.js`의 `resolve.alias`와 동일하게 맞춰져 있습니다.

### `eslint.config.js`

ESLint 9 **flat config** 형식의 린트 규칙입니다.

- `@eslint/js` recommended + `eslint-plugin-vue` essential 규칙 적용
- `dist/`, `node_modules/` 제외
- `vue/multi-word-component-names` 비활성화 (단일 단어 컴포넌트 허용)

### `.gitignore`

Git 추적에서 제외할 항목을 정의합니다.

- `node_modules/`, `dist/` — 의존성·빌드 산출물
- 로그 파일, `.env*.local` 등 로컬 전용 파일
- `.vscode/*` (단, `extensions.json`은 예외로 포함 가능)

### `README.md`

프로젝트 개요, Webpack → Vite 마이그레이션 요약, 실행·빌드 방법, 샘플 페이지 설명, 실제 `scc-fe` 이전 시 체크리스트를 담고 있습니다.  
**빠른 시작**은 README, **구조 이해**는 이 문서(`docs/project-guide.md`)를 참고하면 됩니다.

---

## `src/` 디렉터리 구조

애플리케이션의 실제 소스 코드가 위치합니다.

```
src/
├── main.js                 # 앱 생성·플러그인 등록·마운트
├── App.vue                 # 루트 레이아웃 (헤더, 네비, RouterView)
├── assets/                 # import로 사용하는 이미지·아이콘
├── components/             # 재사용 컴포넌트 (현재 비어 있음, 확장용)
├── i18n/
│   ├── index.js            # vue-i18n 인스턴스 (기본 locale: ko)
│   └── locales/
│       ├── ko.json
│       └── en.json
├── router/
│   └── index.js            # Vue Router 라우트 정의 (lazy import)
├── stores/
│   └── counter.js          # Pinia 스토어 예시 (localStorage persist)
├── styles/
│   ├── _variables.scss     # SCSS 변수 (색상 등)
│   └── main.scss           # 전역 스타일
└── views/                  # 페이지 단위 Vue 컴포넌트
    ├── HomeView.vue        # 홈 — Pinia, lodash debounce, Mock API
    ├── FormView.vue        # 폼 검증 — vee-validate + yup
    ├── ChartView.vue       # 차트 — vue-chartjs
    ├── EditorView.vue      # 코드 에디터 — Monaco Editor
    └── DiffView.vue        # 코드 Diff — v-code-diff
```

### 부트스트랩 흐름

```
index.html
  └── main.js
        ├── Pinia (+ persistedstate)
        ├── Vue Router
        ├── vue-i18n
        ├── styles/main.scss
        └── App.vue
              └── <RouterView /> → views/*.vue
```

### 라우트 목록

| 경로 | 컴포넌트 | 데모 내용 |
|------|----------|-----------|
| `/` | HomeView | 카운터(Pinia persist), Mock API 호출 |
| `/form` | FormView | vee-validate + yup 폼 검증 |
| `/chart` | ChartView | Chart.js 차트 |
| `/editor` | EditorView | Monaco 코드 에디터 |
| `/diff` | DiffView | 텍스트 Diff 뷰 |

---

## 기타 디렉터리

### `public/`

빌드 시 URL 루트(`/`)에 그대로 복사됩니다. `import` 없이 경로로 참조하는 파일을 둡니다.

- `favicon.svg` — 브라우저 탭 아이콘 (`index.html`에서 참조)
- `icons.svg` — SVG 스프라이트 등 공용 아이콘

`src/assets/`와의 차이: `public`은 경로 그대로 제공, `assets`는 Vite가 번들·해시 처리합니다.

### `mock/`

로컬 개발용 REST Mock 데이터입니다.

- `db.json` — json-server가 읽는 DB (`users` 컬렉션)
- `npm run mock` 실행 시 `http://localhost:3001/users` 등으로 API 제공
- Vite 프록시: 프론트의 `/api/users` → Mock 서버 `/users`

### `dist/`

`npm run build` 후 생성되는 프로덕션 빌드 결과물입니다.  
정적 호스팅(Nginx, S3 등)에 배포할 파일이 들어 있으며, Git에는 포함하지 않습니다.

### `.vscode/`

- `extensions.json` — 권장 확장 (Vue: Volar) 안내

---

## 환경 변수 (참고)

Vite 프로젝트에서는 환경 변수 접두사가 **`VITE_`** 입니다.

- 코드: `import.meta.env.VITE_*`
- 공개 경로: `import.meta.env.BASE_URL` (라우터 history base 등)

기존 Vue CLI의 `VUE_APP_*`, `process.env.BASE_URL` 패턴을 이전할 때 주의가 필요합니다.  
자세한 마이그레이션 체크리스트는 루트 `README.md`를 참고하세요.

---

## 관련 문서

| 문서 | 내용 |
|------|------|
| [README.md](../README.md) | 실행 방법, 마이그레이션 요약, 체크리스트 |
| [project-guide.md](./project-guide.md) | 이 문서 — 구조·파일 역할 |

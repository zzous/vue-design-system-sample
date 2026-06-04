<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { debounce } from 'lodash-es'
import { useCounterStore } from '@/stores/counter'

const { t } = useI18n()
const counter = useCounterStore()
const apiResult = ref(null)
const loading = ref(false)

const stack = [
  'Vue 3.5 + Vite 6 (Webpack / Vue CLI 제거)',
  'Vue Router 4',
  'Pinia 3 + pinia-plugin-persistedstate',
  'vue-i18n 11',
  'vee-validate 4 + yup',
  'vue-chartjs 5 + chart.js',
  'monaco-editor (vite-plugin-monaco-editor)',
  'v-code-diff',
  'lodash / lodash-es',
  'sass (Vite 내장, sass-loader 불필요)',
  '@zzou/vue-design-system',
]

const fetchMock = debounce(async () => {
  loading.value = true
  try {
    const res = await fetch('/api/users')
    apiResult.value = await res.json()
  } catch (e) {
    apiResult.value = { error: String(e.message) }
  } finally {
    loading.value = false
  }
}, 300)
</script>

<template>
  <section class="card">
    <h2>{{ t('home.counter') }}</h2>
    <p class="count">
      <strong>{{ counter.count }}</strong>
      <span class="muted">(×2 = {{ counter.doubled }})</span>
    </p>
    <div class="actions">
      <button type="button" class="btn" @click="counter.increment">
        {{ t('home.increment') }}
      </button>
      <button type="button" class="btn btn--ghost" @click="counter.reset">
        {{ t('home.reset') }}
      </button>
    </div>
  </section>

  <section class="card">
    <h2>{{ t('home.mockApi') }}</h2>
    <p class="hint">터미널에서 <code>npm run mock</code> 실행 후 테스트하세요.</p>
    <button type="button" class="btn" :disabled="loading" @click="fetchMock">
      GET /api/users
    </button>
    <pre v-if="apiResult" class="pre">{{ apiResult }}</pre>
  </section>

  <section class="card">
    <h2>{{ t('home.stack') }}</h2>
    <ul>
      <li v-for="item in stack" :key="item">{{ item }}</li>
    </ul>
  </section>
</template>

<style lang="scss" scoped>
.count {
  font-size: 1.5rem;
  margin: 0.5rem 0 1rem;
}

.muted {
  color: $color-muted;
  font-size: 0.9rem;
  margin-left: 0.5rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.hint {
  color: $color-muted;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.pre {
  margin-top: 1rem;
  padding: 1rem;
  background: #1e1e1e;
  color: #d4d4d4;
  border-radius: 8px;
  overflow: auto;
  font-size: 0.8rem;
}

ul {
  margin: 0;
  padding-left: 1.25rem;
  line-height: 1.7;
}
</style>

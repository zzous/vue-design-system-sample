<script setup>
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()

const navItems = [
  { to: '/', labelKey: 'nav.home' },
  { to: '/form', labelKey: 'nav.form' },
  { to: '/chart', labelKey: 'nav.chart' },
  { to: '/editor', labelKey: 'nav.editor' },
  { to: '/diff', labelKey: 'nav.diff' },
  { to: '/design-system', labelKey: 'nav.designSystem' },
  { to: '/ag-grid', labelKey: 'nav.agGrid' },
]

function toggleLocale() {
  locale.value = locale.value === 'ko' ? 'en' : 'ko'
}
</script>

<template>
  <div class="layout">
    <header class="header">
      <div>
        <h1>{{ t('app.title') }}</h1>
        <p class="subtitle">{{ t('app.subtitle') }}</p>
      </div>
      <button type="button" class="btn btn--ghost" @click="toggleLocale">
        {{ locale === 'ko' ? 'EN' : 'KO' }}
      </button>
    </header>

    <nav class="nav">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav__link"
      >
        {{ t(item.labelKey) }}
      </RouterLink>
    </nav>

    <main class="main">
      <RouterView />
    </main>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  margin-bottom: 1.5rem;

  h1 {
    margin: 0;
    font-size: 1.75rem;
    color: $color-primary;
  }
}

.subtitle {
  margin: 0.35rem 0 0;
  color: $color-muted;
  font-size: 0.95rem;
}

.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid $color-border;

  &__link {
    padding: 0.4rem 0.85rem;
    border-radius: 6px;
    text-decoration: none;
    color: $color-text;
    background: $color-surface;
    font-size: 0.9rem;
    transition: background 0.15s;

    &:hover {
      background: color-mix(in srgb, $color-surface 96%, #000);
    }

    &.router-link-active {
      background: $color-primary;
      color: #fff;
    }
  }
}

.main {
  min-height: 320px;
}
</style>

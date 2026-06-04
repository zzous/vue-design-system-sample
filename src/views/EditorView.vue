<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import * as monaco from 'monaco-editor'

const container = ref(null)
let editor = null

onMounted(() => {
  editor = monaco.editor.create(container.value, {
    value: [
      '// Monaco Editor (Vite)',
      'const greeting = "Hello, SCC FE!";',
      'console.log(greeting);',
    ].join('\n'),
    language: 'javascript',
    theme: 'vs-dark',
    automaticLayout: true,
    minimap: { enabled: false },
  })
})

onUnmounted(() => {
  editor?.dispose()
})
</script>

<template>
  <section class="card">
    <h2>Monaco Editor</h2>
    <p class="hint">
      Webpack의 <code>monaco-editor-webpack-plugin</code> 대신
      <code>vite-plugin-monaco-editor</code> 사용
    </p>
    <div ref="container" class="editor" />
  </section>
</template>

<style lang="scss" scoped>
.hint {
  color: $color-muted;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}

.editor {
  height: 360px;
  border: 1px solid $color-border;
  border-radius: 8px;
  overflow: hidden;
}
</style>

<script setup>
import { CodeDiff } from 'v-code-diff'

const oldCode = `function hello() {
  console.log("Hello");
}`

const newCode = `function hello(name = "World") {
  console.log(\`Hello, \${name}!\`);
}`
</script>

<template>
  <section class="card">
    <h2>v-code-diff</h2>
    <CodeDiff
      :old-string="oldCode"
      :new-string="newCode"
      language="javascript"
      output-format="side-by-side"
    />
  </section>
</template>

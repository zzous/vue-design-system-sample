<script setup>
import { SButton, useToast } from '@zzou/vue-design-system'

const toast = useToast()

function showSuccess() {
  toast.success('저장 완료', { message: '변경 사항이 반영되었습니다.' })
}

function showError() {
  toast.error('요청 실패', { message: '네트워크 오류가 발생했습니다.' })
}

function showInfo() {
  toast.info('안내', { message: '@zzou/vue-design-system 샘플 페이지입니다.' })
}
</script>

<template>
  <div class="row">
    <SButton variant="primary" @click="showSuccess">Success Toast</SButton>
    <SButton variant="danger" @click="showError">Error Toast</SButton>
    <SButton variant="outline" @click="showInfo">Info Toast</SButton>
  </div>
</template>

<style lang="scss" scoped>
.row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}
</style>

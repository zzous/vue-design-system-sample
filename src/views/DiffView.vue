<script setup>
import { computed, onMounted, ref } from 'vue'
import { CodeDiff } from 'v-code-diff'
import {
  getMergeRequestChanges,
  getMergeRequestStatus,
  getFileCompare,
  getLanguageFromPath,
  mapChangeFiles,
} from '@/api/codeDiff'

const mrStatus = ref(null)
const fileList = ref([])
const fileDiffs = ref([])
const statusLoading = ref(false)
const compareLoading = ref(false)
const error = ref(null)

const sourceRef = computed(() => mrStatus.value?.source_branch ?? '')
const targetRef = computed(() => mrStatus.value?.target_branch ?? '')

async function fetchMergeRequestStatus() {
  statusLoading.value = true
  error.value = null

  try {
    const { data } = await getMergeRequestStatus()
    mrStatus.value = data
  } catch (e) {
    error.value = String(e.message)
    mrStatus.value = null
  } finally {
    statusLoading.value = false
  }
}

async function fetchChangesAndDiffs() {
  compareLoading.value = true
  error.value = null
  fileList.value = []
  fileDiffs.value = []

  try {
    const { data } = await getMergeRequestChanges()
    fileList.value = mapChangeFiles(data?.changes ?? [])

    if (!fileList.value.length || !sourceRef.value || !targetRef.value) return

    fileDiffs.value = await Promise.all(
      fileList.value.map(async (file) => {
        try {
          const compare = await getFileCompare(file.path, sourceRef.value, targetRef.value)

          return {
            path: file.path,
            language: getLanguageFromPath(file.path),
            source: compare.source,
            target: compare.target,
            error: null,
          }
        } catch (e) {
          return {
            path: file.path,
            language: getLanguageFromPath(file.path),
            source: '',
            target: '',
            error: String(e.message),
          }
        }
      }),
    )
  } catch (e) {
    error.value = String(e.message)
    fileList.value = []
    fileDiffs.value = []
  } finally {
    compareLoading.value = false
  }
}

async function init() {
  await fetchMergeRequestStatus()

  if (mrStatus.value) {
    await fetchChangesAndDiffs()
  }
}

onMounted(init)
</script>

<template>
  <section class="card">
    <h2>v-code-diff</h2>

    <p v-if="statusLoading" class="status">MR 상태를 확인하는 중...</p>

    <template v-else>
      <div v-if="mrStatus" class="mr-info">
        <p class="mr-info__title">{{ mrStatus.title }}</p>
        <p class="mr-info__meta">
          상태: <strong>{{ mrStatus.state }}</strong>
          · {{ sourceRef }} → {{ targetRef }}
        </p>
      </div>

      <p v-if="compareLoading" class="status">파일 diff를 불러오는 중...</p>

      <div v-else-if="fileDiffs.length" class="file-diffs">
        <article v-for="file in fileDiffs" :key="file.path" class="file-diff">
          <h3 class="file-diff__path">{{ file.path }}</h3>

          <div class="file-diff__header">
            <span>원문 ({{ sourceRef }})</span>
            <span>타겟 ({{ targetRef }})</span>
          </div>

          <p v-if="file.error" class="status status--error">{{ file.error }}</p>

          <CodeDiff
            v-else-if="file.source || file.target"
            :old-string="file.source"
            :new-string="file.target"
            :language="file.language"
            output-format="side-by-side"
          />
        </article>
      </div>

      <p v-else-if="!error" class="status">변경된 파일이 없습니다.</p>

      <p v-if="error" class="status status--error">
        API 호출 실패: {{ error }}
        <button type="button" class="btn btn--ghost" @click="init">다시 시도</button>
      </p>
    </template>
  </section>
</template>

<style lang="scss" scoped>
.mr-info {
  margin-bottom: 0.75rem;

  &__title {
    margin: 0 0 0.25rem;
    font-weight: 600;
  }

  &__meta {
    margin: 0;
    color: $color-muted;
    font-size: 0.9rem;
  }
}

.file-diffs {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.file-diff {
  &__path {
    margin: 0 0 0.5rem;
    font-size: 0.95rem;
    font-weight: 600;
  }

  &__header {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
    font-size: 0.85rem;
    font-weight: 600;
    color: $color-muted;
  }
}

.status {
  margin: 0 0 0.75rem;
  color: $color-muted;
  font-size: 0.9rem;

  &--error {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    color: #c0392b;
  }
}
</style>

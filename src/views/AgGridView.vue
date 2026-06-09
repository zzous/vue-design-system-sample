<script setup>
import { ref } from 'vue'
import { AgGridVue } from 'ag-grid-vue3'
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from 'ag-grid-community'

ModuleRegistry.registerModules([AllCommunityModule])

const theme = themeQuartz
const quickFilter = ref('')
const selectedCount = ref(0)

const rowData = ref([
  { id: 1, name: 'web-01', env: 'prod', status: 'running', cpu: 42, memory: 68 },
  { id: 2, name: 'web-02', env: 'prod', status: 'running', cpu: 35, memory: 55 },
  { id: 3, name: 'api-01', env: 'prod', status: 'warning', cpu: 78, memory: 82 },
  { id: 4, name: 'api-02', env: 'staging', status: 'stopped', cpu: 0, memory: 12 },
  { id: 5, name: 'db-primary', env: 'prod', status: 'running', cpu: 61, memory: 74 },
  { id: 6, name: 'db-replica', env: 'prod', status: 'running', cpu: 48, memory: 63 },
  { id: 7, name: 'cache-01', env: 'staging', status: 'running', cpu: 22, memory: 41 },
  { id: 8, name: 'worker-01', env: 'dev', status: 'stopped', cpu: 0, memory: 8 },
  { id: 9, name: 'worker-02', env: 'dev', status: 'warning', cpu: 88, memory: 91 },
  { id: 10, name: 'batch-01', env: 'prod', status: 'running', cpu: 54, memory: 59 },
  { id: 11, name: 'batch-02', env: 'staging', status: 'running', cpu: 31, memory: 47 },
  { id: 12, name: 'monitor-01', env: 'prod', status: 'running', cpu: 18, memory: 33 },
])

const columnDefs = ref([
  { field: 'id', headerName: 'ID', width: 80 },
  { field: 'name', headerName: '서버명', flex: 1, minWidth: 120 },
  { field: 'env', headerName: '환경', width: 110 },
  {
    field: 'status',
    headerName: '상태',
    width: 110,
    cellStyle: (params) => {
      const colors = {
        running: { color: '#1e7e34', fontWeight: '600' },
        warning: { color: '#b7791f', fontWeight: '600' },
        stopped: { color: '#c0392b', fontWeight: '600' },
      }
      return colors[params.value] ?? null
    },
    valueFormatter: (params) => {
      const labels = { running: '실행 중', warning: '주의', stopped: '중지' }
      return labels[params.value] ?? params.value
    },
  },
  {
    field: 'cpu',
    headerName: 'CPU (%)',
    width: 110,
    valueFormatter: (params) => `${params.value}%`,
    cellStyle: (params) => (params.value >= 80 ? { color: '#c0392b' } : null),
  },
  {
    field: 'memory',
    headerName: 'Memory (%)',
    width: 130,
    valueFormatter: (params) => `${params.value}%`,
    cellStyle: (params) => (params.value >= 80 ? { color: '#c0392b' } : null),
  },
])

const defaultColDef = ref({
  sortable: true,
  filter: true,
  resizable: true,
})

const rowSelection = ref({
  mode: 'multiRow',
  checkboxes: true,
  headerCheckbox: true,
})

function onSelectionChanged(event) {
  selectedCount.value = event.api.getSelectedRows().length
}
</script>

<template>
  <section class="card">
    <h2>AG Grid</h2>
    <p class="desc">
      정렬, 필터, 페이지네이션, 다중 선택, Quick Filter 데모입니다.
      <a href="https://www.ag-grid.com/vue-data-grid/getting-started/" target="_blank" rel="noreferrer">
        공식 문서
      </a>
    </p>

    <div class="toolbar">
      <label class="search">
        <span>Quick Filter</span>
        <input v-model="quickFilter" type="search" placeholder="서버명, 환경 검색..." />
      </label>
      <span class="meta">선택된 행: {{ selectedCount }}</span>
    </div>

    <AgGridVue
      class="grid"
      :theme="theme"
      :row-data="rowData"
      :column-defs="columnDefs"
      :default-col-def="defaultColDef"
      :row-selection="rowSelection"
      :pagination="true"
      :pagination-page-size="8"
      :pagination-page-size-selector="[8, 12, 20]"
      :animate-rows="true"
      :quick-filter-text="quickFilter"
      @selection-changed="onSelectionChanged"
    />
  </section>
</template>

<style lang="scss" scoped>
.desc {
  margin: 0 0 1rem;
  color: $color-muted;
  font-size: 0.9rem;
}

.toolbar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.search {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  min-width: 220px;

  span {
    font-size: 0.85rem;
    font-weight: 600;
  }

  input {
    padding: 0.45rem 0.65rem;
    border: 1px solid $color-border;
    border-radius: 6px;
    font-size: 0.9rem;
  }
}

.meta {
  font-size: 0.85rem;
  color: $color-muted;
}

.grid {
  width: 100%;
  height: 420px;
}

a {
  color: $color-primary;
}
</style>

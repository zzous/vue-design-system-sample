import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/form',
      name: 'form',
      component: () => import('@/views/FormView.vue'),
    },
    {
      path: '/chart',
      name: 'chart',
      component: () => import('@/views/ChartView.vue'),
    },
    {
      path: '/editor',
      name: 'editor',
      component: () => import('@/views/EditorView.vue'),
    },
    {
      path: '/diff',
      name: 'diff',
      component: () => import('@/views/DiffView.vue'),
    },
    {
      path: '/design-system',
      name: 'design-system',
      component: () => import('@/views/DesignSystemView.vue'),
    },
    {
      path: '/ag-grid',
      name: 'ag-grid',
      component: () => import('@/views/AgGridView.vue'),
    },
  ],
})

export default router

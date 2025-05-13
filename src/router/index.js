import { createRouter, createWebHistory } from 'vue-router'
import TableView from '../sidepanel/TableView.vue'
import UploadView from '../sidepanel/UploadView.vue'
import HelpView from '../sidepanel/HelpView.vue'

const sidePanelRoutes = [
  {
    path: '/table',
    name: 'table',
    component: TableView,
  },
  {
    path: '/upload',
    name: 'upload',
    component: UploadView,
  },
  {
    path: '/help',
    name: 'help',
    component: HelpView,
  },
  {
    path: '/',
    redirect: '/table', // 默认重定向
  },
]

export const sidePanelRouter = createRouter({
  history: createWebHistory(),
  routes: sidePanelRoutes,
})

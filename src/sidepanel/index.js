import { createApp } from 'vue'

import SidePanel from './SidePanel.vue'
import { sidePanelRouter } from '../router/index.js'

createApp(SidePanel).use(sidePanelRouter).mount('#app')

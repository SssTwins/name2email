import { createApp } from 'vue'

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import Popup from './Popup.vue'

const vuetify = createVuetify({
  components,
  directives,
})

createApp(Popup).use(vuetify).mount('#app')

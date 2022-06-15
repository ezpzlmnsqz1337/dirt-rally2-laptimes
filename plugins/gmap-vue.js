import { inspect } from 'util'
import Vue from 'vue'
import GmapVue from 'gmap-vue'
import { key } from '@/gmap-key'

export default function ({ $config }) {
  console.log(inspect(GmapVue))

  Vue.use(GmapVue, {
    load: {
      key,
      libraries: 'places,visualization,drawing'
    },
    installComponents: true
  })
}

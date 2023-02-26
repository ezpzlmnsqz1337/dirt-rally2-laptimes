import type { Unsubscribe } from 'firebase/firestore'
import type { GameData } from '../model/GameData'

import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

export const useGameDataStore = defineStore('game-data', () => {
  const providerHostname = ref<string>('wallpc')
  const laptime = ref<number>(0)
  const inMenu = ref<boolean>(true)

  const setLaptime = (time: number) => {
    laptime.value = time
  }

  const setInMenu = (_inMenu: boolean) => {
    inMenu.value = _inMenu
  }

  const setProviderHostname = (hostname: string) => {
    providerHostname.value = hostname
  }

  const parseData = (data: GameData) => {
    if (data.origin === providerHostname.value) {
      setLaptime(data.laptime)
      setInMenu(data.inMenu)
    }
  }

  return {
    // state
    laptime: readonly(laptime),
    inMenu: readonly(inMenu),
    providerHostname: readonly(providerHostname),

    // actions
    setProviderHostname,
    parseData
  }
})

export interface Subscription {
  key: string
  unsubscribe: Unsubscribe
}

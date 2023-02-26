import type { Unsubscribe } from 'firebase/firestore'
import type { GameData } from '../model/GameData'

import { WebsocketState } from '@/model/WebsocketState'
import GameDataReceiver from '@/utils/GameDataReceiver'
import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

const HOSTS: Record<string,string> = {
  wallpc: '192.168.0.191',
  deskpc: '192.168.0.215'
}

export const useGameDataStore = defineStore('game-data', () => {
  const providerHostname = ref<string>('192.168.0.191')
  const websocketState = ref<WebsocketState>(WebsocketState.CLOSED_OR_COULD_NOT_OPEN)
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

  const connect = (hostname: string, port: number) => {
    setProviderHostname(hostname)
    websocketState.value = WebsocketState.ESTABLISHED
    const receiver = GameDataReceiver.getInstance()
    receiver.connect(hostname, port)
    receiver.addListener(m => parseData(m))
  }

  const disconnect = () => {
    GameDataReceiver.getInstance().disconnect()
    websocketState.value = WebsocketState.CLOSED_OR_COULD_NOT_OPEN
  }

  const parseData = (data: GameData) => {
    if (HOSTS[data.origin] === providerHostname.value) {
      setLaptime(data.laptime)
      setInMenu(data.inMenu)
    }
  }

  return {
    // state
    laptime: readonly(laptime),
    inMenu: readonly(inMenu),
    websocketState: readonly(websocketState),
    providerHostname: readonly(providerHostname),

    // actions
    connect,
    disconnect,
    parseData
  }
})

export interface Subscription {
  key: string
  unsubscribe: Unsubscribe
}

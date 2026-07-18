import type { GameData } from '../model/GameData'

import GameDataReceiver from '@/utils/GameDataReceiver'
import { defineStore } from 'pinia'
import { readonly, ref } from 'vue'

const HOSTS: Record<string,string> = {
  wallpc: '192.168.0.41',
  deskpc: '192.168.0.42'
}

export const useGameDataStore = defineStore('game-data', () => {
  const providerHostname = ref<string>('192.168.0.41')
  const websocketState = ref<number>(WebSocket.CLOSED)
  const laptime = ref<number>(0)
  const inMenu = ref<boolean>(true)
  const finishedSuccessfully = ref<boolean>(false)

  const setLaptime = (time: number) => {
    laptime.value = time
  }

  const setInMenu = (_inMenu: boolean) => {
    inMenu.value = _inMenu
  }

  const setFinishedSuccessfully = (finished: boolean) => {
    finishedSuccessfully.value = finished
  }

  const setProviderHostname = (hostname: string) => {
    providerHostname.value = hostname
  }

  const connect = (hostname: string, port: number) => {
    setProviderHostname(hostname)

    const receiver = GameDataReceiver.getInstance()
    receiver.connect(hostname, port,
      () => websocketState.value = WebSocket.OPEN,
      () => websocketState.value = WebSocket.CLOSED)
    receiver.addListener(m => parseData(m))
  }

  const disconnect = () => {
    GameDataReceiver.getInstance().disconnect()
  }

  const parseData = (data: GameData) => {
    if (HOSTS[data.origin] === providerHostname.value) {
      setLaptime(data.laptime)
      setInMenu(data.inMenu)
      setFinishedSuccessfully(data.finishedSuccessfully)
    }
  }

  return {
    // state
    laptime: readonly(laptime),
    inMenu: readonly(inMenu),
    finishedSuccessfully: readonly(finishedSuccessfully),
    websocketState: readonly(websocketState),
    providerHostname: readonly(providerHostname),

    // actions
    connect,
    disconnect,
    parseData
  }
})


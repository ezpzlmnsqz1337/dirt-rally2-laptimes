<script setup lang="ts">
import { WebsocketState } from '@/model/WebsocketState';
import { useGameDataStore } from '@/stores/game-data';

import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed, ref } from 'vue';

const GAME_DATA_PORT = 20779

const dataStore = useDataStore()
const gameDataStore = useGameDataStore()

const {
  websocketState,
  inMenu
} = storeToRefs(gameDataStore)

const {
  connect,
  disconnect,
} = gameDataStore

const {
  isLocal
} = dataStore

const connecting = ref<boolean>(false)
const host = ref<string>('192.168.0.41')
const wsHosts = [
  { label: 'wallpc', value: '192.168.0.41'},
  { label: 'deskpc', value: '192.168.0.42' }
]

const websocketStateText = computed(() => {
  return websocketState.value === WebsocketState.ESTABLISHED ? 'Connected' : 'Not connected'
})

const websocketStateClass = computed(() => {
  return {
    __connected: websocketState.value === WebsocketState.ESTABLISHED,
    __notConnected: websocketState.value !== WebsocketState.ESTABLISHED
  }
})

const raceStateText = computed(() => {
  return inMenu.value ? 'In menu' : 'Race in progress'
})

const raceStateClass = computed(() => {
  return {
    __red: inMenu.value,
    __green: !inMenu.value,
  }
})
</script>

<template>

<div
    v-if="isLocal()"
    class="__info"
  >
    <div class="__websocket">
      <div>
        <span>Websocket state: </span>
        <span :class="websocketStateClass">{{ websocketStateText }}</span>
        <div v-if="websocketState === WebsocketState.ESTABLISHED && raceStateText">
          <span>Race state: </span>
          <span :class="raceStateClass">{{ raceStateText }}</span>
        </div>
      </div>
      <div
        v-if="websocketState === WebsocketState.ESTABLISHED"
        class="__disconnect"
      >
        <div class="__btn __danger" @click="disconnect()">
          Disconnect
        </div>
      </div>
    </div>

    <div
      v-if="!connecting && websocketState !== WebsocketState.ESTABLISHED"
      class="__connect"
    >
      <v-select
        v-model="host"
        class="__select"
        placeholder="Select websocket provider"
        :options="wsHosts"
        :reduce="(host: any) => host.value"
      />
      <div
        class="__btn __primary"
        :disabled="!host"
        @click="connect(host, GAME_DATA_PORT)"
      >
        Connect
      </div>
    </div>
  </div>

  <div
    v-if="connecting && websocketState !== WebsocketState.ESTABLISHED"
    class="__connecting"
  >
    <PulseLoader
      color="#188cff"
      size="8px"
    />
  </div>
</template>


<style scoped lang="scss">
.__connect {
  display: flex;
}

.__info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.3rem;
  gap: 0.1rem;
  flex-direction: column;
}

.__websocket {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.__notConnected {
  color: red;
}

.__connected {
  color: rgb(28, 197, 28);
}

.__connect {
  justify-content: center;

  .__select{
    min-width: 10rem;
  }
}

.__btn {
  display: flex;
  align-items: center;
}
</style>

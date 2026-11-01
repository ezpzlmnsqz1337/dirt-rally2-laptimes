<script setup lang="ts">
import { WS_OPEN } from '@/model/websocket-constants';
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
  return websocketState.value === WS_OPEN ? 'Connected' : 'Not connected'
})

const websocketStateClass = computed(() => {
  return websocketState.value === WS_OPEN ? '__status-connected' : '__status-disconnected'
})

const raceStateText = computed(() => {
  return inMenu.value ? 'In menu' : 'Race in progress'
})

const raceStateClass = computed(() => {
  return inMenu.value ? 'race--menu' : 'race--running'
})
</script>

<template>

<div
    v-if="isLocal()"
    class="__info"
  >
    <div class="__websocket" role="status">
        <div>
          <span class="__label">Websocket</span>
          <span :class="websocketStateClass">{{ websocketStateText }}</span>
          <div v-if="websocketState === WS_OPEN && raceStateText">
            <span class="__label">Race</span>
            <span :class="raceStateClass">{{ raceStateText }}</span>
          </div>
        </div>
        <div
          v-if="websocketState === WS_OPEN"
        class="__disconnect"
      >
        <button type="button" class="__btn __danger" @click="disconnect()">
          Disconnect
        </button>
      </div>
    </div>

    <div
      v-if="!connecting && websocketState !== WS_OPEN"
      class="__connect"
    >
      <v-select
        v-model="host"
        class="__select"
        placeholder="Select websocket provider"
        aria-label="Websocket provider"
        :options="wsHosts"
        :reduce="(host: any) => host.value"
        append-to-body
      />
      <button
        type="button"
        class="__btn __primary"
        :disabled="!host"
        @click="connect(host, GAME_DATA_PORT)"
      >
        Connect
      </button>
    </div>
  </div>

  <div
      v-if="connecting && websocketState !== WS_OPEN"
    class="__connecting"
  >
    <PulseLoader
      color="var(--accent)"
      size="8px"
    />
  </div>
</template>


<style scoped lang="scss">
.__connect {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.__info {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0.75rem;
  gap: 0.5rem;
  flex-direction: column;
}

.__websocket {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--muted);
}

.__label {
  color: var(--muted);
  font-size: 0.68rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin-right: 0.35rem;
}

.race--menu {
  color: var(--muted);
}

.race--running {
  color: var(--success);
  font-weight: 600;
}

.__select{
  min-width: 10rem;
}

.__disconnect .__btn {
  font-size: 0.8rem;
  padding: 0.25rem 0.75rem;
}
</style>

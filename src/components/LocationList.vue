<script setup lang="ts">
import type { Location } from '@/model/Location'

import { useDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'

export interface Props {
  locations: Location[]
}

withDefaults(defineProps<Props>(), {
  locations: () => [],
})

// store
const store = useDataStore()

const {
  locations,
  activeLocation,
} = storeToRefs(store)

const {
  setActiveLocation,
} = store

const isActiveLocation  = (location: Location) => {
  if (!location || !activeLocation.value) { return false }
  return location.id === activeLocation.value.id
}
</script>

<template>
  <div class="__wrapper">
    <div
      v-for="l in locations"
      :key="`location-${l.id}`"
      class="__item __location"
      :class="{__active: isActiveLocation(l as Location)}"
      @click="setActiveLocation(l as Location)"
    >
      <div>{{ l.name }}</div> <div><span :class="`fp fp-lg ${l.countryCode}`" /></div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.__stage {
  text-align: center;
  padding: 0 0.5rem;
}

.__item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 0.8rem 1rem;
  margin-bottom: 0.5rem;
  font-size: 1rem;
  border-radius: 0.3rem;
  background-color: #777777;

  &:hover {
    cursor: pointer;
    background-color: #0045e0;
  }

  &.__active {
    background-color: #0045E0;
  }
}

.__location {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

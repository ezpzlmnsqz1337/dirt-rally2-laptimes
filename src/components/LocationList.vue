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
  getTimesForLocation,
  setActiveLocation,
} = store

const isActiveLocation  = (location: Location) => {
  if (!location || !activeLocation.value) { return false }
  return location.id === activeLocation.value.id
}
</script>

<template>
  <div class="__wrapper">
    <button
      v-for="l in locations"
      :key="`location-${l.id}`"
      type="button"
      class="__item __location"
      :class="{__active: isActiveLocation(l as Location)}"
      :aria-current="isActiveLocation(l as Location) ? 'true' : undefined"
      @click="setActiveLocation(l as Location)"
    >
      <span class="__label">
        {{ l.name }}
        <span class="__meta">{{ getTimesForLocation(l as Location).length }} time(s)</span>
      </span>
      <span :class="`fp fp-lg ${l.countryCode}`" aria-hidden="true"></span>
    </button>
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
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  min-height: var(--target-min);
  padding: 0.6rem 0.85rem;
  margin-bottom: 0.4rem;
  font-family: inherit;
  font-size: 0.95rem;
  text-align: left;
  color: var(--fg);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  background-color: var(--surface-raised);
  cursor: pointer;
  transition: background-color var(--motion-fast) ease, border-color var(--motion-fast) ease;

  &:hover {
    background-color: var(--line);
    border-color: var(--line-strong);
  }

  &.__active {
    border-color: var(--accent);
    background-color: var(--accent-soft);
  }
}

.__label {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.__meta {
  color: var(--muted);
  font-size: 0.75rem;
  font-variant-numeric: tabular-nums;
}

.__location {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>

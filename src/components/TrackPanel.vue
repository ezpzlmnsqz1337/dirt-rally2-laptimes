<script setup lang="ts">
import type { Location } from '@/model/Location';
import type { Stage } from '@/model/Stage';

import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

import LocationList from '@/components/LocationList.vue'
import StageList from '@/components/StageList.vue'

// store
const store = useDataStore()

const {
  locations,
  activeLocation
} = storeToRefs(store)

const {
  setActiveLocation,
  showStatisticsModal
} = store

const back = () => {
  setActiveLocation(null)
}
</script>

<template>
  <aside class="__trackPanel" aria-label="Rally locations and stages">
    <div class="__panelTop">
      <h2 class="__heading">
        {{ activeLocation ? 'Stages' : 'Locations' }}
      </h2>
      <button type="button" class="__btn __stats" @click="showStatisticsModal()">
        Statistics
      </button>
    </div>
    <div v-if="!activeLocation" class="__locations">
      <LocationList :locations="(locations as Location[])" />
    </div>
    <div v-if="activeLocation" class="__stages">
      <div class="__top">
        <button type="button" class="__btn __back" @click="back()">
          &lt; Back
        </button>
        <div class="__stage">
          {{ activeLocation.name }}
        </div>
        <div><span :class="`fp fp-lg ${activeLocation.countryCode}`"></span></div>
      </div>

      <div class="__groupHeading">
        Forward
      </div>
      <StageList :stages="(activeLocation.forward as Stage[])" />

      <div class="__groupHeading">
        Reverse
      </div>
      <StageList :stages="(activeLocation.reverse as Stage[])" />
    </div>
  </aside>
</template>

<style scoped lang="scss">
.__trackPanel {
  background-color: color-mix(in srgb, var(--surface) 92%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  width: 30vw;
  max-width: 26rem;
  height: calc(100vh - 2rem);
  padding: 1rem;
  margin: 1rem 0 1rem 1rem;
  color: var(--fg);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.__locations, .__stages {
  overflow-y: auto;
  min-height: 0;
}

.__panelTop {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.__stage {
  text-align: center;
  padding: 0 0.5rem;
  font-weight: 600;
}

.__heading {
  text-align: left;
  margin: 0;
}

.__groupHeading {
  color: var(--muted);
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  margin: 0.75rem 0 0.4rem;
}

.__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;

  .__back {
    white-space: nowrap;
  }
}

.__stats {
  font-size: 0.8rem;
  padding: 0.35rem 0.75rem;
}

@media screen and (max-width: 768px) {
  .__trackPanel {
    width: 100%;
    max-width: none;
    height: 100%;
    margin: 0;
    border-radius: 0;
    border: 0;
  }
}
</style>

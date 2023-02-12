<script setup lang="ts">
import type { Stage } from '@/model/Stage';

import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

import LocationList from '@/components/LocationList.vue'
import StageList from '@/components/StageList.vue'
import type { Location } from '@/model/Location';

// store
const store = useDataStore()

const {
  locations,
  activeLocation
} = storeToRefs(store)

const {
  setActiveLocation
} = store

const back = () => {
  setActiveLocation(null)
}
</script>

<template>
  <div class="__trackPanel">
    <h2 class="__heading">
      {{ activeLocation ? 'Stages' : 'Locations' }}
    </h2>
    <div v-if="!activeLocation" class="__locations">
      <LocationList :locations="(locations as Location[])" />
    </div>
    <div v-if="activeLocation" class="__stages">
      <div class="__top">
        <div class="__back" @click="back()">
          &lt; Back
        </div>
        <div class="__stage">
          {{ activeLocation.name }}
        </div>
        <div><span :class="`fp fp-lg ${activeLocation.countryCode}`" /></div>
      </div>

      <div class="__heading">
        Forward
      </div>
      <StageList :stages="(activeLocation.forward as Stage[])" />

      <div class="__heading">
        Reverse
      </div>
      <StageList :stages="(activeLocation.reverse as Stage[])" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.__trackPanel {
  background-color: rgba(31, 31, 31, 0.7);
  width: 30vw;
  height: 95vh;
  padding: 1rem;
  margin: 1.5rem 0 1.5rem 1.5rem;
  color: white;
  display: flex;
  flex-direction: column;
}

.__locations, .__stages {
  overflow: scroll;
}

.__stage {
  text-align: center;
  padding: 0 0.5rem;
}

.__heading {
  text-align: center;
  margin-bottom: 1rem;
}

.__top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  .__back {
    padding: 0.8rem 1rem;
    font-size: 1rem;
    white-space: nowrap;
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
}

</style>

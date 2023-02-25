<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

import CarGroupFilter from '@/components/CarGroupFilter.vue';
import TimeTable from '@/components/TimeTable.vue';
import AddLaptimeModal from '@/components/modals/AddLaptimeModal.vue';
import AddDriverModal from '@/components/modals/AddDriverModal.vue';

import { ref } from 'vue';

type ModalType = 'driver' | 'laptime';

// store
const store = useDataStore()

const {
  carGroupFilter,
  activeLocation,
  activeStage,
} = storeToRefs(store)

const {
  getTimesForStage,
  setActiveStage,
  isLocal
} = store

const close = () => {
  setActiveStage(null)
}

const showAddLaptimeModal = ref(false)
const showAddDriverModal = ref(false)

const showModal = (modal: ModalType) => {
  if (modal === 'driver') {
    showAddLaptimeModal.value = false
    showAddDriverModal.value = true
  } else {
    showAddLaptimeModal.value = true
    showAddDriverModal.value = false
  }
}

</script>

<template>
  <div class="__contentPanel">
    <div class="__btn __danger __close" @click="close()">
      Close
    </div>
    <div v-if="activeLocation" class="__locationContent">
      <h2>{{ activeLocation.name }}</h2>
    </div>
    <div v-if="activeStage" class="__stageContent">
      <h3>{{ activeStage.name }}</h3>
      <div class="__table">
        <CarGroupFilter class="__carGroupFilter" />
        <TimeTable :times="getTimesForStage(activeStage)" :group="carGroupFilter" />
        <div v-if="isLocal()" class="__btn __success" @click="showModal('laptime')">Add Laptime</div>
        <AddLaptimeModal v-show="showAddLaptimeModal" @close="showAddLaptimeModal = false" @show-add-driver-modal="showModal('driver')" />
        <AddDriverModal v-show="showAddDriverModal" @close="showModal('laptime')"  />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.__contentPanel {
  background-color: rgba(31, 31, 31, 0.7);
  padding: 1rem 1rem;
  width: 63vw;
  height: 95vh;
  margin: 1.5rem;
  position: relative;

  .__table {
    margin-top: 1rem;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-end;

    .__carGroupFilter {
      z-index: 0;
    }
  }

  .__close {
    position: absolute;
    right: 1rem;
    top: 1rem;
  }
}

@media screen and (max-width: 768px) {
  .__contentPanel {
    width: 100%;
    height: 100%;
    margin: 0;

    .__locationContent {
      max-width: 70%;
    }

    .__table {
      padding: 0;
    }
  }
}
</style>

<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

import CarGroupFilter from '@/components/CarGroupFilter.vue';
import TimeTable from '@/components/TimeTable.vue';
import AddLaptimeModal from '@/components/modals/AddLaptimeModal.vue';
import { ref } from 'vue';

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
} = store

const close = () => {
  setActiveStage(null)
}

const showAddModal = ref(false)

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
        <div class="__btn __success" @click="showAddModal = !showAddModal">Add</div>
        <AddLaptimeModal v-show="showAddModal" @close="showAddModal = false" />
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
  }
}
</style>

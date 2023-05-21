<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

import CarGroupFilter from '@/components/CarGroupFilter.vue';
import TimeTable from '@/components/TimeTable.vue';
import AddLaptimeModal from '@/components/modals/AddLaptimeModal.vue';
import AddDriverModal from '@/components/modals/AddDriverModal.vue';
import EditLaptimeModal from '@/components/modals/EditLaptimeModal.vue';

import { ref } from 'vue';
import type { LaptimeWithData } from '@/model/LaptimeWithData';
import type { Laptime } from '@/model/Laptime';

type ModalType = 'add-driver' | 'add-laptime' | 'edit-laptime';

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
const laptimeToEdit = ref<Laptime | undefined>(undefined)
const modals = ref<ModalType[]>([])

const onRowClicked = (laptime: LaptimeWithData) => {
  if (!isLocal()) { return }
  laptimeToEdit.value = laptime as Laptime
  showModal('edit-laptime')
}

const isModalActive = (modal: ModalType) => {
  return modals.value.length > 0 && modals.value[modals.value.length - 1] === modal
}

const showModal = (modal: ModalType) => {
  modals.value.push(modal)
}

const closeModal = () => {
  modals.value.pop()
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
        <TimeTable :times="getTimesForStage(activeStage)" :group="carGroupFilter" @row-clicked="onRowClicked($event)" />
        <div v-if="isLocal()" class="__btn __success" @click="showModal('add-laptime')">Add Laptime</div>
      </div>
    </div>
    <AddLaptimeModal v-show="isModalActive('add-laptime')" @close="closeModal()"
      @show-add-driver-modal="showModal('add-driver')" />
    <AddDriverModal v-show="isModalActive('add-driver')" @close="closeModal()" />
    <EditLaptimeModal v-if="isModalActive('edit-laptime')" @close="closeModal()"
      @show-add-driver-modal="showModal('add-driver')" :laptime="laptimeToEdit" />
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

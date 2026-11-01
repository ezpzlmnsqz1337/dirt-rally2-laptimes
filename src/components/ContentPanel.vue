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

type ModalType = 'add-driver' | 'add-laptime' | 'edit-laptime';

// store
const store = useDataStore()

const {
  carGroupFilter,
  activeLocation,
  activeStage,
  loading,
  loadError,
} = storeToRefs(store)

const {
  getTimesForStage,
  setActiveStage,
  isLocal,
  fetchAll,
} = store

const close = () => {
  setActiveStage(null)
}
const laptimeToEdit = ref<LaptimeWithData | undefined>(undefined)
const modals = ref<ModalType[]>([])

const onRowClicked = (laptime: LaptimeWithData) => {
  if (!isLocal()) { return }
  laptimeToEdit.value = laptime
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
  <aside class="__contentPanel" aria-label="Stage times">
    <div class="__panelTop">
      <div v-if="activeLocation" class="__locationContent">
        <h2>{{ activeLocation.name }}</h2>
      </div>
      <button type="button" class="__btn __close" @click="close()">
        Close
      </button>
    </div>
    <div v-if="activeStage" class="__stageContent">
      <h3>{{ activeStage.name }}</h3>
      <div class="__table">
        <div class="__tableTop">
          <CarGroupFilter class="__carGroupFilter" />
          <button v-if="isLocal()" type="button" class="__btn __primary" @click="showModal('add-laptime')">
            Add laptime
          </button>
        </div>
        <div v-if="loadError" class="__state" role="alert">
          <strong>{{ loadError }}</strong>
          <button type="button" class="__btn" @click="fetchAll()">Retry</button>
        </div>
        <TimeTable v-else :times="getTimesForStage(activeStage)" :group="carGroupFilter" :loading="loading"
          :interactive="isLocal()" @row-clicked="onRowClicked($event)" />
      </div>
    </div>
    <div v-else class="__state" role="status">
      <strong>{{ activeLocation ? 'Pick a stage' : 'Pick a location' }}</strong>
      <span v-if="activeLocation">Select a stage on the left to see its times.</span>
      <span v-else>Select a rally location on the map or in the list to browse stage times.</span>
    </div>
    <AddLaptimeModal v-show="isModalActive('add-laptime')" :active="isModalActive('add-laptime')"
      @close="closeModal()" @show-add-driver-modal="showModal('add-driver')" />
    <AddDriverModal v-show="isModalActive('add-driver')" :active="isModalActive('add-driver')" @close="closeModal()" />
    <EditLaptimeModal v-if="isModalActive('edit-laptime')" @close="closeModal()"
      @show-add-driver-modal="showModal('add-driver')" :laptime="laptimeToEdit" />
  </aside>
</template>

<style scoped lang="scss">
.__contentPanel {
  background-color: color-mix(in srgb, var(--surface) 92%, transparent);
  backdrop-filter: blur(12px);
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 1rem;
  width: 63vw;
  max-width: 60rem;
  height: calc(100vh - 2rem);
  margin: 1rem;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  .__panelTop {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1rem;
  }

  .__locationContent h2 {
    margin: 0;
  }

  .__stageContent {
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
  }

  .__table {
    margin-top: 0.75rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-height: 0;
    overflow-y: auto;
  }

  .__tableTop {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .__close {
    flex-shrink: 0;
  }
}

.__state {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1.25rem;
  color: var(--muted);
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-md);

  strong {
    color: var(--fg);
  }
}

@media screen and (max-width: 768px) {
  .__contentPanel {
    width: 100%;
    max-width: none;
    height: 100%;
    margin: 0;
    border-radius: 0;
    border: 0;

    .__locationContent {
      max-width: 70%;
    }
  }
}
</style>

<script setup lang="ts">
import type { Stage } from '@/model/Stage'
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { withDefaults } from 'vue';

export interface Props {
  stages: Stage[]
}

withDefaults(defineProps<Props>(),
  {
    stages: () => []
  })

// store
const store = useDataStore()

const {
  activeStage,
} = storeToRefs(store)

const {
  getTimesForStage,
  setActiveStage,
} = store

const isActiveStage = (stage: Stage) => {
  if (!stage || !activeStage.value) { return false }
  return stage.id === activeStage.value.id
}
</script>

<template>
  <div class="__wrapper">
    <div v-for="s in stages" :key="`stage-${s.id}`" class="__item stage" :class="{ __active: isActiveStage(s) }"
      @click="setActiveStage(s)">
      <div>
        <div>{{ s.name }}</div>
        <div>{{ s.lengthKm }}km</div>
      </div>
      <div v-if="getTimesForStage(s).length > 0">
        {{ getTimesForStage(s).length }} time(s)
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.__stage {
  text-align: center;
  padding: 0 0.5rem;
}

.__heading {
  text-align: center;
  margin-bottom: 1rem;
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
</style>

<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

// store
const store = useDataStore()

const {
  activeStage,
  carGroupFilter,
  carGroups
} = storeToRefs(store)

const {
  setCarGroupFilter,
  getTimesForStage
} = store

const getNumberOfTimesForStage = (group: string) => {
  if (!activeStage.value) return 0
  if (group === 'Any') return getTimesForStage(activeStage.value).length
  return getTimesForStage(activeStage.value).filter(x => x.car?.group === group).length
}

const carGroupFilterOptions = computed(() => carGroups.value.map((group) => ({
  label: `${group} [${getNumberOfTimesForStage(group)}]`,
  value: group
})).sort((a, b) => getNumberOfTimesForStage(b.value) - getNumberOfTimesForStage(a.value))
)
</script>

<template>
  <div class="__wrapper">
    <label for="car-group-filter" class="__label">Group</label>
    <v-select id="car-group-filter" input-id="car-group-filter" class="__select" :options="carGroupFilterOptions"
      :model-value="carGroupFilter" :searchable="false" :clearable="false" append-to-body
      @update:model-value="setCarGroupFilter($event.value)" />
  </div>
</template>

<style scoped lang="scss">
.__wrapper {
  display: flex;
  align-items: center;
  gap: 0.5rem;

  .__select {
    min-width: 15rem;
    display: inline-block;
  }
}

.__label {
  color: var(--muted);
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

@media screen and (max-width: 700px) {
  .__wrapper {
    width: 100%;

    .__select {
      min-width: 0;
      flex: 1;
    }
  }
}
</style>

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
    <button v-for="s in stages" :key="`stage-${s.id}`" type="button" class="__item stage"
      :class="{ __active: isActiveStage(s) }" :aria-current="isActiveStage(s) ? 'true' : undefined"
      @click="setActiveStage(s)">
      <span class="__label">
        <span>{{ s.name }}</span>
        <span class="__meta">{{ s.lengthKm }} km</span>
      </span>
      <span v-if="getTimesForStage(s).length > 0" class="__meta">
        {{ getTimesForStage(s).length }} time(s)
      </span>
    </button>
  </div>
</template>

<style scoped lang="scss">
.__stage {
  text-align: left;
}

.__heading {
  text-align: center;
  margin-bottom: 1rem;
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
</style>

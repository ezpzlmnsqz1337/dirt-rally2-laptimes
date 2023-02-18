<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

// store
const store = useDataStore()

const {
  carGroupFilter,
  carGroups
} = storeToRefs(store)

const {
  setCarGroupFilter
} = store
</script>

<template>
  <div class="__wrapper">
    Group:
    <v-select
      class="__select"
      :options="carGroups"
      :model-value="carGroupFilter"
      :searchable="false"
      :clearable="false"
      @update:model-value="setCarGroupFilter($event)"
    />
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
</style>

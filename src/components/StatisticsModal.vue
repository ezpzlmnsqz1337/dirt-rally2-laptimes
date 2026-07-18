<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { storeToRefs } from 'pinia';

const store = useDataStore()
const { statistics, availableYears, yearFilter } = storeToRefs(store)
const { setYearFilter } = store

const onYearChange = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value
  setYearFilter(val ? parseInt(val) : null)
}

defineEmits<(e: 'close') => void>()
</script>

<template>
  <div class="__backdrop" @click="$emit('close')">
    <div class="__modal __statsModal" @click.stop="">
      <div class="__topRow">
        <h2>Statistics</h2>
        <select :value="yearFilter ?? ''" @change="onYearChange">
          <option value="">All Time</option>
          <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
        </select>
      </div>
      <div class="__table">
        <table v-if="statistics.length">
          <tr>
            <th>Driver</th><th>Events</th>
            <th>1st</th><th>2nd</th><th>3rd</th>
          </tr>
          <tr v-for="s in statistics" :key="s.driverId">
            <td>{{ s.driverName }}</td>
            <td>{{ s.total }}</td>
            <td class="__gold">{{ s.gold }}</td>
            <td class="__silver">{{ s.silver }}</td>
            <td class="__bronze">{{ s.bronze }}</td>
          </tr>
        </table>
        <div v-else>No times yet.</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/scss/_modal.scss';

.__statsModal {
  width: 40vw;
  max-height: 80vh;
  overflow: auto;

  .__topRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;

    h2 { margin: 0; }

    select {
      padding: 0.5rem;
      border-radius: 0.3rem;
      font-size: 1rem;
      border: 0.1rem solid black;
    }
  }

  .__table table {
    width: 100%;
    border-spacing: 0;
    background-color: #777;
    border-radius: 0.3rem;

    th, td {
      padding: 0.8rem 1rem;
      text-align: center;
      border-bottom: 1px solid #fff;
    }

    th { border-bottom-width: 2px; }

    .__gold { color: gold; font-weight: bold; }
    .__silver { color: silver; font-weight: bold; }
    .__bronze { color: #cd7f32; font-weight: bold; }
  }

  @media screen and (max-width: 1024px) {
    width: 80vw;
  }
}
</style>

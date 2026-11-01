<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { useModalFocus } from '@/utils/useModalFocus';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const store = useDataStore()
const { statistics, availableYears, yearFilter } = storeToRefs(store)
const { setYearFilter } = store

const onYearChange = (e: Event) => {
  const val = (e.target as HTMLSelectElement).value
  setYearFilter(val ? parseInt(val) : null)
}

const emit = defineEmits<(e: 'close') => void>()

const dialogRef = ref<HTMLElement | null>(null)
useModalFocus(dialogRef, () => emit('close'))
</script>

<template>
  <div class="__backdrop" @click="$emit('close')">
    <div ref="dialogRef" class="__modal __statsModal" role="dialog" aria-modal="true" aria-label="Statistics" tabindex="-1" @click.stop="">
      <div class="__topRow">
        <h2>Statistics</h2>
        <div class="__topActions">
          <label for="stats-year" class="__visuallyHidden">Year</label>
          <select id="stats-year" :value="yearFilter ?? ''" @change="onYearChange">
            <option value="">All Time</option>
            <option v-for="y in availableYears" :key="y" :value="y">{{ y }}</option>
          </select>
          <button type="button" class="__btn" @click="$emit('close')">Close</button>
        </div>
      </div>
      <div class="__table">
        <table v-if="statistics.length">
          <thead>
            <tr>
              <th scope="col">Driver</th>
              <th scope="col">Events</th>
              <th scope="col">1st</th>
              <th scope="col">2nd</th>
              <th scope="col">3rd</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="s in statistics" :key="s.driverId">
              <td>{{ s.driverName }}</td>
              <td>{{ s.total }}</td>
              <td class="__gold">{{ s.gold }}</td>
              <td class="__silver">{{ s.silver }}</td>
              <td class="__bronze">{{ s.bronze }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="__state">
          <strong>No times yet.</strong>
          <span>Add a run to see the podium table.</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/scss/_modal.scss';

.__statsModal {
  width: min(90vw, 40rem);
  max-height: 80vh;
  overflow: auto;

  .__topRow {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;

    h2 { margin: 0; }
  }

  .__topActions {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .__visuallyHidden {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  .__table table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    background-color: transparent;
    font-variant-numeric: tabular-nums;

    th {
      color: var(--muted);
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 0.6rem 0.75rem;
      border-bottom: 1px solid var(--line-strong);
      text-align: left;
    }

    td {
      padding: 0.6rem 0.75rem;
      text-align: left;
      border-bottom: 1px solid var(--line);
    }

    .__gold { color: var(--medal-gold); font-weight: 700; }
    .__silver { color: var(--medal-silver); font-weight: 700; }
    .__bronze { color: var(--medal-bronze); font-weight: 700; }
  }

  .__state {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    padding: 2rem 1rem;
    color: var(--muted);
    border: 1px dashed var(--line-strong);
    border-radius: var(--radius-md);

    strong { color: var(--fg); }
  }

  @media screen and (max-width: 1024px) {
    width: min(90vw, 36rem);
  }

  @media screen and (max-width: 700px) {
    .__topRow {
      flex-direction: column;
      align-items: stretch;
    }
  }
}
</style>

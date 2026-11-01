<script setup lang="ts">
import type { LaptimeWithData } from '@/model/LaptimeWithData'

import LaptimeUtil from '@/utils/LaptimeUtil'
import { computed } from 'vue'

export interface Props {
  times: LaptimeWithData[]
  group: string
  showLocation?: boolean
  showStage?: boolean
  loading?: boolean
  interactive?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  times: () => [],
  group: 'Any',
  showLocation: false,
  showStage: false,
  loading: false,
  interactive: true
})

const emit = defineEmits<{
  (e: 'row-clicked', laptime: LaptimeWithData): void
}>()

const columns = computed(() =>
  ['Position', 'Driver', 'Time', 'Losing', 'Car', 'Group', 'Location', 'Stage']
    .filter(x => (!props.showStage && x !== 'Stage') && (!props.showLocation && x !== 'Location'))
)

const rows = computed(() => {
  return props.group === 'Any' ? props.times : props.times.filter(x => x.car?.group === props.group)
})

const rowLabel = (time: LaptimeWithData) =>
  `Edit laptime, driver ${time.driver?.name ?? ''}, ${time.time}`
</script>

<template>
  <div class="__timeTable">
    <table v-if="rows.length > 0">
      <thead>
        <tr>
          <th v-for="c in columns" :key="c" scope="col">
            {{ c }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(time, index) in rows" :key="time.id" :tabindex="interactive ? 0 : undefined"
          :role="interactive ? 'button' : undefined" :aria-label="interactive ? rowLabel(time) : undefined"
          :class="{ __clickable: interactive }" @click="interactive && emit('row-clicked', time)"
          @keydown.enter.prevent="interactive && emit('row-clicked', time)"
          @keydown.space.prevent="interactive && emit('row-clicked', time)">
          <td class="__position">
            <span :class="index < 3 ? ['medal-pill', `medal-pill--${index + 1}`] : null">{{ index + 1 }}.</span>
          </td>
          <td class="__driver">
            <span>{{ time.driver?.name }}</span>
          </td>
          <td class="__time">
            {{ time.time }}
          </td>
          <td class="__losing">
            <span v-if="index > 0 && rows[0]">{{ LaptimeUtil.getLaptimeDiff(rows[0].time, time.time) }}</span>
          </td>
          <td class="__car">
            {{ time.car?.name }}
          </td>
          <td class="__group">
            {{ time.car?.group }}
          </td>
          <td v-if="showLocation" class="__location">
            {{ time.location?.name }}
          </td>
          <td v-if="showStage" class="__stage">
            {{ time.stage?.name }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="loading" class="__state" role="status">
      <PulseLoader color="var(--accent)" size="10px" />
      <span>Loading times…</span>
    </div>
    <div v-else-if="times.length === 0" class="__state">
      <strong>No times yet.</strong>
      <span>Pick a stage and add the first run.</span>
    </div>
    <div v-else-if="rows.length === 0" class="__state">
      <strong>No times in this group.</strong>
      <span>Clear the car-group filter to see all runs on this stage.</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.__timeTable {
  width: 100%;
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
    border-spacing: 0;
    background-color: transparent;
    color: var(--fg);
    font-size: 0.9rem;
    font-variant-numeric: tabular-nums;

    thead th {
      color: var(--muted);
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-align: left;
      padding: 0.6rem 0.75rem;
      border-bottom: 1px solid var(--line-strong);
      background-color: transparent;
      white-space: nowrap;
    }

    tbody tr {
      border-bottom: 1px solid var(--line);
      transition: background-color var(--motion-fast) ease;

      &.__clickable {
        cursor: pointer;
      }

      &:hover,
      &:focus-visible {
        background-color: var(--surface-raised);
      }

      td {
        text-align: left;
        padding: 0.6rem 0.75rem;
        border-bottom: 1px solid var(--line);

        &.__losing {
          color: var(--muted);
          min-width: 5rem;
          white-space: nowrap;
        }

        &.__time {
          font-weight: 600;
        }

        &.__position {
          color: var(--muted);
          width: 4.5rem;
        }
      }
    }
  }
}

.medal-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  border: 1px solid transparent;
  font-weight: 700;

  &--1 {
    color: var(--medal-gold);
    border-color: var(--medal-gold);
    background-color: var(--medal-gold-soft);
  }

  &--2 {
    color: var(--medal-silver);
    border-color: var(--medal-silver);
    background-color: var(--medal-silver-soft);
  }

  &--3 {
    color: var(--medal-bronze);
    border-color: var(--medal-bronze);
    background-color: var(--medal-bronze-soft);
  }
}

.__state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  padding: 2.5rem 1rem;
  color: var(--muted);
  text-align: center;
  border: 1px dashed var(--line-strong);
  border-radius: var(--radius-md);

  strong {
    color: var(--fg);
  }
}

@media screen and (max-width: 768px) {
  .__timeTable {
    font-size: 0.8rem;

    table {

      thead th,
      tbody tr td {
        padding: 0.5rem 0.4rem;
      }
    }
  }
}
</style>

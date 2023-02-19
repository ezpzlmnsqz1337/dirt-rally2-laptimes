<script setup lang="ts">
import type { LaptimeWithData } from '@/model/LaptimeWithData'

import LaptimeUtil from '@/utils/LaptimeUtil'
import { computed } from 'vue'

export interface Props {
  times: LaptimeWithData[]
  group: string
  showLocation?: boolean
  showStage?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  times: () => [],
  group: 'Any',
  showLocation: false,
  showStage: false
})

const columns = computed(() =>
  ['Position', 'Driver', 'Time', 'Losing', 'Car', 'Group', 'Location', 'Stage']
    .filter(x => (!props.showStage && x !== 'Stage') && (!props.showLocation && x !== 'Location'))
)

const rows = computed(() => {
  return props.group === 'Any' ? props.times : props.times.filter(x => x.car?.group === props.group)
})
</script>

<template>
  <div class="__timeTable">
    <table v-if="rows.length > 0">
      <tr>
        <th v-for="c in columns" :key="c">
          {{ c }}
        </th>
      </tr>
      <tr v-for="(time, index) in rows" :key="time.id">
        <td class="__position">
          {{ index + 1 }}.
        </td>
        <td class="__driver">
          <span>{{ time.driver?.name }}</span>
        </td>
        <td class="__time">
          {{ time.time }}
        </td>
        <td class="__losing">
          <span v-if="index > 0">{{ LaptimeUtil.getLaptimeDiff(times[0].time, time.time) }}</span>
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
    </table>
    <div v-if="times.length === 0">
      No times yet.
    </div>
  </div>
</template>

<style scoped lang="scss">
.__timeTable {
  width: 100%;

  table {
    width: 100%;
    border-radius: 0.3rem;
    background-color: #777777;
    border-spacing: 0;

    tr {
      &:hover {
        background-color: #0045E0;
      }

      &:first-child {
        background-color: unset;
      }

      th {
        padding: 1rem;
        border-bottom: 1px solid #fff;
      }

      td {
        text-align: center;
        padding: 1rem;
        border-top: 1px solid white;

        &.__losing {
          color: #cb0b2b;

          span {
            // font-weight: bold;
            background-color: rgba(31, 31, 31, 0.7);
            padding: 0.3rem;
            border-radius: 0.3rem;
          }
        }
      }
    }

    tr:nth-child(-n+4) {
      .__driver span {
        box-shadow: 0.2rem 0.2rem 0.5rem 0.2rem #555454;
        background-color: #424242;
        padding: 0.3rem;
        border-radius: 0.3rem;
        color: var(--medal);
        border: 0.1rem solid var(--medal);
      }
    }

    tr:nth-child(2) .__driver span {
      --medal: gold;
    }

    tr:nth-child(3) .__driver span {
      --medal: silver;
    }

    tr:nth-child(4) .__driver span {
      --medal: #cd7f32;
    }
  }
}

@media screen and (max-width: 768px) {
  .__timeTable {
    font-size: 0.6rem;

    th, td {
      padding-left: 0.5rem !important;
      padding-right: 0.5rem !important;
    }
  }
}
</style>

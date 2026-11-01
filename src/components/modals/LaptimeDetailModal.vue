<script setup lang="ts">
import type { LaptimeWithData } from '@/model/LaptimeWithData';
import { useDataStore } from '@/stores/data';
import { useModalFocus } from '@/utils/useModalFocus';
import { computed, ref } from 'vue';

export interface Props {
  laptime: LaptimeWithData
  gap?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'showEdit'): void,
  (e: 'close'): void
}>()

// store
const store = useDataStore()
const { isLocal } = store

const dialogRef = ref<HTMLElement | null>(null)
useModalFocus(dialogRef, () => emit('close'))

const carLabel = computed(() => {
  const car = props.laptime.car
  if (!car) { return '—' }
  return car.group ? `${car.name} · ${car.group}` : car.name
})

const stageLabel = computed(() => {
  const stage = props.laptime.stage
  if (!stage) { return '—' }
  return `${stage.name} · ${stage.lengthKm} km`
})

const recordedAt = computed(() => new Date(props.laptime.timestamp).toLocaleString())
</script>

<template>
  <div class="__backdrop" @click="emit('close')">
    <div ref="dialogRef" class="__modal" role="dialog" aria-modal="true" aria-label="Laptime detail" tabindex="-1"
      @click.stop="">
      <h2>Laptime detail</h2>
      <p class="__time">
        {{ laptime.time }}
        <span v-if="gap" class="__gap">{{ gap }}</span>
      </p>
      <dl class="__details">
        <div class="__row">
          <dt>Driver</dt>
          <dd>{{ laptime.driver?.name ?? '—' }}</dd>
        </div>
        <div class="__row">
          <dt>Car</dt>
          <dd>{{ carLabel }}</dd>
        </div>
        <div class="__row">
          <dt>Location</dt>
          <dd>{{ laptime.location?.name ?? '—' }}</dd>
        </div>
        <div class="__row">
          <dt>Stage</dt>
          <dd>{{ stageLabel }}</dd>
        </div>
        <div class="__row">
          <dt>Recorded</dt>
          <dd>{{ recordedAt }}</dd>
        </div>
      </dl>
      <div v-if="laptime.notes" class="__notes">
        <h3>Notes</h3>
        <p>{{ laptime.notes }}</p>
      </div>
      <div class="__actions">
        <button v-if="isLocal()" type="button" class="__btn __primary" @click="emit('showEdit')">
          Edit
        </button>
        <button type="button" class="__btn" @click="emit('close')">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/scss/_modal.scss';

.__modal {
  text-align: left;
}

.__time {
  margin: 0 0 1rem;
  font-size: 1.75rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: var(--fg);
}

.__gap {
  margin-left: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--muted);
}

.__details {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.__row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--line);

  dt {
    color: var(--muted);
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  dd {
    margin: 0;
    color: var(--fg);
    text-align: right;
  }
}

.__notes {
  margin-top: 1rem;

  h3 {
    margin-bottom: 0.35rem;
    color: var(--muted);
    font-size: 0.8rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  p {
    margin: 0;
    color: var(--fg);
    white-space: pre-wrap;
  }
}
</style>

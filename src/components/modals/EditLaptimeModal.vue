<script setup lang="ts">
import type { Car } from '@/model/Car';
import type { Driver } from '@/model/Driver';
import type { LaptimeWithData } from '@/model/LaptimeWithData';
import { useDataStore } from '@/stores/data';
import LaptimeUtil from '@/utils/LaptimeUtil';
import { useModalFocus } from '@/utils/useModalFocus';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import LaptimeInput from '../LaptimeInput.vue';

export interface Props {
  laptime?: LaptimeWithData
}

const props = defineProps<Props>()

// store
const store = useDataStore()

const {
  cars,
  drivers,
} = storeToRefs(store)

const {
  updateLaptime,
  deleteLaptime
} = store

const emit = defineEmits<{
  (e: 'showAddDriverModal'): void,
  (e: 'close'): void
}>()

const dialogRef = ref<HTMLElement | null>(null)
useModalFocus(dialogRef, () => emit('close'))

const driverId = ref<string | undefined>(props.laptime?.driver?.id)
const time = ref<string | undefined>(props.laptime?.time)
const carId = ref<number | undefined>(props.laptime?.car?.id)
const toSeconds = (value?: string) => {
  const date = value ? LaptimeUtil.laptimeToDate(value) : undefined
  return date ? date.getTime() / 1000 : 0
}
const laptime = ref<number>(toSeconds(props.laptime?.time))

const saveError = ref<string | null>(null)
const deleteArmed = ref(false)

const save = async () => {
  const current = props.laptime
  if (!current || !current.location || !current.stage) { return }
  if (driverId.value === undefined || carId.value === undefined || !time.value) { return }
  saveError.value = null
  try {
    await updateLaptime({
      id: current.id,
      carId: carId.value,
      driverId: driverId.value,
      time: time.value,
      locationId: current.location.id,
      stageId: current.stage.id,
      timestamp: new Date().getTime(),
      notes: ''
    })
  } catch (error) {
    saveError.value = 'Could not save the change. Check the connection and try again.'
    console.error('Failed to update laptime:', error)
    return
  }
  emit('close')
}

const remove = async () => {
  if (!props.laptime) { return }
  // Two-step delete: the first click only arms the button.
  if (!deleteArmed.value) {
    deleteArmed.value = true
    return
  }
  saveError.value = null
  try {
    await deleteLaptime(props.laptime.id)
  } catch (error) {
    saveError.value = 'Could not delete the lap time. Check the connection and try again.'
    console.error('Failed to delete laptime:', error)
    return
  }
  emit('close')
}

</script>

<template>
  <div class="__backdrop" @click="emit('close')">
    <div ref="dialogRef" class="__modal" role="dialog" aria-modal="true" aria-label="Edit laptime" tabindex="-1" @click.stop="">
      <div>
        <h2>Edit Laptime</h2>
      </div>
      <div class="__body">
        <div class="__form">
          <div class="__formRow">
            <label for="edit-driver-select">Driver</label>
            <v-select input-id="edit-driver-select" class="__select" :options="drivers" label="name" :reduce="(driver: Driver) => driver.id"
              v-model="driverId" :clearable="false" append-to-body>
            </v-select>
            <button type="button" class="__btn" @click="emit('showAddDriverModal')">Add driver</button>
          </div>
          <div class="__formRow">
            <label for="edit-car-select">Car</label>
            <v-select input-id="edit-car-select" class="__select" :options="cars" label="name" :reduce="(car: Car) => car.id" v-model="carId"
              :clearable="false" append-to-body>
            </v-select>
          </div>
          <div class="__formRow">
            <label>Time</label>
            <LaptimeInput :value="laptime" @changed="time = $event!" />
          </div>
          <div class="__formRow" v-if="saveError">
            <p class="__error" role="alert">{{ saveError }}</p>
          </div>
          <div class="__formRow">
            <button type="button" class="__btn __primary" :disabled="!time" @click="save()">
              Save
            </button>
          </div>
          <button type="button" class="__btn __danger" @click="remove()">
            {{ deleteArmed ? 'Confirm delete?' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/scss/_modal.scss';
</style>

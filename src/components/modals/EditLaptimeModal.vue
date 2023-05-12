<script setup lang="ts">
import type { Car } from '@/model/Car';
import type { Driver } from '@/model/Driver';
import type { LaptimeWithData } from '@/model/LaptimeWithData';
import { useDataStore } from '@/stores/data';
import LaptimeUtil from '@/utils/LaptimeUtil';
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

const driverId = ref<string | undefined>(props.laptime?.driver?.id)
const time = ref<string | undefined>(props.laptime?.time)
const carId = ref<number | undefined>(props.laptime?.car?.id)
const laptime = ref<number | undefined>(LaptimeUtil.laptimeToDate(props.laptime!.time)?.getTime()! / 1000)

const save = () => {
  updateLaptime({
    id: props.laptime!.id,
    carId: carId.value!,
    driverId: `${driverId.value}`,
    time: time.value!,
    locationId: props.laptime!.location!.id,
    stageId: props.laptime!.stage!.id,
    timestamp: new Date().getTime(),
    notes: ''
  })
  emit('close')
}

const remove = () => {
  deleteLaptime(props.laptime!.id)
  emit('close')
}

</script>

<template>
  <div class="__backdrop" @click="emit('close')">
    <div class="__modal" @click.stop="">
      <div>
        <h2>Edit Laptime</h2>
      </div>
      <div class="__body">
        <div class="__form">
          <div class="__formRow">
            <label>Driver</label>
            <v-select class="__select" :options="drivers" label="name" :reduce="(driver: Driver) => driver.id"
              v-model="driverId" :clearable="false">
            </v-select>
            <button class="__btn __success" @click="emit('showAddDriverModal')">Add Driver</button>
          </div>
          <div class="__formRow">
            <label>Car</label>
            <v-select class="__select" :options="cars" label="name" :reduce="(car: Car) => car.id" v-model="carId"
              :clearable="false">
            </v-select>
          </div>
          <div class="__formRow">
            <label>Time</label>
            <LaptimeInput :value="laptime" @changed="time = $event!" />
          </div>
          <div class="__formRow">
            <button class="__btn __success" :disabled="time === null" @click="save()">
              Save
            </button>
          </div>
          <button class="__btn __danger" @click="remove()">
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/scss/_modal.scss';
</style>

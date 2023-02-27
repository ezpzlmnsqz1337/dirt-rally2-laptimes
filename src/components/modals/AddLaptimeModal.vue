<script setup lang="ts">
import type { Car } from '@/model/Car';
import type { Driver } from '@/model/Driver';
import type { Laptime } from '@/model/Laptime';
import { useDataStore } from '@/stores/data';
import { useGameDataStore } from '@/stores/game-data';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import LaptimeInput from '../LaptimeInput.vue';
import ProviderHostnameSelect from '../ProviderHostnameSelect.vue';


// store
const store = useDataStore()
const gameDataStore = useGameDataStore()

const {
  laptime,
} = storeToRefs(gameDataStore)

const {
  cars,
  carGroupFilter,
  drivers,
  activeLocation,
  activeStage
} = storeToRefs(store)

const {
  addLaptime,
} = store

const emit = defineEmits<{
  (e: 'showAddDriverModal'): void,
  (e: 'close'): void
}>()

const carsByGroup = computed(() => {
  return cars.value.filter(car => carGroupFilter.value === 'Any' || car.group === carGroupFilter.value)
})

const driverId = ref(drivers.value[0].id)
const time = ref<string | null>(null)
const carId = ref(carsByGroup.value[0].id)

watch(carGroupFilter, () => carId.value = Number(carsByGroup.value[0].id))

const add = (laptime: Partial<Laptime>) => {
  addLaptime(laptime)
  emit('close')
}

</script>

<template>
  <div class="__backdrop" @click="emit('close')">
      <div class="__modal" @click.stop="">
        <div>
          <h2>Add Laptime</h2>
        </div>
        <div class="__body">
          <ProviderHostnameSelect />
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
              <v-select class="__select" :options="carsByGroup" label="name" :reduce="(car: Car) => car.id" v-model="carId"
                :clearable="false">
              </v-select>
            </div>
            <div class="__formRow">
              <label>Time</label>
              <LaptimeInput :value="laptime" @changed="time = $event" />
            </div>
            <div class="__formRow">
              <button class="__btn __success" :disabled="time === null" @click="add({
                carId,
                driverId: `${driverId}`,
                time: time!,
                locationId: activeLocation!.id,
                stageId: activeStage!.id,
                timestamp: new Date().getTime(),
                notes: ''
              })">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<style scoped lang="scss">
@use '@/scss/_modal.scss';
</style>

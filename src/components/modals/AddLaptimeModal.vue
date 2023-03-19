<script setup lang="ts">
import type { Car } from '@/model/Car';
import type { Driver } from '@/model/Driver';
import type { Laptime } from '@/model/Laptime';
import { WebsocketState } from '@/model/WebsocketState';
import { useDataStore } from '@/stores/data';
import { useGameDataStore } from '@/stores/game-data';
import LaptimeUtil from '@/utils/LaptimeUtil';
import { storeToRefs } from 'pinia';
import { computed, ref, watch, onMounted } from 'vue';
import LaptimeInput from '../LaptimeInput.vue';
import ProviderHostnameSelect from '../ProviderHostnameSelect.vue';


// store
const store = useDataStore()
const gameDataStore = useGameDataStore()

const {
  websocketState,
  laptime,
  finishedSuccessfully
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

const driverId = ref(drivers.value[4]?.id)
const time = ref<string | null>(null)
const carId = ref(carsByGroup.value[49]?.id)

onMounted(() => {
  setTimeout(() => {
    loadSettingsFromLocalStorage()
  }, 2000)
})

watch(carGroupFilter, () => carId.value = Number(carsByGroup.value[0].id))
watch(finishedSuccessfully, () => {
  if (finishedSuccessfully.value) {
    add(LaptimeUtil.dateToLaptime(new Date(laptime.value * 1000)))
  }
})

const loadSettingsFromLocalStorage = () => {
  const settings = localStorage.getItem('settings')
  if (settings) {
    const saved = JSON.parse(settings)
    driverId.value = saved.driverId
    carId.value = saved.carId
  }
}

const saveSettingsToLocalStorage = () => {
  localStorage.setItem('settings', JSON.stringify({ driverId: driverId.value, carId: carId.value }))
}

const add = (laptimeToAdd: string) => {
  if (!activeStage.value || !activeLocation.value) { return }
  addLaptime({
    carId: carId.value,
    driverId: `${driverId.value}`,
    time: laptimeToAdd,
    locationId: activeLocation.value.id,
    stageId: activeStage.value.id,
    timestamp: new Date().getTime(),
    notes: ''
  })
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
              v-model="driverId" :clearable="false" @option:selected="saveSettingsToLocalStorage()">
            </v-select>
            <button class="__btn __success" @click="emit('showAddDriverModal')">Add Driver</button>
          </div>
          <div class="__formRow">
            <label>Car</label>
            <v-select class="__select" :options="carsByGroup" label="name" :reduce="(car: Car) => car.id" v-model="carId"
              :clearable="false" @option:selected="saveSettingsToLocalStorage()">
            </v-select>
          </div>
          <div class="__formRow">
            <label>Time</label>
            <LaptimeInput :value="laptime" @changed="time = $event" />
          </div>
          <div class="__formRow" v-if="websocketState !== WebsocketState.ESTABLISHED">
            <button class="__btn __success" :disabled="time === null" @click="add(time!)">
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

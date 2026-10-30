<script setup lang="ts">
import type { Car } from '@/model/Car';
import type { Driver } from '@/model/Driver';
import { WS_OPEN } from '@/model/websocket-constants';
import { useDataStore } from '@/stores/data';
import { useGameDataStore } from '@/stores/game-data';
import LaptimeUtil from '@/utils/LaptimeUtil';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
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

interface Props {
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false
})

const emit = defineEmits<{
  (e: 'showAddDriverModal'): void,
  (e: 'close'): void
}>()

const carsByGroup = computed(() => {
  return cars.value.filter(car => carGroupFilter.value === 'Any' || car.group === carGroupFilter.value)
})

const driverId = ref<string | undefined>(undefined)
const time = ref<string | null>(null)
const carId = ref<number | undefined>(undefined)
const pendingTelemetry = ref(false)
const telemetryConsumed = ref(false)

const loadSettingsFromLocalStorage = () => {
  const settings = localStorage.getItem('settings')
  if (!settings) return
  try {
    const saved = JSON.parse(settings) as { driverId?: string; carId?: number }
    if (saved.driverId) driverId.value = saved.driverId
    if (saved.carId !== undefined && carsByGroup.value.some(car => car.id === saved.carId)) {
      carId.value = saved.carId
    }
  } catch {
    // Ignore malformed settings and fall back to the first available driver/car.
  }
}

loadSettingsFromLocalStorage()

// Keep selections valid once the API data arrives or the car group changes.
watch(drivers, driverList => {
  if (driverList.length === 0) return
  if (!driverList.some(driver => driver.id === driverId.value)) {
    driverId.value = driverList[0].id
  }
}, { immediate: true })

watch(carsByGroup, groupCars => {
  if (!groupCars.some(car => car.id === carId.value)) {
    carId.value = groupCars[0]?.id
  }
}, { immediate: true })

watch([finishedSuccessfully, () => props.active], ([finished, active]) => {
  if (!finished) {
    telemetryConsumed.value = false
    pendingTelemetry.value = false
    return
  }
  if (!active || telemetryConsumed.value || laptime.value <= 0) return
  // Telemetry only pre-fills the time; the user still confirms with the Add button.
  time.value = LaptimeUtil.dateToLaptime(new Date(laptime.value * 1000))
  pendingTelemetry.value = true
})

watch(() => props.active, active => {
  if (!active) pendingTelemetry.value = false
})

const saveSettingsToLocalStorage = () => {
  localStorage.setItem('settings', JSON.stringify({ driverId: driverId.value, carId: carId.value }))
}

const add = (laptimeToAdd: string | null) => {
  if (!laptimeToAdd || !activeStage.value || !activeLocation.value) { return }
  if (driverId.value === undefined || carId.value === undefined) { return }
  addLaptime({
    carId: carId.value,
    driverId: driverId.value,
    time: laptimeToAdd,
    locationId: activeLocation.value.id,
    stageId: activeStage.value.id,
    timestamp: new Date().getTime(),
    notes: ''
  })
  saveSettingsToLocalStorage()
  if (pendingTelemetry.value) telemetryConsumed.value = true
  pendingTelemetry.value = false
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
          <div class="__formRow" v-if="websocketState !== WS_OPEN || pendingTelemetry">
            <button class="__btn __success" :disabled="!time" @click="add(time)">
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

<script setup lang="ts">
import type { Car } from '@/model/Car';
import type { Driver } from '@/model/Driver';
import type { Laptime } from '@/model/Laptime';
import { useDataStore } from '@/stores/data'
import { storeToRefs } from 'pinia'
import { ref, computed, watch } from 'vue'
import LaptimeInput from '../LaptimeInput.vue'


// store
const store = useDataStore()

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

const emit = defineEmits<(e: 'close') => void>()

const driverId = ref(drivers.value[0].id)
const time = ref<string | null>(null)
const carId = ref(0)

const carsByGroup = computed(() => {
  return cars.value.filter(car => carGroupFilter.value === 'Any' || car.group === carGroupFilter.value)
})

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
        <div class="__form">
          <div class="__formRow">
            <label>Driver</label>
            <v-select class="__select" :options="drivers" label="name" :reduce="(driver: Driver) => driver.id"
              v-model="driverId" :clearable="false">
            </v-select>
          </div>
          <div class="__formRow">
            <label>Car</label>
            <v-select class="__select" :options="carsByGroup" label="name" :reduce="(car: Car) => car.id" v-model="carId"
              :clearable="false">
            </v-select>
          </div>
          <div class="__formRow">
            <label>Time</label>
            <LaptimeInput @changed="time = $event" />
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
.__backdrop {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}

.__modal {
  text-align: center;
  padding: 1rem;
  width: 20vw;
  background-color: rgb(117, 117, 117);
  border-radius: 0.3rem;

  h2 {
    margin-top: 0;
  }

  .__formRow {
    display: flex;
    flex-direction: column;
    margin: 2rem 0;

    label {
      font-size: 1.2rem;
      display: block;
      margin-bottom: 0.5rem;
    }
  }
}
</style>

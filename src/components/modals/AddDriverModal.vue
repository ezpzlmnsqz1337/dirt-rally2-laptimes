<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { ref } from 'vue';


// store
const store = useDataStore()

const {
  addDriver,
} = store

const emit = defineEmits<(e: 'close') => void>()

const name = ref('')

const add = () => {
  addDriver(name.value)
  name.value = ''
  emit('close')
}

</script>

<template>
  <div class="__backdrop" @click="emit('close')">
      <div class="__modal" @click.stop="">
        <div>
          <h2>Add Driver</h2>
        </div>
        <div class="__body">
          <div class="__form">
            <div class="__formRow">
              <label>Name</label>
              <input type="text" v-model="name" />
            </div>
            <div class="__formRow">
              <button class="__btn __success" :disabled="name.length < 3" @click="add()">
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

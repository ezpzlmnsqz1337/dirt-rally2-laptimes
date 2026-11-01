<script setup lang="ts">
import { useDataStore } from '@/stores/data';
import { useModalFocus } from '@/utils/useModalFocus';
import { computed, ref } from 'vue';


interface Props {
  active?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  active: false
})

// store
const store = useDataStore()

const {
  addDriver,
} = store

const emit = defineEmits<(e: 'close') => void>()

const dialogRef = ref<HTMLElement | null>(null)
useModalFocus(dialogRef, () => emit('close'), computed(() => props.active))

const name = ref('')
const saveError = ref<string | null>(null)

const add = async () => {
  saveError.value = null
  try {
    await addDriver(name.value)
  } catch (error) {
    saveError.value = 'Could not add the driver. Check the connection and try again.'
    console.error('Failed to add driver:', error)
    return
  }
  name.value = ''
  emit('close')
}

</script>

<template>
  <div class="__backdrop" @click="emit('close')">
      <div ref="dialogRef" class="__modal" role="dialog" aria-modal="true" aria-label="Add driver" tabindex="-1" @click.stop="">
        <div>
          <h2>Add Driver</h2>
        </div>
        <div class="__body">
          <div class="__form">
            <div class="__formRow">
              <label for="add-driver-name">Name</label>
              <input id="add-driver-name" type="text" v-model="name" />
            </div>
            <div class="__formRow" v-if="saveError">
              <p class="__error" role="alert">{{ saveError }}</p>
            </div>
            <div class="__formRow">
              <button type="button" class="__btn __primary" :disabled="name.length < 3" @click="add()">
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

<script setup lang="ts">
import LaptimeUtil from '@/utils/LaptimeUtil'
import { ref, computed, onMounted, watch } from 'vue'

export interface Props {
  value?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  value: 0,
  disabled: false
})

const emit = defineEmits<{
  (e: 'changed', laptime: string | null): void
}>()


const minutes= ref('')
const seconds = ref('')
const milliseconds = ref('')
const laptimeError = ref(false)
const minutesRef = ref(null)
const secondsRef = ref(null)
const millisecondsRef = ref(null)

const valid = computed(() => {
  return laptime.value && !laptimeError.value
})

const laptime = computed(() => {
  const [m, s, ms] = [minutes, seconds, milliseconds].map(x => x.value)
  if (!m || !s || !ms) return

  return LaptimeUtil.isLaptimeValid(m, s, ms) ? LaptimeUtil.laptimeFromComponents(m, s, ms) : undefined
})

watch(() => props.value, newLaptime => {
  if(newLaptime) {
    setLaptime(newLaptime)
  }
})

onMounted(() => {
  if (props.value) {
    setLaptime(props.value)
  }
})

const onLaptimeInputKeyDown = (e: any, leftInput: HTMLInputElement | null, rightInput?: HTMLInputElement | null)  => {
  if (e.key === 'ArrowRight') {
    if (!rightInput) return
    const ri = rightInput
    if (e.target.selectionStart === e.target.value.length) {
      ri.selectionStart = 0
      ri.focus()
    }
  } else if (e.key === 'ArrowLeft') {
    if (!leftInput) return
    const li = leftInput
    if (e.target.selectionStart === 0) {
      li.selectionStart = li.value.length
      li.focus()
    }
  }
}

const onLaptimeInput = () => {
  validateLaptimeFormat()
  if (!laptimeError.value) {
    const [m, s, ms] = [minutes, seconds, milliseconds].map(x => x.value)
    emit('changed', LaptimeUtil.laptimeFromComponents(m, s, ms))
  } else {
    emit('changed', null)
  }
}

const setLaptime = (laptime: number) => {
  const d = new Date(laptime*1000)
  minutes.value = `${d?.getMinutes()}`
  seconds.value = `${d?.getSeconds()}`.padStart(2, '0')
  milliseconds.value = `${d?.getMilliseconds()}`.padStart(3, '0')
  onLaptimeInput()
}

const validateLaptimeFormat = () => {
  laptimeError.value = !laptime.value || laptime.value.match(/^\d{1,2}:\d{2}.\d{3}$/) === null
}

defineExpose({
  valid
})
</script>

<template>
  <div
    class="__laptimeInputs"
    :class="{__error: !valid}"
  >
    <input
      ref="minutesRef"
      v-model="minutes"
      tabindex="1"
      type="text"
      maxlength="2"
      class="__minutes"
      placeholder="0"
      :disabled="disabled"
      @keydown="onLaptimeInputKeyDown($event, null, secondsRef)"
      @input="onLaptimeInput()"
    >
    <div class="__colon">
      :
    </div>
    <input
      ref="secondsRef"
      v-model="seconds"
      tabindex="2"
      maxlength="2"
      type="text"
      class="__seconds"
      placeholder="00"
      :disabled="disabled"
      @keydown="onLaptimeInputKeyDown($event, minutesRef, millisecondsRef)"
      @input="onLaptimeInput()"
    >
    <div class="__dot">
      .
    </div>
    <input
      ref="millisecondsRef"
      v-model="milliseconds"
      tabindex="3"
      maxlength="3"
      type="text"
      class="__milliseconds"
      placeholder="000"
      :disabled="disabled"
      @keydown="onLaptimeInputKeyDown($event, secondsRef, null)"
      @input="onLaptimeInput()"
    >
  </div>
</template>

<style lang="scss" scoped>
.__laptimeInputs {
  border-radius: 0.3rem;
  display: flex;
  width: 100%;

  .__minutes {
    width: 100%;
    text-align: right;
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    padding-right: 0.3rem;
  }

  .__seconds {
    width: 3.1rem;
    border-right: 0;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    text-align: center;
    padding-left: 0.3rem;
    padding-right: 0.3rem;
  }

  .__milliseconds {
    width: 100%;
    border-left: 0;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    padding-left: 0.3rem;
  }

  .__colon, .__dot {
    background-color: white;
    color: black;
    font-size: 2rem;
    padding-top: 0.45rem;
    border-top: 0.1rem solid black;
    border-bottom: 0.1rem solid black;
  }

  &.__error {
    .__minutes {
      border: 0.15rem solid red;
      color: red;
      border-right: none;
    }
    .__seconds,  .__colon,  .__dot {
      border: 0.15rem solid red;
      color: red;
      border-right: none;
      border-left: none;
    }

    .__milliseconds {
      border: 0.15rem solid red;
      color: red;
      border-left: none;
    }
  }
}
</style>

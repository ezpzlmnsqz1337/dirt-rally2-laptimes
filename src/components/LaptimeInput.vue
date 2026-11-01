<script setup lang="ts">
import LaptimeUtil from '@/utils/LaptimeUtil'
import { ref, computed, getCurrentInstance, onMounted, watch } from 'vue'

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

// Unique per instance: AddLaptime and EditLaptime can be mounted together.
const hintId = `laptime-hint-${getCurrentInstance()?.uid ?? 0}`

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
    role="group"
    aria-label="Lap time"
  >
    <input
      ref="minutesRef"
      v-model="minutes"
      type="text"
      maxlength="2"
      class="__minutes"
      aria-label="Lap time minutes"
      :aria-describedby="hintId"
      :aria-invalid="!valid"
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
      maxlength="2"
      type="text"
      class="__seconds"
      aria-label="Lap time seconds"
      :aria-describedby="hintId"
      :aria-invalid="!valid"
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
      maxlength="3"
      type="text"
      class="__milliseconds"
      aria-label="Lap time milliseconds"
      :aria-describedby="hintId"
      :aria-invalid="!valid"
      placeholder="000"
      :disabled="disabled"
      @keydown="onLaptimeInputKeyDown($event, secondsRef, null)"
      @input="onLaptimeInput()"
    >
    <span :id="hintId" class="__hint">Use minutes:seconds.milliseconds</span>
  </div>
</template>

<style lang="scss" scoped>
.__laptimeInputs {
  border-radius: var(--radius-sm);
  display: flex;
  width: 100%;
  font-variant-numeric: tabular-nums;

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
    background-color: var(--surface-raised);
    color: var(--muted);
    font-size: 1.5rem;
    padding-top: 0.35rem;
    border-top: 1px solid var(--line-strong);
    border-bottom: 1px solid var(--line-strong);
  }

  .__hint {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  &.__error {
    .__minutes {
      border: 1px solid var(--danger);
      color: var(--danger);
      border-right: none;
    }
    .__seconds,  .__colon,  .__dot {
      border: 1px solid var(--danger);
      color: var(--danger);
      border-right: none;
      border-left: none;
    }

    .__milliseconds {
      border: 1px solid var(--danger);
      color: var(--danger);
      border-left: none;
    }
  }
}
</style>

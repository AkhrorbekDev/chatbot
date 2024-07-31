<script setup lang="ts">
import {ref, computed, onMounted, onUnmounted} from 'vue'
import type {PropType} from 'vue'
import {Mask} from 'maska'

type PhoneCodes = {
  [key: string]: {
    mask: string
    placeholder: string
  }
}

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  modelModifiers: {
    type: Object,
    default: () => ({})
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  code: {
    type: String,
    default: '+998'
  },
  loading: {
    type: Boolean,
    default: false
  },
  maskedValue: {
    type: Boolean,
    default: true
  },
  phoneCodes: {
    type: Object as PropType<PhoneCodes>,
    default: () => ({})
  },
  disabled: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['select:code', 'update:model-value', 'on:input', 'on:keydown'])
const _phoneCodes = ref({
  '+998': {
    mask: '## ### ## ##',
    placeholder: '(__) ___ __ __',
    validationLength: 9
  }
  // '+971': '## ### ## ##',
  // '+7': '### ### ## ##',
  // '+90': '### ### ## ##',
  // '+852': '#### ####'
})
const openMenu = ref(false)
const selectMenu = ref()
const selectedCode = computed({
  get: () => {
    return props.code
  },
  set: (val) => {
    return val
  }
})
const _disabled = computed(() => {
  return props.disabled || props.loading
})

let mask: Mask = new Mask({mask: _phoneCodes.value[selectedCode.value]?.mask || _phoneCodes.value[props.code]?.mask || '## ### ## ##'})

const inputVal = computed(() => {
  return encodeValue(props.modelValue)
})


function selectCode(e: string) {
  selectedCode.value = e
  emit('select:code', e)
  mask = new Mask({mask: _phoneCodes.value[e]?.mask})
}

function encodeValue(val: string) {
  return mask.masked(val)
}

function decodeValue(val: string) {
  return mask.unmasked(val)
}

function clickOutSide(event: any) {
  const menu = selectMenu.value
  const clickInside = menu?.contains(event.target)
  if (!clickInside) {
    openMenu.value = false
  }
}

function onMaska(e: CustomEvent) {
  if (props.loading) return
  emit('update:model-value', props.maskedValue ? e.detail.masked : e.detail.unmasked)
}

function openList() {
  if (openMenu.value) {
    openMenu.value = false
    document?.removeEventListener('click', clickOutSide)
  } else if (!props.disabled) {
    openMenu.value = true
    document.addEventListener('click', clickOutSide)
  }
}

onMounted(() => {
  _phoneCodes.value = {..._phoneCodes.value, ...props.phoneCodes}
})

onUnmounted(() => {
  document?.removeEventListener('click', clickOutSide)
})

defineExpose({
  selectedCode,
  _phoneCodes,
  encodeValue,
  decodeValue
})
</script>

<template>
  <div class="phone-input">
    <span
        v-if="label"
        class="label"
    >
      {{ label }}
    </span>
    <div class="phone-input__wrapper">
      <div
          ref="selectMenu"
          class="phone-input__prefix"
          @click="openList"
      >
        <div class="phone-input__prefix-value">
          {{ selectedCode }}
        </div>
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            class="icon"
            :style="openMenu ? {transform: 'rotate(-180deg)'} : ''"
        >
          <path
              d="M12.7105 15.54L18.3605 9.87998C18.4542 9.78702 18.5286 9.67642 18.5793 9.55456C18.6301 9.4327 18.6562 9.30199 18.6562 9.16998C18.6562 9.03797 18.6301 8.90726 18.5793 8.78541C18.5286 8.66355 18.4542 8.55294 18.3605 8.45998C18.1731 8.27373 17.9196 8.16919 17.6555 8.16919C17.3913 8.16919 17.1378 8.27373 16.9505 8.45998L11.9505 13.41L7.00045 8.45998C6.81309 8.27373 6.55964 8.16919 6.29545 8.16919C6.03127 8.16919 5.77781 8.27373 5.59045 8.45998C5.49596 8.5526 5.42079 8.66304 5.3693 8.78492C5.3178 8.90679 5.291 9.03767 5.29045 9.16998C5.291 9.30229 5.3178 9.43317 5.3693 9.55505C5.42079 9.67692 5.49596 9.78737 5.59045 9.87998L11.2405 15.54C11.3341 15.6415 11.4477 15.7225 11.5742 15.7779C11.7007 15.8333 11.8373 15.8619 11.9755 15.8619C12.1136 15.8619 12.2502 15.8333 12.3767 15.7779C12.5032 15.7225 12.6168 15.6415 12.7105 15.54Z"
              fill="#111111"
          />
        </svg>
        <div
            v-show="openMenu"
            class="phone-input__prefix-list"
        >
          <div
              v-for="(_, index) in _phoneCodes"
              :key="index"
              class="phone-input__prefix-item"
              @click="selectCode(index)"
          >
            {{ index }}
          </div>
        </div>
      </div>
      <input
          v-maska
          :value="inputVal"
          :data-maska="_phoneCodes[selectedCode]?.mask || _phoneCodes['+998']?.mask"
          type="tel"
          class="input _phone"
          :placeholder="placeholder || _phoneCodes[selectedCode]?.placeholder"
          :disabled="_disabled"
          name="phone"
          @keydown.enter="$emit('on:keydown')"
          @input="$emit('on:input', $event)"
          @maska="onMaska"
      >
      <div
          v-if="loading"
          class="animate-bg"
      >
        <svg
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            class="animate-spin"
        >
          <circle
              class=""
              cx="12"
              cy="12"
              r="10"
              stroke="var(--red)"
              stroke-width="4"
          />
          <path
              fill="#ddd"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style  lang="scss">
@import "../assets/scss/phone-input.scss";
</style>

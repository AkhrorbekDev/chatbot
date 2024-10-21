<script setup>
import {computed, ref} from "vue";

const input = ref(null)
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const model_value = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function resizeInput(e) {
  const targetHeight = e.target.getClientRects()[0]?.height
  console.log(e.target.getClientRects())
  if (!e.target.value) {
    e.target.style.height = 'auto';
  } else if (targetHeight < 164) {
    e.target.style.height = (e.target.scrollHeight) + 'px';
  }
}

defineExpose({
  clear() {
    input.value.value = ''
  }
})
</script>

<template>
  <textarea ref="input" v-model="model_value" @input="resizeInput" class="base-input chat-bot-input" />
<!--  <textarea ref="input" v-model="model_value" class="base-input chat-bot-input" wrap="soft" rows="4" />-->
<!--  <div ref="input" class="base-input chat-bot-input" contenteditable="true" @input="onInput" />-->
</template>

<style scoped lang="scss">
@use "@/assets/scss/components/input";

//[contenteditable=true]:empty:before {
//  content: attr(placeholder);
//  pointer-events: none;
//  display: block; /* For Firefox */
//}
</style>

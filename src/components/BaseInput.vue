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

// function onInput(e) {
//   console.log('onInput', e.target.innerText);
//   model_value.value = e.target.innerText
// }

defineExpose({
  clear() {
    input.value.value = ''
  }
})
</script>

<template>
  <input ref="input" v-model="model_value" class="base-input chat-bot-input" type="text"/>
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

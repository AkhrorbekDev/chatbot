<script setup>
import {computed} from "vue";

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
</script>

<template>
  <input v-model="model_value" class="base-input chat-bot-input" type="text"/>
</template>

<style scoped lang="scss">
@use "@/assets/scss/components/input";

</style>

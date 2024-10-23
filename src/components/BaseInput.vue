<script setup>
import {computed, ref} from "vue";

const input = ref(null)
const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  }
})

const emit = defineEmits(['update:modelValue', 'on:submit'])

const model_value = computed({
  get: () => props.modelValue,
  set: (val) => {
    let value = val
    value = value.replace(/[\n\t&<>"']/g, function (match) {
      switch (match) {
        case '\n':
        case '\t':
          return ' '; // Replace newline and tab with a space
        case '&':
          return '&amp;';
        case '<':
          return '&lt;';
        case '>':
          return '&gt;';
        case '"':
          return '&quot;';
        case "'":
          return '&#039;';
        default:
          return match;
      }
    });
    if (!value) {
      return
    }
    emit('update:modelValue', value)
  }
})
const holdEnter = ref(false)

function resizeInput(e) {
  let value = e.target.value
  value = value.replace(/[\n\t&<>"']/g, function (match) {
    switch (match) {
      case '\n':
      case '\t':
        return ' '; // Replace newline and tab with a space
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#039;';
      default:
        return match;
    }
  });
  const targetHeight = input.value.getClientRects()[0]?.height
  console.log(e.target.value.length, 'input.value.value')
  if (!value) {
    input.value.style.height = 'auto';
  } else if (targetHeight < 164) {
    input.value.style.height = (input.value.scrollHeight) + 'px';
  }
}


function clear(e) {
  e.target.value = ''
}


function disableSubmitEnter(e) {
  holdEnter.value = true
}

function enableSubmitEnter(e) {
  holdEnter.value = false
}

function updateModelValue(e) {
  model_value.value = e.target.value
  if (e.code === 'Enter' || e.code === 'Backspace' || e.code === 'Delete') {
    e.preventDefault()
    console.log(holdEnter.value, 'holdEnter')
    if (e.code === 'Enter' && !holdEnter.value) {
      emit('on:submit', e)
      e.target.value = ''
      input.value.style.height = 'auto';
    } else {
      resizeInput(e)
    }
  } else {
    resizeInput(e)
  }
}

defineExpose({
  clear() {
    input.value.value = ''
  }
})
</script>

<template>
  <template v-if="type === 'textarea'">
    <textarea
        ref="input"
        v-model="model_value"
        @input="resizeInput"
        class="base-input chat-bot-input"/>
  </template>
  <template v-else>
    <input ref="input" v-model="model_value" type="text" class="base-input chat-bot-input"/>
  </template>
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

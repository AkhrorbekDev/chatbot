<script setup>

import BaseInput from "@/components/BaseInput.vue";
import {ref} from "vue";

const message = ref('');
const emit = defineEmits(['send:message'])
const returnMessage = (e) => {
  console.log(e);
  let value = message.value
  value = value.replace(/[\n\t&<>"']/g, function (match) {
    switch (match) {
      case '\n':
      case '\t':
        return ''; // Replace newline and tab with a space
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
  if (value && value.length > 0) {
    emit('send:message', {message: value})
    e.target.value = ''
    message.value = ''
  }
}

</script>

<template>
  <div class="chat-area-footer">
    <!--    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round" class="feather feather-video">
          <path d="M23 7l-7 5 7 5V7z"/>
          <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round" class="feather feather-image">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="M21 15l-5-5L5 21"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round" class="feather feather-plus-circle">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 8v8M8 12h8"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round" class="feather feather-paperclip">
          <path
              d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>
        </svg>-->
    <BaseInput v-model="message" @keydown.enter="returnMessage" type="textarea" rows="1"
               placeholder="Написать сообщение..."/>
    <!--    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round" class="feather feather-smile">
          <circle cx="12" cy="12" r="10"/>
          <path d="M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"
             stroke-linecap="round" stroke-linejoin="round" class="feather feather-thumbs-up">
          <path
              d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"/>
        </svg>-->
    <button class="send-text" :class="{'send-text-active': message.length}" @click="returnMessage">
      <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M2.35853 9.01594L1.14654 13.046C0.380553 15.593 2.86709 17.8673 5.112 16.6729L14.431 11.715C16.5212 10.6029 16.5235 7.4241 14.4348 6.30862L5.11093 1.32915C2.86721 0.13088 0.377132 2.40233 1.14065 4.95083L2.35853 9.01594ZM2.35853 9.01594H5.32953"
            stroke="#999999"
            stroke-width="1.5"
            stroke-linecap="round"/>
      </svg>
    </button>
  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/components/footer";
@use "@/assets/scss/components/input";
</style>

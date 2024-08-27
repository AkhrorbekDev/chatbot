<script setup lang="ts">

import {Message} from "@/types";
import {PropType} from "vue";

defineProps({
  message: {
    type: Object as PropType<Message>,
    default: () => ({})
  }
})

</script>

<template>
  <div class="chat-msg" :class="{owner: message.user && message.user.owner}">
    <!-- <div class="chat-msg-profile" v-if="message.user"> -->
      <!-- <img class="chat-msg-img" :src="message.user?.avatar" alt=""/> -->
    <!-- </div> -->
    
    <div class="chat-msg-wrapper">
    <div class="chat-msg-content" v-if="message?.content">  
      <div v-if="$slots.default" class="chat-msg-text">
        <slot/>
      </div>
      <div class="chat-msg-date">
        {{ message.created_at?.slice(11, 16) || message.created_at }}
      </div>
    </div>
    <div v-if="$slots.actions" class="chat-msg-actions">
        <slot name="actions"></slot>
    </div>
  </div>

  </div>
</template>

<style scoped lang="scss">
@use "@/assets/scss/components/message-wrapper";
</style>

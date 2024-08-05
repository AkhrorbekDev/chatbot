<script setup lang="ts">

defineProps({
  message: {
    type: Object,
    default: () => ({})
  }
})

</script>

<template>
  <div class="chat-msg">
    <div class="chat-msg-profile">
      <img class="chat-msg-img"
           :src="message.user?.avatar"
           alt=""/>
      <div class="chat-msg-date">{{ message.created_at }}</div>
    </div>
    <div class="chat-msg-content">
      <slot></slot>
      <div v-if="$slots.actions" class="chat-msg-actions">
        <slot name="actions"></slot>
      </div>
    </div>
  </div>

</template>

<style scoped lang="scss">
@use "@/assets/scss/components/message-wrapper";
</style>

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
      <img class="chat-msg-img" src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png"
           alt=""/>
      <div class="chat-msg-date">Message seen 1.22pm</div>
    </div>
    <div class="chat-msg-content">
     <slot></slot>
    </div>

  </div>

</template>

<style  lang="scss">
@use "@/assets/scss/components/message-wrapper";
</style>

<script setup>

import ChatBot from "@/components/ChatBot.vue";
import ChatHeader from "@/components/ChatHeader.vue";
</script>

<template>
  <div class="app">
    <ChatHeader/>
    <ChatBot></ChatBot>
  </div>
</template>

<style scoped lang="scss">
.app {
  display: flex;
  flex-direction: column;
  background-color: var(--theme-bg-color);
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
}

</style>

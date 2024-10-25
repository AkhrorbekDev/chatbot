<script setup>
import {inject} from "vue";

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="close-operator-chat" :class="{ __active: show }">
    <p>
      Закрыть чат с оператором?
    </p>
  </div>
</template>

<style scoped lang="scss">
.close-operator-chat {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: var(--chat-text-bg);
  color: var(--body-color);
  padding: 10px;
  text-align: center;
  transition: all 0.3s;
  transform: translateY(-30%);
  opacity: 0;
  max-width: fit-content;
  margin: 0 auto;
  border-radius: 6px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.07), 0 2px 2px rgba(0, 0, 0, 0.07), 0 4px 4px rgba(0, 0, 0, 0.07), 0 8px 8px rgba(0, 0, 0, 0.07), 0 16px 16px rgba(0, 0, 0, 0.07);
  z-index: -1;
  cursor: pointer;

  &.__active {
    transform: translateY(0);
    opacity: 1;
    z-index: 20;
    bottom: 80px;

  }
}
</style>

<script setup>
import {inject} from "vue";

const alertOptions = inject('alertOptions');

</script>

<template>
  <div class="base-alert" :class="{ __active: alertOptions.open }">
    <p>{{ alertOptions.text }}</p>
  </div>
</template>

<style scoped lang="scss">
.base-alert {
  position: absolute;
  bottom: -60px;
  left: 0;
  right: 0;
  background-color: var(--chat-text-bg);
  color: var(--body-color);
  padding: 10px;
  text-align: center;
  transition: all 0.3s;
  transform: translateY(-30%);
  z-index: 1000;
  opacity: 0;
  max-width: 90%;
  margin: 0 auto;
  border-radius: 6px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.07), 0 2px 2px rgba(0, 0, 0, 0.07), 0 4px 4px rgba(0, 0, 0, 0.07), 0 8px 8px rgba(0, 0, 0, 0.07), 0 16px 16px rgba(0, 0, 0, 0.07);

  &.__active {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>

<script setup>

import MessageTemplate from "@/components/templates/MessageTemplate.vue";
import OrderDetailsTemplate from "@/components/templates/OrderDetailsTemplate.vue";
</script>

<template>
  <MessageTemplate class="order-details">
    <template #default>
      <OrderDetailsTemplate/>
    </template>
  </MessageTemplate>
</template>

<style scoped lang="scss">

</style>

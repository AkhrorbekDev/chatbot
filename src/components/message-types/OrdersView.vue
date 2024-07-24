<script setup>

import MessageTemplate from "@/components/templates/MessageTemplate.vue";
import OrderTemplate from "@/components/templates/OrderTemplate.vue";
import ActionButton from "@/components/ActionButton.vue";
import EmptyMessageTemplate from "@/components/templates/EmptyMessageTemplate.vue";
</script>

<template>
  <EmptyMessageTemplate class="orders-view">
    <MessageTemplate>
      <template #default>
        <OrderTemplate/>
      </template>

      <template #actions>
        <ActionButton>
          <template #label>
            Pay
          </template>
        </ActionButton>
        <ActionButton>
          <template #label>
            More details
          </template>
        </ActionButton>
      </template>
    </MessageTemplate>
    <MessageTemplate>
      <template #default>
        <OrderTemplate/>
      </template>

      <template #actions>
        <ActionButton>
          <template #label>
            Pay
          </template>
        </ActionButton>
        <ActionButton>
          <template #label>
            More details
          </template>
        </ActionButton>
      </template>
    </MessageTemplate>
  </EmptyMessageTemplate>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">

import MessageTemplate from "@/components/templates/MessageTemplate.vue";
import OrderTemplate from "@/components/templates/OrderTemplate.vue";
import ActionButton from "@/components/ActionButton.vue";
import EmptyMessageTemplate from "@/components/templates/EmptyMessageTemplate.vue";
import {PropType} from "vue";
import {OrderViewMessage} from "@/types";
import {createOrderDTO} from "@/core/DTO";

defineProps({
  message: {
    type: Object as PropType<OrderViewMessage>,
    default: () => []
  }
})
</script>

<template>
  <EmptyMessageTemplate :message="message" class="orders-view">
    <MessageTemplate
        v-for="order in message.orders"
        :key="order.id"
        :message="message"
        class="order-template"
    >
      <template #default>
        <OrderTemplate :order="createOrderDTO(order)" />
      </template>

      <template #actions v-if="order.actions?.length > 0">
        <ActionButton :action="action" v-for="action in order.actions" @on:action="$emit('on:action', action)">
          <template #label>
            {{ action.text }}
          </template>
          <template #img>
            <template v-if="action.icon">
              <img :src="action.icon" alt="icon" />
            </template>
          </template>
        </ActionButton>
      </template>
    </MessageTemplate>
  </EmptyMessageTemplate>
</template>

<style scoped lang="scss">
.orders-view {
  :deep(.chat-msg-content) {
    display: flex;
    flex-direction: column;

    .chat-msg-wrapper {
      width: 100%;
    }
  }
}

</style>

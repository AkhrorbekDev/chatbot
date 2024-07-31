<script setup lang="ts">

import MessageTemplate from "@/components/templates/MessageTemplate.vue";
import OrderDetailsTemplate from "@/components/templates/OrderDetailsTemplate.vue";
import ActionButton from "@/components/ActionButton.vue";
import {OrderDetailsMessage} from "@/types";
import {PropType} from "vue";

defineProps({
  message: {
    type: Object as PropType<OrderDetailsMessage>,
    default: () => ({})
  }

})
</script>

<template>
  <MessageTemplate :message="message" class="order-details">
    <template #default>
      <OrderDetailsTemplate :order="message.order"/>
    </template>
    <template #actions>
      <ActionButton :action="action" v-for="action in message.actions" @on:action="$emit('on:action', action)">
        <template #label>
          {{ action.text }}
        </template>
        <template #img>
          <template v-if="action.icon">
            <img :src="action.icon"/>
          </template>
        </template>
      </ActionButton>
    </template>
  </MessageTemplate>
</template>

<style  lang="scss">

</style>

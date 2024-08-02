<script setup lang="ts">

import MessageTemplate from "@/components/templates/MessageTemplate.vue";
import ProductTemplate from "@/components/templates/ProductTemplate.vue";
import AddToCartActions from "@/components/AddToCartActions.vue";
import {ProductMessage} from "@/types";
import {PropType} from "vue";
import ActionButton from "@/components/ActionButton.vue";

defineProps({
  message: {
    type: Object as PropType<ProductMessage>,
    default: () => ({})
  }
})
</script>

<template>
  <MessageTemplate :message="message" class="product-template">
    <ProductTemplate :product="message.product"></ProductTemplate>
    <template #actions>
      <template v-for="action in message.actions" :key="action.type">
        <template v-if="action.type === 'add_to_cart'">
          <AddToCartActions :action="action" @on:action="$emit('on:action', action)"/>
        </template>
        <template v-else>
          <ActionButton :action="{...action, type: 'redirect'}" @on:action="$emit('on:action', action)">
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
      </template>
    </template>
  </MessageTemplate>
</template>

<style scoped lang="scss">

</style>

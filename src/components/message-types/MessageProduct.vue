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
          <AddToCartActions />
        </template>
        <template v-else>
          <ActionButton />
        </template>
      </template>
    </template>
  </MessageTemplate>
</template>

<style scoped lang="scss">

</style>

<script setup lang="ts">

import MessageTemplate from "@/components/templates/MessageTemplate.vue";
import ProductTemplate from "@/components/templates/ProductTemplate.vue";
import AddToCartActions from "@/components/AddToCartActions.vue";
import {ProductMessage} from "@/types";
import {PropType} from "vue";

defineProps({
  message: {
    type: Object as PropType<ProductMessage>,
    default: () => ({})
  }
})
</script>

<template>
  <MessageTemplate class="product-template">
    <ProductTemplate></ProductTemplate>
    <template #actions>
      <AddToCartActions/>
    </template>
  </MessageTemplate>
</template>

<style scoped lang="scss">

</style>

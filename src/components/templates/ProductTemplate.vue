<script setup lang="ts">

import {PropType} from "vue";
import {Product} from "@/types";
import FeaturesTemplate from "@/components/templates/FeaturesTemplate.vue";

defineProps({
  product: {
    type: Object as PropType<Product>,
    default: () => ({})
  },
})
</script>

<template>
  <div class="product-template">
    <div v-if="product.image" class="product-template-image">
      <img
          class="product-template-img"
          :src="product.image"
          :alt="product.name"/>
    </div>
    <div class="product-template-content">
      <p class="product-template-title">
        {{ product.name }}
      </p>
      <p v-if="product.description" class="product-template-description">
        {{ product.description }}
      </p>
      <FeaturesTemplate v-if="product.features" :features="product.features"></FeaturesTemplate>
      <p v-if="product.price" class="product-template-price">
        <span class="product-template-price__label">Цена:</span> {{ product.price?.toLocaleString('en-US').replace(/,/g, ' ')}} сум
      </p>
    </div>

  </div>
</template>

<style scoped lang="scss">
.product-template {
  display: flex;
  flex-direction: column;
  gap: 20px;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  }

  &-image {
    width: 100%;
    height: 300px;
    border-radius: 10px;
    overflow: hidden;
  }

  &-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 10px 16px;
    color: var(--chat-text-color);
  }


  &-actions {
    display: flex;
    gap: 10px;
  }

}
</style>

<script setup lang="ts">

import {PropType} from "vue";
import {Product} from "@/types";
import FeaturesTemplate from "@/components/templates/FeaturesTemplate.vue";

defineProps({
  product: {
    type: Object as PropType<Product>,
    default: () => ({})
  },
  isExist: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="product-template">
    <div class="product-template-image">
      <img
          class="product-template-img"
          src="https://olcha.uz/image/original/products/cdn_1/supplier/stores/1/2024-06-24/B1sstxZM8xJNQz63joKdoUbYOi0pyMZoRvRBrL9r7FXX8SC3vmeiqFqQBOfa.jpg"
          alt=""/>
    </div>
    <div class="product-template-content">
      <p class="product-template-title">
        Redmi 13C (Бывший в употреблении) Midnight Black 8/256 GB
      </p>
      <p class="product-template-description">
        Redmi 13C заслуживает внимания тех, кто ищет решение со средней ценой и высокими производительными
        характеристиками.
      </p>
      <FeaturesTemplate></FeaturesTemplate>
      <p class="product-template-price">
        <span class="product-template-price__label">💰Цена:</span> 1 000 000 сум
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
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  }

  &-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 0 10px 16px;
    color: var(--white);
  }


  &-actions {
    display: flex;
    gap: 10px;
  }

}
</style>

<script setup lang="ts">

import {PropType} from "vue";
import {Product} from "@/types";

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
      <ul class="product-template-features">
        <li class="product-template-features__row">
          <div class="product-template-features__col">
            <span class="product-template-features__key">Количество и тип SIM-карты</span>
          </div>
          <div class="product-template-features__col">
            <span class="product-template-features__value">2 (Nano Sim)</span>
          </div>
        </li>
        <li class="product-template-features__row">
          <div class="product-template-features__col">
            <span class="product-template-features__key">Количество и тип SIM-карты</span>
          </div>
          <div class="product-template-features__col">
            <span class="product-template-features__value">2 (Nano Sim)</span>
          </div>
        </li>
        <li class="product-template-features__row">
          <div class="product-template-features__col">
            <span class="product-template-features__key">Количество и тип SIM-карты</span>
          </div>
          <div class="product-template-features__col">
            <span class="product-template-features__value">2 (Nano Sim)</span>
          </div>
        </li>
        <li class="product-template-features__row">
          <div class="product-template-features__col">
            <span class="product-template-features__key">Количество и тип SIM-карты</span>
          </div>
          <div class="product-template-features__col">
            <span class="product-template-features__value">2 (Nano Sim)</span>
          </div>
        </li>
        <li class="product-template-features__row">
          <div class="product-template-features__col">
            <span class="product-template-features__key">Количество и тип SIM-карты</span>
          </div>
          <div class="product-template-features__col">
            <span class="product-template-features__value">2 (Nano Sim)</span>
          </div>
        </li>
        <li class="product-template-features__row">
          <div class="product-template-features__col">
            <span class="product-template-features__key">Количество и тип SIM-карты</span>
          </div>
          <div class="product-template-features__col">
            <span class="product-template-features__value">2 (Nano Sim)</span>
          </div>
        </li>
      </ul>
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

  &-features {
    margin-top: 24px;

    &__row {
      display: flex;
      margin-bottom: 12px;
      width: 100%;
      justify-content: space-between;
    }

    &__col {
      align-items: baseline;
      color: #999;
      display: flex;
      flex: 0 0 1;
      font-size: 14px;
      font-weight: 500;
      line-height: 20px;
      padding-right: 20px;
      position: relative;
      text-align: start;

      &:before {
        border-bottom: 1px dashed #999;
        content: "";
        display: block;
        height: 20px;
        left: 0;
        position: absolute;
        top: -5px;
        width: 100%;
        z-index: 1;
      }

      span {
        background-color: var(--chat-text-bg);
        display: inline-block;
        padding-right: 6px;
        word-break: break-all;
        z-index: 2;
      }

      &:last-child {
        flex: 0 0 calc(40% - 20px);
        padding-right: 0;

        &:before {
          display: none;
        }

        span {
          padding-left: 6px;
          padding-right: 0;
        }
      }
    }

  }
}
</style>

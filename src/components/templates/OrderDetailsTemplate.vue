<script setup lang="ts">

import {Order} from "@/types";
import {PropType} from "vue";

defineProps({
  order: {
    type: Object as PropType<Order>,
    default: () => ({})
  }
})
</script>

<template>
  <div class="order-detail">
    <ul class="order-detail__items">
      <li class="order-detail__item">
        <p class="order-detail__item-header">
          Заказ:
        </p>
        <p class="order-detail__item-value">
          <b>#{{ order.id }}</b>
        </p>
      </li>
      <li class="order-detail__item __products">
        <p class="order-detail__item-header">
          Продукты:
        </p>
        <ol class="order-detail__item-value">
          <li v-for="product in order.products" :key="product.id">
            <p>{{ product.name }}</p>
            <p>{{ product.quantity }}x</p>
          </li>
        </ol>
      </li>
      <li class="order-detail__item">
        <p class="order-detail__item-header">
          Сумма:
        </p>
        <p class="order-detail__item-value">
          <b>{{ order.total_price }} сум</b>
        </p>
      </li>
      <li class="order-detail__item">
        <p class="order-detail__item-header">
          Долг:
        </p>
        <p class="order-detail__item-value">
          <b>{{ order.debt_price }} сум</b>
        </p>
      </li>
      <li class="order-detail__item">
        <p class="order-detail__item-header">
          Адрес:
        </p>
        <p class="order-detail__item-value">
          <b>{{ order.address }}</b>
        </p>
      </li>
      <li class="order-detail__item">
        <p class="order-detail__item-header">
          Дата:
        </p>
        <p class="order-detail__item-value">
          <b>{{ order.created_at }}</b>
        </p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">

</style>

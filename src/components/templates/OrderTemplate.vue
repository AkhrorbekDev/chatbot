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
  <div class="orders-view">
    <ul class="orders-view__items">
      <li class="order-detail__item">
        <p class="order-detail__item-header">
          Заказ:
        </p>
        <p class="order-detail__item-value">
          <b>{{ order.id }}</b>
        </p>
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
          Оплачено:
        </p>
        <p class="order-detail__item-value">
          <b>{{ order.payed }} сум</b>
        </p>
      </li>
      <li v-if="order.next_payment" class="order-detail__item">
        <p class="order-detail__item-header">
          Следующий платеж:
        </p>
        <p class="order-detail__item-value">
          <b>{{ order.next_payment }} сум</b>
        </p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.orders-view {
  &__items {
    display: flex;
    gap: 10px;
    flex-direction: column;
  }

}
</style>

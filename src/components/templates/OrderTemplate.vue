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
      <li class="orders-view__item">
        <p class="orders-view__id">
          Заказ: <b>{{ order.id }}</b>
        </p>
      </li>
      <li class="orders-view__item">
        <p class="orders-view__price">
          Сумма: <b>{{ order.total_price }} сум</b>
        </p>
      </li>
      <li class="orders-view__item">
        <p class="orders-view__debt">
          Долг: <b>{{order.debt_price}} сум</b>
        </p>
      </li>
      <li class="orders-view__item">
        <p class="orders-view__payed">
          Оплачено: <b>{{ order.payed }} сум</b>
        </p>
      </li>
      <li v-if="order.next_payment" class="orders-view__item">
        <p class="orders-view__next-payment">
          Следующий платеж: <b>{{ order.next_payment }}</b>
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

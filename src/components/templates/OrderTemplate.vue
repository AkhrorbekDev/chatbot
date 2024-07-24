<script setup>

</script>

<template>
  <div class="orders-view">
    <ul class="orders-view__items">
      <li class="orders-view__item">
        <p class="orders-view__id">
          Заказ: <b>123333</b>
        </p>
      </li>
      <li class="orders-view__item">
        <p class="orders-view__price">
          Сумма: <b>123 333 сум</b>
        </p>
      </li>
      <li class="orders-view__item">
        <p class="orders-view__debt">
          Долг: <b>123 333 сум</b>
        </p>
      </li>
      <li class="orders-view__item">
        <p class="orders-view__payed">
          Оплачено: <b>123 333 сум</b>
        </p>
      </li>
      <li class="orders-view__item">
        <p class="orders-view__next-payment">
          Следующий платеж: <b>28.08.2024</b>
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

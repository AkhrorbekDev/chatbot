<script setup>

</script>

<template>
  <div class="order-detail">
    <ul class="order-detail__items">
      <li class="order-detail__item">
        <p class="order-detail__item-header">
          Заказ:
        </p>
        <p class="order-detail__item-value">
          <b>123333</b>
        </p>
      </li>
      <li class="order-detail__item __products">
        <p class="order-detail__item-header">
          Продукты:
        </p>
        <ol class="order-detail__item-value">
          <li>
            <p>TV приставка Xiaomi TV Stick 4K</p>
          </li>
          <li>
            <p>TV приставка Xiaomi TV Stick 4K</p>
          </li>
          <li>
            <p>TV приставка Xiaomi TV Stick 4K</p>
          </li>
          <li>
            <p>TV приставка Xiaomi TV Stick 4K</p>
          </li>
        </ol>
      </li>
      <li class="order-detail__item">
        <p class="order-detail__item-header">
          Сумма:
        </p>
        <p class="order-detail__item-value">
          <b>123 333 сум</b>
        </p>
      </li>
      <li class="order-detail__item">
        <p class="order-detail__item-header">
          Долг:
        </p>
        <p class="order-detail__item-value">
          <b>123 333 сум</b>
        </p>
      </li>
      <li class="order-detail__item">
        <p class="order-detail__item-header">
          Адрес:
        </p>
        <p class="order-detail__item-value">
          <b>123 333 сум</b>
        </p>
      </li>
      <li class="order-detail__item">
        <p class="order-detail__item-header">
          Дата:
        </p>
        <p class="order-detail__item-value">
          <b>123 333 сум</b>
        </p>
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.order-detail {
  &__items {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;

    &:first-child {
      border-bottom: 1px solid #e0e0e0;
    }

    &.__products {
      display: block;

      ol {
        margin-left: 14px;
        margin-top: 14px;

        li {
          padding: 4px 0;
          list-style: circle;
          color: white;
        }
      }
    }
  }

  &__item-header {
    font-size: 14px;
    color: #9e9e9e;
  }

  &__item-value {
    font-size: 14px;
    color: #000;
  }
}
</style>

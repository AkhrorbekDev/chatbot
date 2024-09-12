<script setup lang="ts">
import {PropType} from "vue";
import {ProductFeature} from "@/types";

defineProps({
  features: {
    type: Array as PropType<ProductFeature[]>,
    default: () => []
  }
})
</script>

<template>
  <ul class="product-template-features">
    <li v-for="feature in  features" :key="feature.name" class="product-template-features__row">
      <div class="product-template-features__col">
        <span class="product-template-features__key">
          {{ feature.name }}
        </span>
      </div>
      <div class="product-template-features__col">
        <span class="product-template-features__value">
          {{ feature.value }}
        </span>
      </div>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.product-template-features {
  //margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &__row {
    display: flex;
    //margin-bottom: 12px;
    width: 100%;
    //justify-content: space-between;
  }

  &__col {
    align-items: baseline;
    color: #999;
    display: flex;
    flex: 0 0 60%;
    font-size: 16px;
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

</style>

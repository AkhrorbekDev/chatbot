<script setup>

import ActionButton from "@/components/ActionButton.vue";
import BaseInput from "@/components/BaseInput.vue";


defineProps({
  isExist: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="add-to-cart-actions" :class="{'is-exist': isExist}">
    <template v-if="isExist">
      <ActionButton>
        <template #img>
          -
        </template>
      </ActionButton>
      <BaseInput></BaseInput>
      <ActionButton>
        <template #img>
          +
        </template>
      </ActionButton>
    </template>
    <template v-else>
      <ActionButton>
        <template #label>
          Add to cart
        </template>
      </ActionButton>
    </template>

  </div>
</template>

<style scoped lang="scss">

.add-to-cart-actions {
  width: 100%;
  display: flex;
  gap: 16px;

}

.add-to-cart-actions.is-exist {
  display: flex;
  align-items: center;
  gap: 10px;

  &:deep(.chat-msg-action) {
    width: 80px;
    height: 40px;
  }

  &:deep(input) {
    background: var(--action-bg-color);
    color: var(--white);
    text-align: center;

    &::placeholder {
      display: none;
      opacity: 0;
      color: var(--white);
    }

    &:active {
      background: var(--action-highlighting-color);
    }
  }
}
</style>

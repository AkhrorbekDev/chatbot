<script setup>

</script>

<template>
  <div class="chat-msg-action">
    <button type="button" class="chat-msg-action__btn">
      <span class="chat-msg-action__label">
        <slot name="label"></slot>
      </span>
      <div class="chat-msg-action__img">
        <slot name="img"></slot>
      </div>
    </button>
  </div>
</template>

<style scoped lang="scss">

.chat-msg-action {
  overflow: hidden;
  min-height: 2.5rem;
  display: flex;
  gap: .125rem;

  &__btn {
    position: relative;
    user-select: none;
    padding: .5625rem .5625rem;
    border-radius: .375rem;
    z-index: 2;
    font-size: 14px;
    text-align: center;
    color: #fff !important;
    outline: none;
    border: none;
    width: 100%;
    cursor: pointer;
    overflow: hidden;
    font-weight: 500;
    background: var(--action-bg-color);

    &:active {
      background: var(--action-highlighting-color);
    }
  }

  /*&__label {
    font-size: 1.2rem;
    font-weight: 500;
    color: #000;
  }*/

  &__img {
    img {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }
  }

}

</style>

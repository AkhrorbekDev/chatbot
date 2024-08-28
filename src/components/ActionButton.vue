<script setup>

const emit = defineEmits(['on:click']);
const props = defineProps({
  action: {
    type: Object,
    default: () => ({})
  }
})
function onClick() {
  if (props.action.type === 'redirect') {
    return
  }
  emit('on:action')
}

const _component = () => {
  if (props.action.type === 'redirect') {
    return 'a'
  } else {
    return 'button'
  }
}
</script>

<template>
  <div class="chat-msg-action">
    <component :is="_component()" :href="action.alias" target="_blank" type="button" class="chat-msg-action__btn" @click="onClick">
      <span class="chat-msg-action__label">
        <slot name="label"></slot>
      </span>
      <span v-if="$slots.img" class="chat-msg-action__img">
        <slot name="img"></slot>
      </span>
    </component>
  </div>
</template>

<style scoped lang="scss">

.chat-msg-action {
  overflow: hidden;
  min-height: 2.5rem;
  display: flex;
  gap: .125rem;
  position: relative;

  &.__loading {
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      border-radius: .375rem;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
      animation: loading 1.5s infinite;
    }
  }

  @keyframes loading {
    0% {
      left: -100%;
    }
    50% {
      left: 100%;
    }
    100% {
      left: 100%;
    }
  }

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
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;

    &:focus {
      outline: none;
    }

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
    display: block;
    width: 1rem;
    height: 1rem;

    img {

      border-radius: 50%;
    }
  }

}

.product-template{
  .chat-msg-action__btn{
    margin: 0 10px;
  }
}
</style>

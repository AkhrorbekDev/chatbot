<template>
  <div ref="main">
    <slot />
  </div>
</template>

<script setup lang="ts">
import {computed, onBeforeUnmount, onMounted, ref} from "vue";

const main = ref<Element>()
// const observer = ref<IntersectionObserver>()

const props = defineProps({
  rootMargin: {
    type: String,
    default: '0px 0px 0px 0px'
  },
  loaderDistance: {
    type: Number,
    default: 0
  },
  loaderDisable: {
    type: Boolean,
    default: false
  },
  loaderMethod: {
    type: Function,
    required: true
  },
  loaderViewport: {
    default: null
  }
})

const options = computed(() => {
  return {
    rootMargin: `0px 0px ${props.loaderDistance}px 0px`,
  }
})

const observer = computed(() => {
  return new IntersectionObserver((e, _observer) => {
    const [{
      isIntersecting,
    }] = e
    if (isIntersecting && !props.loaderDisable && typeof props.loaderMethod === 'function') {
      props.loaderMethod(e)
    }
  }, options.value)
})
// const emit = defineEmits(['intersected'])
onMounted(() => {
  // if (props.rootMargin && parseInt(props.rootMargin.split(' ')[2].replace('px', '')) > 500) {
  //   observer.value = new IntersectionObserver(observe, { rootMargin: props.rootMargin })
  //   observer.value.observe(main.value)
  //   emit('intersected')
  //   return
  // }
  observer.value.observe(main.value)
})

// function observe (entries: any) {
//   if (entries[0].isIntersecting) {
//     emit('intersected', entries)
//   }
// }

onBeforeUnmount(() => {
  if ('IntersectionObserver' in window && main.value) {
    observer.value.unobserve(main.value)
  }
  // observer.value = null
})

defineExpose({
  observer
})
</script>

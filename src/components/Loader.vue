<script setup>

</script>

<template>
  <div class="loader">
    <span></span>
  </div>
</template>

<style scoped lang="scss">
.loader {
  width: 25px;
  height: 25px;
  border-radius: 50%;
  position: relative;
  margin: 0 auto;
  animation: rotate 1s linear infinite
}

.loader span {
  display: block;
  box-sizing: border-box;
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 5px solid #f1f2f6;
  animation: prixClipFix 2s linear infinite;
}

@keyframes rotate {
  100% {
    transform: rotate(360deg)
  }
}

@keyframes prixClipFix {
  0% {
    clip-path: polygon(50% 50%, 0 0, 0 0, 0 0, 0 0, 0 0)
  }
  25% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 0, 100% 0, 100% 0)
  }
  50% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 100% 100%, 100% 100%)
  }
  75% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 100%)
  }
  100% {
    clip-path: polygon(50% 50%, 0 0, 100% 0, 100% 100%, 0 100%, 0 0)
  }
}
</style>

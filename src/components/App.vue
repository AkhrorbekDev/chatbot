<script setup>

import ChatBot from "@/components/ChatBot.vue";
import ChatHeader from "@/components/ChatHeader.vue";
import {computed, inject, onMounted, onUnmounted, ref} from "vue";
import ChatWidgetBtn from "@/components/ChatWidgetBtn.vue";

const canvas_context = ref(null)
const canvas_context_gradient = ref(null)
const chat_bot = ref(null)
const options = inject('widget-options')

function resizeCanvas() {
  const canvas = canvas_context.value
  const chat = chat_bot.value
  canvas.width = chat.getBoundingClientRect().width;
  canvas.height = chat.getBoundingClientRect().height;
  canvas_context_gradient.value.width = chat.getBoundingClientRect().width;
  canvas_context_gradient.value.height = chat.getBoundingClientRect().height;
  drawPattern();
}

function drawPattern() {
  const canvas = canvas_context.value
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.src = options.background.pattern; // Path to your uploaded SVG file
  img.onload = function () {
    const pattern = ctx.createPattern(img, options.background.repeat ? 'repeat' : null);
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };
  const canvas_gradient = canvas_context_gradient.value
  const ctx_canvas_context_gradient = canvas_gradient.getContext('2d');

  const angle = 130 * Math.PI / 180;
  const x1 = 0;
  const y1 = 0;
  const x2 = canvas_gradient.width * Math.cos(angle);
  const y2 = canvas_gradient.height * Math.sin(angle);

  const gradient = ctx_canvas_context_gradient.createLinearGradient(x1, y1, x2, y2);
  gradient.addColorStop(0, 'rgba(62, 47, 40, .5)');
  gradient.addColorStop(1, 'rgba(28, 11, 35, .5)');

  ctx_canvas_context_gradient.fillStyle = gradient;
  ctx_canvas_context_gradient.fillRect(0, 0, canvas_gradient.width, canvas_gradient.height);
}

const changeTheme = () => {
  const root = document.getElementById(options.rootId)
  console.log(root)
  root.classList.toggle('theme-dark');
}

const close = () => {
  _show.value = false
}
const _show = ref(false)
const showChat = () => {
  _show.value = true
}

onMounted(() => {
  if (options.background?.pattern) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<template>
  <ChatWidgetBtn @click="showChat" :class="{ _hide: _show}"/>
  <div :class="{ _hide: !_show}" ref="chat_bot" class="__root">
    <ChatHeader @on:close="close" @change:theme="changeTheme"/>
    <canvas ref="canvas_context_gradient"></canvas>
    <canvas ref="canvas_context"></canvas>
    <ChatBot class="chat-bot"></ChatBot>
  </div>
</template>

<style scoped lang="scss">

._hide {
  display: none !important;
}

.__root {
  display: flex;
  flex-direction: column;
  background-color: var(--theme-bg-color);
  width: 100%;
  height: 100%;
  margin: 0 auto;
  overflow: hidden;
  position: relative;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

}

</style>

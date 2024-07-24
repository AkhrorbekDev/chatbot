<script setup>
import ChatBotFooter from "@/components/ChatBotFooter.vue";
import ActionButton from "@/components/ActionButton.vue";
import LoginView from "@/components/LoginView.vue";
import {onMounted, onUnmounted, ref} from "vue";
import AddToCartActions from "@/components/AddToCartActions.vue";
import MessageTemplate from "@/components/templates/MessageTemplate.vue";
import MessageProduct from "@/components/message-types/MessageProduct.vue";
import OrdersView from "@/components/message-types/OrdersView.vue";
import OrderDetails from "@/components/message-types/OrderDetails.vue";

const canvas_context = ref(null)
const canvas_context_gradient = ref(null)
const chat_bot = ref(null)

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
  img.src = '/mnt/data/bg-pattern.svg'; // Path to your uploaded SVG file
  img.onload = function () {
    const pattern = ctx.createPattern(img, 'repeat');
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

const loggedIn = ref(false)

onMounted(() => {

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
});

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas);
});
</script>

<template>
  <div ref="chat_bot" class="chat-area">
    <canvas ref="canvas_context_gradient"></canvas>
    <canvas ref="canvas_context"></canvas>
    <template v-if="loggedIn">
      <div class="chat-area-main">
        <MessageTemplate>
          <template #default>
            <p>Hi there! How can I help you today?</p>
          </template>
          <template #actions>
            <ActionButton>
              <template #label>
                Add to cart
              </template>
            </ActionButton>
          </template>
        </MessageTemplate>
        <MessageTemplate>
          <template #default>
            <p>Hi there! How can I help you today?</p>
          </template>
          <template #actions>
            <AddToCartActions>

            </AddToCartActions>
          </template>
        </MessageTemplate>
        <MessageTemplate>
          <template #default>
            <p>Hi there! How can I help you today?</p>
          </template>
          <template #actions>
            <AddToCartActions is-exist>

            </AddToCartActions>
          </template>
        </MessageTemplate>
        <MessageTemplate class="owner">
          <template #default>
            <p>Hi there! How can I help you today?</p>
          </template>
        </MessageTemplate>
        <MessageProduct></MessageProduct>
        <OrdersView></OrdersView>
        <OrderDetails></OrderDetails>
      </div>
      <ChatBotFooter></ChatBotFooter>
    </template>
    <template v-else>
      <LoginView/>
    </template>
  </div>
</template>

<style scoped lang="scss">

.chat-area {
  display: flex;
  flex-direction: column;
  overflow: auto;
  height: 100%;
  position: relative;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
  }

  &-header {
    display: flex;
    position: sticky;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    background: var(--chat-header-bg);
  }


  &-title {
    font-size: 18px;
    font-weight: 600;
  }

  &-main {
    flex-grow: 1;
    padding: 20px 0;
    height: 100%;
    overflow-y: auto;
    z-index: 2;
  }

  &-footer {
    z-index: 2;
  }
}
</style>

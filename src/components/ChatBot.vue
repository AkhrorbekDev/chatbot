<script setup>
import ChatBotFooter from "@/components/ChatBotFooter.vue";
import ActionButton from "@/components/ActionButton.vue";
import LoginView from "@/components/LoginView.vue";
import {computed, inject, onMounted, onUnmounted, ref} from "vue";
import AddToCartActions from "@/components/AddToCartActions.vue";
import MessageTemplate from "@/components/templates/MessageTemplate.vue";
import MessageProduct from "@/components/message-types/MessageProduct.vue";
import OrdersView from "@/components/message-types/OrdersView.vue";
import OrderDetails from "@/components/message-types/OrderDetails.vue";
import {Botman} from "@/core/Api/Botman";
import {createProductMessageDTO, createSampleMessageDTO} from "@/core/DTO";

const $auth = inject('$auth')
const loggedIn = computed(() => $auth.loggedIn)
const botman = new Botman({$auth})
const messages = ref([])
const message = {}

const getMessages = (params) => {
  return botman.getMessages({
    ...params
  })
}

const sendMessage = (params) => {
  return botman.sendMessage({
    ...params
  })
}

const renderer = () => {

}


onMounted(() => {
  getMessages().then((response) => {
    messages.value = [{}]
  })
})
</script>

<template>
  <div class="chat-area">
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
        <MessageProduct :message="createProductMessageDTO({})"></MessageProduct>
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

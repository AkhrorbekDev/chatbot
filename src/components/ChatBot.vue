<script setup lang="ts">
import {computed, h, inject, onMounted, onUnmounted, ref, shallowRef, watch} from "vue";
import ChatBotFooter from "@/components/ChatBotFooter.vue";
import ActionButton from "@/components/ActionButton.vue";
import LoginView from "@/components/LoginView.vue";
import Loader from "@/components/Loader.vue";
import {v4 as uuidv4} from 'uuid';
import MessageTemplate from "@/components/templates/MessageTemplate.vue";
import MessageProduct from "@/components/message-types/MessageProduct.vue";
import OrdersView from "@/components/message-types/OrdersView.vue";
import OrderDetails from "@/components/message-types/OrderDetails.vue";

import {Botman} from "@/core/Api/Botman";
import {
  createOrderDetailsMessageDTO,
  createOrderViewMessageDTO,
  createProductMessageDTO,
  createSampleMessageDTO
} from "@/core/DTO";
import {
  AnyMessage,
  ContentTypes,
  Message,
  OrderDetailsMessage,
  OrderViewMessage,
  ProductMessage,
  SampleMessage
} from "@/types.js";
import InfiniteScrollObserver from "@/components/InfiniteScrollObserver.vue";
import EmptyMessageTemplate from "@/components/templates/EmptyMessageTemplate.vue";
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import useLoading from "@/composables/useLoading";


const $auth = inject('$chatbot-auth')
const widgetOptions = inject('widget-options')
const loggedIn = computed(() => {
  return $auth.$storage.state.value.loggedIn
})

const botman = new Botman({$auth, ...widgetOptions})
const messages = ref<AnyMessage[]>([])
const pagination = ref({})
const chatContainer = ref(null)
const isUserNearTop = ref(false)
const showLogin = ref(false)
const firstLoading = useLoading()
const paginationLoading = useLoading()
const alertOptions = inject('alertOptions')
const lastErroredMessage = ref(null)

const paginateMessages = () => {
  if (pagination.value.current_page < pagination.value.last_page && !paginationLoading.value.idle.value) {
    paginationLoading.value.start()
    getMessages({page: pagination.value.current_page + 1})
        .then((res) => {
          messages.value = [...messages.value, ...res.data.messages]
          pagination.value = res.data.paginator
        }).finally(() => {
      paginationLoading.value.stop()
    })
  }
}
const getMessages = (params = {}) => {
  return botman.getMessages({params}).catch(() => {
    alertOptions.value.events.openModal('error', 'Произошла ошибка')
  })
}
const handleAction = (action) => {
  const payload = action.payload ?? {}
  sendMessage({
    message: action.text,
    content_type: 'action',
    payload: {
      alias: action.alias,
      ...payload,
      type: action.type
    },
  })
}
const createSampleMessage = (content) => {
  return createSampleMessageDTO(content)
}
const sampleMessageRenderer = (message: SampleMessage) => {
  return h(MessageTemplate, {message}, {
    default: message.content ? () => h('p', {}, message.content) : null,
    actions: () => message.actions && message.actions.map((action) => {
      const slots = {
        label: () => h('span', {}, action.text),
      }
      if (action.icon) {
        slots.img = () => h('img', {src: action.icon})
      }
      return h(ActionButton, {
        action,
        'onOn:action': () => handleAction(action)
      }, slots)
    })
  })
}
const productMessageRenderer = (message: ProductMessage) => {
  if (message.products) {
    const products = message.products
    return h(EmptyMessageTemplate, {class: '__products-template'}, products.map((product) => {
      return h(MessageProduct, {
        message: createProductMessageDTO({...message, actions: product.actions, user: undefined, product}),
        'onOn:action': (e) => handleAction(e)
      })
    }))
  }
  return h(MessageProduct, {message: createProductMessageDTO(message)})
}
const orderViewMessageRenderer = (message: OrderViewMessage) => {
  return h(OrdersView, {message: createOrderViewMessageDTO(message)})
}
const orderDetailMessageRenderer = (message: OrderDetailsMessage) => {
  return h(OrderDetails, {message: createOrderDetailsMessageDTO(message)})
}

const sendMessage = (params) => {
  const id = uuidv4()
  const newMessage = createSampleMessage({
    content_type: ContentTypes.Text,
    content: params.message,
    id,
    user: {
      owner: true,
      last_sean: new Date().toISOString()
    }
  })
  inComeMessage(newMessage)
  messages.value.unshift(newMessage)
  return botman.sendMessage({
    message: {
      ...newMessage,
      content_type: params.content_type ? params.content_type : newMessage.content_type,
    },
    payload: params.payload,
  }).then((res) => {
    messages.value.unshift(...res.data.reverse())
  }).catch((err) => {
    if (err.status === 401) {
      showLogin.value = true
      lastErroredMessage.value = {
        message: {
          ...newMessage,
          content_type: params.content_type ? params.content_type : newMessage.content_type,
        },
        payload: params.payload,
      }
      return
    }
    alertOptions.value.events.openModal('error', 'Произошла ошибка')
  }).finally(() => {

  })
}

function cancelLogin() {
  showLogin.value = false
  lastErroredMessage.value = null
}

function onLogin() {
  showLogin.value = false
  return botman.sendMessage(lastErroredMessage.value).then((res) => {
    messages.value.unshift(...res.data.reverse())
    lastErroredMessage.value = null
    botman.mergeHistory({'chat-token': $auth.$storage.get({key: 'chat-access'})})
  }).catch((err) => {
    alertOptions.value.events.openModal('error', `Произошла ошибка ${err.status}`)
  })
}

const lastItemId = ref(null)
const lastScrollEndHeight = ref(null)

const messagesTemplates = {
  [ContentTypes.Text]: sampleMessageRenderer,
  [ContentTypes.Product]: productMessageRenderer,
  [ContentTypes.OrdersView]: orderViewMessageRenderer,
  [ContentTypes.OrderDetails]: orderDetailMessageRenderer,
}

const renderer = (message: Message) => {
  let _h = messagesTemplates[message.content_type]

  if (!_h) {
    _h = messagesTemplates[ContentTypes.Text]
  }
  return _h(message)
}

const inComeMessage = (message: Message) => {
  const oldScrollHeight = chatContainer.value.scrollHeight;
  const oldScrollTop = chatContainer.value.scrollTop;
  const wasAtBottom = oldScrollTop + chatContainer.value.clientHeight >= oldScrollHeight - 10; // Threshold of 10px

  if (wasAtBottom) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
  } else if (isUserNearTop.value) {
    const newScrollHeight = chatContainer.value.scrollHeight;
    chatContainer.value.scrollTop = newScrollHeight - oldScrollHeight + oldScrollTop;
  }
}

const connectWS = (user?) => {
  window.Pusher = Pusher;
  window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '21f054cecc8f4861fa4b',
    cluster: 'ap2',
    authEndpoint: 'http://92.204.254.100:5050/broadcasting/auth', // Add this line
    forceTLS: true,
    auth: {
      headers: {
        Authorization: $auth.$token.get(),
        Accept: 'application/json',
        'Chat-Token': $auth.$storage.get({key: 'chat-access-token'}) || ''
      },
    },
  });
  const chatModel = $auth.$storage.get({key: 'chat-access-token'}) && !user ? `App.Models.Token.${$auth.$storage.get({key: 'chat-access-token'}) || ''}` : `App.Models.User.${user?.id}`
  window.Echo.private(chatModel).listen(".NewChatMessage", res => {
    messages.value.unshift(...res.reverse())
  });
}

const reMount = () => {
  firstLoading.value.start()
  $auth.fetchUser()
      .then((res) => {
        connectWS(res.data.user)
      })
  getMessages().then((res) => {
    messages.value = res.data.messages
    pagination.value = res.data.paginator
    lastItemId.value = messages.value[0]?.id
    if (res.data.token) {
      $auth.$storage.set({
        key: 'chat-access-token',
        value: res.data.token
      })
    }
  }).finally(() => {
    firstLoading.value.stop()
  })
}

watch(messages, () => {
  const lastMessage = messages.value[0]
  if (lastMessage?.user.owner) {
    lastItemId.value = null
    chatContainer.value.scroll({top: 0});

  } else {
    lastItemId.value = lastMessage?.id
  }
}, {
  immediate: false,
  deep: true
})

watch(loggedIn, (value) => {
  window.Echo?.leaveAllChannels()
  if (value) {
    reMount()
  }
}, {
  immediate: true
})

const handleScroll = (e) => {
  const chat = chatContainer.value;
  isUserNearTop.value = chat.scrollTop < 100; // Adjust the threshold as needed
}

onMounted(() => {
  firstLoading.value.start()
  getMessages()
      .then((res) => {
        messages.value = res.data.messages
        pagination.value = res.data.paginator
        lastItemId.value = messages.value[0]?.id
        if (res.data.token) {
          $auth.$storage.set({
            key: 'chat-access-token',
            value: res.data.token
          })
        }
      }).finally(() => {
    firstLoading.value.stop()
  })
  connectWS()
})

defineExpose({
  sendMessage: () => {
    sendMessage(lastErroredMessage.value)
  }
})
</script>

<template>
  <div class="chat-area">

    <div ref="chatContainer" class="chat-area-main" @scroll="handleScroll">
      <template v-if="firstLoading.idle">
        <Loader class="firstTimeLoader"></Loader>
      </template>

      <template v-else>
        <component v-for="(message, ind) in messages" :key="message.id || ind" :is="renderer(message)"
                   :message="message" @on:action="handleAction"></component>
        <template
            v-if="pagination.current_page < pagination.last_page"
        >
          <InfiniteScrollObserver
              :loader-disable="pagination.last_page === pagination.current_page && !paginationLoading.idle"
              :loader-method="paginateMessages">
            <Loader/>
          </InfiniteScrollObserver>
        </template>
      </template>

    </div>
    <ChatBotFooter @send:message="sendMessage"></ChatBotFooter>
    <template v-if="showLogin">
      <LoginView @cancel:login="cancelLogin" @on:login="onLogin"/>
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
  scrollbar-color: #8a8d9c #f1f2f6;
  scrollbar-width: thin;

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
    display: flex;
    flex-direction: column-reverse;
  }

  &-footer {
    z-index: 2;
  }
}

.firstTimeLoader {
  width: 50px;
  height: 50px;
  margin: auto auto;
}
</style>

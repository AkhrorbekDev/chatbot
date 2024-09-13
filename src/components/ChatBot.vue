<script setup lang="ts">
import {computed, h, inject, onMounted, onUnmounted, ref, shallowRef, watch} from "vue";
import ChatBotFooter from "@/components/ChatBotFooter.vue";
import ActionButton from "@/components/ActionButton.vue";
import LoginView from "@/components/LoginView.vue";
import Loader from "@/components/Loader.vue";
import {v4 as uuidv4} from 'uuid';
import AddToCartActions from "@/components/AddToCartActions.vue";
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
const firstLoading = useLoading()
const paginationLoading = useLoading()
const alertOptions = inject('alertOptions')

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
    // alertOptions.value.events.openModal('error', 'Произошла ошибка')
  }).finally(() => {
    const data = [
      {
        content_type: ContentTypes.Text,
        content: 'Hi there! How can I help you today?',
        actions: [
          {
            text: 'Add to cart',
            // icon: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png',
            type: 'add_to_cart',
            alias: 'product_id123333'
          }
        ],
        created_at: new Date().toISOString(),
        user: {
          id: '1',
          name: 'Botman',
          avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png',
          last_sean: new Date().toISOString()
        },
      },
      {
        user: {
          id: '3', name: 'Botman',
          avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png',
          last_sean: new Date().toISOString()
        },
        created_at: new Date().toISOString(),
        content_type: ContentTypes.Product,
        content: [],
        product: {
          id: 'prod1',
          name: 'Redmi 13C (Бывший в употреблении) Midnight Black 8/256 GB',
          description: 'Product 1 description',
          discount: 10,
          price: 1000000,
          features: [
            {
              name: 'Контроллер в комплекте\n',
              value: 'Value 1'
            },
            {
              name: 'Контроллер в комплекте\n',
              value: 'Value 2'
            }
          ],
          image: 'https://olcha.uz/image/300x300/products/PaM0CUVGoX5QsvtKi6TiICrUtZW0lmfgz9q07KKoHKnyHbDP33p0egVhTFIf.jpg',
        },
        actions: [
          {
            type: 'add_to_cart',
            text: 'Buy Now',
            icon: 'https://example.com/buy.png',
            alias: 'product_id123333'
          },
          {
            type: 'add_to_cart',
            text: 'Buy Now',
            icon: 'https://example.com/buy.png',
            alias: 'product_id123333'
          },
          {
            type: 'add_to_cart',
            text: 'Buy Now',
            icon: 'https://example.com/buy.png',
            alias: 'product_id123333'
          }
        ]
      },
      {
        content_type: ContentTypes.OrdersView,
        created_at: new Date().toISOString(),
        content: [],
        user: {
          id: '1',
          name: 'Botman',
          avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png',
          last_sean: new Date().toISOString()
        },
        orders: [
          {
            id: '1',
            total_price: 1000000,
            debt_price: 1000000,
            payed: 0,
            next_payment: '2022-12-12',
            address: 'Tashkent, Mirzo Ulugbek district, 12-23',
            created_at: new Date().toISOString()
          },
          {
            id: '2',
            total_price: 1000000,
            debt_price: 1000000,
            payed: 0,
            next_payment: '2022-12-12',
            address: 'Tashkent, Mirzo Ulugbek district, 12-23',
            created_at: new Date().toISOString()
          }
        ],
        actions: [
          {
            text: 'Pay now',
            icon: 'https://example.com/pay.png',
            alias: 'order_id123333',
            type: 'pay_now'
          }
        ]
      },
      {
        content_type: ContentTypes.OrderDetails,
        created_at: new Date().toISOString(),
        content: [],
        user: {
          id: '1',
          name: 'Botman',
          avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png',
          last_sean: new Date().toISOString()
        },
        order: {
          id: '1',
          total_price: 1000000,
          debt_price: 1000000,
          payed: 0,
          products: [
            {
              id: 'prod1',
              name: 'Redmi 13C (Бывший в употреблении) Midnight Black 8/256 GB',
              description: 'Product 1 description',
              discount: 10,
              price: 1000000,
              features: [
                {
                  name: 'Контроллер в комплекте\n',
                  value: 'Value 1'
                }, {
                  name: 'Контроллер в комплекте\n',
                  value: 'Value 2'
                }
              ],
              quantity: 2,
              image: 'https://olcha.uz/image/300x300/products/PaM0CUVGoX5QsvtKi6TiICrUtZW0lmfgz9q07KKoHKnyHbDP33p0egVhTFIf.jpg',
            },
            {
              id: 'prod1',
              name: 'Redmi 13C (Бывший в употреблении) Midnight Black 8/256 GB',
              description: 'Product 1 description',
              discount: 10,
              price: 1000000,
              features: [
                {
                  name: 'Контроллер в комплекте\n',
                  value: 'Value 1'
                },
                {
                  name: 'Контроллер в комплекте\n',
                  value: 'Value 2'
                }],
              quantity: 3,
              image: 'https://olcha.uz/image/300x300/products/PaM0CUVGoX5QsvtKi6TiICrUtZW0lmfgz9q07KKoHKnyHbDP33p0egVhTFIf.jpg',
            }
          ],
          created_at: new Date().toISOString(),
          next_payment: '2022-12-12',
          address: 'Tashkent, Mirzo Ulugbek district, 12-23',
        },
        actions: [
          {
            text: 'Pay now',
            icon: 'https://example.com/pay.png',
            alias: 'order_id123333',
            type: 'pay_now'
          }
        ]
      }
    ]
    messages.value = [...data, ...messages.value]
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
      return h(ActionButton, {
        action,
        'onOn:action': () => handleAction(action)
      }, {
        label: () => h('span', {}, action.text),
        img: () => action.icon ? h('img', {src: action.icon}) : false
      })
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
  }).catch(() => {
    alertOptions.value.events.openModal('error', 'Произошла ошибка')
  }).finally(() => {

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

const reMount = () => {
  firstLoading.value.start()
  $auth.fetchUser()
      .then((res) => {
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
              Accept: 'application/json'
            },
          },
        });
        window.Echo.private(`App.Models.User.${res.data.user.id}`).listen(".NewChatMessage", res => {
          messages.value.unshift(...res.reverse())
        });
      })
  getMessages().then((res) => {
    messages.value = res.data.messages
    pagination.value = res.data.paginator
    lastItemId.value = messages.value[0]?.id
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
  if (value) {
    reMount()
  } else {
    window.Echo?.leaveAllChannels()
  }
}, {
  immediate: true
})

const handleScroll = (e) => {
  const chat = chatContainer.value;
  isUserNearTop.value = chat.scrollTop < 100; // Adjust the threshold as needed
}


onMounted(() => {
  if (loggedIn.value) {
    firstLoading.value.start()
    getMessages()
        .then((res) => {
          messages.value = res.data.messages
          pagination.value = res.data.paginator
          lastItemId.value = messages.value[0]?.id
        }).finally(() => {
      firstLoading.value.stop()
    })
  }
})
</script>

<template>
  <div class="chat-area">
    <template v-if="loggedIn">

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
              <Loader />
            </InfiniteScrollObserver>
          </template>
        </template>

      </div>
      <ChatBotFooter @send:message="sendMessage"></ChatBotFooter>
    </template>
    <template v-else>
      <LoginView />
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

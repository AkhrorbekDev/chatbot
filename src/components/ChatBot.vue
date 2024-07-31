<script setup lang="ts">
import {computed, h, inject, onMounted, onUnmounted, ref, watch} from "vue";
import Pusher from 'pusher-js'
import ChatBotFooter from "@/components/ChatBotFooter.vue";
import ActionButton from "@/components/ActionButton.vue";
import LoginView from "@/components/LoginView.vue";

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
const $auth = inject('$auth')
const loggedIn = computed(() => {
  return $auth.$storage.state.value.loggedIn
})
const pusher = new Pusher('21f054cecc8f4861fa4b', {
  cluster: 'ap2',
  userAuthentication: {
    endpoint: "https://ajalchat.crmgeomotive.uz/api/v1/pusher/user-auth",
    transport: "ajax",
    params: {},
    headers: {
      Authorization: $auth.$token.get()
    },
    customHandler: null,
  },
  channelAuthorization: {
    endpoint: "https://ajalchat.crmgeomotive.uz/api/v1/pusher/auth",
    transport: "ajax",
    params: {},
    headers: {
      Authorization: $auth.$token.get()
    },
    customHandler: null,
  }
});
let socketId = null;
pusher.connection.bind("connected", () => {
  socketId = pusher.connection.socket_id;
});

pusher.subscribe('botman')

pusher.bind('pusher:subscription_succeeded', (e) => {
  console.log(e, 'pusher:subscription_succeeded')
})
pusher.bind('pusher:subscription_error', (e) => {
  console.log(e, 'pusher:subscription_error')
})
pusher.bind('message', (e) => {
  messages.value.unshift(e.data.message)
})
pusher.bind('pusher:signin_success', (e) => {
  console.log(e, 'pusher:signin_success')
})
pusher.bind('pusher:error', (e) => {
  console.trace(e, 'pusher:error')
})

pusher.signin();


const botman = new Botman({$auth})
const messages = ref<AnyMessage[]>([])
const pagination = ref({})
const message = {}
const chatContainer = ref(null)
const isUserNearTop = ref(false)

const paginateMessages = () => {
  if (pagination.value.current_page < pagination.value.last_page) {
    getMessages({page: pagination.value.current_page + 1})
        .then((res) => {
          messages.value = [...res.data.message, ...messages.value]
          pagination.value = res.data.paginator
        }).catch(() => {
      const data = [
        {
          content_type: ContentTypes.Text,
          content: 'Hi there! How can I help you today?',
          actions: [{
            text: 'Add to cart',
            // icon: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png',
            type: 'add_to_cart',
            alias: 'product_id123333'
          }],
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
            features: [{
              name: 'Контроллер в комплекте\n',
              value: 'Value 1'
            }, {
              name: 'Контроллер в комплекте\n',
              value: 'Value 2'
            }],
            image: 'https://olcha.uz/image/300x300/products/PaM0CUVGoX5QsvtKi6TiICrUtZW0lmfgz9q07KKoHKnyHbDP33p0egVhTFIf.jpg',
          },
          actions: [{
            type: 'add_to_cart',
            text: 'Buy Now',
            icon: 'https://example.com/buy.png',
            alias: 'product_id123333'

          }, {
            type: 'add_to_cart',
            text: 'Buy Now',
            icon: 'https://example.com/buy.png',
            alias: 'product_id123333'

          }, {
            type: 'add_to_cart',
            text: 'Buy Now',
            icon: 'https://example.com/buy.png',
            alias: 'product_id123333'

          }]
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
          orders: [{
            id: '1',
            total_price: 1000000,
            debt_price: 1000000,
            payed: 0,
            next_payment: '2022-12-12',
            address: 'Tashkent, Mirzo Ulugbek district, 12-23',
            created_at: new Date().toISOString()
          },
            {
              id: '1',
              total_price: 1000000,
              debt_price: 1000000,
              payed: 0,
              next_payment: '2022-12-12',
              address: 'Tashkent, Mirzo Ulugbek district, 12-23',
              created_at: new Date().toISOString()
            }],
          actions: [{
            text: 'Pay now',
            icon: 'https://example.com/pay.png',
            alias: 'order_id123333',
            type: 'pay_now'
          }]

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
                features: [{
                  name: 'Контроллер в комплекте\n',
                  value: 'Value 1'
                }, {
                  name: 'Контроллер в комплекте\n',
                  value: 'Value 2'
                }],
                quantity: 2,
                image: 'https://olcha.uz/image/300x300/products/PaM0CUVGoX5QsvtKi6TiICrUtZW0lmfgz9q07KKoHKnyHbDP33p0egVhTFIf.jpg',
              },
              {
                id: 'prod1',
                name: 'Redmi 13C (Бывший в употреблении) Midnight Black 8/256 GB',
                description: 'Product 1 description',
                discount: 10,
                price: 1000000,
                features: [{
                  name: 'Контроллер в комплекте\n',
                  value: 'Value 1'
                }, {
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
          actions: [{
            text: 'Pay now',
            icon: 'https://example.com/pay.png',
            alias: 'order_id123333',
            type: 'pay_now'
          }]

        }
      ]
      messages.value = [...data, ...messages.value]
    })
  }
}

const getMessages = (params = {}) => {
  return botman.getMessages({
    ...params
  }).catch(() => {
    const data = [
      {
        content_type: ContentTypes.Text,
        content: 'Hi there! How can I help you today?',
        actions: [{
          text: 'Add to cart',
          // icon: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png',
          type: 'add_to_cart',
          alias: 'product_id123333'
        }],
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
        products: [{
          id: 'prod1',
          name: 'Redmi 13C (Бывший в употреблении) Midnight Black 8/256 GB',
          description: 'Product 1 description',
          discount: 10,
          price: 1000000,
          features: [{
            name: 'Контроллер в комплекте\n',
            value: 'Value 1'
          }, {
            name: 'Контроллер в комплекте\n',
            value: 'Value 2'
          }],
          image: 'https://olcha.uz/image/300x300/products/PaM0CUVGoX5QsvtKi6TiICrUtZW0lmfgz9q07KKoHKnyHbDP33p0egVhTFIf.jpg',
        }, {
          id: 'prod1',
          name: 'Redmi 13C (Бывший в употреблении) Midnight Black 8/256 GB',
          description: 'Product 1 description',
          discount: 10,
          price: 1000000,
          features: [{
            name: 'Контроллер в комплекте\n',
            value: 'Value 1'
          }, {
            name: 'Контроллер в комплекте\n',
            value: 'Value 2'
          }],
          image: 'https://olcha.uz/image/300x300/products/PaM0CUVGoX5QsvtKi6TiICrUtZW0lmfgz9q07KKoHKnyHbDP33p0egVhTFIf.jpg',
        }, {
          id: 'prod1',
          name: 'Redmi 13C (Бывший в употреблении) Midnight Black 8/256 GB',
          description: 'Product 1 description',
          discount: 10,
          price: 1000000,
          features: [{
            name: 'Контроллер в комплекте\n',
            value: 'Value 1'
          }, {
            name: 'Контроллер в комплекте\n',
            value: 'Value 2'
          }],
          image: 'https://olcha.uz/image/300x300/products/PaM0CUVGoX5QsvtKi6TiICrUtZW0lmfgz9q07KKoHKnyHbDP33p0egVhTFIf.jpg',
        }],
        actions: [{
          type: 'add_to_cart',
          text: 'Buy Now',
          icon: 'https://example.com/buy.png',
          alias: 'product_id123333'

        }, {
          type: 'add_to_cart',
          text: 'Buy Now',
          icon: 'https://example.com/buy.png',
          alias: 'product_id123333'

        }, {
          type: 'add_to_cart',
          text: 'Buy Now',
          icon: 'https://example.com/buy.png',
          alias: 'product_id123333'

        }]
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
        orders: [{
          id: '1',
          total_price: 1000000,
          debt_price: 1000000,
          payed: 0,
          next_payment: '2022-12-12',
          address: 'Tashkent, Mirzo Ulugbek district, 12-23',
          created_at: new Date().toISOString()
        },
          {
            id: '1',
            total_price: 1000000,
            debt_price: 1000000,
            payed: 0,
            next_payment: '2022-12-12',
            address: 'Tashkent, Mirzo Ulugbek district, 12-23',
            created_at: new Date().toISOString()
          }],
        actions: [{
          text: 'Pay now',
          icon: 'https://example.com/pay.png',
          alias: 'order_id123333',
          type: 'pay_now'
        }]

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
              features: [{
                name: 'Контроллер в комплекте\n',
                value: 'Value 1'
              }, {
                name: 'Контроллер в комплекте\n',
                value: 'Value 2'
              }],
              quantity: 2,
              image: 'https://olcha.uz/image/300x300/products/PaM0CUVGoX5QsvtKi6TiICrUtZW0lmfgz9q07KKoHKnyHbDP33p0egVhTFIf.jpg',
            },
            {
              id: 'prod1',
              name: 'Redmi 13C (Бывший в употреблении) Midnight Black 8/256 GB',
              description: 'Product 1 description',
              discount: 10,
              price: 1000000,
              features: [{
                name: 'Контроллер в комплекте\n',
                value: 'Value 1'
              }, {
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
        actions: [{
          text: 'Pay now',
          icon: 'https://example.com/pay.png',
          alias: 'order_id123333',
          type: 'pay_now'
        }]

      }
    ]
    messages.value = [...data]
  })
}

const handleAction = (action) => {
  sendMessage({
    message: action.text,
    payload: action.payload,
  })
}

const createSampleMessage = (content) => {
  return createSampleMessageDTO(content)
}


const sampleMessageRenderer = (message: SampleMessage) => {
  return h(MessageTemplate, {message}, {
    default: () => h('p', {}, message.content),
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
      return h(MessageProduct, {message: createProductMessageDTO({...message, user: undefined, product})})
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
  const newMessage = createSampleMessage({
    content_type: ContentTypes.Text,
    content: params.message,
    user: {
      owner: true,
      last_sean: new Date().toISOString()
    }
  })
  inComeMessage(newMessage)
  messages.value.unshift(newMessage)
  return botman.sendMessage({
    message: newMessage,
    payload: params.payload,
  }).then((res) => {
    messages.value.unshift(...res.data.reverse())
  }).finally(() => {

  })
}

const lastItemId = ref(null)
const lastScrollEndHeight = ref(null)

watch(messages, () => {
  const lastMessage = messages.value[0]
  if (!lastMessage.id && lastMessage.id !== lastItemId.value && lastMessage.user.owner) {
    lastItemId.value = null
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight;

  } else {
    lastItemId.value = lastMessage.id
  }
}, {
  immediate: false,
  deep: true
})


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
  getMessages().then((res) => {
    messages.value = res.data.messages
    pagination.value = res.data.paginator
  })
}

watch(loggedIn, (value) => {
  if (value) {
    reMount()
  }
}, {
  immediate: false
})
const handleScroll = () => {
  const chat = chatContainer.value;
  isUserNearTop.value = chat.scrollTop < 100; // Adjust the threshold as needed
}
onMounted(() => {
  if (loggedIn.value) {
    getMessages()
        .then((res) => {
          messages.value = res.data.messages
          pagination.value = res.data.paginator
          lastItemId.value = messages.value[0].id
        })
  }
})
</script>

<template>
  <div class="chat-area">
    <template v-if="loggedIn">
      <div ref="chatContainer" class="chat-area-main" @scroll="handleScroll">
        <template v-for="message in messages">
          <component :is="renderer(message)" :message="message" @on:action="handleAction"></component>
        </template>
        <template
            v-if="pagination.last_page > pagination.current_page "
        >

        </template>
        <InfiniteScrollObserver
            :loader-disable="pagination.last_page === pagination.current_page"
            :loader-method="paginateMessages" :loader-params="{page: 1}"></InfiniteScrollObserver>
      </div>
      <ChatBotFooter @send:message="sendMessage"></ChatBotFooter>
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
    display: flex;
    flex-direction: column-reverse;
  }

  &-footer {
    z-index: 2;
  }
}
</style>

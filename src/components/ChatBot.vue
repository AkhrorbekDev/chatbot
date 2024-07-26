<script setup lang="ts">
import {computed, h, inject, onMounted, onUnmounted, ref, watch} from "vue";
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

const $auth = inject('$auth')
const loggedIn = computed(() => $auth.loggedIn)
const botman = new Botman({$auth})
const messages = ref<AnyMessage[]>([])
const messagesPaginator = ref({})
const message = {}
const chatContainer = ref(null)

const paginateMessages = () => {
  // if (messagesPaginator.value.current_page < messagesPaginator.value.last_page) {
  getMessages({page: messagesPaginator.value.current_page + 1})
      .finally((res) => {
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
  // }
}

const getMessages = (params = {}) => {
  return botman.getMessages({
    ...params
  })
}

const createSampleMessage = (content) => {
  return createSampleMessageDTO(content)
}


const sampleMessageRenderer = (message: SampleMessage) => {
  return h(MessageTemplate, {message}, {
    default: () => h('p', {}, message.content),
    actions: () => message.actions && message.actions.map((action) => {
      return h(ActionButton, {action}, {
        label: () => h('span', {}, action.text),
        img: () => action.icon ? h('img', {src: action.icon}) : false
      })
    })
  })
}
const productMessageRenderer = (message: ProductMessage) => {
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
    created_at: new Date().toISOString(),
    user: {
      id: '1',
      name: 'Botman',
      owner: false,
      avatar: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/3364143/download+%283%29+%281%29.png',
      last_sean: new Date().toISOString()
    }
  })
  messages.value.unshift(newMessage)
  // return botman.sendMessage(params).finally(() => {
  //
  // })
}

const lastItemId = ref(null)
const lastScrollHeight = ref(null)
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
  return messagesTemplates[message.content_type](message)
}

const initScroll = () => {
  const chat = chatContainer.value
  const loadMoreButton = document.getElementById("loadMoreButton");

  // Scroll to bottom on initial load
  chat.scrollTop = chat.scrollHeight;
}

onMounted(() => {
  initScroll()
  messages.value = [
    {
      content_type: ContentTypes.Text,
      content: 'Hi there! How can I help you today?',
      id: 1,
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
      id: 2,
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
      id: 3,
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
      id: 4,
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
  lastScrollHeight.value = chatContainer.value.scrollHeight
  lastItemId.value = messages.value[0].id
})

function test(e) {
  lastScrollEndHeight.value = e.target.scrollTop
  console.log(lastScrollEndHeight.value)
}

</script>

<template>
  <div class="chat-area">
    <template v-if="loggedIn">
      <div ref="chatContainer" class="chat-area-main" @scroll="test">
        <template v-for="message in messages">
          <component :is="renderer(message)" :message="message"></component>
        </template>
        <InfiniteScrollObserver :loader-method="paginateMessages" :loader-params="{page: 1}"></InfiniteScrollObserver>
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

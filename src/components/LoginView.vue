<script setup lang="ts">
import {Form as VeeForm, Field, ErrorMessage} from 'vee-validate'
import PhoneInput from "@/components/PhoneInput.vue";
import BaseInput from "@/components/BaseInput.vue";
import {inject, ref, watch} from "vue";
import {defineRule} from 'vee-validate';
import {required, length} from '@vee-validate/rules';
import ActionButton from "@/components/ActionButton.vue";
import {Authorization} from "@/core/Api/Authorization.js";
import useLoading from "@/composables/useLoading";

defineRule('required', required);
defineRule('length', length);

const phoneRef = ref(null)
const vee_form = ref(null)
const phone = ref('')
const password = ref('')
const phoneCode = ref('+998')
const smsSending = useLoading()
const submiting = useLoading()
const isRegistered = ref(false)
const $auth = inject('$auth')
const authorization = new Authorization({$auth})
const loginType = ref('login')
const inputType = ref('password')
const userChecked = ref(false)

let phoneNumber = ref('')

watch(phone, (value) => {
  const prefix = phoneCode.value?.toLocaleString().replace(/\D/g, '')
  const phoneShort = phone.value?.replace(/[\D]/g, '')
  phoneNumber.value = prefix + phoneShort
  const validLength = phoneRef.value?._phoneCodes[prefix]?.validationLength || 9

  if (smsSending.value.idle.value) return
  smsSending.value.stop()
  vee_form.value.setFieldError('error_field', '')
  if (phoneShort.length === validLength) {
    smsSending.value.start()
    userChecked.value = false

    authorization.checkUser(phoneNumber.value).then(async (response) => {
      isRegistered.value = response.data.exists
      if (!isRegistered.value) {
        await sendSms().then(() => {
          loginType.value = LoginType.register
          inputType.value = 'text'
        })
      }
      smsSending.value.stop()
      userChecked.value = true
    }).catch((error) => {
      vee_form.value.setFieldError('error_field', error.message)

      smsSending.value.stop()
    })
  } else {
    console.log('invalid phone number')
  }
})

enum LoginType {
  login = 'login',
  register = 'register',
  loginWithSms = 'loginWithSms',
  sendSms = 'sendSms'
}

watch(isRegistered, (newVal) => {
  if (!newVal) {
    loginType.value = LoginType.register
    inputType.value = 'text'
  } else {
    loginType.value = LoginType.login
    inputType.value = 'password'
  }
})

const submitHandlers = {
  [LoginType.login]: login,
  [LoginType.register]: register,
  [LoginType.loginWithSms]: loginWithSms,
  [LoginType.sendSms]: sendSms
}

function submit() {
  return vee_form.value.validate()
      .then(async res => {
        if (res.valid && !submiting.value.idle.value) {
          submiting.value.start()
          await submitHandlers[loginType.value]()
          submiting.value.stop()
        } else {
          console.log(res)
        }
      })
}

function sendSms() {
  return authorization.sendSms({phone: phoneNumber.value})
}

function login() {
  return $auth.login({
    body: {
      username: phoneNumber.value,
      password: password.value
    }
  })
}

function loginWithSms() {
  return
}

function register() {

}
</script>

<template>
  <div class="login-view">
    <div class="login-view__form">
      <div class="login-view__form-bg"></div>
      <div class="login-view__form-form">
        <h1 class="login-view__form-title">Войти</h1>

        <VeeForm ref="vee_form" @submit.prevent>

          <Field name="error_field">
            <ErrorMessage class="validation-error" name="error_field"/>
          </Field>

          <Field
              v-model="phone"
              name="phone"
              :rules="`required|length:${phoneRef?._phoneCodes[phoneCode] ? phoneRef._phoneCodes[phoneCode].validationLength : 9}`"
          >
            <PhoneInput
                ref="phoneRef"
                v-model="phone"
                label="phone number"
                :code="phoneCode"
                :loading="smsSending.idle"
                :masked-value="false"
                @select:code="phoneCode = $event"
            />
          </Field>
          <template
              v-if="userChecked"
          >
            <Field
                v-model="password"
                name="password"
                rules="required"
            >
              <label class="login-view__form-label">
                <span>password</span>
                <BaseInput v-model="password" :type="inputType"/>
              </label>
            </Field>
            <ActionButton :class="{__loading: submiting.idle}" type="button" @on:action="submit">
              <template #label>
                test
              </template>
            </ActionButton>
          </template>
        </VeeForm>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-view {
  position: absolute;
  z-index: 2;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  bottom: 0;


  &__form {
    position: relative;
    padding: 18px 10px;
    margin: auto auto;
    max-width: 80%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    top: -10%;
    align-items: center;
    justify-content: center;

    &-label {
      span {
        color: var(--input-chat-color);
        margin-bottom: 8px;
        display: block;
      }
    }

    &:deep(.phone-input) {
      .phone-input__wrapper {
        border: none;
      }

      .phone-input__wrapper, .input, .phone-input__prefix-list {
        color: var(--body-color);
        background-color: var(--input-bg);
      }

      .phone-input__prefix .icon {
        path {
          fill: var(--body-color);
        }
      }

    }

    &:deep(.base-input) {
      height: 48px;
    }

    &-title {
      font-size: 24px;
      color: #fff;
      text-align: center;
    }


    &-bg {
      display: block;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      filter: blur(10px);
      z-index: 1;

      &:before {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        //background: rgb(0 0 0 / 44%);
        z-index: 2;
      }
    }

    &-form, form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    &-form, form {
      position: relative;
      z-index: 3;
    }

  }
}
</style>

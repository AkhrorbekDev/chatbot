<script setup>
import {Form as VeeForm, Field, ErrorMessage} from 'vee-validate'
import PhoneInput from "@/components/PhoneInput.vue";
import BaseInput from "@/components/BaseInput.vue";
import {ref, watch} from "vue";
import {defineRule} from 'vee-validate';
import {required} from '@vee-validate/rules';

defineRule('required', required);
const phoneRef = ref(null)
const phone = ref('')
const password = ref('')
const phoneCode = ref('+998')
const smsSending = ref(false)
const isRegistered = ref(false)

watch(phone, (value) => {
  const prefix = phoneCode.value?.toLocaleString().replace(/\D/g, '')
  const phoneShort = phone.value?.replace(/[\D]/g, '')
  const phoneNumber = prefix + phoneShort
  const validLength = phoneRef.value?._phoneCodes[phoneCode]?.validationLength || 9
  console.log(phoneShort, validLength)
  if (smsSending.value) return
  smsSending.value = false
  if (phoneShort.length === validLength) {
    smsSending.value = true
    console.log('send sms', phoneNumber);
  } else {
    console.log('invalid phone number')
  }
})

</script>

<template>
  <div class="login-view">
    <div class="login-view__form">
      <div class="login-view__form-bg"></div>
      <div class="login-view__form-form">
        <h1 class="login-view__form-title">Войти</h1>

        <VeeForm>
          <Field
              v-model="phone"
              name="phone"
              rules="required"
              :rules="`required|length:${phoneRef?._phoneCodes[phoneCode] ?
              phoneRef._phoneCodes[phoneCode].validationLength : 9}`"
          >
            <PhoneInput
                ref="phoneRef"
                v-model="phone"
                :code="phoneCode"
                :loading="smsSending"
                @select:code="phoneCode = $event"
            />
          </Field>

          <Field
              v-model="password"
              name="password"
              rules="required"
          >
            <BaseInput/>
          </Field>
          <button type="submit">Login</button>
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

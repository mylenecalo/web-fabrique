<script setup>
import { requiredValidator, emailValidator } from '@/utils/validators';
import { ref } from 'vue'

const isPasswordVisible = ref(false)
const refVform = ref()

const formDataDefault = {
  email: '',
  password: '',
}

const formData = ref({
  ...formDataDefault
})

const onSubmit = () => {
  alert(formData.value.email)
}


const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid)
    onSubmit()
  })
}
</script>

<template>
                  <v-form ref="refVform" @submit.prevent="onFormSubmit">
                    <v-text-field
                    v-model="formData.email"
                      label="Email" prepend-inner-icon="mdi-email" :rules="[requiredValidator, emailValidator]"></v-text-field>

                    <v-text-field
                    v-model="formData.password"
                      prepend-inner-icon="mdi-lock"
                      label="Password"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye' "
                      @click:append-inner="isPasswordVisible = !isPasswordVisible"
                      :rules="[requiredValidator]"
                    ></v-text-field>

                    <v-btn class="mt-2" type="submit" block color="pink-darken-4" prepend-icon="mdi-login">Login</v-btn>
                  </v-form>
</template>

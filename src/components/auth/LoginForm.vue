<script setup>
import { requiredValidator, emailValidator } from '@/utils/validators'
import { ref } from 'vue'
import { formActionDefault, supabase } from '@/utils/supabase'
import { useRouter } from 'vue-router'
import AlertNotification from '../common/AlertNotification.vue'
const router = useRouter()

// Load Variables
const formDataDefault = {
  email: '',
  password: '',
}
const formData = ref({
  ...formDataDefault,
})
const formAction = ref({
  ...formActionDefault,
})
const isPasswordVisible = ref(false)
const refVForm = ref()

const onSubmit = async () => {
  // Reset Form Action utils; Turn on processing at the same time
  formAction.value = { ...formActionDefault, formProcess: true }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: formData.value.email,
    password: formData.value.password,
  })

  if (error) {
    // Add Error Message and Status Code
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    // Add Success Message
    formAction.value.formSuccessMessage = 'Successfully Logged Account.'
    // Redirect Acct to Dashboard
    router.replace('/home')
  }

  // Reset Form
  refVForm.value?.reset()
  // Turn off processing
  formAction.value.formProcess = false
}

const onFormSubmit = () => {
  refVForm.value?.validate().then(({ valid }) => {
    if (valid) onSubmit()
  })
}
</script>

<template>
  <AlertNotification
    :form-success-message="formAction.formSuccessMessage"
    :form-error-message="formAction.formErrorMessage"
  ></AlertNotification>
  
  <v-form ref="refVForm" @submit.prevent="onFormSubmit" class="login-form">
    <v-text-field
      v-model="formData.email"
      label="Email"
      prepend-inner-icon="mdi-email-outline"
      variant="outlined"
      color="pink-darken-3"
      class="mb-4 rounded-lg"
      hide-details="auto"
      :rules="[requiredValidator, emailValidator]"
    ></v-text-field>
    
    <v-text-field
      v-model="formData.password"
      prepend-inner-icon="mdi-lock-outline"
      label="Password"
      variant="outlined"
      color="pink-darken-3"
      class="mb-6 rounded-lg"
      hide-details="auto"
      :type="isPasswordVisible ? 'text' : 'password'"
      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
      @click:append-inner="isPasswordVisible = !isPasswordVisible"
      :rules="[requiredValidator]"
    ></v-text-field>
    
    <v-btn
      type="submit"
      block
      color="pink-darken-3"
      size="large"
      class="mb-4 text-capitalize"
      rounded="pill"
      elevation="1"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
    >
      Sign In
    </v-btn>
  </v-form>
</template>

<style scoped>
.login-form {
  max-width: 100%;
}

:deep(.v-field__outline) {
  border-radius: 12px !important;
}

:deep(.v-field--variant-outlined .v-field__outline__start) {
  border-radius: 12px 0 0 12px !important;
}

:deep(.v-field--variant-outlined .v-field__outline__end) {
  border-radius: 0 12px 12px 0 !important;
}
</style>

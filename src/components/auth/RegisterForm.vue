<script setup>
import {
  requiredValidator,
  emailValidator,
  passwordValidator,
  confirmedValidator,
} from '@/utils/validators'
import { ref } from 'vue'
import AlertNotification from '@/components/common/AlertNotification.vue'
import { supabase, formActionDefault } from '@/utils/supabase.js'
import { useRouter } from 'vue-router'

// Utilize pre-defined vue functions
const router = useRouter()

// Load Variables
const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: '',
}
const formData = ref({
  ...formDataDefault,
})
const formAction = ref({
  ...formActionDefault,
})
const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
const refVForm = ref()

// Register Functionality
const onSubmit = async () => {
  // Reset Form Action utils
  formAction.value = { ...formActionDefault, formProcess: true }

  const { data, error } = await supabase.auth.signUp({
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname,
        lastname: formData.value.lastname,
        is_admin: false, // Just turn to true if super admin account
        // role: 'Administrator' // If role based; just change the string based on role
      },
    },
  })

  if (error) {
    // Add Error Message and Status Code
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  } else if (data) {
    // Add Success Message
    formAction.value.formSuccessMessage = 'Successfully Registered Account.'
    // Redirect Acct to Dashboard
    router.replace('/home')
  }

  // Reset Form
  refVForm.value?.reset()
  // Turn off processing
  formAction.value.formProcess = false
}

// Trigger Validators
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

  <v-form ref="refVForm" @submit.prevent="onFormSubmit" class="register-form">
    <v-row dense>
      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.firstname"
          label="First Name"
          variant="outlined"
          color="pink-darken-3"
          class="mb-3 rounded-lg"
          hide-details="auto"
          :rules="[requiredValidator]"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.lastname"
          label="Last Name"
          variant="outlined"
          color="pink-darken-3"
          class="mb-3 rounded-lg"
          hide-details="auto"
          :rules="[requiredValidator]"
        ></v-text-field>
      </v-col>

      <v-col cols="12">
        <v-text-field
          v-model="formData.email"
          label="Email"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
          color="pink-darken-3"
          class="mb-3 rounded-lg"
          hide-details="auto"
          :rules="[requiredValidator, emailValidator]"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.password"
          prepend-inner-icon="mdi-lock-outline"
          label="Password"
          variant="outlined"
          color="pink-darken-3"
          class="mb-3 rounded-lg"
          hide-details="auto"
          :type="isPasswordVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordVisible = !isPasswordVisible"
          :rules="[requiredValidator, passwordValidator]"
        ></v-text-field>
      </v-col>

      <v-col cols="12" sm="6">
        <v-text-field
          v-model="formData.password_confirmation"
          label="Confirm Password"
          variant="outlined"
          color="pink-darken-3"
          class="mb-3 rounded-lg"
          hide-details="auto"
          :type="isPasswordConfirmVisible ? 'text' : 'password'"
          :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
          :rules="[
            requiredValidator,
            confirmedValidator(formData.password_confirmation, formData.password),
          ]"
        ></v-text-field>
      </v-col>
    </v-row>

    <div class="mt-4 mb-2 text-body-2">
      By creating an account, you agree to our <a href="#" class="text-decoration-none text-pink-lighten-2">Terms of Service</a> and <a href="#" class="text-decoration-none text-pink-lighten-2">Privacy Policy</a>.
    </div>

    <v-btn
      class="mt-4"
      type="submit"
      color="pink-darken-3"
      size="large"
      rounded="pill"
      elevation="1"
      :disabled="formAction.formProcess"
      :loading="formAction.formProcess"
      block
    >
      Create Account
    </v-btn>
  </v-form>
</template>

<style scoped>
.register-form {
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

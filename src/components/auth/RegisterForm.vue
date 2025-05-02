<script setup>
import { requiredValidator, emailValidator, passwordValidator, confirmedValidator } from '@/utils/validators';
import { ref } from 'vue'
import { supabase, formActionDefault } from '@/utils/supabase';
import AlertNotification from '@/components/common/AlertNotification.vue';

const formDataDefault = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
  password_confirmation: '',
}

const formData = ref({
  ...formDataDefault
})

const formAction = ref({
  ...formActionDefault
})

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
const refVform = ref()

const onSubmit = async () => {
  formAction.value = { ...formActionDefault }
formAction.value.formProcess = true


  const { data, error } = await supabase.auth.signUp(
  {
    email: formData.value.email,
    password: formData.value.password,
    options: {
      data: {
        firstname: formData.value.firstname ,
        lastname: formData.value.lastname,
      }
    }
  }
  )

  if (error) {
    console.log(error)
    formAction.value.formErrorMessage = error.message
    formAction.value.formStatus = error.status
  }

  else if (data) {
    console.log(data)
    formAction.value.formSuccessMessage = 'Successfully Registered Account.'
    //add here more actions if you want
    refVform.value?.reset()
  }
formAction.value.formProcess = false
}


const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid)
    onSubmit()
  })
}
</script>

<template>
<AlertNotification :form-success-message="formAction.formSuccessMessage" :form-error-message="formAction.formErrorMessage"></AlertNotification>


<v-form class="mt-5" ref="refVform"  @submit.prevent="onFormSubmit">
             <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field v-model="formData.firstname" label="First Name" :rules="[requiredValidator]"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field v-model="formData.lastname" label="Last Name" :rules="[requiredValidator]"></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field v-model="formData.email" label="Email" prepend-inner-icon="mdi-email"
                    :rules="[requiredValidator, emailValidator]"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field v-model="formData.password"
                    prepend-inner-icon="mdi-lock"
                      label="Password"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye' "
                      @click:append-inner="isPasswordVisible = !isPasswordVisible"
                      :rules="[requiredValidator, passwordValidator]"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field v-model="formData.password_confirmation"
                    prepend-inner-icon="mdi-lock"
                      label="Password Confirmation"
                      :type="isPasswordConfirmVisible ? 'text' : 'password'"
                      :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye' "
                      @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
                      :rules="[requiredValidator, confirmedValidator(formData.password_confirmation, formData.password)]"
                    ></v-text-field>
                  </v-col>

                    <v-btn class="mt-2" type="submit" block color="pink-darken-4" prepend-icon="mdi-account-plus"
                    :disabled="formAction.formProcess"
                    :loading="formAction.formProcess"
                    >Register</v-btn>
                  </v-row>
                  </v-form>

</template>

<script setup>
import { requiredValidator, emailValidator, passwordValidator, confirmedValidator } from '@/utils/validators';
import { ref } from 'vue'

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

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
const refVform = ref()

const onSubmit = () => {
  alert(formData.value.email),  alert(formData.value.password)

}


const onFormSubmit = () => {
  refVform.value?.validate().then(({ valid }) => {
    if (valid)
    onSubmit()
  })
}
</script>

<template>

<v-form ref="refVform"  @submit.prevent="onFormSubmit">
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

                    <v-btn class="mt-2" type="submit" block color="pink-darken-4" prepend-icon="mdi-account-plus">Register</v-btn>
                  </v-row>
                  </v-form>

</template>

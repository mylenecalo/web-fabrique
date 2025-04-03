<script setup>
import { ref } from 'vue'

const isPasswordVisible = ref(false)
const isPasswordConfirmVisible = ref(false)
</script>

<template>

<v-form fast-fail @submit.prevent>
             <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field label="First Name"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field label="Last Name"></v-text-field>
                  </v-col>

                  <v-col cols="12">
                    <v-text-field label="Email" prepend-inner-icon="mdi-email"></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                    prepend-inner-icon="mdi-lock"
                      label="Password"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye' "
                      @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    ></v-text-field>
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-text-field
                    prepend-inner-icon="mdi-lock"
                      label="Password Confirmation"
                      :type="isPasswordConfirmVisible ? 'text' : 'password'"
                      :append-inner-icon="isPasswordConfirmVisible ? 'mdi-eye-off' : 'mdi-eye' "
                      @click:append-inner="isPasswordConfirmVisible = !isPasswordConfirmVisible"
                    ></v-text-field>
                  </v-col>

                    <v-btn class="mt-2" type="submit" block color="pink-darken-4" prepend-icon="mdi-account-plus">Register</v-btn>
                  </v-row>
                  </v-form>

</template>

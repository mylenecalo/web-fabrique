<script setup>
import { ref } from 'vue'

const isPasswordVisible = ref(false)
</script>

<template>
                  <v-form fast-fail @submit.prevent>
                    <v-text-field
                      label="Email" prepend-inner-icon="mdi-email"></v-text-field>

                    <v-text-field
                      prepend-inner-icon="mdi-lock"
                      label="Password"
                      :type="isPasswordVisible ? 'text' : 'password'"
                      :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye' "
                      @click:append-inner="isPasswordVisible = !isPasswordVisible"
                    ></v-text-field>

                    <v-btn class="mt-2" type="submit" block color="pink-darken-4" prepend-icon="mdi-login">Login</v-btn>
                  </v-form>
</template>

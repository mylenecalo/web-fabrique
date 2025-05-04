<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const goToLogin = () => {
  router.replace('/')
}
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="5" class="text-center">
        <v-card class="py-8 px-6" elevation="3">
          <v-card-item>
            <v-icon
              size="120"
              color="pink-lighten-2"
              class="mb-4"
            >
              mdi-shield-lock
            </v-icon>
            <v-card-title class="text-h3 mb-2">403</v-card-title>
            <v-card-subtitle class="text-h5 mb-4">
              Access Forbidden
            </v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <p class="text-body-1 mb-6">
              You don't have permission to access this page. Please log in to continue.
            </p>
            
            <v-divider class="my-4"></v-divider>
          </v-card-text>

          <v-card-actions class="justify-center">
            <v-btn
              color="grey-darken-1"
              variant="text"
              @click="goBack"
              class="mr-2"
            >
              Go Back
            </v-btn>
            <v-btn
              color="pink-lighten-2"
              variant="elevated"
              @click="goToLogin"
            >
              Go to Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

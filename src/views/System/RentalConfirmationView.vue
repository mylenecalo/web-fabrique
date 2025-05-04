<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppLayout from '@/components/layout/AppLayout.vue'

const router = useRouter()
const countdown = ref(10)

onMounted(() => {
  // Start countdown to redirect to home
  const timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer)
      router.push('/home')
    }
  }, 1000)
})
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6">
            <v-card class="text-center py-6 px-4" elevation="3">
              <v-card-item>
                <v-icon
                  size="96"
                  color="pink-lighten-2"
                  class="mb-4"
                >
                  mdi-check-circle
                </v-icon>
                <v-card-title class="text-h4 mb-2">Thank You!</v-card-title>
                <v-card-subtitle class="text-h6 mb-4">
                  Your rental order has been confirmed
                </v-card-subtitle>
              </v-card-item>

              <v-card-text>
                <p class="text-body-1 mb-4">
                  We've received your rental request and are processing it now. You'll receive a confirmation email shortly with all the details.
                </p>
                
                <v-divider class="my-4"></v-divider>
                
                <p class="text-body-2 text-medium-emphasis">
                  Redirecting to home page in {{ countdown }} seconds...
                </p>
              </v-card-text>

              <v-card-actions class="justify-center">
                <v-btn
                  color="pink-lighten-2"
                  variant="elevated"
                  @click="router.push('/home')"
                >
                  Return to Home
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

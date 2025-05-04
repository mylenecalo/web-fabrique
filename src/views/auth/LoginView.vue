<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import LoginForm from '@/components/auth/LoginForm.vue'
import { useDisplay } from 'vuetify'
import { ref } from 'vue'

const { mobile } = useDisplay()
const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid class="auth-container pa-0 ma-0 fill-height">
        <v-row no-gutters class="fill-height">
          <!-- Left side - Image/Banner (hidden on mobile) -->
          <v-col cols="12" md="7" class="d-none d-md-flex" style="position: relative;">
            <div class="auth-banner-overlay"></div>
            <v-img
              src="/images/auth-banner.jpg"
              cover
              class="h-100"
              alt="Fabrique Clothing"
            >
              <div class="d-flex flex-column justify-center align-center h-100 position-relative">
                <div class="text-center auth-banner-content">
                  <h1 class="text-h3 font-weight-bold white--text mb-4">Welcome to Fabrique</h1>
                  <p class="text-h6 white--text">Rent premium clothing for any occasion</p>
                </div>
              </div>
            </v-img>
          </v-col>

          <!-- Right side - Login Form -->
          <v-col cols="12" md="5" class="d-flex align-center justify-center">
            <v-card class="auth-card mx-auto pa-6" elevation="0" max-width="500" width="100%">
              <v-card-title class="text-center pt-8 pb-4">
                <v-img
                  class="mx-auto mb-4"
                  src="/images/logo-fabrique.png"
                  :width="mobile ? '120' : '150'"
                  alt="Fabrique Logo"
                ></v-img>
                <h2 class="text-h4 font-weight-bold text-pink-darken-3">Sign In</h2>
                <p class="text-subtitle-1 text-medium-emphasis mt-2">
                  Enter your credentials to access your account
                </p>
              </v-card-title>

              <v-card-text>
                <LoginForm />
                
                <v-divider class="my-6"></v-divider>
                
                <div class="text-center">
                  <p class="mb-4">Don't have an account?</p>
                  <v-btn
                    to="/register"
                    variant="outlined"
                    color="pink-lighten-2"
                    class="px-6"
                    rounded="pill"
                  >
                    Create Account
                  </v-btn>
                </div>
              </v-card-text>
              
              <v-card-text class="text-center text-caption text-medium-emphasis pt-0">
                &copy; {{ currentYear }} Fabrique. All rights reserved.
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </AppLayout>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
}

.auth-card {
  border-radius: 16px;
}

.auth-banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(233, 30, 99, 0.7), rgba(156, 39, 176, 0.7));
  z-index: 1;
}

.auth-banner-content {
  position: relative;
  z-index: 2;
  padding: 2rem;
  max-width: 80%;
}

@media (max-width: 600px) {
  .auth-card {
    border-radius: 0;
    box-shadow: none !important;
  }
}
</style>

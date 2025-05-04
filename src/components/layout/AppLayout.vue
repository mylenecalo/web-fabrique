<script setup>
import { ref, onMounted } from 'vue'
const theme = ref(localStorage.getItem('theme') ?? 'light')
import ProfileHeader from './ProfileHeader.vue'
import { useAuthUserStore } from '@/stores/authUser'
import { useRentalStore } from '@/stores/rentalStore'
import CartDrawer from '@/components/rental/CartDrawer.vue'

const authStore = useAuthUserStore()
const rentalStore = useRentalStore()

const isLoggedIn = ref(false)
const showCart = ref(false)

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}

const getLoggedStatus = async () => {
  isLoggedIn.value = await authStore.isAuthenticated()
}

onMounted(() => {
  getLoggedStatus()
})
</script>

<template>
  <v-responsive>
    <v-app :theme="theme">
      <v-app-bar
        class="px-3"
        :color="theme === 'light' ? 'pink-lighten-2' : 'pink-darken-3'"
        border
      >
        <v-spacer></v-spacer>
        
        <!-- Cart Icon (only show if logged in) -->
        <v-badge
          v-if="isLoggedIn"
          :content="rentalStore.cartCount"
          :model-value="rentalStore.cartCount > 0"
          color="pink-darken-2"
          class="mr-2"
        >
          <v-btn
            icon="mdi-cart"
            variant="text"
            @click="showCart = true"
          ></v-btn>
        </v-badge>
        
        <ProfileHeader v-if="isLoggedIn"></ProfileHeader>
        <v-btn
          :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
          variant="elevated"
          color="pink-lighten-3"
          slim
          @click="onClick"
          class="ml-4"
        ></v-btn>
      </v-app-bar>

      <v-main>
        <slot name="content"></slot>
      </v-main>
      <v-footer
        class="font-weight-bold"
        :color="theme === 'light' ? 'pink-lighten-2' : 'pink-darken-3'"
        elavation="24"
        border
        app
        >2025 - Fabrique</v-footer
      >
      
      <!-- Cart Drawer -->
      <CartDrawer v-model="showCart" />
    </v-app>
  </v-responsive>
</template>

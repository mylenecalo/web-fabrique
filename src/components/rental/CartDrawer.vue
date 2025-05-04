<script setup>
import { ref, computed } from 'vue'
import { useRentalStore } from '@/stores/rentalStore'
import { useRouter } from 'vue-router'

const props = defineProps({
  modelValue: Boolean,
})

const emit = defineEmits(['update:modelValue'])

const rentalStore = useRentalStore()
const router = useRouter()

const drawer = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const startDate = ref(new Date().toISOString().substr(0, 10))
const endDate = ref(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().substr(0, 10))

// Apply dates to all items
const applyDatesToAll = () => {
  rentalStore.cartItems.forEach((item) => {
    rentalStore.updateRentalDates(item.item_name, startDate.value, endDate.value)
  })
}

// Checkout function
const checkout = async () => {
  // Apply dates to all items first
  applyDatesToAll()

  // Validate that all items have dates
  const allItemsHaveDates = rentalStore.cartItems.every(
    (item) => item.rental_start_date && item.rental_end_date,
  )

  if (!allItemsHaveDates) {
    rentalStore.error = 'Please select rental dates for all items'
    return
  }

  // Submit the rental order
  const success = await rentalStore.submitRentalOrder()

  if (success) {
    drawer.value = false
    // Show success message or redirect to confirmation page
    router.push('/rental-confirmation')
  }
}
</script>

<template>
  <v-navigation-drawer v-model="drawer" location="right" temporary width="400">
    <v-card flat>
      <v-toolbar color="pink-lighten-2" density="compact">
        <v-toolbar-title>Your Rental Cart</v-toolbar-title>
        <template v-slot:append>
          <v-btn icon="mdi-close" variant="text" @click="drawer = false"></v-btn>
        </template>
      </v-toolbar>

      <div v-if="rentalStore.cartItems.length === 0" class="pa-6 text-center">
        <v-icon size="64" color="pink-lighten-3">mdi-cart-outline</v-icon>
        <h3 class="mt-4">Your cart is empty</h3>
        <p class="text-medium-emphasis">Add items to your cart to get started</p>
        <v-btn color="pink-lighten-2" variant="elevated" class="mt-4" @click="drawer = false">
          Browse Items
        </v-btn>
      </div>

      <div v-else>
        <!-- Rental Dates -->
        <div class="pa-4 border-b">
          <h3 class="text-subtitle-1 font-weight-bold mb-3">Select Rental Dates</h3>
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                v-model="startDate"
                label="Start Date"
                type="date"
                variant="outlined"
                density="compact"
                color="pink-lighten-2"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="endDate"
                label="End Date"
                type="date"
                variant="outlined"
                density="compact"
                color="pink-lighten-2"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-btn block color="pink-lighten-3" variant="tonal" size="small" @click="applyDatesToAll">
            Apply to All Items
          </v-btn>
        </div>

        <!-- Cart Items -->
        <v-list lines="two">
          <v-list-item
            v-for="item in rentalStore.cartItems"
            :key="item.item_name"
            :title="item.item_name"
            :subtitle="`₱${item.item_price}`"
          >
            <template v-slot:prepend>
              <v-avatar size="60" rounded class="bg-grey-lighten-2">
                <v-img 
                  :src="item.image_url" 
                  cover
                  position="center"
                >
                  <template v-slot:placeholder>
                    <div class="d-flex align-center justify-center fill-height">
                      <v-progress-circular indeterminate size="24" color="pink-lighten-3"></v-progress-circular>
                    </div>
                  </template>
                </v-img>
              </v-avatar>
            </template>

            <template v-slot:append>
              <v-btn
                icon="mdi-delete"
                variant="text"
                color="pink-lighten-2"
                size="small"
                @click="rentalStore.removeFromCart(item.item_name)"
              ></v-btn>
            </template>
          </v-list-item>
        </v-list>

        <!-- Cart Summary -->
        <div class="pa-4">
          <div class="d-flex justify-space-between mb-2">
            <span class="text-subtitle-1">Items:</span>
            <span class="text-subtitle-1">{{ rentalStore.cartCount }}</span>
          </div>
          <div class="d-flex justify-space-between mb-4">
            <span class="text-h6 font-weight-bold">Total:</span>
            <span class="text-h6 font-weight-bold">₱{{ rentalStore.cartTotal }}</span>
          </div>

          <v-btn
            block
            color="pink-darken-1"
            size="large"
            variant="elevated"
            :loading="rentalStore.loading"
            :disabled="rentalStore.loading"
            @click="checkout"
          >
            Complete Rental
          </v-btn>

          <v-btn block variant="text" class="mt-2" @click="rentalStore.clearCart">
            Clear Cart
          </v-btn>
        </div>

        <!-- Error Message -->
        <v-alert
          v-if="rentalStore.error"
          type="error"
          variant="tonal"
          class="mx-4 mb-4"
          closable
          @click:close="rentalStore.error = null"
        >
          {{ rentalStore.error }}
        </v-alert>
      </div>
    </v-card>
  </v-navigation-drawer>
</template>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>

<script setup>
import { computed } from 'vue'
import { useRentalStore } from '@/stores/rentalStore'
import { useAuthUserStore } from '@/stores/authUser'

const props = defineProps({
  modelValue: Boolean,
  item: Object,
})

const emit = defineEmits(['update:modelValue'])

const rentalStore = useRentalStore()
const authStore = useAuthUserStore()

const dialog = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const isAuthenticated = computed(() => !!authStore.userData)

// Add to cart function
const addToCart = () => {
  if (props.item) {
    rentalStore.addToCart(props.item)
    dialog.value = false
  }
}
</script>

<template>
  <v-dialog v-model="dialog" max-width="800" scrollable>
    <v-card v-if="item">
      <v-img 
        :src="item.image_url" 
        height="400" 
        class="bg-grey-lighten-2"
        position="center"
        contain
      >
        <template v-slot:placeholder>
          <v-row class="fill-height ma-0" align="center" justify="center">
            <v-progress-circular indeterminate color="pink-lighten-3"></v-progress-circular>
          </v-row>
        </template>
      </v-img>

      <v-card-title class="text-h5 pt-4">
        {{ item.item_name }}
        <v-chip
          class="ml-2"
          size="small"
          :color="item.item_category === 'Men' ? 'blue-lighten-3' : 'pink-lighten-3'"
        >
          {{ item.item_category }}
        </v-chip>
      </v-card-title>

      <v-card-text>
        <div class="text-h6 font-weight-bold mb-2">₱{{ item.item_price }}</div>

        <v-divider class="my-3"></v-divider>

        <div class="text-body-1 mb-4">
          {{ item.item_description }}
        </div>

        <v-row>
          <v-col cols="12" md="6">
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="pink-lighten-2">mdi-tag</v-icon>
                </template>
                <v-list-item-title>Category</v-list-item-title>
                <v-list-item-subtitle>{{ item.item_category }}</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="pink-lighten-2">mdi-package-variant</v-icon>
                </template>
                <v-list-item-title>Availability</v-list-item-title>
                <v-list-item-subtitle>
                  <v-chip
                    size="x-small"
                    :color="item.item_stock > 5 ? 'green-lighten-3' : 'amber-lighten-3'"
                  >
                    {{ item.item_stock }} in stock
                  </v-chip>
                </v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>

          <v-col cols="12" md="6">
            <v-list density="compact">
              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="pink-lighten-2">mdi-calendar-range</v-icon>
                </template>
                <v-list-item-title>Rental Period</v-list-item-title>
                <v-list-item-subtitle>Minimum 1 day, Maximum 30 days</v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <template v-slot:prepend>
                  <v-icon color="pink-lighten-2">mdi-truck-delivery</v-icon>
                </template>
                <v-list-item-title>Delivery</v-list-item-title>
                <v-list-item-subtitle>Free delivery for rentals over ₱500</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-col>
        </v-row>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="dialog = false"> Close </v-btn>
        <v-btn
          color="pink-lighten-2"
          variant="elevated"
          :disabled="!isAuthenticated"
          @click="addToCart"
        >
          {{ isAuthenticated ? 'Add to Cart' : 'Login to Rent' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

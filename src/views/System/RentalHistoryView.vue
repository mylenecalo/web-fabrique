<script setup>
import { ref, onMounted } from 'vue'
import AppLayout from '@/components/layout/AppLayout.vue'
import { useRentalStore } from '@/stores/rentalStore'
import { formatDate } from '@/utils/formatters'

const rentalStore = useRentalStore()
const loading = ref(true)
const noHistory = ref(false)

// Status color mapping
const statusColors = {
  'pending': 'amber-lighten-2',
  'confirmed': 'green-lighten-2',
  'active': 'blue-lighten-2',
  'completed': 'indigo-lighten-2',
  'cancelled': 'red-lighten-2'
}

// Load rental history
onMounted(async () => {
  loading.value = true
  const success = await rentalStore.fetchRentalHistory()
  
  if (success) {
    noHistory.value = rentalStore.rentalHistory.length === 0
  }
  
  loading.value = false
})

// Format date for display
function formatDisplayDate(dateString) {
  if (!dateString) return 'N/A'
  return formatDate(dateString)
}
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container>
        <v-row class="mb-6">
          <v-col cols="12">
            <h1 class="text-h4 font-weight-bold" style="color: #ad1457;">Rental History</h1>
            <p class="text-subtitle-1">View your past and current rentals</p>
          </v-col>
        </v-row>
        
        <!-- Loading State -->
        <v-row v-if="loading" justify="center" class="my-12">
          <v-col cols="12" class="text-center">
            <v-progress-circular
              indeterminate
              color="pink-lighten-2"
              size="64"
            ></v-progress-circular>
            <p class="mt-4 text-body-1">Loading your rental history...</p>
          </v-col>
        </v-row>
        
        <!-- Empty State -->
        <v-row v-else-if="noHistory" justify="center" class="my-12">
          <v-col cols="12" sm="8" md="6" class="text-center">
            <v-icon size="64" color="pink-lighten-3" class="mb-4">mdi-calendar-blank</v-icon>
            <h3 class="text-h5 mb-2">No Rental History</h3>
            <p class="text-body-1 mb-6">You haven't rented any items yet. Browse our collection to find something you like!</p>
            <v-btn color="pink-lighten-2" variant="elevated" to="/home">
              Browse Collection
            </v-btn>
          </v-col>
        </v-row>
        
        <!-- Rental History List -->
        <template v-else>
          <v-row>
            <v-col cols="12">
              <v-card v-for="order in rentalStore.rentalHistory" :key="order.id" class="mb-4">
                <v-card-item>
                  <template v-slot:prepend>
                    <v-avatar size="80" rounded class="mr-4 bg-grey-lighten-2">
                      <v-img 
                        :src="order.item?.image_url" 
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
                  
                  <v-card-title>
                    {{ order.item?.item_name || 'Item Unavailable' }}
                    <v-chip
                      size="small"
                      class="ml-2"
                      :color="statusColors[order.order_status] || 'grey'"
                    >
                      {{ order.order_status }}
                    </v-chip>
                  </v-card-title>
                  
                  <v-card-subtitle>
                    Order #{{ order.id.substring(0, 8) }} • {{ formatDisplayDate(order.created_at) }}
                  </v-card-subtitle>
                </v-card-item>
                
                <v-card-text>
                  <v-row>
                    <v-col cols="12" md="8">
                      <p class="text-body-2 mb-1">
                        <v-icon size="small" color="pink-lighten-2" class="mr-1">mdi-information-outline</v-icon>
                        <span class="font-weight-medium">Category:</span> {{ order.item?.item_category || 'N/A' }}
                      </p>
                      <p class="text-body-2 mb-1">
                        <v-icon size="small" color="pink-lighten-2" class="mr-1">mdi-calendar-range</v-icon>
                        <span class="font-weight-medium">Rental Period:</span> 
                        {{ formatDisplayDate(order.rental_start_date) }} to {{ formatDisplayDate(order.rental_end_date) }}
                      </p>
                      <p class="text-body-2">
                        <v-icon size="small" color="pink-lighten-2" class="mr-1">mdi-tag</v-icon>
                        <span class="font-weight-medium">Order Type:</span> {{ order.order_type }}
                      </p>
                    </v-col>
                    
                    <v-col cols="12" md="4" class="text-md-right">
                      <p class="text-h6 font-weight-bold">₱{{ order.total_price }}</p>
                    </v-col>
                  </v-row>
                </v-card-text>
                
                <v-divider></v-divider>
                
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn
                    v-if="order.order_status === 'pending'"
                    color="red-lighten-2"
                    variant="text"
                    size="small"
                  >
                    Cancel Order
                  </v-btn>
                  <v-btn
                    color="pink-lighten-2"
                    variant="text"
                    size="small"
                  >
                    View Details
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-container>
    </template>
  </AppLayout>
</template>

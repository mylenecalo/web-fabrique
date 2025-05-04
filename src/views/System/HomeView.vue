<script setup>
import AppLayout from '@/components/layout/AppLayout.vue'
import { ref, computed, onMounted } from 'vue'
import { items } from '@/components/common/items/items.js'
import { useAuthUserStore } from '@/stores/authUser'
import { useRentalStore } from '@/stores/rentalStore'
import ItemDetailModal from '@/components/rental/ItemDetailModal.vue'

const authStore = useAuthUserStore()
const rentalStore = useRentalStore()
const searchQuery = ref('')
const selectedCategory = ref('All')
const categories = ['All', 'Men', 'Women']
const selectedItem = ref(null)
const showItemDetail = ref(false)

// Filtered items based on search and category
const filteredItems = computed(() => {
  let result = items
  
  if (selectedCategory.value !== 'All') {
    result = result.filter(item => item.item_category === selectedCategory.value)
  }
  
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(item => 
      item.item_name.toLowerCase().includes(query) || 
      item.item_description.toLowerCase().includes(query)
    )
  }
  
  return result
})

// Check if user is authenticated
const isAuthenticated = ref(false)
onMounted(async () => {
  isAuthenticated.value = await authStore.isAuthenticated()
  
  // If authenticated, sync items to database
  if (isAuthenticated.value) {
    await rentalStore.syncItemsToDatabase()
  }
})

// Function to open item detail modal
const openItemDetail = (item) => {
  selectedItem.value = item
  showItemDetail.value = true
}
</script>

<template>
  <AppLayout>
    <template #content>
      <v-container fluid>
        <!-- Hero Section -->
        <v-row class="py-10" :style="{ background: 'linear-gradient(to right, #f8bbd0, #fce4ec)' }">
          <v-col cols="12" class="text-center">
            <h1 class="text-h2 font-weight-bold mb-4" style="color: #ad1457;">Fabrique</h1>
            <p class="text-h5 mb-6">Rent premium clothing for any occasion</p>
            <v-btn
              color="pink-darken-2"
              size="large"
              variant="elevated"
              class="text-white"
              @click="$vuetify.goTo('#browse')"
            >
              Browse Collection
            </v-btn>
          </v-col>
        </v-row>

        <!-- Search and Filter Section -->
        <v-row id="browse" class="mt-8">
          <v-col cols="12" md="6">
            <v-text-field
              v-model="searchQuery"
              label="Search items"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="comfortable"
              color="pink-lighten-2"
              hide-details
              class="rounded-pill"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="6">
            <v-select
              v-model="selectedCategory"
              :items="categories"
              label="Category"
              variant="outlined"
              density="comfortable"
              color="pink-lighten-2"
              hide-details
              class="rounded-pill"
            ></v-select>
          </v-col>
        </v-row>

        <!-- Items Grid -->
        <v-row class="mt-4">
          <v-col
            v-for="item in filteredItems"
            :key="item.item_name"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <v-card
              class="mx-auto h-100 d-flex flex-column"
              max-width="400"
              hover
              elevation="3"
            >
              <v-img
                :src="item.image_url"
                :aspect-ratio="1"
                class="bg-grey-lighten-2"
                cover
                position="center"
              >
                <template v-slot:placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate color="pink-lighten-3"></v-progress-circular>
                  </div>
                </template>
                <v-chip
                  class="ma-2"
                  :color="item.item_category === 'Men' ? 'blue-lighten-3' : 'pink-lighten-3'"
                >
                  {{ item.item_category }}
                </v-chip>
              </v-img>

              <v-card-title class="text-truncate">{{ item.item_name }}</v-card-title>

              <v-card-text class="flex-grow-1">
                <div class="text-truncate-2 mb-2">{{ item.item_description }}</div>
                <div class="d-flex justify-space-between align-center mt-2">
                  <span class="text-h6 font-weight-bold">₱{{ item.item_price }}</span>
                  <v-chip size="small" :color="item.item_stock > 5 ? 'green-lighten-3' : 'amber-lighten-3'">
                    {{ item.item_stock }} in stock
                  </v-chip>
                </div>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  block
                  color="pink-lighten-2"
                  variant="elevated"
                  @click="openItemDetail(item)"
                >
                  View Details
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-if="filteredItems.length === 0" class="mt-8">
          <v-col cols="12" class="text-center">
            <v-icon size="64" color="pink-lighten-3">mdi-hanger</v-icon>
            <h3 class="mt-4">No items found</h3>
            <p class="text-medium-emphasis">Try adjusting your search or filter criteria</p>
          </v-col>
        </v-row>

        <!-- Features Section -->
        <v-row class="my-12 py-8" style="background-color: #fce4ec;">
          <v-col cols="12" class="text-center mb-6">
            <h2 class="text-h4 font-weight-bold" style="color: #ad1457;">Why Choose Fabrique?</h2>
          </v-col>
          
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="48" color="pink-darken-1">mdi-tshirt-crew</v-icon>
            <h3 class="mt-3">Premium Selection</h3>
            <p class="px-4">High-quality formal attire for all occasions</p>
          </v-col>
          
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="48" color="pink-darken-1">mdi-truck-delivery</v-icon>
            <h3 class="mt-3">Easy Delivery</h3>
            <p class="px-4">Convenient delivery and pickup options</p>
          </v-col>
          
          <v-col cols="12" md="4" class="text-center">
            <v-icon size="48" color="pink-darken-1">mdi-cash-multiple</v-icon>
            <h3 class="mt-3">Save Money</h3>
            <p class="px-4">Why buy when you can rent for a fraction of the cost?</p>
          </v-col>
        </v-row>
      </v-container>
      
      <!-- Item Detail Modal -->
      <ItemDetailModal 
        v-model="showItemDetail"
        :item="selectedItem"
      />
    </template>
  </AppLayout>
</template>

<style scoped>
.text-truncate-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-clamp: 2; /* Adding for compatibility as per lint warning */
}
</style>

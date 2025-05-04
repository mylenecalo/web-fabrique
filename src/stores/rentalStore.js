import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/utils/supabase'
import { useAuthUserStore } from './authUser'
import { items as localItems } from '@/components/common/items/items.js'

export const useRentalStore = defineStore('rental', () => {
  // States
  const cartItems = ref([])
  const rentalHistory = ref([])
  const loading = ref(false)
  const error = ref(null)
  const dbItems = ref([])
  
  // Get auth store
  const authStore = useAuthUserStore()
  
  // Getters
  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + item.item_price
    }, 0)
  })
  
  const cartCount = computed(() => {
    return cartItems.value.length
  })
  
  // Actions
  function addToCart(item) {
    // Check if item is already in cart
    const existingItem = cartItems.value.find(cartItem => cartItem.item_name === item.item_name)
    
    if (!existingItem) {
      cartItems.value.push({
        ...item,
        rental_start_date: null,
        rental_end_date: null
      })
    }
  }
  
  function removeFromCart(itemName) {
    cartItems.value = cartItems.value.filter(item => item.item_name !== itemName)
  }
  
  function clearCart() {
    cartItems.value = []
  }
  
  function updateRentalDates(itemName, startDate, endDate) {
    const itemIndex = cartItems.value.findIndex(item => item.item_name === itemName)
    
    if (itemIndex !== -1) {
      cartItems.value[itemIndex].rental_start_date = startDate
      cartItems.value[itemIndex].rental_end_date = endDate
    }
  }
  
  // Sync local items to Supabase database
  async function syncItemsToDatabase() {
    if (!authStore.userData) {
      error.value = 'You must be logged in to sync items'
      return false
    }
    
    loading.value = true
    error.value = null
    
    try {
      // First, fetch existing items to avoid duplicates
      const { data: existingItems, error: fetchError } = await supabase
        .from('items')
        .select('item_name')
      
      if (fetchError) throw fetchError
      
      const existingItemNames = existingItems.map(item => item.item_name)
      
      // Filter out items that already exist
      const newItems = localItems.filter(item => !existingItemNames.includes(item.item_name))
      
      if (newItems.length === 0) {
        // All items already exist in the database
        console.log('All items already exist in the database')
        
        // Fetch and store all items for reference
        const { data, error: allItemsError } = await supabase
          .from('items')
          .select('*')
        
        if (allItemsError) throw allItemsError
        dbItems.value = data
        
        return true
      }
      
      // Prepare items for insertion with user_id
      const itemsToInsert = newItems.map(item => ({
        ...item,
        user_id: authStore.userData.id
      }))
      
      // Insert new items
      const { data, error: insertError } = await supabase
        .from('items')
        .insert(itemsToInsert)
        .select()
      
      if (insertError) throw insertError
      
      console.log(`Added ${data.length} new items to the database`)
      
      // Fetch and store all items for reference
      const { data: allItems, error: allItemsError } = await supabase
        .from('items')
        .select('*')
      
      if (allItemsError) throw allItemsError
      dbItems.value = allItems
      
      return true
    } catch (err) {
      error.value = err.message || 'Failed to sync items to database'
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function submitRentalOrder() {
    if (!authStore.userData) {
      error.value = 'You must be logged in to place an order'
      return false
    }
    
    if (cartItems.value.length === 0) {
      error.value = 'Your cart is empty'
      return false
    }
    
    loading.value = true
    error.value = null
    
    try {
      // Make sure items are synced to database first
      await syncItemsToDatabase()
      
      // Process each item in the cart as a separate rental order
      for (const item of cartItems.value) {
        if (!item.rental_start_date || !item.rental_end_date) {
          throw new Error('Please select rental dates for all items')
        }
        
        // Find the item in our cached database items
        const dbItem = dbItems.value.find(i => i.item_name === item.item_name)
        
        if (!dbItem) {
          throw new Error(`Could not find item: ${item.item_name}`)
        }
        
        // Create a new order in the database with the proper item ID
        const { data, error: orderError } = await supabase
          .from('orders')
          .insert({
            user_id: authStore.userData.id,
            item_id: dbItem.id, // Use the actual UUID from the database
            order_type: 'rental',
            order_status: 'pending',
            total_price: item.item_price,
            rental_start_date: item.rental_start_date,
            rental_end_date: item.rental_end_date
          })
          .select()
        
        if (orderError) throw orderError
        
        // Add to rental history
        if (data) {
          rentalHistory.value.push(data[0])
        }
      }
      
      // Clear the cart after successful order
      clearCart()
      return true
    } catch (err) {
      error.value = err.message || 'Failed to submit rental order'
      return false
    } finally {
      loading.value = false
    }
  }
  
  async function fetchRentalHistory() {
    if (!authStore.userData) {
      error.value = 'You must be logged in to view rental history'
      return false
    }
    
    loading.value = true
    error.value = null
    
    try {
      const { data, error: historyError } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          item_id,
          order_type,
          order_status,
          total_price,
          rental_start_date,
          rental_end_date
        `)
        .eq('user_id', authStore.userData.id)
        .order('created_at', { ascending: false })
      
      if (historyError) throw historyError
      
      // If we have orders, fetch the corresponding items
      if (data && data.length > 0) {
        // Get all item IDs from the orders
        const itemIds = data.map(order => order.item_id)
        
        // Fetch items data
        const { data: itemsData, error: itemsError } = await supabase
          .from('items')
          .select('*')
          .in('id', itemIds)
        
        if (itemsError) throw itemsError
        
        // Combine orders with their item details
        rentalHistory.value = data.map(order => {
          const itemDetails = itemsData.find(item => item.id === order.item_id)
          return {
            ...order,
            item: itemDetails || null
          }
        })
      } else {
        rentalHistory.value = []
      }
      
      return true
    } catch (err) {
      error.value = err.message || 'Failed to fetch rental history'
      return false
    } finally {
      loading.value = false
    }
  }
  
  // Reset state
  function $reset() {
    cartItems.value = []
    rentalHistory.value = []
    loading.value = false
    error.value = null
    dbItems.value = []
  }
  
  return {
    // States
    cartItems,
    rentalHistory,
    loading,
    error,
    dbItems,
    
    // Getters
    cartTotal,
    cartCount,
    
    // Actions
    addToCart,
    removeFromCart,
    clearCart,
    updateRentalDates,
    submitRentalOrder,
    fetchRentalHistory,
    syncItemsToDatabase,
    $reset
  }
})

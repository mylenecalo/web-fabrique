<script setup>
import { formActionDefault } from '@/utils/supabase'
import { getAvatarText } from '@/utils/helpers'
import { useRouter } from 'vue-router'
import { useAuthUserStore } from '@/stores/authUser'
import { ref } from 'vue'
import { supabase } from '@/utils/supabase'

// Utilize pre-defined vue functions
const router = useRouter()

// Use Pinia Store
const authStore = useAuthUserStore()

// Load Variables
const formAction = ref({
  ...formActionDefault,
})

// Logout Functionality
const onLogout = async () => {
  /// Reset Form Action utils; Turn on processing at the same time
  formAction.value = { ...formActionDefault, formProcess: true }

  try {
    // Call Supabase signOut directly since the store doesn't have a logout function
    const { error } = await supabase.auth.signOut()
    
    if (error) {
      console.error('Logout failed:', error)
    } else {
      // Reset the auth store
      authStore.$reset()
      // Redirect to login page
      router.replace('/')
    }
  } catch (err) {
    console.error('Error during logout process:', err)
  } finally {
    formAction.value.formProcess = false
  }
}
</script>

<template>
  <v-menu min-width="200px" rounded>
    <template #activator="{ props }">
      <v-btn icon v-bind="props">
        <v-avatar
          v-if="authStore.userData.image_url"
          :image="authStore.userData.image_url"
          color="orange-darken-3"
          size="large"
        >
        </v-avatar>

        <v-avatar v-else color="grey-lighten-3" size="large">
          <span class="text-h5 text-pink-lighten-2">
            {{ getAvatarText(authStore.userData.firstname + ' ' + authStore.userData.lastname) }}
          </span>
        </v-avatar>
      </v-btn>
    </template>

    <v-card class="mt-1">
      <v-card-text>
        <v-list>
          <v-list-item
            :subtitle="authStore.userData.email"
            :title="authStore.userData.firstname + ' ' + authStore.userData.lastname"
          >
            <template #prepend>
              <v-avatar
                v-if="authStore.userData.image_url"
                :image="authStore.userData.image_url"
                color="orange-darken-3"
                size="large"
              >
              </v-avatar>

              <v-avatar v-else color="grey-lighten-3" size="large">
                <span class="text-h5 text-pink-lighten-2">
                  {{
                    getAvatarText(authStore.userData.firstname + ' ' + authStore.userData.lastname)
                  }}
                </span>
              </v-avatar>
            </template>
          </v-list-item>
        </v-list>

        <v-divider class="my-3"></v-divider>

        <v-btn
          prepend-icon="mdi-history"
          variant="plain"
          color="pink-lighten-2"
          to="/rental-history"
        >
          Rental History
        </v-btn>

        <v-divider class="my-3"></v-divider>

        <v-btn
          prepend-icon="mdi-logout"
          variant="plain"
          color="pink-lighten-2"
          @click="onLogout"
          :loading="formAction.formProcess"
          :disabled="formAction.formProcess"
        >
          Logout
        </v-btn>
      </v-card-text>
    </v-card>
  </v-menu>
</template>

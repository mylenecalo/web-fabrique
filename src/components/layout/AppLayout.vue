<script setup>
import { ref } from 'vue'
const theme = ref(localStorage.getItem ( 'theme' ) ?? 'light')

function onClick() {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
  localStorage.setItem('theme', theme.value)
}
</script>

<template>
  <v-responsive>
     <v-app :theme="theme">
       <v-app-bar class="px-3" :color="theme === 'light' ? 'pink-lighten-2' :'pink-darken-3'" border>
         <v-spacer></v-spacer>

         <v-btn
           :icon="theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
           variant="elevated"
           color="pink-lighten-3"
           slim
           @click="onClick"
         ></v-btn>
       </v-app-bar>

       <v-main>
         <v-container>
          <slot name="content"></slot>
        </v-container>
      </v-main>

      <v-footer
      class="font-weight-bold"
      :color="theme === 'light' ? 'pink-lighten-2' :'pink-darken-3'" elavation="24" border app>2025 - Fabrique</v-footer>
    </v-app>
  </v-responsive>
</template>


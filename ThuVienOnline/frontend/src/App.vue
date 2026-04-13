<script setup>
import MyHeader from './components/Header.vue'
import MyFooter from './components/Footer.vue'

import { useRoute } from 'vue-router'
import { computed } from 'vue'


const route = useRoute()

const authPages = ['/login','/admin', '/history','/profile'];

const display = computed(() => authPages.includes(route.path));
</script>

<template>
  <MyHeader v-if="!display"/>
  <router-view></router-view>
  <MyFooter v-if="!display"/>

</template>

<script setup lang="ts">
import { TheHeader } from '@/shared/ui/components'
import { useRoute} from 'vue-router';
import { computed } from 'vue';
import {FullPage} from "@/shared/ui/layouts";
const route = useRoute();


const computedLayoutComponent = computed(()=>route.meta.layout || FullPage)

</script>

<template>
  <component :is="computedLayoutComponent">
    <template v-slot:header>
      <TheHeader />
    </template>

    <template v-slot:default>
      <router-view />
    </template>
  </component>
</template>

<style scoped>
@import 'index.css';
</style>

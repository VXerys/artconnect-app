<template>
  <component :is="layoutComponent">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </component>
</template>

<script setup>
import { computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AuthLayout from "@/layouts/AuthLayout.vue";
import DefaultLayout from "@/layouts/DefaultLayout.vue";

const route = useRoute();
const authStore = useAuthStore();

onMounted(() => {
  authStore.checkAuth();
});

const layoutComponent = computed(() => {
  const layoutMeta = route.matched.find((r) => r.meta.layout)?.meta.layout;

  if (layoutMeta === "AuthLayout") {
    return AuthLayout;
  }
  return DefaultLayout;
});

watch(
  () => authStore.loading,
  (loading) => {
    console.log("Auth loading:", loading);
  },
  { immediate: true }
);
</script>

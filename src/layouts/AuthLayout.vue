<template>
  <div class="flex h-screen w-full bg-white overflow-hidden">
    <!-- Left Side -->
    <div class="hidden md:flex md:w-1/2 lg:w-[55%] items-center justify-center p-8 bg-white">
      <img
        :src="authImage"
        alt="Login Hero"
        class="object-contain w-full h-full max-h-[85vh]"
      />
    </div>

    <!-- Right Side -->
    <div class="flex flex-col w-full md:w-1/2 lg:w-[45%] p-6 lg:p-12 relative">


      <div class="w-full max-w-md mx-auto my-auto">
         <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const authImage = computed(() => {
  const imageName = route.meta.authImage || "image-login.png";
  return new URL(`../assets/images/${imageName}`, import.meta.url).href;
});
</script>

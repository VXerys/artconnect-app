<template>
  <div class="w-full max-w-md mx-auto flex flex-col items-center text-center relative h-full">
    
    <!-- Main Content Centered -->
    <div class="my-auto">
      <!-- Animated Checkmark Icon -->
      <div class="mb-6 relative flex justify-center">
        <svg
          class="w-20 h-20 text-[#00C853]"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 52 52"
        >
          <circle
            class="checkmark__circle"
            cx="26"
            cy="26"
            r="25"
            fill="none"
          />
          <path
            class="checkmark__check"
            fill="none"
            d="M14.1 27.2l7.1 7.2 16.7-16.8"
          />
        </svg>
      </div>

      <h2 class="mb-3 text-3xl font-bold text-gray-800">
        Your Account <br />
        Successfully Created
      </h2>
      <p class="text-sm text-gray-500">
        Let's start your journey
      </p>
    </div>

    <!-- Bottom Right Loading Spinner -->
    <div class="fixed bottom-8 right-8">
      <div class="w-8 h-8 relative">
        <svg class="animate-spin text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  // Simulate loading/initialization before going to Dashboard
  setTimeout(() => {
    router.push({ name: 'Dashboard' });
  }, 3000); // 3 seconds delay
});
</script>

<style scoped>
/* Checkmark Animation (Reused) */
.checkmark__circle {
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #00c853;
  fill: #00c853;
  animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards, fill .4s ease-in-out .4s forwards;
}

.checkmark__check {
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  stroke: #fff;
  stroke-width: 3;
  animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
}

@keyframes stroke {
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes fill {
  100% {
    box-shadow: inset 0px 0px 0px 30px #00c853;
  }
}
</style>

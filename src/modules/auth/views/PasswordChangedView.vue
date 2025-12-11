<template>
  <div class="w-full max-w-md mx-auto flex flex-col items-center text-center">
    <!-- Animated Checkmark Icon -->
    <div class="mb-6 relative">
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
      Your Password <br />
      Successfully Changed
    </h2>
    <p class="mb-8 text-sm text-gray-500">
      Sign in to your account with your new password
    </p>

    <div class="w-full">
      <AppButton
        type="button"
        variant="soft-green-primary"
        class="w-full rounded-full py-3"
        @click="$router.push({ name: 'Login' })"
      >
        Sign in
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import AppButton from "@/components/common/AppButton.vue";
</script>

<style scoped>
/* Checkmark Animation */
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

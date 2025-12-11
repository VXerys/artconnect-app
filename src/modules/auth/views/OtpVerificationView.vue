<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Back Button -->
    <div class="mb-4">
      <button
        @click="handleBack"
        class="inline-flex items-center text-gray-500 hover:text-gray-900 transition-colors"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </button>
    </div>

    <!-- Mail Icon -->
    <div class="flex justify-start mb-4">
      <div class="bg-[#EFF4FF] p-3 rounded-2xl">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-6 h-6 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      </div>
    </div>

    <h2 class="mb-1 text-3xl font-bold text-gray-800">OTP Verification</h2>
    <p class="mb-6 text-sm text-gray-500">
      Check your email to see the verification code
    </p>

    <form @submit.prevent="handleVerify" class="space-y-6">
      <!-- OTP Inputs -->
      <div class="flex justify-between gap-2">
        <input
          v-for="(digit, index) in otp"
          :key="index"
          type="text"
          v-model="otp[index]"
          ref="otpInputs"
          maxlength="1"
          class="w-12 h-12 text-center text-xl font-bold border rounded-full focus:ring-2 focus:ring-artconnect-soft-green focus:border-artconnect-soft-green outline-none transition-all"
          :class="{'border-gray-300': !digit, 'border-artconnect-soft-green bg-green-50': digit}"
          @input="handleInput(index, $event)"
          @keydown.delete="handleDelete(index, $event)"
          @paste="handlePaste"
        />
      </div>

      <p v-if="error" class="text-sm text-red-600 text-center">{{ error }}</p>

      <div class="pt-2">
        <AppButton
          type="submit"
          variant="soft-green-primary"
          class="w-full rounded-full py-3"
          :loading="loading"
        >
          Verify
        </AppButton>
      </div>

      <!-- Resend Timer -->
      <p class="text-sm text-center text-gray-500">
        Resend code in 
        <span class="text-artconnect-soft-green font-medium">{{ formattedTimer }}</span>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppButton from "@/components/common/AppButton.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const otp = ref(new Array(6).fill(""));
const otpInputs = ref([]);
const loading = ref(false);
const error = ref("");
const timer = ref(59);
let interval = null;

const formattedTimer = computed(() => {
  const minutes = Math.floor(timer.value / 60);
  const seconds = timer.value % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const isSignup = computed(() => route.name === 'SignupVerification');

const handleBack = () => {
  if (isSignup.value) {
    router.push({ name: 'Register' }); // Or Login
  } else {
    router.push({ name: 'ForgotPassword' });
  }
};

onMounted(() => {
  startTimer();
  if (otpInputs.value[0]) {
    otpInputs.value[0].focus();
  }
});

onUnmounted(() => {
  clearInterval(interval);
});

const startTimer = () => {
  clearInterval(interval);
  timer.value = 59;
  interval = setInterval(() => {
    if (timer.value > 0) {
      timer.value--;
    } else {
      clearInterval(interval);
    }
  }, 1000);
};

const handleInput = (index, event) => {
  const value = event.target.value;
  if (value && index < 5) {
    otpInputs.value[index + 1].focus();
  }
};

const handleDelete = (index, event) => {
  if (!otp.value[index] && index > 0) {
    otpInputs.value[index - 1].focus();
  }
};

const handlePaste = (event) => {
  const pasteData = event.clipboardData.getData('text');
  if (pasteData.length === 6) {
     otp.value = pasteData.split('');
     otpInputs.value[5].focus();
  }
};

const handleVerify = async () => {
  const code = otp.value.join("");
  if (code.length < 6) {
    error.value = "Please enter the full 6-digit code";
    return;
  }

  loading.value = true;
  error.value = "";
  
  try {
    await authStore.verifyOtp(code);
    
    if (isSignup.value) {
      // Flow Signup -> OTP -> Signup Success -> Dashboard
      router.push({ name: 'SignupSuccess' });
    } else {
      // Flow Forgot Password -> OTP -> Set New Password
      router.push({ name: 'SetNewPassword' });
    }

  } catch (err) {
    error.value = err.message || "Invalid OTP Code";
  } finally {
    loading.value = false;
  }
};
</script>

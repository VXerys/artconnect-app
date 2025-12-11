<template>
  <div class="w-full max-w-md mx-auto">
    <!-- Back Button -->
    <div class="mb-4">
      <router-link
        to="/login"
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
      </router-link>
    </div>

    <!-- Lock Icon -->
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
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      </div>
    </div>

    <h2 class="mb-1 text-3xl font-bold text-gray-800">Forgot Password?</h2>
    <p class="mb-6 text-sm text-gray-500">
      Enter your email to reset your password
    </p>

    <!-- Success Message -->
    <div
      v-if="successMessage"
      class="p-4 mb-6 text-sm text-green-700 bg-green-100 rounded-xl"
    >
      {{ successMessage }}
    </div>

    <form v-else @submit.prevent="handleReset" class="space-y-4">
      <AppInput
        label="Email"
        name="email"
        type="email"
        v-model="email"
        required
        placeholder="domat@example.com" 
        :error="authStore.error"
        autocomplete="email"
        inputClass="rounded-full px-5 py-3 border-gray-300"
      />

      <div class="pt-2">
        <AppButton
          type="submit"
          variant="soft-green-primary" 
          class="w-full rounded-full py-3"
          :loading="loading"
        >
          Submit
        </AppButton>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppInput from "@/components/common/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";
import { MoveLeft, Lock } from "lucide-vue-next"; 

const router = useRouter();
const authStore = useAuthStore();
const email = ref("");
const loading = ref(false);
const successMessage = ref("");

const handleReset = async () => {
  loading.value = true;
  successMessage.value = "";
  authStore.error = null;
  try {
    await authStore.resetPassword(email.value);
    // successMessage.value = "Link reset password terkirim! Cek email Anda."; // Old message
    router.push({ name: 'OtpVerification' });
  } catch (error) {
    console.error("Password reset failed:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="w-full max-w-md mx-auto">
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

    <h2 class="mb-1 text-3xl font-bold text-gray-800">Set New Password</h2>
    <p class="mb-6 text-sm text-gray-500">
      Enter your new password to complete the reset process
    </p>

    <form @submit.prevent="handleSavePassword" class="space-y-4">
      <AppInput
        label="New Password"
        name="password"
        type="password"
        v-model="password"
        required
        placeholder="Enter new password"
        :error="passwordError"
        autocomplete="new-password"
        inputClass="rounded-full px-5 py-3 border-gray-300"
      />
      
      <AppInput
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        v-model="confirmPassword"
        required
        placeholder="Confirm new password"
        :error="confirmPasswordError"
        autocomplete="new-password"
        inputClass="rounded-full px-5 py-3 border-gray-300"
      />

      <div class="pt-2">
        <AppButton
          type="submit"
          variant="soft-green-primary" 
          class="w-full rounded-full py-3"
          :loading="authStore.loading"
        >
          Save New Password
        </AppButton>
      </div>
    </form>

    <p class="mt-6 text-sm text-center text-gray-600">
      Remember old password?
      <router-link
        :to="{ name: 'Login' }"
        class="font-medium text-artconnect-soft-green hover:text-green-700"
      >
        Sign in
      </router-link>
    </p>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppInput from "@/components/common/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const password = ref("");
const confirmPassword = ref("");
const error = ref("");

const passwordError = computed(() => {
  if (password.value && password.value.length < 6) return "Password must be at least 6 characters";
  return "";
});

const confirmPasswordError = computed(() => {
  if (confirmPassword.value && password.value !== confirmPassword.value) return "Passwords do not match";
  return "";
});

const handleSavePassword = async () => {
  if (passwordError.value || confirmPasswordError.value) return;
  if (!password.value) return;

  const email = route.query.email;
  const token = route.query.token;

  if (!email || !token) {
    // Should probably show visual error, but for now console error
    console.error("Missing email or token for password reset");
    // Optionally redirect back or show error toast
    return;
  }

  try {
    await authStore.updatePassword({
      email,
      resetToken: token,
      newPassword: password.value,
      confirmPassword: confirmPassword.value
    });
    
    // Success flow
    router.push({ name: 'PasswordChanged' });
  } catch (err) {
    console.error("Failed to update password:", err);
  }
};
</script>

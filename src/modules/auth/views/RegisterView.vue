<template>
  <div class="w-full max-w-md mx-auto">
    <h2 class="mb-1 text-3xl font-bold text-gray-800">Get Started Now</h2>
    <p class="mb-6 text-sm text-gray-500">Let's create your account</p>

    <form @submit.prevent="handleRegister" class="space-y-3">
      <AppInput
        label="Full Name"
        name="displayName"
        v-model="displayName"
        placeholder="Sehan Alfarisi"
        autocomplete="name"
        inputClass="rounded-full px-4 py-2.5 border-gray-300"
      />
      <AppInput
        label="Email"
        name="email"
        type="email"
        v-model="email"
        required
        placeholder="sehanf@example.com"
        autocomplete="email"
        inputClass="rounded-full px-4 py-2.5 border-gray-300"
        :error="emailError"
      />
      <AppInput
        label="Password"
        name="password"
        type="password"
        v-model="password"
        required
        placeholder="Set your password"
        autocomplete="new-password"
        inputClass="rounded-full px-4 py-2.5 border-gray-300"
        :error="passwordError"
      />
      <AppInput
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        v-model="confirmPassword"
        required
        placeholder="Confirm your password"
        autocomplete="new-password"
        inputClass="rounded-full px-4 py-2.5 border-gray-300"
        :error="passwordError"
      />

      <!-- Terms Checkbox -->
      <div class="flex items-center">
        <input
          id="terms"
          name="terms"
          type="checkbox"
          required
          class="w-4 h-4 text-artconnect-soft-green border-gray-300 rounded focus:ring-artconnect-soft-green"
        />
        <label for="terms" class="ml-2 text-sm text-gray-600">
          I agree to
          <span class="font-medium text-artconnect-soft-green"
            >Term & Condition</span
          >
        </label>
      </div>

      <p
        v-if="authStore.error && !authStore.error.includes('email')"
        class="text-sm text-red-600"
      >
        {{ authStore.error }}
      </p>

      <div class="pt-2">
        <AppButton
          type="submit"
          variant="soft-green-primary"
          class="w-full rounded-full py-2.5"
          :loading="authStore.loading"
        >
          Sign up
        </AppButton>
      </div>

      <!-- Divider -->
      <div class="flex items-center my-3">
        <div class="flex-grow border-t border-gray-300"></div>
        <span class="mx-4 text-sm text-gray-500">or</span>
        <div class="flex-grow border-t border-gray-300"></div>
      </div>

      <!-- Google Button -->
      <div>
        <AppButton
          type="button"
          variant="soft-green-outline"
          class="flex items-center justify-center w-full space-x-2 rounded-full py-2.5"
        >
          <svg
            class="w-5 h-5"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M43.611 20.083H42V20H24V28H35.303C33.654 32.657 29.227 36 24 36C17.373 36 12 30.627 12 24C12 17.373 17.373 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24C4 35.045 12.955 44 24 44C35.045 44 44 35.045 44 24C44 22.659 43.862 21.35 43.611 20.083Z"
              fill="#FFC107"
            />
            <path
              d="M6.306 14.691L12.877 19.51C14.655 15.108 18.961 12 24 12C27.059 12 29.842 13.154 31.961 15.039L37.618 9.382C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691Z"
              fill="#FF3D00"
            />
            <path
              d="M24 44C29.266 44 34.043 41.951 37.614 38.63L31.989 32.989C29.852 34.836 27.081 36 24 36C18.789 36 14.375 32.677 12.722 28.045L6.114 33.115C9.454 39.574 16.177 44 24 44Z"
              fill="#4CAF50"
            />
            <path
              d="M43.611 20.083H42V20H24V28H35.303C34.53 30.183 33.401 32.171 31.989 32.989L37.614 38.63C41.447 35.096 43.721 29.942 43.611 20.083Z"
              fill="#1976D2"
            />
          </svg>
          <span class="text-gray-600">Sign up with Google</span>
        </AppButton>
      </div>
    </form>

    <p class="mt-6 text-sm text-center text-gray-600">
      Already have an account?
      <router-link
        :to="{ name: 'Login' }"
        class="font-medium text-gray-900 hover:text-gray-700 underline decoration-gray-400 underline-offset-4"
      >
        Sign in
      </router-link>
    </p>
  </div>
</template>
<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppInput from "@/components/common/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";

const router = useRouter();
const authStore = useAuthStore();
const displayName = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");

const emailError = computed(() =>
  authStore.error?.includes("email-already-in-use")
    ? "Email already in use."
    : ""
);

const passwordError = computed(() => {
  if (password.value && password.value.length < 6)
    return "Password must be at least 6 characters.";
  if (
    password.value &&
    confirmPassword.value &&
    password.value !== confirmPassword.value
  )
    return "Passwords do not match.";
  return "";
});

const handleRegister = async () => {
  if (passwordError.value) return;
  authStore.error = null;
  try {
    await authStore.registerUser({
      email: email.value,
      password: password.value,
      displayName: displayName.value,
    });
    router.push({ name: "SignupVerification" });
  } catch (error) {
    console.error("Registration failed:", error);
  }
};
</script>

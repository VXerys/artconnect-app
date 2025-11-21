<template>
  <div>
    <h2 class="mb-2 text-2xl font-bold text-gray-900">Welcome Back</h2>
    <p class="mb-6 text-sm text-gray-500">Sign in to your account</p>

    <form @submit.prevent="handleLogin" class="space-y-6">
      <AppInput
        label="Email"
        name="email"
        type="email"
        v-model="email"
        required
        autocomplete="email"
        placeholder="sehanaf@example.com"
        :error="
          authError
            ? 'Email atau password salah.'
            : authStore.error?.includes('auth/')
            ? 'Email atau password salah.'
            : ''
        "
      />
      <AppInput
        label="Password"
        name="password"
        type="password"
        v-model="password"
        required
        autocomplete="current-password"
        placeholder="Enter your password"
        :error="authError ? ' ' : ''"
      />

      <div class="flex items-center justify-between text-sm">
        <div class="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label for="remember-me" class="block ml-2 text-gray-600">
            Remember me
          </label>
        </div>
        <router-link
          :to="{ name: 'ForgotPassword' }"
          class="font-medium text-gray-500 hover:text-gray-700"
        >
          Forgot Password?
        </router-link>
      </div>

      <div>
        <!--
          Tombol Login memanggil action dari authStore.
          State loading dari store digunakan untuk menampilkan indikator loading.
        -->
        <AppButton
          type="submit"
          variant="soft-green-primary"
          class="w-full"
          :loading="authStore.loading"
        >
          Sign In
        </AppButton>
      </div>

      <div>
        <AppButton
          type="button"
          variant="soft-green-outline"
          class="flex items-center justify-center w-full space-x-2"
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
          <span>Sign in with Google</span>
        </AppButton>
      </div>

      <p class="mt-6 text-sm text-center text-gray-600">
        Don't have an account?
        <router-link
          :to="{ name: 'Register' }"
          class="font-medium text-indigo-600 hover:text-indigo-500"
        >
          Sign Up
        </router-link>
      </p>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import AppInput from "@/components/common/AppInput.vue";
import AppButton from "@/components/common/AppButton.vue";

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();

const email = ref("");
const password = ref("");
const authError = ref(false);

// Fungsi integrasi Login
const handleLogin = async () => {
  authError.value = false;
  authStore.error = null;
  try {
    // Memanggil action loginWithEmail dari Pinia Store
    // Action ini akan menangani Firebase Login dan sinkronisasi profil Backend (jika ada)
    await authStore.loginWithEmail({
      email: email.value,
      password: password.value,
    });

    // Redirect setelah sukses
    const redirect = route.query.redirect || "/app/dashboard";
    router.push(redirect);
  } catch (error) {
    console.error("Login failed:", error);
    authError.value = true;
  }
};
</script>

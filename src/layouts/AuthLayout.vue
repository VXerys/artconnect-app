<template>
  <div
    class="flex items-center justify-center min-h-screen p-0 bg-gray-100 sm:p-4"
  >
    <div
      class="flex w-full min-h-screen mx-auto overflow-hidden bg-white md:min-h-0 md:max-w-6xl md:rounded-3xl md:shadow-auth-card"
      style="min-height: 700px"
    >
      <!-- Left Side -->
      <div class="hidden w-1/2 md:flex items-center justify-center p-6">
        <img
          src="@/assets/login-hero.png"
          alt="Login Hero"
          class="object-contain w-full h-full rounded-3xl"
        />
      </div>

      <!-- Right Side -->
      <div
        class="relative flex flex-col justify-center w-full p-8 md:w-1/2 lg:p-12"
      >
        <!-- Close Button -->
        <button
          @click="$router.push('/')"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div class="mb-6">
          <div class="flex items-center mb-8">
            <!-- Optional: Logo can be kept if desired, or removed if not in design -->
          </div>
        </div>
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup></script>

import { defineStore } from "pinia";
import axiosClient from "@/api/axiosClient";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    loading: true, 
    error: null,
    jwtToken: localStorage.getItem("jwtToken") || null,
  }),
  getters: {
    isAuthenticated: (s) => !!s.user,
    userId: (s) => s.user?.id || s.user?.uid || null,
    token: (s) => s.jwtToken,
  },
  actions: {
    async registerUser(creds) {
      this.loading = true;
      this.error = null;
      try {
        const payload = {
          fullName: creds.fullName || creds.name, // Ensure field alignment
          email: creds.email,
          password: creds.password,
          confirmPassword: creds.confirmPassword || creds.password // Handle if confirm missing
        };
        const response = await axiosClient.post("/auth/register", payload);
        
        // If auto-login or return user data:
        // this.setSession(response.data.token, response.data.user);
        
        return response.data;
      } catch (e) {
        console.error("Register failed:", e);
        this.error = e.response?.data?.error || e.message;
        throw e; // Rethrow so UI can handle
      } finally {
        this.loading = false;
      }
    },

    async loginWithEmail(creds) {
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosClient.post("/auth/login", {
          email: creds.email,
          password: creds.password
        });
        
        const { token, user } = response.data;
        this.setSession(token, user);
        
        return user;
      } catch (e) {
        console.error("Login failed:", e);
        this.error = e.response?.data?.error || e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      // Backend stateless JWT usually just needs client-side cleanup
      this.clearSession();
    },

    async resetPassword(email) {
      this.error = null;
      try {
        await axiosClient.post("/auth/forgot-password", { email });
      } catch (e) {
        this.error = e.response?.data?.error || e.message;
        throw e;
      }
    },

    async verifyEmail(email, code) { 
        this.loading = true;
        try {
            await axiosClient.post("/auth/verify-email", { 
               email: email, 
               verificationCode: code 
            });
            return true;
        } catch(e) {
            this.error = e.response?.data?.error || e.message;
            throw e;
        } finally {
            this.loading = false;
        }
    },

    async verifyResetOtp(email, code) { 
        this.loading = true;
        try {
            await axiosClient.post("/auth/verify-otp", { 
               email: email, 
               otp: code 
            });
            return true; 
        } catch(e) {
            this.error = e.response?.data?.error || e.message;
            throw e;
        } finally {
            this.loading = false;
        }
    },

    async updatePassword(payload) { // payload: { email, resetToken, newPassword, confirmPassword }
      this.loading = true;
      this.error = null;
      try {
        // Assuming this is for Reset Password flow
        await axiosClient.post("/auth/reset-password", payload);
      } catch (e) {
        this.error = e.response?.data?.error || e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async checkAuth() {
      const token = localStorage.getItem("jwtToken");
      const userStr = localStorage.getItem("user");
      
      if (!token) {
        this.user = null;
        this.loading = false;
        return;
      }
      
      // If we had a /me endpoint, we would call it here.
      // For now, we restore from localStorage if available
      if (userStr) {
          try {
              this.user = JSON.parse(userStr);
              this.jwtToken = token;
          } catch(e) {
              this.clearSession();
          }
      }
      this.loading = false;
    },

    setSession(token, user) {
      this.jwtToken = token;
      this.user = user;
      localStorage.setItem("jwtToken", token);
      localStorage.setItem("user", JSON.stringify(user));
    },

    clearSession() {
      this.jwtToken = null;
      this.user = null;
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");
    }
  },
});

import { defineStore } from "pinia";
// import axiosClient from "@/api/axiosClient"; // Commented out for dummy mode

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
    // --- DUMMY IMPLEMENTATIONS FOR UI SLICING ---

    async registerUser(creds) {
      this.loading = true;
      this.error = null;
      console.log("Mock Register initiating...", creds);
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Mock successful response
        const dummyUser = {
          id: "dummy-user-" + Date.now(),
          email: creds.email,
          name: creds.displayName || creds.email.split("@")[0],
          role: "artist",
          avatar: "https://i.pravatar.cc/150?u=" + creds.email
        };
        const dummyToken = "dummy-jwt-token-" + Date.now();

        this.setSession(dummyToken, dummyUser);
        console.log("Mock Register success!", dummyUser);

      } catch (e) {
        console.error("Mock Register failed:", e);
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async loginWithEmail(creds) {
      this.loading = true;
      this.error = null;
      console.log("Mock Login initiating...", creds);

      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate error for specific email if needed for testing (Optional)
        if (creds.email === "fail@test.com") {
           throw new Error("Invalid credentials (simulated)");
        }

        // Mock successful response
        const dummyUser = {
          id: "dummy-user-123",
          email: creds.email,
          name: "Slicing Tester",
          role: "collector",
          avatar: "https://i.pravatar.cc/150?u=test"
        };
        const dummyToken = "dummy-jwt-token-ACCESS";

        this.setSession(dummyToken, dummyUser);
        console.log("Mock Login success!", dummyUser);

      } catch (e) {
        console.error("Mock Login failed:", e);
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async logout() {
      this.loading = true;
      this.error = null;
      console.log("Mock Logout...");
      
      try {
         await new Promise(resolve => setTimeout(resolve, 500));
      } finally {
        this.clearSession();
        this.loading = false;
        console.log("Mock Logout done");
      }
    },

    async resetPassword(email) {
      this.error = null;
      console.log("Mock Reset Password for:", email);
      
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Success
        console.log("Mock Reset Password email sent");
      } catch (e) {
        this.error = e.message;
        throw e;
      }
    },

    // Include dummy OTP method if needed by UI
    async verifyOtp(otpCode) {
        this.loading = true;
        try {
            console.log("Mock Verify OTP:", otpCode);
            await new Promise(resolve => setTimeout(resolve, 1500));
            if (otpCode === "000000") throw new Error("Invalid OTP (Simulated)");
            return true;
        } catch(e) {
            this.error = e.message;
            throw e;
        } finally {
            this.loading = false;
        }
    },

    async updatePassword(newPassword) {
      this.loading = true;
      this.error = null;
      try {
        console.log("Mock Update Password:", newPassword);
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Success
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async checkAuth() {
      const token = localStorage.getItem("jwtToken");
      console.log("Mock Check Auth, token:", token);
      
      if (!token) {
        this.user = null;
        this.loading = false;
        return;
      }
      
      this.loading = true;
      try {
        // Simulate validating token
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Restore session with dummy user
        this.user = {
          id: "dummy-user-restored",
          email: "restored@example.com",
          name: "Restored User",
          role: "viewer",
          avatar: "https://i.pravatar.cc/150?u=restored"
        };
        this.jwtToken = token;
        
      } catch (e) {
        console.warn("Mock Session invalid:", e);
        this.clearSession();
      } finally {
        this.loading = false;
      }
    },

    setSession(token, user) {
      this.jwtToken = token;
      this.user = user;
      localStorage.setItem("jwtToken", token);
    },

    clearSession() {
      this.jwtToken = null;
      this.user = null;
      localStorage.removeItem("jwtToken");
    }
  },
});

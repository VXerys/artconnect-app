import { defineStore } from "pinia";
import { auth, db } from "@/services/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import axiosClient from "@/api/axiosClient";

export const useAuthStore = defineStore("auth", {
  state: () => ({ user: null, loading: true, error: null, jwtToken: null }),
  getters: {
    isAuthenticated: (s) => !!s.user,
    userId: (s) => s.user?.uid || null,
    jwtToken: (s) => s.jwtToken,
  },
  actions: {
    async registerUser(creds) {
      this.loading = true;
      this.error = null;
      try {
        // 1. Register with Firebase Auth
        const cred = await createUserWithEmailAndPassword(
          auth,
          creds.email,
          creds.password
        );
        this.user = cred.user;

        // 2. Update Profile in Firebase
        if (creds.displayName) {
          await updateProfile(cred.user, { displayName: creds.displayName });
        }

        // 3. Sync with Backend (MySQL)
        // The backend endpoint matches: POST /api/auth/register
        // It uses the token to identify the user, but we send profile data as well.
        await axiosClient.post("/auth/register", {
          email: this.user.email,
          name: creds.displayName || this.user.email.split("@")[0],
        });

        // 4. Keep Firestore sync for now (Legacy/Hybrid support if needed)
        // If you are fully migrating to SQL, this might be removable later.
        // But for safety, I will keep it as per original code unless instructed to remove.
        const ref = doc(db, "users", this.user.uid);
        await setDoc(ref, {
          uid: this.user.uid,
          email: this.user.email,
          displayName: creds.displayName || this.user.email.split("@")[0],
          created_at: serverTimestamp(),
          subscription_plan: "free",
        });
      } catch (e) {
        console.error("Registration failed:", e);
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async loginWithEmail(creds) {
      this.loading = true;
      this.error = null;
      try {
        // 1. Login with Firebase
        const cred = await signInWithEmailAndPassword(
          auth,
          creds.email,
          creds.password
        );
        this.user = cred.user;

        if (this.user) {
          const token = await this.user.getIdToken();
          this.jwtToken = token;
          localStorage.setItem("jwtToken", token);

          // 2. Fetch Profile from Backend (Optional but good for sync)
          try {
            const response = await axiosClient.get("/auth/profile");
            console.log("Backend Profile:", response.data);
            // Here you could merge backend data into the state if needed
            // e.g., this.userProfile = response.data.data;
          } catch (backendError) {
            console.warn("Backend profile fetch failed:", backendError);
            // Don't block login if backend sync fails, but log it
          }
        }
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async logout() {
      this.loading = true;
      this.error = null;
      try {
        await signOut(auth);
        this.user = null;
        this.jwtToken = null;
        localStorage.removeItem("jwtToken");
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async resetPassword(email) {
      this.error = null;
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (e) {
        this.error = e.message;
        throw e;
      }
    },
    monitorAuthState() {
      onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          this.user = currentUser;
          if (!this.jwtToken) {
            this.jwtToken = await currentUser.getIdToken();
            localStorage.setItem("jwtToken", this.jwtToken);
          }
          // Optional: Fetch backend profile on auto-login
          // axiosClient.get('/auth/profile').catch(...)
        } else {
          // Original Dummy Data Logic (Removed or kept for dev?)
          // For proper integration, I should probably remove the dummy data fallback
          // or make it clearly a dev-only thing.
          // I'll keep the structure but maybe comment out the forced dummy data
          // to prevent confusion in a real integration scenario,
          // or strictly keep it if the user relies on it for UI dev without backend.
          // Given the request is "Integration", I'll prioritize real auth state.

          this.user = null;
          this.jwtToken = null;

          // UNCOMMENT FOR DEV WITHOUT BACKEND:
          /*
          this.user = {
            uid: "DUMMY_FRONTEND_TEST_ID",
            email: "fathir@artconnect.dev",
            displayName: "Fathir",
            photoURL: "...",
          };
          this.jwtToken = "dummy-jwt-token-for-axios";
          */
        }
        this.loading = false;
      });
    },
  },
});

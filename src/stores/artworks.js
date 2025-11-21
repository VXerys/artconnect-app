import { defineStore } from "pinia";
import axiosClient from "@/api/axiosClient";
import { useAuthStore } from "./auth";

export const useArtworksStore = defineStore("artworks", {
  state: () => ({
    artworksList: [],
    currentArtwork: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchArtworks() {
      const auth = useAuthStore();
      if (!auth.user) {
        this.error = "No user";
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosClient.get("/artworks");
        // Assuming standard response format: { data: [...], ... }
        // If the backend returns the array directly or inside 'data.data', adjust here.
        // Based on common patterns: response.data might be the array or response.data.data
        const data = response.data.data || response.data;

        this.artworksList = Array.isArray(data) ? data.map((item) => ({
          artwork_id: item.id || item.artwork_id, // Ensure ID mapping
          ...item,
        })) : [];

      } catch (e) {
        console.error("Fetch artworks failed:", e);
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },

    async fetchArtworkById(id) {
      this.loading = true;
      this.error = null;
      this.currentArtwork = null;
      try {
        const response = await axiosClient.get(`/artworks/${id}`);
        const data = response.data.data || response.data;
        this.currentArtwork = {
            artwork_id: data.id || data.artwork_id,
            ...data
        };
        return this.currentArtwork;
      } catch (e) {
        this.error = e.message;
        return null;
      } finally {
        this.loading = false;
      }
    },

    async addArtwork(data, file) {
      this.loading = true;
      this.error = null;
      try {
        // 1. Create Artwork Record
        const response = await axiosClient.post("/artworks", {
            ...data,
            price: Number(data.price), // Ensure number
            status: "concept" // Default status
        });
        const newArtwork = response.data.data || response.data;
        const newId = newArtwork.id || newArtwork.artwork_id;

        // 2. Upload Image if provided
        if (file && newId) {
            const formData = new FormData();
            formData.append('image', file);
            await axiosClient.post(`/artworks/${newId}/image`, formData);
            // Refresh to get image URL
            await this.fetchArtworkById(newId);
        } else {
            this.artworksList.unshift(newArtwork);
        }

        return newId;
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async updateArtworkStatus(id, status) {
      try {
        // Optimistic Update
        const index = this.artworksList.findIndex((a) => a.artwork_id === id);
        if (index !== -1) this.artworksList[index].status = status;

        await axiosClient.put(`/artworks/${id}`, { status });
        // Or specific endpoint if available: axiosClient.put(`/artworks/${id}/status`, { status });

      } catch (e) {
        console.error("Update status failed:", e);
        // Revert on failure
        this.fetchArtworks();
        throw e;
      }
    },

    async updateArtwork(id, data, newFile = null) {
        this.loading = true;
        try {
            await axiosClient.put(`/artworks/${id}`, data);

            if (newFile) {
                const formData = new FormData();
                formData.append('image', newFile);
                await axiosClient.post(`/artworks/${id}/image`, formData);
            }

            await this.fetchArtworks(); // Refresh list
        } catch (e) {
            this.error = e.message;
            throw e;
        } finally {
            this.loading = false;
        }
    },

    async deleteArtwork(id) {
      try {
        await axiosClient.delete(`/artworks/${id}`);
        this.artworksList = this.artworksList.filter((a) => a.artwork_id !== id);
      } catch (e) {
        console.error("Delete artwork failed:", e);
        throw e;
      }
    },
  },
});

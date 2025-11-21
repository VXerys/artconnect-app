import { defineStore } from "pinia";
import axiosClient from "@/api/axiosClient";

export const useAnalyticsStore = defineStore("analytics", {
  state: () => ({
    dashboardStats: {
      totalSales: 0,
      averageSaleValue: 0,
      newContacts: 0,
    },
    salesTrend: [],
    activities: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchDashboardStats() {
      this.loading = true;
      this.error = null;
      try {
        // Assuming the backend provides a consolidated dashboard endpoint
        // If not, we might need to call multiple endpoints or calculate on frontend
        const response = await axiosClient.get("/analytics/dashboard");
        if (response.data && response.data.data) {
            this.dashboardStats = response.data.data.stats;
            this.salesTrend = response.data.data.trends;
            this.activities = response.data.data.recentActivities;
        }
      } catch (e) {
        console.error("Failed to fetch dashboard stats:", e);
        this.error = e.message;

        // Fallback / Mock for MVP if backend endpoint is not ready yet
        // This ensures the UI doesn't break while waiting for backend implementation
        this.dashboardStats = {
            totalSales: 25450,
            averageSaleValue: 1272.50,
            newContacts: 15
        };
        this.activities = [
            { id: 1, icon: "💰", text: "Sold 'Abstract Landscape' to Olivia Bennett", time: "2 days ago" },
            { id: 2, icon: "✨", text: "Added new artwork 'Urban Sketch'", time: "1 week ago" },
            { id: 3, icon: "📞", text: "Contacted by potential buyer, Ethan Chen", time: "2 weeks ago" }
        ];
      } finally {
        this.loading = false;
      }
    },
  },
});

import { defineStore } from "pinia";
import axiosClient from "@/api/axiosClient";
import { useAuthStore } from "./auth";

export const useContactsStore = defineStore("contacts", {
  state: () => ({
    contactsList: [],
    currentContact: null,
    loading: false,
    error: null,
  }),
  actions: {
    async fetchContacts() {
      const auth = useAuthStore();
      if (!auth.user) {
        this.error = "No user";
        return;
      }
      this.loading = true;
      this.error = null;
      try {
        const response = await axiosClient.get("/contacts");
        const data = response.data.data || response.data;

        this.contactsList = Array.isArray(data) ? data.map((item) => ({
          contact_id: item.id || item.contact_id,
          ...item,
        })) : [];

      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchContactById(id) {
      this.loading = true;
      try {
        const response = await axiosClient.get(`/contacts/${id}`);
        const data = response.data.data || response.data;
        this.currentContact = { contact_id: data.id || data.contact_id, ...data };
        return this.currentContact;
      } catch (e) {
        this.error = e.message;
      } finally {
        this.loading = false;
      }
    },
    async addContact(data) {
      this.loading = true;
      try {
        await axiosClient.post("/contacts", data);
        await this.fetchContacts();
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async updateContact(id, data) {
      this.loading = true;
      try {
        await axiosClient.put(`/contacts/${id}`, data);
        await this.fetchContacts();
      } catch (e) {
        this.error = e.message;
        throw e;
      } finally {
        this.loading = false;
      }
    },
    async deleteContact(id) {
      try {
        await axiosClient.delete(`/contacts/${id}`);
        this.contactsList = this.contactsList.filter((c) => c.contact_id !== id);
      } catch (e) {
        this.error = e.message;
        throw e;
      }
    },
  },
  getters: {
    contactsByCategory: (state) => (cat) => {
      if (!cat || cat === "Semua") return state.contactsList;
      const map = {
        Kolektor: "collector",
        Galeri: "gallery",
        Kurator: "curator",
      };
      const target = map[cat] || cat.toLowerCase();
      return state.contactsList.filter(
        (c) => c.category?.toLowerCase() === target
      );
    },
  },
});

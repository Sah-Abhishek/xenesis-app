import { create } from "zustand"

import { persist } from "zustand/middleware"

export const useAuthStore = create(persist(
  (set, get) => ({
    token: null,
    user: null,
    loading: false,

    isLoggedIn: () => !!get().token,


    setLoading: (v) => set({ loading: v }),

    loginSuccess: (token, user) => {
      set({ token, user })
    },

    logout: async () => {
      set({ token: null, user: null })
    }
  }), {
  name: "auth-storage",

}
))

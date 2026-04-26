import { create } from "zustand";

const useAuthStore = create((set) => ({
  accessToken: null,
  admin: null,
  hasBootstrapped: false,
  setSession: (accessToken, admin) =>
    set({
      accessToken,
      admin,
      hasBootstrapped: true
    }),
  clearSession: () =>
    set({
      accessToken: null,
      admin: null,
      hasBootstrapped: true
    }),
  setBootstrapped: () =>
    set({
      hasBootstrapped: true
    })
}));

export default useAuthStore;

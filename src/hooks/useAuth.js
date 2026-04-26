import { useEffect } from "react";
import { refreshSessionRequest } from "../api/auth.api";
import useAuthStore from "../store/authStore";

export default function useAuth() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const admin = useAuthStore((state) => state.admin);
  const hasBootstrapped = useAuthStore((state) => state.hasBootstrapped);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setBootstrapped = useAuthStore((state) => state.setBootstrapped);

  useEffect(() => {
    let isActive = true;

    const bootstrapSession = async () => {
      try {
        const response = await refreshSessionRequest();

        if (!isActive) {
          return;
        }

        setSession(response.data.accessToken, response.data.admin);
      } catch (error) {
        if (!isActive) {
          return;
        }

        clearSession();
        setBootstrapped();
      }
    };

    if (!hasBootstrapped) {
      bootstrapSession();
    }

    return () => {
      isActive = false;
    };
  }, [clearSession, hasBootstrapped, setBootstrapped, setSession]);

  return {
    accessToken,
    admin,
    isAuthenticated: Boolean(accessToken),
    isBootstrapping: !hasBootstrapped
  };
}

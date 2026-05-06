import { createContext, useEffect, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import { authService } from "../services/authService";
import { setAuthToken } from "../services/api";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress || "";
  const clerkUserId = clerkUser?.id || "";
  const clerkFirstName = clerkUser?.firstName || "";
  const clerkLastName = clerkUser?.lastName || "";
  const clerkFullName = clerkUser?.fullName || "";
  const clerkUsername = clerkUser?.username || "";
  const clerkAvatar = clerkUser?.imageUrl || "";

  useEffect(() => {
    let active = true;

    const syncSession = async () => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        setAuthToken(null);
        if (active) {
          setUser(null);
          setAuthError(null);
          setLoading(false);
        }
        return;
      }

      try {
        const token = await getToken();
        setAuthToken(token);
        await authService.sync({
          email: clerkEmail,
          name: clerkFullName,
          firstName: clerkFirstName,
          lastName: clerkLastName,
          username: clerkUsername,
          avatar: clerkAvatar
        });
        const response = await authService.me();
        if (active) {
          setUser(response.user);
          setAuthError(null);
        }
      } catch (error) {
        if (active) {
          setUser(null);
          setAuthError(
            error?.response?.data?.message ||
              "Authentication succeeded, but DailySync could not finish syncing your account."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    setLoading(true);
    syncSession();

    return () => {
      active = false;
    };
    // Clerk user objects and hook functions can change identity often in development.
    // Depend on stable scalar values to avoid unnecessary re-sync loops.
  }, [
    clerkAvatar,
    clerkEmail,
    clerkFirstName,
    clerkFullName,
    clerkLastName,
    clerkUserId,
    clerkUsername,
    isLoaded,
    isSignedIn
  ]);

  const logout = async () => {
    setAuthToken(null);
    setUser(null);
    await signOut({ redirectUrl: "/login" });
  };

  const refreshUser = async () => {
    const response = await authService.me();
    setUser(response.user);
    return response.user;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        clerkUser,
        setUser,
        loading,
        authError,
        isClerkSignedIn: Boolean(isSignedIn),
        isAuthenticated: Boolean(isSignedIn && user),
        logout,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

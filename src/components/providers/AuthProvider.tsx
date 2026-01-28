"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  tenantId: string | null;
  loading: boolean;
  signInWithGoogle: () => Promise<any>;
  signInWithEmail: (email: string, password: string) => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  tenantId: null,
  loading: true,
  signInWithGoogle: async () => { },
  signInWithEmail: async () => { },
  resetPassword: async () => { },
  logout: async () => { },
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Force refresh token to get latest claims
        const tokenResult = await currentUser.getIdTokenResult(true);
        const tid = tokenResult.claims.tenantId as string;

        if (tid) {
          setTenantId(tid);
          // If on login/register page and we have a tenant, go to dashboard
          if (window.location.pathname === "/login" || window.location.pathname === "/register") {
            router.push("/dashboard");
          }
        } else {
          setTenantId(null);
          // If logged in but no tenant, force registration
          if (window.location.pathname !== "/register") {
            // Optionally we could show a toast here or have a specific "onboarding" page
            router.push("/register");
          }
        }
      } else {
        setTenantId(null);
        const publicPaths = ["/", "/login", "/register", "/privacy-policy", "/terms"];
        const currentPath = window.location.pathname;

        // Only redirect if NOT on a public path
        if (!publicPaths.includes(currentPath)) {
          router.push("/login");
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      const { signInWithEmailAndPassword } = await import("firebase/auth");
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      console.error("Email login failed:", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error("Password reset failed:", error);
      throw error;
    }
  }

  const logout = async () => {
    await signOut(auth);
    setTenantId(null);
    setUser(null);
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, tenantId, loading, signInWithGoogle, signInWithEmail, resetPassword, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

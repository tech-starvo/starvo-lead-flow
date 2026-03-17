import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

/** Only these email domains can sign in to the admin area. */
const ALLOWED_EMAIL_DOMAINS = ["starvo.co.id", "moizasia.com", "electrifyindonesia.id"] as const;

function isAllowedEmailDomain(email: string | null): boolean {
  if (!email || !email.includes("@")) return false;
  const domain = email.split("@")[1]?.toLowerCase().trim();
  return domain ? ALLOWED_EMAIL_DOMAINS.includes(domain as (typeof ALLOWED_EMAIL_DOMAINS)[number]) : false;
}

/** Shape compatible with existing UI (email, displayName, photoURL). */
export type AuthUser = {
  id: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

function fromFirebaseUser(u: User): AuthUser {
  return {
    id: u.uid,
    email: u.email ?? null,
    displayName: u.displayName ?? u.email ?? null,
    photoURL: u.photoURL ?? null,
  };
}

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  signInError: string | null;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  isAuthAvailable: boolean;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [signInError, setSignInError] = useState<string | null>(null);
  const isAuthAvailable = auth !== null;

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser ? fromFirebaseUser(nextUser) : null);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!auth) return;
    setLoading(true);
    setSignInError(null);
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const email = result.user?.email ?? null;
      if (!isAllowedEmailDomain(email)) {
        await firebaseSignOut(auth);
        setSignInError("domain");
        setUser(null);
      }
    } catch (err) {
      console.error("Google sign-in error:", err);
      setSignInError(null);
    }
    setLoading(false);
  }, []);

  const signOut = useCallback(async () => {
    if (!auth) return;
    setLoading(true);
    try {
      await firebaseSignOut(auth);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInError,
        signInWithGoogle,
        signOut,
        isAuthAvailable,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

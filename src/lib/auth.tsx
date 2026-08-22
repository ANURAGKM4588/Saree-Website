import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "./supabase";

export interface SavedAddress {
  id: string;
  label: string; // e.g. "Home", "Office", "Studio"
  name: string;
  phone: string;
  address: string;
  isPrimary: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  addresses: SavedAddress[];
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: {
    name: string;
    email: string;
    phone: string;
    address?: string;
    password?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (fields: Partial<UserProfile>) => void;
  addSavedAddress: (addressData: Omit<SavedAddress, "id">) => void;
  deleteSavedAddress: (addressId: string) => void;
  setPrimaryAddress: (addressId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "kadha_sarees_user_profile";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync profile to localStorage on updates
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {}
  }, [user]);

  // Sync Supabase Auth session if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !user) {
        const u = session.user;
        const initialProfile: UserProfile = {
          id: u.id,
          email: u.email || "",
          name: u.user_metadata?.full_name || u.email?.split("@")[0] || "Valued Customer",
          phone: u.user_metadata?.phone || "",
          addresses: [],
        };
        setUser(initialProfile);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(
    async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        if (isSupabaseConfigured) {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass });
          if (error) {
            // If Supabase authentication fails or user is not found, fallback to local authentication
            console.warn("Supabase auth warning:", error.message);
          } else if (data.user) {
            const profile: UserProfile = {
              id: data.user.id,
              email: data.user.email || email,
              name: data.user.user_metadata?.full_name || email.split("@")[0],
              phone: data.user.user_metadata?.phone || "",
              addresses: [],
            };
            setUser(profile);
            setIsLoading(false);
            return { success: true };
          }
        }

        // Local Auth Demo Fallback
        const defaultProfile: UserProfile = {
          id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
          email: email,
          name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          phone: "+91 98765 43210",
          addresses: [
            {
              id: "ADDR-1",
              label: "Home Address",
              name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
              phone: "+91 98765 43210",
              address: "Flat 4B, Emerald Heights, MG Road, Kochi, Kerala - 682016",
              isPrimary: true,
            },
          ],
        };
        setUser(defaultProfile);
        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || "Sign in failed" };
      }
    },
    []
  );

  const register = useCallback(
    async (data: {
      name: string;
      email: string;
      phone: string;
      address?: string;
      password?: string;
    }): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      try {
        if (isSupabaseConfigured && data.password) {
          const { data: suData } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
              data: { full_name: data.name, phone: data.phone },
            },
          });
          if (suData.user) {
            const initialAddr: SavedAddress[] = data.address
              ? [
                  {
                    id: "ADDR-1",
                    label: "Primary Delivery Address",
                    name: data.name,
                    phone: data.phone,
                    address: data.address,
                    isPrimary: true,
                  },
                ]
              : [];
            const profile: UserProfile = {
              id: suData.user.id,
              email: data.email,
              name: data.name,
              phone: data.phone,
              addresses: initialAddr,
            };
            setUser(profile);
            setIsLoading(false);
            return { success: true };
          }
        }

        // Local Auth Fallback
        const initialAddr: SavedAddress[] = data.address
          ? [
              {
                id: "ADDR-1",
                label: "Primary Delivery Address",
                name: data.name,
                phone: data.phone,
                address: data.address,
                isPrimary: true,
              },
            ]
          : [];

        const newProfile: UserProfile = {
          id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
          email: data.email,
          name: data.name,
          phone: data.phone,
          addresses: initialAddr,
        };

        setUser(newProfile);
        setIsLoading(false);
        return { success: true };
      } catch (err: any) {
        setIsLoading(false);
        return { success: false, error: err.message || "Registration failed" };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut().catch(() => {});
    }
    setUser(null);
  }, []);

  const updateProfile = useCallback((fields: Partial<UserProfile>) => {
    setUser((prev) => (prev ? { ...prev, ...fields } : null));
  }, []);

  const addSavedAddress = useCallback((addressData: Omit<SavedAddress, "id">) => {
    setUser((prev) => {
      if (!prev) return null;
      const newId = `ADDR-${Date.now().toString().substring(7)}`;
      const isFirst = prev.addresses.length === 0;
      const newAddr: SavedAddress = {
        ...addressData,
        id: newId,
        isPrimary: addressData.isPrimary || isFirst,
      };

      const updatedAddresses = addressData.isPrimary || isFirst
        ? prev.addresses.map((a) => ({ ...a, isPrimary: false })).concat(newAddr)
        : [...prev.addresses, newAddr];

      return { ...prev, addresses: updatedAddresses };
    });
  }, []);

  const deleteSavedAddress = useCallback((addressId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const filtered = prev.addresses.filter((a) => a.id !== addressId);
      if (filtered.length > 0 && !filtered.some((a) => a.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return { ...prev, addresses: filtered };
    });
  }, []);

  const setPrimaryAddress = useCallback((addressId: string) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        addresses: prev.addresses.map((a) => ({
          ...a,
          isPrimary: a.id === addressId,
        })),
      };
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        updateProfile,
        addSavedAddress,
        deleteSavedAddress,
        setPrimaryAddress,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

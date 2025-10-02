"use client";
import { useState, useEffect } from "react";
import { supabase } from "../utils/supabaseClient";
import { useRouter} from "next/navigation";

export function useAuth(protectedRoute: boolean = false) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
  
    useEffect(() => {
      async function loadUser() {
        const { data, error } = await supabase.auth.getUser();
        if (error) {
          console.error(error);
        }
        setUser(data.user);
        setLoading(false);
  
        // 🚨 If this is a protected page & no user, redirect to login
        if (protectedRoute && !data.user) {
          router.push("/login");
        }
      }
      loadUser();
  
      // Listen for login/logout events
      const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
  
      return () => {
        listener.subscription.unsubscribe();
      };
    }, [protectedRoute, router]);
  
    return { user, loading };
  }
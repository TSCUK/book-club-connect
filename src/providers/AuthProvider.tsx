import * as React from "react";

import { supabase } from "@/integrations/supabase/client";

type Profile = {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  display_name: string | null;
  avatar_url: string | null;
} | null;

type AuthContextValue = {
  session: import("@supabase/supabase-js").Session | null;
  profile: Profile;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

async function ensureProfile(userId: string) {
  const { data } = await supabase
    .from("profiles")
    .select("user_id, first_name, last_name, display_name, avatar_url")
    .eq("user_id", userId)
    .maybeSingle();

  if (data) return data;

  const { data: inserted } = await supabase
    .from("profiles")
    .insert({ user_id: userId })
    .select("user_id, first_name, last_name, display_name, avatar_url")
    .maybeSingle();

  return inserted ?? null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = React.useState<AuthContextValue["session"]>(null);
  const [profile, setProfile] = React.useState<Profile>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      setSession(nextSession);
      if (!nextSession?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const p = await ensureProfile(nextSession.user.id);
        setProfile(p);
      } finally {
        setLoading(false);
      }
    });

    // Listener must be set up before getSession()
    supabase.auth
      .getSession()
      .then(async ({ data }) => {
        setSession(data.session);
        if (data.session?.user) {
          const p = await ensureProfile(data.session.user.id);
          setProfile(p);
        }
      })
      .finally(() => setLoading(false));

    return () => subscription.unsubscribe();
  }, []);

  const signOut = React.useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const value = React.useMemo<AuthContextValue>(
    () => ({ session, profile, loading, signOut }),
    [session, profile, loading, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

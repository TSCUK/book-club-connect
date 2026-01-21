import { Outlet } from "react-router-dom";

import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";

export function AppLayout() {
  const { session, profile, signOut } = useAuth();
  const signedIn = !!session;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 w-full max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <NavLink to="/" className="text-sm font-semibold">
              CloudBook Club
            </NavLink>
            <nav className="hidden items-center gap-3 sm:flex">
              <NavLink
                to="/dashboard"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="text-foreground"
              >
                Dashboard
              </NavLink>
              <NavLink
                to="/clubs"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="text-foreground"
              >
                Clubs
              </NavLink>
              <NavLink
                to="/discussions"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="text-foreground"
              >
                Discussions
              </NavLink>
              <NavLink
                to="/profile"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                activeClassName="text-foreground"
              >
                Profile
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {signedIn ? (
              <>
                <span className="hidden text-sm text-muted-foreground sm:inline">
                  {profile?.display_name || profile?.first_name || session.user.email}
                </span>
                <Button variant="secondary" onClick={signOut}>
                  Sign out
                </Button>
              </>
            ) : (
              <>
                <Button variant="secondary" asChild>
                  <a href="/login">Sign in</a>
                </Button>
                <Button asChild>
                  <a href="/signup">Sign up</a>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <Outlet />
    </div>
  );
}

import { useAuth } from "@/providers/AuthProvider";

export default function Dashboard() {
  const { profile, session } = useAuth();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Welcome{profile?.first_name ? `, ${profile.first_name}` : ""}.
        </p>
      </header>

      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">My clubs</h2>
          <p className="mt-1 text-sm text-muted-foreground">Coming next: create/join clubs.</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-sm font-semibold">Reading status</h2>
          <p className="mt-1 text-sm text-muted-foreground">Coming next: status per current read.</p>
        </div>
      </section>

      <section className="mt-6 rounded-lg border border-border bg-card p-4">
        <h2 className="text-sm font-semibold">Account</h2>
        <p className="mt-1 text-sm text-muted-foreground">Signed in as {session?.user.email}</p>
      </section>
    </main>
  );
}

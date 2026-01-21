import { useAuth } from "@/providers/AuthProvider";

export default function Profile() {
  const { profile, session } = useAuth();

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Profile</p>
        <h1 className="text-3xl font-semibold tracking-tight">Reading profile</h1>
        <p className="text-sm text-muted-foreground">
          Manage your personal details and notification preferences.
        </p>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <article className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Personal details</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-md border border-border p-3">
                <p className="text-xs text-muted-foreground">Full name</p>
                <p className="text-sm font-medium">
                  {profile?.display_name || `${profile?.first_name ?? ""} ${profile?.last_name ?? ""}`.trim() ||
                    "Adaeze Okeke"}
                </p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{session?.user.email ?? "reader@cloudbook.club"}</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-xs text-muted-foreground">Reading interests</p>
                <p className="text-sm font-medium">African fiction, History, Speculative</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-xs text-muted-foreground">Role</p>
                <p className="text-sm font-medium">Registered member</p>
              </div>
            </div>
            <button className="mt-4 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
              Edit profile
            </button>
          </article>

          <article className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Reading stats</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-md border border-border p-3">
                <p className="text-xs text-muted-foreground">Clubs joined</p>
                <p className="text-lg font-semibold">3</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-xs text-muted-foreground">Books completed</p>
                <p className="text-lg font-semibold">8</p>
              </div>
              <div className="rounded-md border border-border p-3">
                <p className="text-xs text-muted-foreground">Upcoming discussions</p>
                <p className="text-lg font-semibold">2</p>
              </div>
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <label className="flex items-center justify-between gap-3">
                New book selected
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between gap-3">
                Discussion updates
                <input type="checkbox" defaultChecked className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between gap-3">
                Reading deadlines
                <input type="checkbox" className="h-4 w-4" />
              </label>
            </div>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Account security</h2>
            <p className="mt-2 text-sm text-muted-foreground">Last password update: 3 months ago</p>
            <button className="mt-4 w-full rounded-md border border-input px-3 py-2 text-sm font-medium">
              Update password
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

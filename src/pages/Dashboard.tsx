import { useAuth } from "@/providers/AuthProvider";
import { clubs, notifications } from "@/lib/mockData";

export default function Dashboard() {
  const { profile, session } = useAuth();

  const joinedClubs = clubs.slice(0, 2);
  const activeClub = joinedClubs[0];

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Dashboard</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          Welcome{profile?.first_name ? `, ${profile.first_name}` : " back"}.
        </h1>
        <p className="text-sm text-muted-foreground">
          Track your clubs, progress, and upcoming discussions in one place.
        </p>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">My clubs</h2>
            <div className="mt-3 space-y-3">
              {joinedClubs.map((club) => (
                <div key={club.id} className="rounded-md border border-border p-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold">{club.name}</p>
                      <p className="text-xs text-muted-foreground">{club.focus}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">{club.members} members</span>
                  </div>
                  <div className="mt-3">
                    <p className="text-xs text-muted-foreground">Current book</p>
                    <p className="text-sm">{club.currentBook}</p>
                    <div className="mt-2 h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${club.progress}%` }}
                      />
                    </div>
                    <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{club.progress}% complete</span>
                      <span>Next discussion: {club.nextDiscussion}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {activeClub && (
            <div className="rounded-lg border border-border bg-card p-4">
              <h2 className="text-sm font-semibold">Reading progress</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                You are currently reading {activeClub.currentBook}.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border border-border p-3">
                  <p className="text-xs text-muted-foreground">Chapters read</p>
                  <p className="text-lg font-semibold">12 / 20</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-xs text-muted-foreground">Pages read</p>
                  <p className="text-lg font-semibold">220 / 360</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-xs text-muted-foreground">Next milestone</p>
                  <p className="text-lg font-semibold">Chapter 15</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Notifications</h2>
            <ul className="mt-3 space-y-3">
              {notifications.map((item) => (
                <li key={item.id} className="rounded-md border border-border p-3">
                  <p className="text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Account</h2>
            <p className="mt-1 text-sm text-muted-foreground">Signed in as {session?.user.email}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Use the profile page to update your reading interests and notification preferences.
            </p>
          </div>
        </aside>
      </section>
    </main>
  );
}

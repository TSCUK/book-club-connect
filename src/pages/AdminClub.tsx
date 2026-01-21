export default function AdminClub() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Admin tools</p>
        <h1 className="text-3xl font-semibold tracking-tight">Manage your club</h1>
        <p className="text-sm text-muted-foreground">
          Approve members, moderate posts, and control the reading cycle.
        </p>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <article className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Pending join requests</h2>
            <div className="mt-3 space-y-3">
              {["Femi A.", "Grace N.", "Samuel O."].map((name) => (
                <div key={name} className="flex items-center justify-between rounded-md border border-border p-3">
                  <div>
                    <p className="text-sm font-medium">{name}</p>
                    <p className="text-xs text-muted-foreground">Requested 2 days ago</p>
                  </div>
                  <div className="flex gap-2">
                    <button className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
                      Approve
                    </button>
                    <button className="rounded-md border border-input px-3 py-1 text-xs font-medium">
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Moderation queue</h2>
            <div className="mt-3 space-y-3">
              {["Thread flagged: spoilers in chapter 9", "Comment flagged: off-topic reply"].map((item) => (
                <div key={item} className="flex items-center justify-between rounded-md border border-border p-3">
                  <p className="text-sm text-muted-foreground">{item}</p>
                  <button className="rounded-md border border-input px-3 py-1 text-xs font-medium">
                    Review
                  </button>
                </div>
              ))}
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Reading cycle</h2>
            <p className="mt-2 text-sm text-muted-foreground">Current book: Half of a Yellow Sun</p>
            <p className="mt-1 text-xs text-muted-foreground">Ends Oct 30, 2024</p>
            <button className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
              Set next timeline
            </button>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Member tools</h2>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>Members: 128</p>
              <p>Active this week: 56</p>
              <p>Archived cycles: 4</p>
            </div>
            <button className="mt-4 w-full rounded-md border border-input px-3 py-2 text-sm font-medium">
              Manage members
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}

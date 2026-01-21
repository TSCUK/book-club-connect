import { discussionThreads } from "@/lib/mockData";

export default function Discussions() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Discussion board</p>
        <h1 className="text-3xl font-semibold tracking-tight">Half of a Yellow Sun</h1>
        <p className="text-sm text-muted-foreground">
          Lagos Literary Circle • Reading cycle: Sept 20 – Oct 30
        </p>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <article className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-sm font-semibold">Start a new thread</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Keep discussions structured by chapters or themes.
                </p>
              </div>
              <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                New post
              </button>
            </div>
          </article>

          <div className="space-y-3">
            {discussionThreads.map((thread) => (
              <article key={thread.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-semibold">{thread.title}</h3>
                    <p className="text-xs text-muted-foreground">
                      Started by {thread.author} • {thread.timestamp}
                    </p>
                  </div>
                  <span className="rounded-full border border-border px-2 py-1 text-xs text-muted-foreground">
                    {thread.replies} replies
                  </span>
                </div>
                <div className="mt-3 rounded-md border border-border bg-muted/50 p-3 text-sm text-muted-foreground">
                  This thread focuses on key insights and academic references. Reply to keep the conversation moving.
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Reading progress</h2>
            <p className="mt-2 text-sm text-muted-foreground">You are 62% through the current book.</p>
            <div className="mt-3 h-2 w-full rounded-full bg-muted">
              <div className="h-2 rounded-full bg-primary" style={{ width: "62%" }} />
            </div>
            <button className="mt-4 w-full rounded-md border border-input px-3 py-2 text-sm font-medium">
              Update progress
            </button>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Discussion guidelines</h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Share chapter/page references.</li>
              <li>Keep debates respectful and academic-focused.</li>
              <li>Tag spoilers clearly in replies.</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}

import { clubs } from "@/lib/mockData";

export default function Clubs() {
  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Book clubs</p>
        <h1 className="text-3xl font-semibold tracking-tight">Explore public book clubs</h1>
        <p className="text-sm text-muted-foreground">
          Browse active clubs, review the current reading cycle, and request to join.
        </p>
      </header>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {clubs.map((club) => (
          <article key={club.id} className="rounded-lg border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">{club.name}</h2>
                <p className="text-sm text-muted-foreground">{club.focus}</p>
              </div>
              <span className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                {club.privacy}
              </span>
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Current book:</span> {club.currentBook}
              </p>
              <p>
                <span className="font-medium text-foreground">Next discussion:</span> {club.nextDiscussion}
              </p>
              <p>
                <span className="font-medium text-foreground">Members:</span> {club.members}
              </p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={`/clubs/${club.id}`}
                className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 text-sm font-medium transition-colors hover:bg-accent"
              >
                View club
              </a>
              <button className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground">
                Request to join
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

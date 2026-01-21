import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { clubs } from "@/lib/mockData";

export default function ClubDetail() {
  const { clubId } = useParams();
  const club = useMemo(() => clubs.find((item) => item.id === clubId) ?? clubs[0], [clubId]);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <header className="space-y-2">
        <p className="text-sm font-medium text-muted-foreground">Book club</p>
        <h1 className="text-3xl font-semibold tracking-tight">{club.name}</h1>
        <p className="text-sm text-muted-foreground">{club.focus}</p>
      </header>

      <section className="mt-6 grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="space-y-4">
          <article className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Current reading cycle</h2>
            <p className="mt-2 text-sm">{club.currentBook}</p>
            <p className="mt-2 text-xs text-muted-foreground">Reading timeline: Sept 20 – Oct 30</p>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Club progress</span>
                <span>{club.progress}%</span>
              </div>
              <div className="mt-2 h-2 w-full rounded-full bg-muted">
                <div className="h-2 rounded-full bg-primary" style={{ width: `${club.progress}%` }} />
              </div>
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Book recommendations</h2>
            <div className="mt-3 space-y-3">
              {["Purple Hibiscus — C.N. Adichie", "Stay With Me — Ayobami Adebayo", "Things Fall Apart — Chinua Achebe"].map(
                (title) => (
                  <div key={title} className="flex items-center justify-between rounded-md border border-border p-3">
                    <p className="text-sm">{title}</p>
                    <button className="rounded-full border border-input px-3 py-1 text-xs text-muted-foreground">
                      Vote
                    </button>
                  </div>
                )
              )}
            </div>
          </article>

          <article className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Discussion topics</h2>
            <p className="mt-1 text-sm text-muted-foreground">Keep conversations organized by chapters.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "Opening themes & historical context",
                "Character development in chapters 3-5",
                "Symbolism and recurring motifs",
                "Modern parallels and reflections",
              ].map((topic) => (
                <div key={topic} className="rounded-md border border-border p-3">
                  <p className="text-sm font-medium">{topic}</p>
                  <p className="text-xs text-muted-foreground">6 replies • Last updated today</p>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <a
                href="/discussions"
                className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground"
              >
                Go to discussion board
              </a>
            </div>
          </article>
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Club details</h2>
            <div className="mt-3 space-y-2 text-sm text-muted-foreground">
              <p>
                <span className="font-medium text-foreground">Members:</span> {club.members}
              </p>
              <p>
                <span className="font-medium text-foreground">Privacy:</span> {club.privacy}
              </p>
              <p>
                <span className="font-medium text-foreground">Next discussion:</span> {club.nextDiscussion}
              </p>
            </div>
            <button className="mt-4 w-full rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
              Join reading cycle
            </button>
          </div>

          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Club admin</h2>
            <p className="mt-2 text-sm text-muted-foreground">Admin: Adaeze Okeke</p>
            <p className="mt-1 text-xs text-muted-foreground">Contact for membership approvals.</p>
            <a
              href="/admin"
              className="mt-4 inline-flex w-full items-center justify-center rounded-md border border-input px-3 py-2 text-sm font-medium"
            >
              Admin tools
            </a>
          </div>
        </aside>
      </section>
    </main>
  );
}

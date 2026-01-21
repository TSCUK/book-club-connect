const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-12 sm:py-16">
        <header className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">CloudBook Club</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            A structured, academic-friendly book club platform—built for African and Nigerian reading communities.
          </h1>
          <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Create and join clubs, set a current read, track reading status, and hold focused discussions—all within a
            cloud-ready workspace designed for students, educators, and lifelong readers.
          </p>
        </header>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="/signup"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm ring-offset-background transition-colors hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Create an account
          </a>
          <a
            href="/login"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            Sign in
          </a>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Clubs</h2>
            <p className="mt-1 text-sm text-muted-foreground">Create or join open clubs in seconds.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Current Read</h2>
            <p className="mt-1 text-sm text-muted-foreground">Admins set the book for each reading cycle.</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4">
            <h2 className="text-sm font-semibold">Discussions</h2>
            <p className="mt-1 text-sm text-muted-foreground">Threaded topics per club, per book.</p>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30">
        <div className="mx-auto w-full max-w-5xl px-4 py-12">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground">How it works</p>
              <h2 className="mt-2 text-2xl font-semibold">Everything you need for structured reading cycles.</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                CloudBook Club keeps clubs, books, and discussions connected. Vote on the next title, set
                reading timelines, and keep discussion threads organized by book and chapter.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-sm font-semibold">Book voting</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recommend and vote on the next reading cycle to keep everyone aligned.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-sm font-semibold">Progress tracking</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Mark chapters/pages read and visualize progress with clean indicators.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-sm font-semibold">Notifications</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Get alerts when new books, threads, or deadlines appear.
                </p>
              </div>
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-sm font-semibold">Admin controls</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Approve members, moderate posts, and archive completed reading cycles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;

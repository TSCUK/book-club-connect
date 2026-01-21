// Update this page (the content is just a fallback if you fail to update the page)

const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      <section className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-12 sm:py-16">
        <header className="space-y-4">
          <p className="text-sm font-medium text-muted-foreground">CloudBook Club</p>
          <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            A structured, academic-friendly book club platform—built for African and Nigerian reading communities.
          </h1>
          <p className="max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Create and join clubs, set a current read, track your reading status, and hold focused discussions—without the noise of social media.
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
            <p className="mt-1 text-sm text-muted-foreground">Threaded topics per club (and per book later).</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Index;

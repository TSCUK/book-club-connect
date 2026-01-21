-- CloudBook Club v1 schema

-- 1) Enums
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'club_privacy') THEN
    CREATE TYPE public.club_privacy AS ENUM ('public', 'private');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'club_member_role') THEN
    CREATE TYPE public.club_member_role AS ENUM ('admin', 'member');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'member_status') THEN
    CREATE TYPE public.member_status AS ENUM ('active', 'left');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'read_status') THEN
    CREATE TYPE public.read_status AS ENUM ('not_started', 'in_progress', 'finished');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'club_read_status') THEN
    CREATE TYPE public.club_read_status AS ENUM ('active', 'archived');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'notification_type') THEN
    CREATE TYPE public.notification_type AS ENUM (
      'thread_created',
      'comment_created',
      'reply_created',
      'current_read_changed'
    );
  END IF;
END $$;

-- 2) Timestamp helper
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- 3) Profiles (user-owned)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  first_name TEXT,
  last_name TEXT,
  display_name TEXT,
  avatar_url TEXT,
  status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger WHERE tgname = 'trg_profiles_updated_at'
  ) THEN
    CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Profiles: select own'
  ) THEN
    CREATE POLICY "Profiles: select own"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Profiles: insert own'
  ) THEN
    CREATE POLICY "Profiles: insert own"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='profiles' AND policyname='Profiles: update own'
  ) THEN
    CREATE POLICY "Profiles: update own"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 4) Clubs
CREATE TABLE IF NOT EXISTS public.clubs (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  privacy public.club_privacy NOT NULL DEFAULT 'public',
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_clubs_updated_at') THEN
    CREATE TRIGGER trg_clubs_updated_at
    BEFORE UPDATE ON public.clubs
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_clubs_created_by ON public.clubs(created_by);

ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='clubs' AND policyname='Clubs: public read'
  ) THEN
    CREATE POLICY "Clubs: public read"
    ON public.clubs
    FOR SELECT
    TO anon, authenticated
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='clubs' AND policyname='Clubs: create'
  ) THEN
    CREATE POLICY "Clubs: create"
    ON public.clubs
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='clubs' AND policyname='Clubs: update by creator'
  ) THEN
    CREATE POLICY "Clubs: update by creator"
    ON public.clubs
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='clubs' AND policyname='Clubs: delete by creator'
  ) THEN
    CREATE POLICY "Clubs: delete by creator"
    ON public.clubs
    FOR DELETE
    TO authenticated
    USING (auth.uid() = created_by);
  END IF;
END $$;

-- 5) Club members (open join)
CREATE TABLE IF NOT EXISTS public.club_members (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role public.club_member_role NOT NULL DEFAULT 'member',
  member_status public.member_status NOT NULL DEFAULT 'active',
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (club_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_club_members_club_id ON public.club_members(club_id);
CREATE INDEX IF NOT EXISTS idx_club_members_user_id ON public.club_members(user_id);

ALTER TABLE public.club_members ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='club_members' AND policyname='Club members: read for members'
  ) THEN
    CREATE POLICY "Club members: read for members"
    ON public.club_members
    FOR SELECT
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.club_members cm
        WHERE cm.club_id = club_members.club_id
          AND cm.user_id = auth.uid()
          AND cm.member_status = 'active'
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='club_members' AND policyname='Club members: join'
  ) THEN
    CREATE POLICY "Club members: join"
    ON public.club_members
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='club_members' AND policyname='Club members: leave self'
  ) THEN
    CREATE POLICY "Club members: leave self"
    ON public.club_members
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 6) Books (public catalog)
CREATE TABLE IF NOT EXISTS public.books (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT,
  isbn TEXT UNIQUE,
  language TEXT,
  published_year INT,
  cover_image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='books' AND policyname='Books: public read'
  ) THEN
    CREATE POLICY "Books: public read"
    ON public.books
    FOR SELECT
    TO anon, authenticated
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='books' AND policyname='Books: create authenticated'
  ) THEN
    CREATE POLICY "Books: create authenticated"
    ON public.books
    FOR INSERT
    TO authenticated
    WITH CHECK (true);
  END IF;
END $$;

-- 7) Club reads (one active per club enforced in app for v1)
CREATE TABLE IF NOT EXISTS public.club_reads (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE RESTRICT,
  status public.club_read_status NOT NULL DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_club_reads_club_id ON public.club_reads(club_id);
CREATE INDEX IF NOT EXISTS idx_club_reads_book_id ON public.club_reads(book_id);

ALTER TABLE public.club_reads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='club_reads' AND policyname='Club reads: public read'
  ) THEN
    CREATE POLICY "Club reads: public read"
    ON public.club_reads
    FOR SELECT
    TO anon, authenticated
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='club_reads' AND policyname='Club reads: manage by creator'
  ) THEN
    CREATE POLICY "Club reads: manage by creator"
    ON public.club_reads
    FOR ALL
    TO authenticated
    USING (
      EXISTS (
        SELECT 1 FROM public.clubs c
        WHERE c.id = club_reads.club_id
          AND c.created_by = auth.uid()
      )
    )
    WITH CHECK (
      EXISTS (
        SELECT 1 FROM public.clubs c
        WHERE c.id = club_reads.club_id
          AND c.created_by = auth.uid()
      )
    );
  END IF;
END $$;

-- 8) Reading progress (status-only, per user per club_read)
CREATE TABLE IF NOT EXISTS public.reading_progress (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  club_read_id UUID NOT NULL REFERENCES public.club_reads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status public.read_status NOT NULL DEFAULT 'not_started',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (club_read_id, user_id)
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_reading_progress_updated_at') THEN
    CREATE TRIGGER trg_reading_progress_updated_at
    BEFORE UPDATE ON public.reading_progress
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_reading_progress_user_id ON public.reading_progress(user_id);

ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reading_progress' AND policyname='Reading progress: read own'
  ) THEN
    CREATE POLICY "Reading progress: read own"
    ON public.reading_progress
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reading_progress' AND policyname='Reading progress: upsert own'
  ) THEN
    CREATE POLICY "Reading progress: upsert own"
    ON public.reading_progress
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='reading_progress' AND policyname='Reading progress: update own'
  ) THEN
    CREATE POLICY "Reading progress: update own"
    ON public.reading_progress
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 9) Discussion threads
CREATE TABLE IF NOT EXISTS public.discussion_threads (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID NOT NULL REFERENCES public.clubs(id) ON DELETE CASCADE,
  club_read_id UUID REFERENCES public.club_reads(id) ON DELETE SET NULL,
  created_by UUID NOT NULL,
  title TEXT NOT NULL,
  is_pinned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_threads_club_id ON public.discussion_threads(club_id);

ALTER TABLE public.discussion_threads ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='discussion_threads' AND policyname='Threads: public read'
  ) THEN
    CREATE POLICY "Threads: public read"
    ON public.discussion_threads
    FOR SELECT
    TO anon, authenticated
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='discussion_threads' AND policyname='Threads: create (member)'
  ) THEN
    CREATE POLICY "Threads: create (member)"
    ON public.discussion_threads
    FOR INSERT
    TO authenticated
    WITH CHECK (
      auth.uid() = created_by
      AND EXISTS (
        SELECT 1 FROM public.club_members cm
        WHERE cm.club_id = discussion_threads.club_id
          AND cm.user_id = auth.uid()
          AND cm.member_status = 'active'
      )
    );
  END IF;
END $$;

-- 10) Thread comments (supports replies)
CREATE TABLE IF NOT EXISTS public.thread_comments (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL REFERENCES public.discussion_threads(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  parent_comment_id UUID REFERENCES public.thread_comments(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  is_deleted BOOLEAN NOT NULL DEFAULT false
);

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_thread_comments_updated_at') THEN
    CREATE TRIGGER trg_thread_comments_updated_at
    BEFORE UPDATE ON public.thread_comments
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_comments_thread_id ON public.thread_comments(thread_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.thread_comments(parent_comment_id);

ALTER TABLE public.thread_comments ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='thread_comments' AND policyname='Comments: public read'
  ) THEN
    CREATE POLICY "Comments: public read"
    ON public.thread_comments
    FOR SELECT
    TO anon, authenticated
    USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='thread_comments' AND policyname='Comments: create (member)'
  ) THEN
    CREATE POLICY "Comments: create (member)"
    ON public.thread_comments
    FOR INSERT
    TO authenticated
    WITH CHECK (
      auth.uid() = user_id
      AND EXISTS (
        SELECT 1
        FROM public.discussion_threads t
        JOIN public.club_members cm ON cm.club_id = t.club_id
        WHERE t.id = thread_comments.thread_id
          AND cm.user_id = auth.uid()
          AND cm.member_status = 'active'
      )
    );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='thread_comments' AND policyname='Comments: update own'
  ) THEN
    CREATE POLICY "Comments: update own"
    ON public.thread_comments
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- 11) In-app notifications (private)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  type public.notification_type NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  link_url TEXT,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='notifications' AND policyname='Notifications: read own'
  ) THEN
    CREATE POLICY "Notifications: read own"
    ON public.notifications
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname='public' AND tablename='notifications' AND policyname='Notifications: update own'
  ) THEN
    CREATE POLICY "Notifications: update own"
    ON public.notifications
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

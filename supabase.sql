-- ============================================================================
-- Mount Comfort Men's Club  Supabase setup
-- Run once: Supabase Dashboard -> SQL Editor -> New query -> paste -> Run.
-- ============================================================================

-- 1) Ratings table. Score is 1-10 (the app shows it as 5 stars, 2 pts/star).
create table if not exists public.ratings (
  book       text    not null,
  member     text    not null,
  score      int     not null check (score between 1 and 10),
  updated_at timestamptz not null default now(),
  primary key (book, member)
);

-- 2) Row Level Security: anyone with the anon key may read all ratings and
--    add / update / remove a rating. (Unlisted club link, no logins.)
alter table public.ratings enable row level security;

create policy "read ratings"   on public.ratings for select using (true);
create policy "insert ratings" on public.ratings for insert with check (true);
create policy "update ratings" on public.ratings for update using (true) with check (true);
create policy "delete ratings" on public.ratings for delete using (true);

-- 3) Migrate the 39 existing ratings from the old Val.town app.
insert into public.ratings (book, member, score) values
  ('1984', 'Justin Ray', 8),
  ('1984', 'Alex McDowell', 10),
  ('Digital Fortress', 'Justin Ray', 10),
  ('Digital Fortress', 'Alex McDowell', 6),
  ('Project Hail Mary', 'Justin Ray', 1),
  ('Project Hail Mary', 'Alex McDowell', 8),
  ('These Silent Woods', 'Justin Ray', 6),
  ('With', 'Justin Ray', 10),
  ('The Wager', 'Justin Ray', 5),
  ('Sightseeing', 'Justin Ray', 2),
  ('Sightseeing', 'Alex McDowell', 5),
  ('A Study in Scarlet', 'Justin Ray', 8),
  ('A Study in Scarlet', 'Alex McDowell', 7),
  ('Fathered by God', 'Justin Ray', 6),
  ('Fathered by God', 'Alex McDowell', 9),
  ('Frankenstein', 'Justin Ray', 9),
  ('Frankenstein', 'Alex McDowell', 10),
  ('The Ruthless Elimination of Hurry', 'Justin Ray', 7),
  ('The Ruthless Elimination of Hurry', 'Alex McDowell', 8),
  ('The Imitation of Christ', 'Justin Ray', 9),
  ('The Problem of Pain', 'Justin Ray', 8),
  ('Be a Man of Standing', 'Justin Ray', 8),
  ('Same Kind of Different as Me', 'Justin Ray', 8),
  ('Family Discipleship', 'Justin Ray', 7),
  ('Mere Christianity', 'Justin Ray', 10),
  ('Imitating Jesus', 'Justin Ray', 10),
  ('Extreme Ownership', 'Justin Ray', 8),
  ('Demon Copperhead', 'Justin Ray', 4),
  ('The Boys in the Boat', 'Justin Ray', 7),
  ('The Greatest Beer Run Ever', 'Justin Ray', 5),
  ('The Road', 'Justin Ray', 3),
  ('Winning the War in Your Mind', 'Justin Ray', 6),
  ('The Screwtape Letters', 'Justin Ray', 10),
  ('Pilgrim''s Progress', 'Justin Ray', 9),
  ('This is the Day', 'Justin Ray', 5),
  ('Gates of Fire', 'Justin Ray', 4),
  ('Voice of the Heart', 'Justin Ray', 5),
  ('The Journey to the East', 'Alex McDowell', 8),
  ('Revenge of the Tipping Point', 'Alex McDowell', 7)
on conflict (book, member) do update set score = excluded.score, updated_at = now();

-- 4) Turn on realtime (live updates for everyone). Either run this line, or in
--    the dashboard: Database -> Replication -> supabase_realtime -> enable "ratings".
alter publication supabase_realtime add table public.ratings;

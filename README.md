# Mount Comfort Men's Club

A mobile-first book-ratings dashboard for the club — every book, who led it, the
drink of the month, and the group's 5-star ratings. Built as plain static files
(HTML/CSS/JS), so it hosts anywhere — including **GitHub Pages** for free — and
syncs ratings live across all members through **Supabase**.

> Replaces the old Val.town app. The Hono server is gone; the browser talks to
> Supabase directly.

---

## What's in here

| File | What it is |
|---|---|
| `index.html` | The app shell |
| `styles.css` | All styling (warm/clubby theme) |
| `data.js` | **Club data** — members + meeting history. Edit this to add a meeting. |
| `store.js` | Data layer — picks Supabase (live) or local (demo) automatically |
| `app.js` | UI logic (tabs, cards, star rating, detail sheet) |
| `config.js` | **Your Supabase keys go here** |
| `supabase.sql` | One-paste database setup + migration of existing ratings |

---

## Run it locally

It's static — just open `index.html`, or serve the folder:

```bash
python3 -m http.server 8000   # then visit http://localhost:8000
```

With no Supabase keys, it runs in **Demo mode**: fully usable, but ratings save
only in that browser (the header shows "This device"). Good for trying it out.

---

## Going live (shared ratings for everyone)

### 1. Create the database
1. Make a free project at **https://supabase.com**.
2. In the dashboard: **SQL Editor → New query**, paste the entire contents of
   `supabase.sql`, and **Run**. This creates the `ratings` table, opens the
   access policies, **migrates all your existing ratings**, and enables realtime.

### 2. Add your keys
In the Supabase dashboard: **Project Settings → API**. Copy the **Project URL**
and the **anon / public** key into `config.js`:

```js
window.SUPABASE_URL = "https://YOURPROJECT.supabase.co";
window.SUPABASE_ANON_KEY = "eyJhbGciOi...";
```

The anon key is safe to commit to a public repo — it can only do what the SQL
policies allow (read ratings, and add/update/remove a rating). There are no
logins; anyone with the link can rate, exactly like before.

Reload — the header now reads **"Live"** and every member sees updates in real time.

---

## Deploy to GitHub Pages

1. Create a repo and push these files to it (everything in this folder).
2. On GitHub: **Settings → Pages → Build and deployment**. Set **Source** to
   *Deploy from a branch*, branch **main**, folder **/ (root)**. Save.
3. Wait ~1 minute. Your site is live at
   `https://YOURNAME.github.io/YOURREPO/`.
4. Share that URL with the club. (Want a private link like before? Keep the repo
   private isn't enough for Pages — instead just don't list the URL anywhere;
   it's effectively unlisted.)

Any push to `main` redeploys automatically.

---

## Everyday upkeep

**Add a new meeting** — edit `data.js`, add an object to the **top** of `MEETINGS`:

```js
{ date: "June 2026", book: "The Title", leader: "Mike Kaminski", drink: "Something Clever" },
```

Commit and push. No database change needed — ratings attach to the book title.

**Add or remove a member** — edit the `MEMBERS` array in `data.js`.

---

## Notes

- **Ratings are stored 1–10**, shown as 5 stars (each star = 2 points), so the
  old scores carried over exactly and half-stars work.
- `SEED_RATINGS` in `data.js` is only a snapshot for demo mode; the live source
  of truth is the Supabase table.

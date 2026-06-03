/* ============================================================================
   Data layer — ratings storage + realtime
   ----------------------------------------------------------------------------
   Exposes window.Store with a single async-ish API the UI talks to:

     Store.ready          -> Promise that resolves once initial data is loaded
     Store.mode           -> "live" | "demo"
     Store.getAll()       -> { [book]: { [member]: score(1-10) } }
     Store.setRating(book, member, score)   // score 1-10, or null to clear
     Store.onChange(fn)   -> subscribe to changes; returns unsubscribe fn

   Two backends, chosen automatically:
     • SupabaseStore — when config.js has real credentials. Realtime sync.
     • LocalStore    — otherwise. Saves to localStorage; syncs across this
                       browser's tabs via the `storage` event (demo only).
   ========================================================================== */
(function () {
  const LS_KEY = "mcmc_ratings_v1";

  // ---- shared change-notifier mixin --------------------------------------
  function makeEmitter(obj) {
    const subs = new Set();
    obj.onChange = (fn) => { subs.add(fn); return () => subs.delete(fn); };
    obj._emit = () => subs.forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
    return obj;
  }

  // ---- Local (demo) backend ----------------------------------------------
  function LocalStore() {
    const store = makeEmitter({ mode: "demo" });
    let data = load();

    function load() {
      try {
        const raw = localStorage.getItem(LS_KEY);
        if (raw) return JSON.parse(raw);
      } catch (e) { /* ignore */ }
      // First run: seed from the migrated snapshot
      const seed = JSON.parse(JSON.stringify(window.SEED_RATINGS || {}));
      try { localStorage.setItem(LS_KEY, JSON.stringify(seed)); } catch (e) {}
      return seed;
    }

    store.getAll = () => data;

    store.setRating = (book, member, score) => {
      if (!data[book]) data[book] = {};
      if (score == null) delete data[book][member];
      else data[book][member] = score;
      if (Object.keys(data[book]).length === 0) delete data[book];
      try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) {}
      store._emit();
    };

    // Live-ish sync across tabs of the same browser
    window.addEventListener("storage", (e) => {
      if (e.key === LS_KEY) { data = load(); store._emit(); }
    });

    store.ready = Promise.resolve();
    return store;
  }

  // ---- Supabase (live, shared) backend -----------------------------------
  function SupabaseStore(url, key) {
    const store = makeEmitter({ mode: "live" });
    const data = {};
    const sb = window.supabase.createClient(url, key);

    function apply(row) {
      if (!data[row.book]) data[row.book] = {};
      data[row.book][row.member] = row.score;
    }
    function remove(book, member) {
      if (data[book]) { delete data[book][member]; if (!Object.keys(data[book]).length) delete data[book]; }
    }

    store.getAll = () => data;

    store.setRating = async (book, member, score) => {
      // optimistic local update so the UI feels instant
      if (score == null) remove(book, member);
      else apply({ book, member, score });
      store._emit();
      try {
        if (score == null) {
          await sb.from("ratings").delete().match({ book, member });
        } else {
          await sb.from("ratings").upsert({ book, member, score }, { onConflict: "book,member" });
        }
      } catch (e) { console.error("Supabase write failed", e); }
    };

    store.ready = (async () => {
      const { data: rows, error } = await sb.from("ratings").select("book,member,score");
      if (error) { console.error(error); return; }
      (rows || []).forEach(apply);
      // realtime: everyone sees changes as they happen
      sb.channel("ratings-stream")
        .on("postgres_changes", { event: "*", schema: "public", table: "ratings" }, (payload) => {
          if (payload.eventType === "DELETE") {
            const old = payload.old || {};
            remove(old.book, old.member);
          } else {
            apply(payload.new);
          }
          store._emit();
        })
        .subscribe();
    })();

    return store;
  }

  // ---- pick a backend -----------------------------------------------------
  const url = (window.SUPABASE_URL || "").trim();
  const key = (window.SUPABASE_ANON_KEY || "").trim();
  const haveCreds = url && key && window.supabase && /^https?:\/\//.test(url);

  window.Store = haveCreds ? SupabaseStore(url, key) : LocalStore();
})();

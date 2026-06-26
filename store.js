/* ============================================================================
   Data layer — ratings storage + realtime
   ----------------------------------------------------------------------------
   Exposes window.Store with a single async-ish API the UI talks to:

     Store.ready          -> Promise that resolves once initial data is loaded
     Store.mode           -> "live" | "demo"
     Store.getAll()       -> { [book]: { [member]: score(1-10) } }
     Store.getAllDrinks()  -> { [drink]: { [member]: score(1-10) } }
     Store.setRating(book, member, score)         // score 1-10, or null to clear
     Store.setDrinkRating(drink, member, score)   // score 1-10, or null to clear
     Store.onChange(fn)   -> subscribe to changes; returns unsubscribe fn

   Two backends, chosen automatically:
     • SupabaseStore — when config.js has real credentials. Realtime sync.
     • LocalStore    — otherwise. Saves to localStorage; syncs across this
                       browser's tabs via the `storage` event (demo only).
   ========================================================================== */
(function () {
  const LS_KEY       = "mcmc_ratings_v1";
  const LS_KEY_DRINK = "mcmc_drink_ratings_v1";

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
    let data      = load(LS_KEY,       window.SEED_RATINGS || {});
    let drinkData = load(LS_KEY_DRINK, {});

    function load(key, seed) {
      try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw);
      } catch (e) { /* ignore */ }
      const s = JSON.parse(JSON.stringify(seed));
      try { localStorage.setItem(key, JSON.stringify(s)); } catch (e) {}
      return s;
    }

    store.getAll      = () => data;
    store.getAllDrinks = () => drinkData;

    store.setRating = (book, member, score) => {
      if (!data[book]) data[book] = {};
      if (score == null) delete data[book][member];
      else data[book][member] = score;
      if (Object.keys(data[book]).length === 0) delete data[book];
      try { localStorage.setItem(LS_KEY, JSON.stringify(data)); } catch (e) {}
      store._emit();
    };

    store.setDrinkRating = (drink, member, score) => {
      if (!drinkData[drink]) drinkData[drink] = {};
      if (score == null) delete drinkData[drink][member];
      else drinkData[drink][member] = score;
      if (Object.keys(drinkData[drink]).length === 0) delete drinkData[drink];
      try { localStorage.setItem(LS_KEY_DRINK, JSON.stringify(drinkData)); } catch (e) {}
      store._emit();
    };

    // Live-ish sync across tabs of the same browser
    window.addEventListener("storage", (e) => {
      if (e.key === LS_KEY)       { data      = load(LS_KEY,       window.SEED_RATINGS || {}); store._emit(); }
      if (e.key === LS_KEY_DRINK) { drinkData = load(LS_KEY_DRINK, {}); store._emit(); }
    });

    store.ready = Promise.resolve();
    return store;
  }

  // ---- Supabase (live, shared) backend -----------------------------------
  function SupabaseStore(url, key) {
    const store = makeEmitter({ mode: "live" });
    const data      = {};
    const drinkData = {};
    const sb = window.supabase.createClient(url, key);

    function apply(target, row) {
      if (!target[row.book]) target[row.book] = {};
      target[row.book][row.member] = row.score;
    }
    function remove(target, book, member) {
      if (target[book]) { delete target[book][member]; if (!Object.keys(target[book]).length) delete target[book]; }
    }

    store.getAll      = () => data;
    store.getAllDrinks = () => drinkData;

    store.setRating = async (book, member, score) => {
      if (score == null) remove(data, book, member);
      else apply(data, { book, member, score });
      store._emit();
      try {
        if (score == null) {
          await sb.from("ratings").delete().match({ book, member });
        } else {
          await sb.from("ratings").upsert({ book, member, score }, { onConflict: "book,member" });
        }
      } catch (e) { console.error("Supabase write failed", e); }
    };

    store.setDrinkRating = async (drink, member, score) => {
      if (score == null) remove(drinkData, drink, member);
      else apply(drinkData, { book: drink, member, score });
      store._emit();
      try {
        if (score == null) {
          await sb.from("drink_ratings").delete().match({ drink, member });
        } else {
          await sb.from("drink_ratings").upsert({ drink, member, score }, { onConflict: "drink,member" });
        }
      } catch (e) { console.error("Supabase drink write failed", e); }
    };

    store.ready = (async () => {
      const [{ data: rows }, { data: drinkRows }] = await Promise.all([
        sb.from("ratings").select("book,member,score"),
        sb.from("drink_ratings").select("drink,member,score").catch(() => ({ data: [] })),
      ]);
      (rows || []).forEach(r => apply(data, r));
      (drinkRows || []).forEach(r => apply(drinkData, { book: r.drink, member: r.member, score: r.score }));

      sb.channel("ratings-stream")
        .on("postgres_changes", { event: "*", schema: "public", table: "ratings" }, (payload) => {
          if (payload.eventType === "DELETE") { const old = payload.old || {}; remove(data, old.book, old.member); }
          else { apply(data, payload.new); }
          store._emit();
        })
        .on("postgres_changes", { event: "*", schema: "public", table: "drink_ratings" }, (payload) => {
          if (payload.eventType === "DELETE") { const old = payload.old || {}; remove(drinkData, old.drink, old.member); }
          else { apply(drinkData, { book: payload.new.drink, member: payload.new.member, score: payload.new.score }); }
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

/* ============================================================================
   Mount Comfort Men's Club — app logic (vanilla JS)
   ========================================================================== */
(function () {
  const MEMBERS = window.MEMBERS, MEETINGS = window.MEETINGS, Store = window.Store;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

  // ---------- persisted UI state -----------------------------------------
  const LS_MEMBER = "mcmc_member", LS_VIEW = "mcmc_view";
  let currentMember = localStorage.getItem(LS_MEMBER) || "";
  let currentView = localStorage.getItem(LS_VIEW) || "home";
  let librarySort = "newest";
  let librarySearch = "";
  let openBook = null;

  // ---------- rating math -------------------------------------------------
  const ratingsFor = (book) => (Store.getAll()[book]) || {};
  function avgFor(book) {
    const r = ratingsFor(book);
    const vals = Object.values(r);
    if (!vals.length) return null;
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }
  const countFor = (book) => Object.keys(ratingsFor(book)).length;
  const yourScore = (book) => (currentMember ? ratingsFor(book)[currentMember] : undefined);

  // Convert internal 1–10 score to a 0–5 display string (half-star precision).
  // 8 -> "4", 7 -> "3.5", 10 -> "5". Averages use star5avg for one decimal.
  function star5(score) { const v = score / 2; return Number.isInteger(v) ? String(v) : v.toFixed(1); }
  function star5avg(score) { return (score / 2).toFixed(1); }

  // ---------- star rendering ---------------------------------------------
  // starsFrac is on a 0–5 scale (score/2)
  function starsHTML(extraClass = "") {
    let s = "";
    for (let i = 0; i < 5; i++) {
      s += '<span class="star"><span class="empty">\u2605</span><span class="fill">\u2605</span></span>';
    }
    return '<span class="stars ' + extraClass + '">' + s + "</span>";
  }
  function setFills(starsEl, starsFrac) {
    const stars = $$(".star", starsEl);
    stars.forEach((st, i) => {
      const w = Math.max(0, Math.min(1, starsFrac - i)) * 100;
      $(".fill", st).style.width = w + "%";
    });
  }
  function renderStaticStars(starsFrac, cls) {
    const wrap = document.createElement("span");
    wrap.innerHTML = starsHTML(cls);
    setFills(wrap.firstChild, starsFrac);
    return wrap.firstChild;
  }

  // ---------- interactive rate track --------------------------------------
  function buildRateTrack(book) {
    const wrap = document.createElement("div");
    wrap.className = "rate";
    const track = document.createElement("div");
    track.className = "track";
    track.innerHTML = (function () {
      let s = "";
      for (let i = 0; i < 5; i++) s += '<span class="star"><span class="empty">\u2605</span><span class="fill">\u2605</span></span>';
      return s;
    })();
    const caption = document.createElement("div");
    caption.className = "caption";
    wrap.appendChild(track);
    wrap.appendChild(caption);

    function paint(score) { setFills(track, (score || 0) / 2); }
    function refreshCaption() {
      const ys = yourScore(book);
      if (!currentMember) {
        caption.innerHTML = "Pick your name above to rate";
      } else if (ys != null) {
        caption.innerHTML = "Your rating · <b>" + star5(ys) + "/5</b><span class=\"clear\">clear</span>";
        const cl = $(".clear", caption);
        if (cl) cl.onclick = (e) => { e.stopPropagation(); Store.setRating(book, currentMember, null); };
      } else {
        caption.innerHTML = "Tap to rate";
      }
    }
    function scoreFromEvent(e) {
      const r = track.getBoundingClientRect();
      const cx = e.clientX != null ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : r.left);
      const frac = Math.max(0, Math.min(1, (cx - r.left) / r.width));
      return Math.max(1, Math.min(10, Math.round(frac * 10)));
    }

    let dragging = false;
    function preview(e) { paint(scoreFromEvent(e)); }
    function commit(e) {
      if (!currentMember) { flashName(); return; }
      Store.setRating(book, currentMember, scoreFromEvent(e));
    }
    track.addEventListener("pointerdown", (e) => {
      if (!currentMember) { flashName(); return; }
      dragging = true; track.setPointerCapture(e.pointerId); preview(e); e.preventDefault();
    });
    track.addEventListener("pointermove", (e) => { if (dragging) preview(e); });
    track.addEventListener("pointerup", (e) => { if (dragging) { dragging = false; commit(e); } });
    track.addEventListener("pointercancel", () => { dragging = false; paint(yourScore(book)); });

    // initial
    paint(yourScore(book));
    refreshCaption();
    wrap._refresh = () => { paint(yourScore(book)); refreshCaption(); };
    return wrap;
  }

  function flashName() {
    const sel = $("#memberSelect");
    if (!sel) return;
    sel.focus();
    sel.style.transition = "box-shadow .15s"; sel.style.boxShadow = "0 0 0 3px var(--brass)";
    setTimeout(() => (sel.style.boxShadow = ""), 600);
  }

  // ---------- header ------------------------------------------------------
  function renderHeader() {
    const sel = $("#memberSelect");
    sel.innerHTML = '<option value="">Choose your name…</option>' +
      MEMBERS.map((m) => '<option value="' + m + '"' + (m === currentMember ? " selected" : "") + ">" + m + "</option>").join("");
    sel.onchange = () => {
      currentMember = sel.value;
      localStorage.setItem(LS_MEMBER, currentMember);
      render();
    };
    const dot = $("#modeDot");
    if (Store.mode === "live") { dot.className = "mode-dot live"; dot.innerHTML = "<i></i>Live"; }
    else { dot.className = "mode-dot"; dot.innerHTML = "<i></i>This device"; }
  }

  // ---------- HOME (This Month) -------------------------------------------
  function renderHome() {
    const v = $("#view-home"); v.innerHTML = "";
    const latest = MEETINGS[0];

    // feature card
    const f = document.createElement("div");
    f.className = "feature";
    const avg = avgFor(latest.book), cnt = countFor(latest.book);
    f.innerHTML =
      '<div class="when"><span class="label-eyebrow">This Month</span><span class="date">' + latest.date + "</span></div>" +
      '<h3>' + esc(latest.book) + "</h3>" +
      '<div class="meta-line">Led by <b>' + esc(latest.leader) + "</b></div>" +
      '<div class="drink-chip"><span class="gl">\u{1F943}</span><span>' + esc(latest.drink) + "</span></div>";
    const zone = document.createElement("div");
    zone.className = "rate-zone";
    const avgBlock = document.createElement("div");
    avgBlock.className = "avg-block";
    if (avg != null) {
      avgBlock.appendChild(renderStaticStars(avg / 2, "lg"));
      const n = document.createElement("div");
      n.className = "avg-meta";
      n.innerHTML = "<span class=\"avg-num\">" + star5avg(avg) + "<small>/5</small></span><br>" + cnt + (cnt === 1 ? " rating" : " ratings");
      avgBlock.appendChild(n);
    } else {
      avgBlock.innerHTML = '<div class="avg-meta">No ratings yet —<br>be the first.</div>';
    }
    zone.appendChild(avgBlock);
    zone.appendChild(buildRateTrack(latest.book));
    f.appendChild(zone);
    v.appendChild(f);

    // stats
    const rated = currentMember ? MEETINGS.filter((m) => yourScore(m.book) != null).length : 0;
    const yourVals = currentMember ? MEETINGS.map((m) => yourScore(m.book)).filter((x) => x != null) : [];
    const yourAvg = yourVals.length ? star5avg(yourVals.reduce((a, b) => a + b, 0) / yourVals.length) : "—";
    const row = document.createElement("div");
    row.className = "stat-row";
    row.innerHTML =
      '<div class="stat"><div class="n">' + MEETINGS.length + '</div><div class="l">Books</div></div>' +
      '<div class="stat"><div class="n">' + rated + '</div><div class="l">You rated</div></div>' +
      '<div class="stat"><div class="n">' + yourAvg + '</div><div class="l">Your avg</div></div>';
    v.appendChild(row);

    // nudge: unrated by you
    if (currentMember) {
      const unrated = MEETINGS.filter((m) => yourScore(m.book) == null);
      if (unrated.length) {
        const nb = document.createElement("div");
        nb.className = "nudge";
        nb.innerHTML = '<div class="t"><b>' + unrated.length + "</b> book" + (unrated.length === 1 ? "" : "s") +
          " you haven\u2019t rated yet.</div><button class=\"go\">Rate now</button>";
        $(".go", nb).onclick = () => openSheet(unrated[unrated.length - 1].book); // oldest unrated
        v.appendChild(nb);
      }
    } else {
      const nb = document.createElement("div");
      nb.className = "nudge";
      nb.innerHTML = '<div class="t">Pick your name up top to start rating with the club.</div><button class="go">Choose</button>';
      $(".go", nb).onclick = flashName;
      v.appendChild(nb);
    }

    // footer
    const ft = document.createElement("div");
    ft.className = "footer";
    ft.innerHTML = '<div class="est">Mount Comfort Men\u2019s Club</div>Est. 2023 · Fayetteville, AR · Founded by Mike Kaminski';
    v.appendChild(ft);
  }

  // ---------- LIBRARY -----------------------------------------------------
  function renderLibrary() {
    const v = $("#view-library"); v.innerHTML = "";
    const head = document.createElement("div");
    head.className = "section-head";
    head.innerHTML = '<h2>The Library</h2><span class="count">' + MEETINGS.length + " books</span>";
    v.appendChild(head);

    const tb = document.createElement("div");
    tb.className = "toolbar";
    tb.innerHTML =
      '<div class="search"><span class="ico">\u{1F50D}</span><input id="searchInput" type="search" placeholder="Search books, leaders, drinks" /></div>' +
      '<select class="sort" id="sortSelect">' +
      '<option value="newest">Newest</option>' +
      '<option value="top">Top rated</option>' +
      '<option value="unrated">Unrated by you</option>' +
      '<option value="az">A–Z</option>' +
      "</select>";
    v.appendChild(tb);
    const si = $("#searchInput", tb); si.value = librarySearch;
    si.oninput = () => { librarySearch = si.value; renderLibraryList(); };
    const ss = $("#sortSelect", tb); ss.value = librarySort;
    ss.onchange = () => { librarySort = ss.value; renderLibraryList(); };

    const list = document.createElement("div");
    list.className = "book-list"; list.id = "libraryList";
    v.appendChild(list);
    renderLibraryList();
  }

  function renderLibraryList() {
    const list = $("#libraryList"); if (!list) return;
    let items = MEETINGS.slice();
    const q = librarySearch.trim().toLowerCase();
    if (q) items = items.filter((m) =>
      (m.book + " " + m.leader + " " + m.drink).toLowerCase().includes(q));

    if (librarySort === "top") {
      items.sort((a, b) => (avgFor(b.book) ?? -1) - (avgFor(a.book) ?? -1));
    } else if (librarySort === "az") {
      items.sort((a, b) => a.book.localeCompare(b.book));
    } else if (librarySort === "unrated") {
      items.sort((a, b) => (yourScore(a.book) != null ? 1 : 0) - (yourScore(b.book) != null ? 1 : 0));
    }
    // newest = original order (MEETINGS is newest-first)

    list.innerHTML = "";
    if (!items.length) { list.innerHTML = '<div class="empty-state">No books match \u201C' + esc(librarySearch) + "\u201D.</div>"; return; }
    items.forEach((m) => list.appendChild(bookCard(m)));
  }

  function bookCard(m, rank) {
    const el = document.createElement("div");
    el.className = "book-card";
    const avg = avgFor(m.book), cnt = countFor(m.book), ys = yourScore(m.book);

    if (rank != null) {
      const r = document.createElement("div");
      r.className = "rank" + (rank <= 3 ? " top" : "");
      r.textContent = rank;
      el.appendChild(r);
    }

    const body = document.createElement("div");
    body.className = "body";
    body.innerHTML = '<p class="title">' + esc(m.book) + "</p>" +
      '<div class="sub">' + esc(m.date) + '<span class="dot">•</span>' + esc(m.leader) + "</div>";
    el.appendChild(body);

    const right = document.createElement("div");
    right.className = "right";
    if (avg != null) {
      right.appendChild(renderStaticStars(avg / 2, "sm"));
      const sc = document.createElement("div"); sc.className = "score";
      sc.innerHTML = star5avg(avg) + '<span style="font-size:11px;color:var(--ink-faint)">/5</span>';
      right.appendChild(sc);
    } else {
      const sc = document.createElement("div"); sc.className = "score none"; sc.textContent = "unrated";
      right.appendChild(sc);
    }
    if (currentMember) {
      const y = document.createElement("div");
      y.className = "yours" + (ys == null ? " unrated" : "");
      y.textContent = ys != null ? "You: " + star5(ys) : "Rate this";
      right.appendChild(y);
    }
    el.appendChild(right);
    el.onclick = () => openSheet(m.book);
    return el;
  }

  // ---------- TOP RATED ---------------------------------------------------
  function renderTop() {
    const v = $("#view-top"); v.innerHTML = "";
    const head = document.createElement("div");
    head.className = "section-head";
    head.innerHTML = '<h2>Top Rated</h2><span class="count">club favorites</span>';
    v.appendChild(head);

    const ranked = MEETINGS.filter((m) => avgFor(m.book) != null)
      .sort((a, b) => avgFor(b.book) - avgFor(a.book));

    const list = document.createElement("div");
    list.className = "book-list";
    if (!ranked.length) {
      list.innerHTML = '<div class="empty-state">No ratings yet. Head to a book and tap some stars.</div>';
    } else {
      ranked.forEach((m, i) => list.appendChild(bookCard(m, i + 1)));
    }
    v.appendChild(list);
  }

  // ---------- BOOK SHEET --------------------------------------------------
  function openSheet(book) {
    openBook = book;
    renderSheet();
    $("#scrim").classList.add("open");
    $("#sheet").classList.add("open");
    document.body.style.overflow = "hidden";
  }
  function closeSheet() {
    openBook = null;
    $("#scrim").classList.remove("open");
    $("#sheet").classList.remove("open");
    document.body.style.overflow = "";
  }
  function renderSheet() {
    if (!openBook) return;
    const m = MEETINGS.find((x) => x.book === openBook);
    if (!m) return;
    const sheet = $("#sheet");
    const avg = avgFor(m.book), cnt = countFor(m.book);
    const r = ratingsFor(m.book);

    sheet.innerHTML =
      '<div class="grab"></div>' +
      '<div class="s-when"><span class="label-eyebrow">' + esc(m.date) + "</span></div>" +
      "<h3>" + esc(m.book) + "</h3>" +
      '<div class="s-meta">Led by <b>' + esc(m.leader) + "</b></div>" +
      '<div class="drink-chip"><span class="gl">\u{1F943}</span><span>' + esc(m.drink) + "</span></div>";

    // rate card
    const rc = document.createElement("div");
    rc.className = "s-rate-card";
    rc.innerHTML = '<div class="ask">Your Rating</div>';
    rc.appendChild(buildRateTrack(m.book));
    sheet.appendChild(rc);

    // avg block
    const av = document.createElement("div");
    av.className = "s-avg";
    if (avg != null) {
      const big = document.createElement("div");
      big.className = "big"; big.innerHTML = star5avg(avg) + "<small>/5</small>";
      av.appendChild(big);
      const col = document.createElement("div");
      col.appendChild(renderStaticStars(avg / 2, ""));
      const meta = document.createElement("div"); meta.className = "meta";
      meta.textContent = "Club average · " + cnt + (cnt === 1 ? " rating" : " ratings");
      col.appendChild(meta);
      av.appendChild(col);
    } else {
      av.innerHTML = '<div class="meta" style="text-align:center">No club ratings yet.</div>';
    }
    sheet.appendChild(av);

    // breakdown
    const bd = document.createElement("div");
    bd.className = "breakdown";
    bd.innerHTML = '<div class="bk-head">Member Ratings</div>';
    const entries = MEMBERS.filter((nm) => r[nm] != null).map((nm) => ({ nm, sc: r[nm] }))
      .sort((a, b) => b.sc - a.sc);
    if (!entries.length) {
      bd.innerHTML += '<div class="bk-empty">Nobody has rated this one yet.</div>';
    } else {
      entries.forEach((e) => {
        const row = document.createElement("div");
        row.className = "bk-row";
        const isYou = e.nm === currentMember;
        row.innerHTML = '<span class="nm' + (isYou ? " you" : "") + '">' + esc(e.nm) + (isYou ? " (you)" : "") + "</span>";
        row.appendChild(renderStaticStars(e.sc / 2, "sm"));
        const sc = document.createElement("span"); sc.className = "sc"; sc.textContent = star5(e.sc) + "/5";
        row.appendChild(sc);
        bd.appendChild(row);
      });
    }
    sheet.appendChild(bd);
  }

  // ---------- view switching ----------------------------------------------
  function setView(view) {
    currentView = view;
    localStorage.setItem(LS_VIEW, view);
    $$(".view").forEach((v) => (v.hidden = v.id !== "view-" + view));
    $$(".tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
    render();
    window.scrollTo(0, 0);
  }

  // ---------- master render ----------------------------------------------
  function render() {
    renderHeader();
    if (currentView === "home") renderHome();
    else if (currentView === "library") renderLibrary();
    else if (currentView === "top") renderTop();
    if (openBook) renderSheet();
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  // ---------- boot --------------------------------------------------------
  function boot() {
    $$(".tabbar button").forEach((b) => (b.onclick = () => setView(b.dataset.view)));
    $("#scrim").onclick = closeSheet;
    Store.onChange(render);
    setView(currentView);
  }

  Store.ready.then(boot);
})();

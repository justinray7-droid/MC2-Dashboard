/* ============================================================================
   Mount Comfort Men's Club — styles
   Warm, clubby, leather-and-whiskey. Mobile-first (iPhone), scales up.
   ========================================================================== */

:root {
  /* Warm paper + ink */
  --paper:        #f3ece0;
  --paper-2:      #ece2d2;
  --card:         #fbf7ef;
  --ink:          #2a2320;
  --ink-soft:     #715f4f;
  --ink-faint:    #9b8a78;

  /* Dark "leather" chrome */
  --leather:      #211a16;
  --leather-2:    #2c231d;
  --leather-line: rgba(255, 244, 226, 0.12);
  --cream:        #f3ead9;
  --cream-soft:   #c9bba6;

  /* Accents */
  --wine:         #863331;
  --wine-deep:    #6a2422;
  --brass:        #c0883d;
  --brass-bright: #d8a24e;
  --brass-soft:   #e6cfa3;

  /* Hairlines + structure */
  --line:         rgba(42, 35, 32, 0.12);
  --line-strong:  rgba(42, 35, 32, 0.20);
  --shadow:       0 1px 2px rgba(42, 27, 18, 0.06), 0 8px 24px -12px rgba(42, 27, 18, 0.22);
  --shadow-lg:    0 24px 60px -24px rgba(42, 27, 18, 0.45);
  --radius:       14px;
  --radius-lg:    20px;

  --serif-display: "Libre Caslon Display", Georgia, serif;
  --serif:         "Spectral", Georgia, serif;

  --maxw: 540px;
  --tab-h: 64px;
}

* { box-sizing: border-box; }

html, body {
  margin: 0;
  padding: 0;
  background: var(--leather);
  color: var(--ink);
  font-family: var(--serif);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  background:
    radial-gradient(120% 80% at 50% -10%, #fff7ea 0%, var(--paper) 42%, var(--paper-2) 100%);
}

.app {
  max-width: var(--maxw);
  margin: 0 auto;
  min-height: 100vh;
  min-height: 100dvh;
  background:
    radial-gradient(120% 60% at 50% -8%, #fff8ec 0%, var(--paper) 38%, var(--paper-2) 100%);
  box-shadow: 0 0 80px -20px rgba(33, 26, 22, 0.4);
  position: relative;
  padding-bottom: calc(var(--tab-h) + env(safe-area-inset-bottom, 0px) + 12px);
}

/* ---------------------------------------------------------------- header */
.topbar {
  position: sticky;
  top: 0;
  z-index: 30;
  background: linear-gradient(180deg, var(--leather-2), var(--leather));
  color: var(--cream);
  padding: calc(env(safe-area-inset-top, 0px) + 12px) 18px 13px;
  border-bottom: 1px solid var(--leather-line);
  box-shadow: 0 6px 20px -10px rgba(0,0,0,0.6);
}
.topbar-row { display: flex; align-items: center; gap: 12px; }

.crest {
  width: 42px; height: 42px; flex: none;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  white-space: nowrap; line-height: 1;
  color: var(--brass-bright);
  font-family: var(--serif-display);
  font-size: 16px; letter-spacing: 0.5px;
  border: 1.5px solid var(--brass);
  box-shadow: inset 0 0 0 3px rgba(192,136,61,0.18);
  background: radial-gradient(circle at 50% 30%, #34281f, #1c1511);
}
.crest sup { font-size: 0.62em; vertical-align: top; margin-left: 0.5px; position: relative; top: -0.12em; }

.wordmark { flex: 1; min-width: 0; line-height: 1.05; }
.wordmark .kicker {
  font-size: 9.5px; letter-spacing: 2.4px; text-transform: uppercase;
  color: var(--cream-soft); font-weight: 600;
}
.wordmark h1 {
  margin: 2px 0 0;
  font-family: var(--serif-display);
  font-weight: 400;
  font-size: 20px;
  letter-spacing: 0.2px;
  color: var(--cream);
}
.wordmark h1 em { color: var(--brass-bright); font-style: italic; }

/* "Rating as" selector */
.ratingas { display: flex; align-items: center; gap: 8px; margin-top: 12px; }
.ratingas label {
  font-size: 10px; letter-spacing: 1.6px; text-transform: uppercase;
  color: var(--cream-soft); white-space: nowrap;
}
.select-wrap { position: relative; flex: 1; }
.select-wrap::after {
  content: "▾"; position: absolute; right: 12px; top: 50%; transform: translateY(-50%);
  color: var(--brass-bright); pointer-events: none; font-size: 12px;
}
.ratingas select {
  -webkit-appearance: none; appearance: none;
  width: 100%;
  background: rgba(255,247,234,0.06);
  border: 1px solid var(--leather-line);
  color: var(--cream);
  font-family: var(--serif); font-size: 15px;
  padding: 9px 30px 9px 13px;
  border-radius: 10px;
}
.ratingas select:focus { outline: none; border-color: var(--brass); }
.mode-dot {
  font-size: 9px; letter-spacing: 1.4px; text-transform: uppercase;
  display: inline-flex; align-items: center; gap: 5px;
  color: var(--cream-soft); white-space: nowrap;
}
.mode-dot i {
  width: 7px; height: 7px; border-radius: 50%; background: var(--ink-faint);
  box-shadow: 0 0 0 3px rgba(255,255,255,0.04);
}
.mode-dot.live i { background: #5fae6a; box-shadow: 0 0 8px #5fae6a; }

/* ----------------------------------------------------------------- views */
.view { padding: 18px 16px 8px; }
.view[hidden] { display: none; }

.section-head {
  display: flex; align-items: baseline; justify-content: space-between;
  margin: 4px 2px 12px;
}
.section-head h2 {
  font-family: var(--serif-display); font-weight: 400;
  font-size: 22px; margin: 0; color: var(--ink); white-space: nowrap;
}
.section-head .count { font-size: 12.5px; color: var(--ink-faint); letter-spacing: 0.3px; flex: none; }

.label-eyebrow {
  font-size: 10.5px; letter-spacing: 2.2px; text-transform: uppercase;
  color: var(--wine); font-weight: 600;
}

/* --------------------------------------------------------- feature card */
.feature {
  position: relative;
  background:
    linear-gradient(165deg, #fffaf0, var(--card));
  border: 1px solid var(--line);
  border-radius: var(--radius-lg);
  padding: 20px 20px 18px;
  box-shadow: var(--shadow);
  overflow: hidden;
}
.feature::before {
  content: ""; position: absolute; inset: 0 0 auto 0; height: 4px;
  background: linear-gradient(90deg, var(--wine), var(--brass));
}
.feature .when {
  display: flex; align-items: center; gap: 8px; margin-bottom: 10px;
}
.feature .when .label-eyebrow { color: var(--wine); }
.feature .when .date { font-size: 12.5px; color: var(--ink-soft); }
.feature h3 {
  font-family: var(--serif-display); font-weight: 400;
  font-size: 30px; line-height: 1.08; margin: 0 0 4px;
  letter-spacing: 0.2px; text-wrap: balance;
}
.feature .meta-line { font-size: 13.5px; color: var(--ink-soft); margin-top: 6px; }
.feature .meta-line b { color: var(--ink); font-weight: 600; }

.drink-chip {
  display: inline-flex; align-items: center; gap: 7px;
  margin-top: 12px;
  background: rgba(134,51,49,0.07);
  border: 1px solid rgba(134,51,49,0.16);
  color: var(--wine-deep);
  padding: 6px 12px 6px 10px; border-radius: 999px;
  font-size: 12.5px;
}
.drink-chip .gl { font-size: 13px; }
.drink-chip span { font-style: italic; }

.feature .rate-zone {
  margin-top: 16px; padding-top: 15px; border-top: 1px solid var(--line);
  display: flex; flex-direction: column; gap: 14px;
}
.feature .rate-zone .rate { align-items: flex-start; }
.feature .rate-zone .rate .track { font-size: 34px; gap: 6px; }

/* drink rating section inside feature card */
.drink-rate-section {
  border-top: 1px solid var(--line);
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.drink-rate-label {
  font-size: 12.5px;
  color: var(--ink-soft);
  font-style: italic;
}
.drink-rate-label b { color: var(--ink); font-style: normal; font-weight: 600; }

/* --------------------------------------------------------------- ratings */
.avg-block { display: flex; align-items: center; gap: 10px; }
.avg-num {
  font-family: var(--serif-display); font-size: 27px; line-height: 1; color: var(--ink);
}
.avg-num small { font-size: 14px; color: var(--ink-faint); }
.avg-meta { font-size: 11.5px; color: var(--ink-faint); letter-spacing: 0.2px; line-height: 1.3; }

/* star display */
.stars { display: inline-flex; gap: 2px; font-size: 18px; line-height: 1; }
.stars .star { position: relative; width: 1em; height: 1em; color: var(--line-strong); }
.stars .star .fill {
  position: absolute; inset: 0; overflow: hidden; white-space: nowrap;
  color: var(--brass); width: 0%;
}
.stars .star .empty, .stars .star .fill { display: block; }
.stars.lg { font-size: 30px; gap: 4px; }
.stars.sm { font-size: 14px; gap: 1px; }

/* interactive rating */
.rate {
  display: inline-flex; flex-direction: column; align-items: flex-end; gap: 5px;
}
.rate .track {
  display: inline-flex; gap: 4px; font-size: 30px; line-height: 1;
  cursor: pointer; touch-action: none; padding: 2px 0;
}
.rate .track .star { position: relative; width: 1em; height: 1em; color: var(--line-strong); }
.rate .track .star .fill {
  position: absolute; inset: 0; overflow: hidden; white-space: nowrap;
  color: var(--brass); width: 0%;
}
.rate .caption { font-size: 11px; color: var(--ink-faint); letter-spacing: 0.3px; }
.rate .caption b { color: var(--wine); font-weight: 600; }
.rate .caption .clear { color: var(--ink-faint); text-decoration: underline; cursor: pointer; margin-left: 8px; }

/* ----------------------------------------------------------- list cards */
.book-list { display: flex; flex-direction: column; gap: 10px; }
.book-card {
  display: flex; align-items: center; gap: 14px;
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 13px 14px;
  box-shadow: var(--shadow);
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: transform .12s ease, box-shadow .12s ease, border-color .12s ease;
}
.book-card:active { transform: scale(0.985); }
@media (hover: hover) {
  .book-card:hover { border-color: var(--line-strong); box-shadow: var(--shadow-lg); }
}
.book-card .body { flex: 1; min-width: 0; }
.book-card .title {
  font-family: var(--serif-display); font-size: 17.5px; line-height: 1.12;
  color: var(--ink); margin: 0; text-wrap: balance;
}
.book-card .sub { font-size: 12px; color: var(--ink-soft); margin-top: 4px; }
.book-card .sub .dot { color: var(--ink-faint); margin: 0 5px; }
.book-card .right { text-align: right; flex: none; display: flex; flex-direction: column; align-items: flex-end; gap: 3px; }
.book-card .right .score { font-family: var(--serif-display); font-size: 18px; color: var(--ink); }
.book-card .right .score.none { color: var(--ink-faint); font-size: 12px; font-family: var(--serif); font-style: italic; }
.book-card .right .yours {
  font-size: 9.5px; letter-spacing: 1px; text-transform: uppercase;
  color: var(--brass); font-weight: 600;
}
.book-card .right .yours.unrated { color: var(--wine); }

/* rank medallion */
.rank {
  flex: none; width: 30px; height: 30px; border-radius: 50%;
  display: grid; place-items: center;
  font-family: var(--serif-display); font-size: 14px; color: var(--ink-soft);
  border: 1px solid var(--line-strong);
}
.rank.top { background: linear-gradient(160deg, var(--brass-bright), var(--brass)); color: #2a1c0a; border: none; box-shadow: 0 3px 8px -3px rgba(192,136,61,0.7); }

/* list section divider */
.list-divider {
  font-size: 10px; letter-spacing: 1.8px; text-transform: uppercase;
  color: var(--ink-faint); padding: 10px 4px 2px;
}

/* -------------------------------------------------------- stat row (home) */
.stat-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin: 16px 0 6px; }
.stat {
  background: var(--card); border: 1px solid var(--line); border-radius: var(--radius);
  padding: 13px 10px; text-align: center; box-shadow: var(--shadow);
}
.stat .n { font-family: var(--serif-display); font-size: 26px; color: var(--ink); line-height: 1; }
.stat .l { font-size: 10px; letter-spacing: 1.2px; text-transform: uppercase; color: var(--ink-faint); margin-top: 6px; }

/* nudge banner */
.nudge {
  margin-top: 16px;
  background: linear-gradient(160deg, #2c231d, var(--leather));
  color: var(--cream);
  border-radius: var(--radius);
  padding: 14px 16px;
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  box-shadow: var(--shadow);
}
.nudge .t { font-size: 13.5px; line-height: 1.3; }
.nudge .t b { color: var(--brass-bright); font-weight: 600; }
.nudge .go {
  flex: none; background: var(--brass); color: #2a1c0a; border: none;
  font-family: var(--serif); font-weight: 600; font-size: 13px;
  padding: 9px 14px; border-radius: 9px; cursor: pointer;
}

/* ---------------------------------------------------------- search/sort */
.toolbar { display: flex; gap: 8px; margin-bottom: 14px; }
.search {
  flex: 1; position: relative;
}
.search input {
  width: 100%; -webkit-appearance: none; appearance: none;
  background: var(--card); border: 1px solid var(--line);
  border-radius: 11px; padding: 11px 13px 11px 34px;
  font-family: var(--serif); font-size: 15px; color: var(--ink);
  box-shadow: var(--shadow);
}
.search input:focus { outline: none; border-color: var(--brass); }
.search .ico { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--ink-faint); font-size: 14px; }
.sort {
  -webkit-appearance: none; appearance: none;
  background: var(--card); border: 1px solid var(--line);
  border-radius: 11px; padding: 0 30px 0 13px;
  font-family: var(--serif); font-size: 13.5px; color: var(--ink);
  box-shadow: var(--shadow); position: relative;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%23c0883d' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 12px center;
}
.sort:focus { outline: none; border-color: var(--brass); }

.empty-state { text-align: center; color: var(--ink-faint); padding: 40px 20px; font-style: italic; }

/* ------------------------------------------------------------ bottom tabs */
.tabbar {
  position: fixed; left: 50%; transform: translateX(-50%);
  bottom: 0; width: 100%; max-width: var(--maxw); z-index: 40;
  display: grid; grid-template-columns: repeat(4, 1fr);
  background: linear-gradient(180deg, var(--leather-2), var(--leather));
  border-top: 1px solid var(--leather-line);
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-shadow: 0 -8px 24px -12px rgba(0,0,0,0.6);
}
.tabbar button {
  background: none; border: none; cursor: pointer;
  padding: 10px 4px 9px; color: var(--cream-soft);
  font-family: var(--serif); display: flex; flex-direction: column; align-items: center; gap: 3px;
  -webkit-tap-highlight-color: transparent;
}
.tabbar button .ic { font-size: 18px; line-height: 1; opacity: 0.8; }
.tabbar button .tx { font-size: 9.5px; letter-spacing: 0.4px; }
.tabbar button.active { color: var(--brass-bright); }
.tabbar button.active .ic { opacity: 1; }

/* ----------------------------------------------------------------- sheet */
.scrim {
  position: fixed; inset: 0; z-index: 50;
  background: rgba(24, 17, 12, 0.55);
  backdrop-filter: blur(2px);
  opacity: 0; pointer-events: none; transition: opacity .22s ease;
}
.scrim.open { opacity: 1; pointer-events: auto; }

.sheet {
  position: fixed; left: 50%; bottom: 0; transform: translate(-50%, 100%);
  width: 100%; max-width: var(--maxw); z-index: 51;
  background: var(--card);
  border-radius: 22px 22px 0 0;
  box-shadow: var(--shadow-lg);
  transition: transform .28s cubic-bezier(.22,.7,.25,1);
  max-height: 88vh; overflow-y: auto;
  padding: 8px 20px calc(env(safe-area-inset-bottom, 0px) + 26px);
}
.sheet.open { transform: translate(-50%, 0); }
.sheet .grab { width: 38px; height: 4px; border-radius: 99px; background: var(--line-strong); margin: 8px auto 14px; }
.sheet .s-when { display:flex; align-items:center; gap: 8px; }
.sheet .s-when .date { font-size: 12.5px; color: var(--ink-soft); }
.sheet h3 {
  font-family: var(--serif-display); font-weight: 400; font-size: 27px;
  line-height: 1.1; margin: 8px 0 4px; text-wrap: balance;
}
.sheet .s-meta { font-size: 13.5px; color: var(--ink-soft); }
.sheet .s-meta b { color: var(--ink); font-weight: 600; }

/* sheet divider between book and drink sections */
.s-divider {
  border: none; border-top: 2px dashed var(--line-strong);
  margin: 22px 0 18px;
}

.s-rate-card {
  margin: 18px 0; padding: 16px; border-radius: var(--radius);
  background: linear-gradient(160deg, #fffaf0, #f6efe3);
  border: 1px solid var(--line);
  text-align: center;
}
.s-rate-card .ask { font-size: 12px; letter-spacing: 1.4px; text-transform: uppercase; color: var(--ink-soft); margin-bottom: 12px; }
.s-rate-card .rate { align-items: center; }
.s-rate-card .rate .track { font-size: 38px; gap: 6px; }
.s-rate-card .who { font-size: 12px; color: var(--ink-faint); margin-top: 4px; }
.s-rate-card .who b { color: var(--wine); font-weight: 600; }

.s-avg { display: flex; align-items: center; justify-content: center; gap: 12px; margin: 4px 0 18px; }
.s-avg .big { font-family: var(--serif-display); font-size: 34px; color: var(--ink); line-height: 1; }
.s-avg .big small { font-size: 16px; color: var(--ink-faint); }
.s-avg .meta { font-size: 12px; color: var(--ink-faint); text-align: left; line-height: 1.35; }

.breakdown { border-top: 1px solid var(--line); padding-top: 14px; }
.breakdown .bk-head { font-size: 11px; letter-spacing: 1.6px; text-transform: uppercase; color: var(--ink-faint); margin-bottom: 10px; }
.bk-row { display: flex; align-items: center; gap: 10px; padding: 6px 0; }
.bk-row .nm { flex: 1; font-size: 14px; color: var(--ink); }
.bk-row .nm.you { color: var(--wine); font-weight: 600; }
.bk-row .sc { font-family: var(--serif-display); font-size: 15px; color: var(--ink-soft); width: 42px; text-align: right; }
.bk-empty { font-size: 13px; color: var(--ink-faint); font-style: italic; padding: 4px 0 6px; }

/* footer note */
.footer { text-align: center; color: var(--ink-faint); font-size: 11px; padding: 22px 20px 6px; line-height: 1.5; }
.footer .est { font-family: var(--serif-display); font-size: 13px; color: var(--ink-soft); }

@media (max-width: 360px) {
  .feature h3 { font-size: 26px; }
  .stat .n { font-size: 22px; }
  .tabbar button .tx { font-size: 8.5px; }
}
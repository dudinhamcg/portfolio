/* Portfólio Maria Costa
   O design fica aqui. Todo o conteúdo (textos, projetos, imagens) vem dos
   arquivos em content/ e é editado pelo estúdio de edição (Pages CMS). */

const UI = {
  pt: {
    nav: ["Trabalhos", "Archive", "Sobre"], sel: "Projetos selecionados", see: "Ver projeto",
    archT: "Archive", archTeaser: "trabalhos avulsos, estudos e experimentos",
    back: "← Todos os projetos", client: "Cliente", year: "Ano", scope: "Escopo", credits: "Créditos",
    ch: { problem: "Problema", challenge: "Desafio", solution: "Solução" }, next: "Próximo projeto",
    all: "Tudo", close: "Fechar", view: "Ver", imgs: "imagens", prev: "Anterior", nxt: "Próximo",
    exp: "Experiência", edu: "Formação", rec: "Reconhecimentos", photo: "Adicione sua foto",
    copy: "Copiar", copied: "Copiado", contact: "Contato", social: "Redes", based: "Base", langs: "Idiomas",
    top: "Voltar ao topo ↑", empty: "Adicione uma imagem", lang: "Idioma"
  },
  en: {
    nav: ["Work", "Archive", "About"], sel: "Selected projects", see: "View project",
    archT: "Archive", archTeaser: "one-off pieces, studies and experiments",
    back: "← All projects", client: "Client", year: "Year", scope: "Scope", credits: "Credits",
    ch: { problem: "Problem", challenge: "Challenge", solution: "Solution" }, next: "Next project",
    all: "All", close: "Close", view: "View", imgs: "images", prev: "Previous", nxt: "Next",
    exp: "Experience", edu: "Education", rec: "Recognition", photo: "Add your photo",
    copy: "Copy", copied: "Copied", contact: "Contact", social: "Social", based: "Based in", langs: "Languages",
    top: "Back to top ↑", empty: "Add an image", lang: "Language"
  }
};

let SITE = {}, P = [], A = [];
const S = { lang: "pt", page: "index", proj: null, cat: "all", xo: -1 };
const RM = matchMedia("(prefers-reduced-motion:reduce)").matches;
const HOVER = matchMedia("(hover:hover) and (pointer:fine)").matches;
{
  let l = null; try { l = localStorage.getItem("mc-lang"); } catch (e) {}
  if (l === "pt" || l === "en") S.lang = l;
  else { const nl = ((navigator.languages && navigator.languages[0]) || navigator.language || "pt").toLowerCase(); S.lang = nl.startsWith("pt") ? "pt" : "en"; }
}
const t = k => UI[S.lang][k];
/* campo bilíngue: tx(obj,"scope") lê scope_pt ou scope_en, com o outro idioma como reserva */
const tx = (o, k) => o ? (o[k + "_" + S.lang] || o[k + "_" + (S.lang === "pt" ? "en" : "pt")] || "") : "";
const period = s => S.lang === "en" ? String(s || "").replace(/\batual\b/gi, "present").replace(/\bhoje\b/gi, "present") : String(s || "");
const slug = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function h(tag, attrs, ...kids) {
  const e = tag === "svg" ? document.createElementNS("http://www.w3.org/2000/svg", "svg") : document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (k === "on") for (const [ev, fn] of Object.entries(v)) e.addEventListener(ev, fn);
    else if (k === "html") e.innerHTML = v;
    else if (v !== false && v != null) e.setAttribute(k, v);
  }
  kids.flat(9).forEach(c => { if (c != null && c !== false) e.append(c); });
  return e;
}
const arr = () => h("svg", { class: "arr", viewBox: "0 0 10 10", "aria-hidden": "true", html: '<path d="M2 8 8 2M3.5 2H8v4.5" fill="none" stroke="currentColor" stroke-width="1.1"/>' });
const frame = (cls, ...k) => h("div", { class: "frame " + (cls || "") }, ...k);

/* imagem ou vídeo (mp4/webm vira vídeo em loop, sem som) */
const fixSrc = s => s ? String(s).replace(/^\/+/, "") : "";
const isVid = s => /\.(mp4|webm|mov|m4v)(\?|#|$)/i.test(s || "");
/* link do YouTube ou Vimeo: toca sozinho, sem som, em loop e sem os controles */
function embedOf(s) {
  const u = String(s || "").trim(); let m;
  if ((m = u.match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/))) {
    const id = m[1];
    return { src: "https://www.youtube-nocookie.com/embed/" + id + "?autoplay=1&mute=1&loop=1&playlist=" + id + "&controls=0&playsinline=1&rel=0&modestbranding=1&disablekb=1&iv_load_policy=3&fs=0", tall: /\/shorts\//.test(u) };
  }
  if ((m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/))) return { src: "https://player.vimeo.com/video/" + m[1] + "?background=1&autoplay=1&muted=1&loop=1&dnt=1", tall: false };
  return null;
}
/* O YouTube escolhe a qualidade pelo tamanho do player. O player é desenhado
   grande (1920×1080, como uma tela Full HD) e reduzido para caber no quadro,
   assim o YouTube entrega a qualidade mais alta que a conexão permitir. */
const EMB = { w: 1920, h: 1080 };
const embRO = "ResizeObserver" in window ? new ResizeObserver(es => es.forEach(e => scaleEmbed(e.target))) : null;
function scaleEmbed(d) {
  const f = d.querySelector("iframe"); if (!f) return;
  const tall = d.classList.contains("tall"), W = tall ? EMB.h : EMB.w, H = tall ? EMB.w : EMB.h;
  const cw = d.clientWidth, ch = d.clientHeight; if (!cw || !ch) return;
  f.style.transform = "translate(-50%,-50%) scale(" + Math.max(cw / W, ch / H).toFixed(4) + ")";
}
function fitEmbed(d) { if (embRO) embRO.observe(d); requestAnimationFrame(() => scaleEmbed(d)); }
function med(s, alt) {
  const d = h("div", { class: "art" });
  const em = embedOf(s);
  if (em) {
    d.classList.add("embed"); if (em.tall) d.classList.add("tall");
    d.append(h("iframe", { src: em.src, title: alt || "vídeo", loading: "lazy", allow: "autoplay; encrypted-media; picture-in-picture", frameborder: "0", tabindex: "-1", "aria-hidden": "true" }));
    fitEmbed(d);
    return d;
  }
  const u = fixSrc(s);
  if (!u) { d.classList.add("empty"); d.append(h("span", {}, t("empty"))); return d; }
  if (isVid(u)) {
    const v = h("video", { src: u, muted: "", loop: "", playsinline: "", autoplay: "", preload: "metadata", "aria-hidden": "true" });
    v.muted = true; d.append(v);
  } else d.append(h("img", { src: u, alt: alt || "", loading: "lazy", decoding: "async" }));
  return d;
}

/* ---------- conteúdo ---------- */
function normP(r, i) {
  const blocks = Array.isArray(r.gallery) ? r.gallery : [];
  blocks.forEach(b => { b.media = b.video_url || b.media; b.left = b.left_url || b.left; b.right = b.right_url || b.right; });
  const imgs = blocks.flatMap(b => b.type === "inteira" ? [b.media] : b.type === "dupla" ? [b.left, b.right] : []).filter(Boolean);
  return { raw: r, id: slug(r.slug || r.name) || ("projeto-" + (i + 1)), name: r.name || "", year: r.year || "", client: r.client || "", credits: r.credits || "", gal: r.gallery_style === "colado" ? "colado" : "respiro", cover: r.cover_url || r.cover, blocks, imgs };
}
const scope = p => tx(p.raw, "scope");
const socials = () => (SITE.socials || []).filter(s => s && s.name);

/* ---------- navegação ---------- */
function parseHash() {
  const hs = decodeURIComponent((location.hash || "").slice(1));
  if (hs.startsWith("p-") && P.some(p => p.id === hs.slice(2))) { S.page = "case"; S.proj = hs.slice(2); }
  else if (["archive", "info"].includes(hs)) { S.page = hs; S.proj = null; }
  else { S.page = "index"; S.proj = null; }
}
function go(page, proj) {
  const app = document.getElementById("app"); const cu = document.getElementById("cur"); if (cu) cu.classList.remove("on");
  const doit = () => {
    S.page = page; S.proj = proj || null;
    try { history.pushState(null, "", "#" + (proj ? "p-" + proj : page)); } catch (e) {}
    app.classList.add("entering"); render();
    if (window.lenis) window.lenis.scrollTo(0, { immediate: true, force: true }); else window.scrollTo(0, 0);
    requestAnimationFrame(() => requestAnimationFrame(() => app.classList.remove("entering", "leaving")));
  };
  if (RM) { doit(); return; }
  app.classList.add("leaving"); setTimeout(doit, 280);
}
addEventListener("popstate", () => { parseHash(); render(); if (window.lenis) window.lenis.scrollTo(0, { immediate: true, force: true }); else scrollTo(0, 0); });
function setLang(l) { S.lang = l; try { localStorage.setItem("mc-lang", l); } catch (e) {} render(); }

/* ---------- partes fixas ---------- */
function header() {
  const pages = ["index", "archive", "info"];
  return h("header", { class: "top" + (S.page === "index" ? " home-top" : "") }, h("div", { class: "in wrap" },
    h("button", { class: "id", on: { click: () => go("index") } }, h("b", {}, SITE.name)),
    h("div", { class: "nav" }, pages.map((p, i) => h("button", { "aria-current": (S.page === p || (p === "index" && S.page === "case")) ? "page" : false, on: { click: () => go(p) } }, t("nav")[i]))),
    h("button", { class: "mbtn", "aria-haspopup": "dialog", "aria-label": "Menu", on: { click: () => toggleMenu(true) } }, h("i", { class: "burg", "aria-hidden": "true" })),
    h("div", { class: "hright" }, h("a", { class: "hmail", href: "mailto:" + SITE.email }, SITE.email),
      h("div", { class: "lang", role: "group", "aria-label": t("lang") }, ["pt", "en"].map(l => h("button", { class: S.lang === l ? "on" : "", "aria-pressed": S.lang === l ? "true" : "false", on: { click: () => setLang(l) } }, l.toUpperCase()))))));
}
function mobileMenu() {
  const pages = ["index", "archive", "info"];
  return h("div", { id: "mnav", role: "dialog", "aria-modal": "true", "aria-label": "Menu", hidden: "" },
    h("div", { class: "mtop wrap" }, h("b", {}, SITE.name), h("button", { class: "mbtn mx", "aria-label": t("close"), on: { click: () => toggleMenu(false) } }, h("i", { class: "burg x", "aria-hidden": "true" }))),
    h("nav", { class: "mlinks wrap" }, pages.map((p, i) => h("button", { "aria-current": (S.page === p || (p === "index" && S.page === "case")) ? "page" : false, on: { click: () => { toggleMenu(false); go(p); } } }, t("nav")[i]))),
    h("div", { class: "mbot wrap" },
      h("a", { href: "mailto:" + SITE.email }, SITE.email),
      h("div", { class: "msoc" }, socials().map(s => h("a", { href: s.url, class: "ext", target: "_blank", rel: "noopener" }, s.name, arr()))),
      h("div", { class: "mlang", role: "group", "aria-label": t("lang") }, [["pt", "Português"], ["en", "English"]].map(([l, n]) => h("button", { class: S.lang === l ? "on" : "", "aria-pressed": S.lang === l ? "true" : "false", on: { click: () => { setLang(l); toggleMenu(true); } } }, n)))));
}
function toggleMenu(on) {
  const m = document.getElementById("mnav"); if (!m) return;
  m.hidden = !on; document.documentElement.classList.toggle("menu-open", on);
  if (window.lenis) { on ? window.lenis.stop() : window.lenis.start(); }
}

function footer() {
  const fr = frame("", P.map((p, i) => { const a = med(p.cover, p.name); if (i === 0) a.classList.add("show"); return a; }));
  const cap = h("span", {}, P[0] ? P[0].name : "");
  const mail = h("a", { href: "mailto:" + SITE.email }, SITE.email);
  const cp = h("button", { on: { click: async () => { try { await navigator.clipboard.writeText(SITE.email); cp.textContent = t("copied"); } catch (e) { const r = document.createRange(); r.selectNodeContents(mail); const s = getSelection(); s.removeAllRanges(); s.addRange(r); } setTimeout(() => cp.textContent = t("copy"), 1600); } } }, t("copy"));
  return h("footer", { class: "foot" },
    h("div", { class: "g12 wrap" },
      h("div", { class: "l" },
        h("div", {}, h("p", { class: "lbl", style: "margin:0" }, t("contact")), h("div", { class: "mailrow" }, mail, cp)),
        h("div", { class: "cols" },
          h("div", {}, h("h3", { class: "lbl", style: "margin:0 0 8px" }, t("social")), socials().map(s => h("a", { href: s.url, class: "ext", target: "_blank", rel: "noopener" }, s.name, arr()))),
          h("div", {}, h("h3", { class: "lbl", style: "margin:0 0 8px" }, t("based")), h("span", {}, tx(SITE, "location")), h("span", { id: "clock" })),
          h("div", {}, h("h3", { class: "lbl", style: "margin:0 0 8px" }, t("langs")), h("span", {}, tx(SITE, "languages"))))),
      h("div", { class: "r" }, fr, h("div", { class: "cap" }, cap, h("span", { class: "mut" }, t("sel"))))),
    h("div", { class: "base wrap" }, h("span", {}, "© " + new Date().getFullYear() + " " + SITE.name), h("button", { on: { click: () => window.lenis ? window.lenis.scrollTo(0) : window.scrollTo({ top: 0, behavior: "smooth" }) } }, t("top"))));
}

/* ---------- páginas ---------- */
function home() {
  const rows = P.map((p, i) => {
    const li = h("li", { class: "xrow" + ((!HOVER || i === S.xo) ? " open" : "") });
    const openMe = () => { if (!HOVER || li.classList.contains("open")) return; document.querySelectorAll(".xrow.open").forEach(r => r.classList.remove("open")); li.classList.add("open"); S.xo = i; };
    li.addEventListener("pointermove", e => { if (e.pointerType !== "mouse" || li.classList.contains("open")) return; clearTimeout(window._xt); window._xt = setTimeout(openMe, 90); });
    li.addEventListener("pointerleave", () => clearTimeout(window._xt));
    const head = h("button", { "data-cur": "1", class: "xhead", on: { click: () => go("case", p.id), focus: openMe } },
      h("span", { class: "nm" }, p.name), h("span", { class: "sc mut" }, scope(p)), h("span", { class: "yr mut" }, p.year, h("i", { class: "pm", "aria-hidden": "true" })));
    const ims = [p.cover, p.imgs[0], p.imgs[1]];
    const body = h("div", { class: "xbody" }, h("div", {}, h("div", { class: "xin" },
      ims.map((s, k) => h("button", { "data-cur": "1", class: "xim x" + k, tabindex: "-1", on: { click: () => go("case", p.id) } }, frame("", med(s, p.name)))),
      h("button", { class: "xgo", on: { click: () => go("case", p.id) } }, t("see") + " →"))));
    li.append(head, body); return li;
  });
  return h("main", { class: "home" },
    h("section", { class: "hero4 wrap" },
      h("h1", { id: "bigname" }, SITE.name),
      h("p", { class: "desc" }, tx(SITE, "intro")),
      h("div", { class: "soc" }, socials().map(s => h("a", { href: s.url, target: "_blank", rel: "noopener" }, s.name)))),
    h("section", { class: "flist xlist wrap" },
      h("div", { class: "fhead" }, h("span", { class: "lbl" }, t("sel")), h("span", { class: "lbl" }, t("scope")), h("span", { class: "lbl" }, t("year"))),
      h("ol", { on: { pointerleave: e => { if (!HOVER || e.pointerType !== "mouse") return; clearTimeout(window._xt); document.querySelectorAll(".xrow.open").forEach(r => r.classList.remove("open")); S.xo = -1; } } }, rows)),
    A.length ? h("div", { class: "wrap" }, h("button", { class: "teaser", on: { click: () => go("archive") } },
      h("span", {}, h("b", {}, t("archT") + " →"), h("span", { class: "mut" }, " " + t("archTeaser"))),
      h("span", { class: "ths" }, A.slice(0, 5).map(a => frame("", med((a.images || [])[0], a.title)))))) : null);
}

function caseP() {
  const i = Math.max(0, P.findIndex(x => x.id === S.proj)); const p = P[i]; const nx = P[(i + 1) % P.length];
  const r = p.raw;
  const spec = [[t("client"), p.client], [t("year"), p.year], [t("scope"), scope(p)], [t("credits"), p.credits]].filter(x => x[1]);
  const story = [["problem", "problem"], ["challenge", "challenge"], ["solution", "solution"]].filter(([k]) => tx(r, k));
  return h("main", { class: "wrap case " + p.gal },
    h("div", { class: "crumb" }, h("button", { class: "mut", on: { click: () => go("index") } }, t("back"))),
    h("h1", { class: "ctitle" }, p.name),
    frame("cover", med(p.cover, p.name)),
    h("section", { class: "cinfo g12" },
      h("dl", { class: "cspec" }, spec.map(([a, b]) => h("div", {}, h("dt", { class: "lbl" }, a), h("dd", {}, b)))),
      h("div", { class: "cstory" }, story.map(([k]) => h("div", {}, h("h2", { class: "lbl" }, t("ch")[k]), h("p", {}, tx(r, k)))))),
    h("div", { class: "gal " + p.gal }, p.blocks.map(b => {
      if (b.type === "inteira") return h("div", { class: "blk" }, frame("", med(b.media, p.name)));
      if (b.type === "dupla") return h("div", { class: "blk dupla" }, frame("", med(b.left, p.name)), frame("", med(b.right, p.name)));
      if (b.type === "frase") return h("div", { class: "blk" }, h("div", { class: "quote" }, h("p", {}, tx(b, "text"))));
      return null;
    })),
    nx && nx !== p ? h("button", { "data-cur": "1", class: "nextp g12", on: { click: () => go("case", nx.id) } },
      h("span", { class: "t" }, h("span", { class: "lbl mut" }, t("next")), h("b", {}, nx.name), h("span", { class: "mut" }, scope(nx))),
      frame("", med(nx.cover, nx.name))) : null);
}

function archive() {
  const catKey = a => (a.category_pt || a.category_en || "").trim();
  const cats = []; A.forEach(a => { const k = catKey(a); if (k && !cats.some(c => c.k === k)) cats.push({ k, a }); });
  const items = A.filter(a => S.cat === "all" || catKey(a) === S.cat);
  return h("main", { class: "wrap" },
    h("section", { class: "ahead g12" }, h("h1", {}, t("archT")), h("p", { class: "mut" }, tx(SITE, "archive_intro"))),
    cats.length > 1 ? h("div", { class: "filters" }, [{ k: "all" }, ...cats].map(c => h("button", { class: S.cat === c.k ? "on" : "", on: { click: () => { S.cat = c.k; render(); } } }, c.k === "all" ? t("all") : tx(c.a, "category")))) : null,
    h("div", { class: "mosaic" }, items.map((a, k) => {
      const n = (a.images || []).length;
      return h("button", { "data-cur": "1", class: "tile", on: { click: () => openLB(items, k, 0) } },
        frame("nat", med((a.images || [])[0], a.title)),
        h("span", { class: "cp" }, h("b", {}, a.title), h("span", { class: "mut" }, [tx(a, "category"), a.year].filter(Boolean).join(" · "))),
        n > 1 ? h("span", { class: "cnt" }, n + " " + t("imgs")) : null);
    })));
}
function openLB(list, k, j) {
  const box = document.getElementById("lb"); const back = document.activeElement;
  const n = a => Math.max(1, (a.images || []).length);
  const step = d => { j += d; if (j >= n(list[k])) { k = (k + 1) % list.length; j = 0; } else if (j < 0) { k = (k - 1 + list.length) % list.length; j = n(list[k]) - 1; } draw(); };
  const close = () => { box.innerHTML = ""; window.lenis && window.lenis.start(); document.removeEventListener("keydown", key); back && back.focus && back.focus(); };
  const key = e => { if (e.key === "Escape") close(); if (e.key === "ArrowRight") step(1); if (e.key === "ArrowLeft") step(-1); };
  function draw() {
    const a = list[k]; const imgs = a.images || []; const c = n(a); box.innerHTML = "";
    const thumbs = c > 1 ? h("div", { class: "thumbs" }, imgs.map((s, q) => h("button", { class: q === j ? "on" : "", "aria-label": (q + 1) + " / " + c, on: { click: () => { j = q; draw(); } } }, frame("", med(s, a.title))))) : h("span");
    box.append(h("div", { class: "lb", role: "dialog", "aria-modal": "true", "aria-label": a.title },
      h("div", { class: "bar" }, h("span", {}, h("b", { style: "font-weight:500" }, a.title), h("span", { class: "mut" }, " — " + [tx(a, "category"), a.year].filter(Boolean).join(", "))), h("button", { class: "x", "aria-label": t("close"), on: { click: close } }, "×")),
      h("div", { class: "stage" }, frame("", med(imgs[j], a.title))),
      h("div", { class: "foot2" }, h("span", { class: "mut" }, c > 1 ? (j + 1) + " / " + c : ""), thumbs,
        h("div", { class: "ctl" }, h("button", { "aria-label": t("prev"), on: { click: () => step(-1) } }, "←"), h("button", { "aria-label": t("nxt"), on: { click: () => step(1) } }, "→")))));
    box.querySelector(".x").focus();
  }
  document.addEventListener("keydown", key); window.lenis && window.lenis.stop(); draw();
}

function info() {
  const ab = SITE.about || {};
  const list = rows => h("ul", {}, (rows || []).map(x => h("li", {}, h("b", { style: "font-weight:500" }, x.name), tx(x, "role") ? h("span", {}, tx(x, "role")) : null, x.period ? h("span", {}, period(x.period)) : null)));
  const bio = tx(ab, "bio").split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
  const cols = [["exp", ab.experience], ["edu", ab.education], ["rec", ab.recognition]].filter(([, v]) => v && v.length);
  return h("main", {}, h("section", { class: "about g12 wrap" },
    ab.photo ? frame("ph", med(ab.photo, SITE.name)) : frame("ph", h("span", {}, t("photo"))),
    h("div", { class: "txt" },
      h("p", { class: "st" }, tx(ab, "statement")),
      bio.length ? h("div", { class: "bio" }, bio.map(b => h("p", {}, b))) : null,
      cols.length ? h("div", { class: "facts" }, cols.map(([k, v]) => h("div", {}, h("h3", { class: "lbl" }, t(k)), list(v)))) : null)));
}

/* ---------- desenhar a página ---------- */
let timers = [];
function setShift() {
  const hd = document.querySelector("header.home-top"); if (!hd) return;
  const nav = hd.querySelector(".nav"), idb = hd.querySelector(".id");
  hd.style.setProperty("--shift", Math.max(0, nav.offsetLeft - idb.offsetLeft) + "px");
}
addEventListener("resize", setShift);
function render() {
  timers.forEach(clearInterval); timers = [];
  document.documentElement.lang = S.lang === "pt" ? "pt-BR" : "en";
  const proj = S.page === "case" ? P.find(p => p.id === S.proj) : null;
  document.title = proj ? proj.name + " — " + SITE.name : S.page === "archive" ? "Archive — " + SITE.name : S.page === "info" ? t("nav")[2] + " — " + SITE.name : SITE.name + " — " + tx(SITE, "role");
  const md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute("content", tx(SITE, "intro"));
  const app = document.getElementById("app"); app.innerHTML = "";
  const page = S.page === "case" && proj ? caseP() : S.page === "archive" ? archive() : S.page === "info" ? info() : home();
  app.append(header(), page, footer(), mobileMenu()); document.documentElement.classList.remove("menu-open");
  const tick = () => { const c = document.getElementById("clock"); if (c) try { c.textContent = new Intl.DateTimeFormat(S.lang === "pt" ? "pt-BR" : "en-US", { hour: "2-digit", minute: "2-digit", timeZone: SITE.timezone || "America/Sao_Paulo" }).format(new Date()); } catch (e) {} };
  tick(); timers.push(setInterval(tick, 30000));
  if (window._ob) window._ob.disconnect();
  const bn = document.getElementById("bigname"), hd = app.querySelector("header.top");
  if (bn && "IntersectionObserver" in window) { window._ob = new IntersectionObserver(([e]) => hd.classList.toggle("scrolled", !e.isIntersecting), { rootMargin: "-56px 0px 0px 0px" }); window._ob.observe(bn); } else if (hd) hd.classList.add("scrolled");
  setShift();
  if (window._rv) window._rv.disconnect();
  if (!RM && "IntersectionObserver" in window) {
    app.querySelectorAll("main .frame, .ctitle, .cspec, .cstory > div, .nextp .t, .fhead, .hero4 > *, .ahead > *, .tile .cp, .about .txt > *, footer .l > *, footer .r .frame").forEach(e => { if (!e.closest(".teaser") && !e.closest(".xbody")) e.classList.add("rv"); });
    window._rv = new IntersectionObserver(es => { let i = 0; es.forEach(en => { if (en.isIntersecting) { en.target.style.transitionDelay = (i++ * 70) + "ms"; en.target.classList.add("in"); window._rv.unobserve(en.target); } }); }, { rootMargin: "0px 0px -6% 0px" });
    app.querySelectorAll(".rv").forEach(e => window._rv.observe(e));
    let k = 0;
    timers.push(setInterval(() => { const l = app.querySelectorAll("footer .r .frame .art"); if (l.length < 2) return; l[k].classList.remove("show"); k = (k + 1) % l.length; l[k].classList.add("show"); const c = app.querySelector("footer .r .cap span"); if (c) c.textContent = P[k].name; }, 3400));
  }
}

/* ---------- movimento: rolagem suave, cursor, parallax ---------- */
function motion() {
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .12 0 0 0 0 .11 0 0 0 0 .09 0 0 0 .11 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>";
  document.documentElement.style.setProperty("--grain", 'url("data:image/svg+xml,' + encodeURIComponent(svg) + '")');
  document.documentElement.classList.add("fx-paper");
  if (!RM && window.Lenis) { try { window.lenis = new Lenis({ duration: 1.15, smoothWheel: true }); } catch (e) { window.lenis = null; } }
  const cur = h("div", { id: "cur", "aria-hidden": "true" }, h("span")); let cx = -200, cy = -200, tx2 = -200, ty2 = -200;
  if (HOVER && !RM) {
    document.body.append(cur); document.documentElement.classList.add("has-cur");
    addEventListener("mousemove", e => { tx2 = e.clientX; ty2 = e.clientY; const on = e.target.closest && e.target.closest("[data-cur]"); cur.classList.toggle("on", !!on && !document.querySelector(".lb")); cur.firstChild.textContent = t("view"); });
    document.addEventListener("mouseleave", () => cur.classList.remove("on"));
  }
  function loop(time) {
    if (window.lenis) window.lenis.raf(time);
    if (cur.isConnected) { cx += (tx2 - cx) * .2; cy += (ty2 - cy) * .2; cur.style.transform = "translate(" + cx.toFixed(1) + "px," + cy.toFixed(1) + "px)"; }
    if (!RM) { const vh = innerHeight; document.querySelectorAll(".cover .art").forEach(a => { const r = a.parentElement.getBoundingClientRect(); if (r.bottom < 0 || r.top > vh) return; const p = (r.top + r.height / 2 - vh / 2) / vh; a.style.translate = "0 " + (p * -7).toFixed(2) + "%"; }); }
    document.documentElement.classList.toggle("scrolled-y", scrollY > 8);
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
}

/* ---------- início ---------- */
const load = n => fetch("content/" + n + ".json", { cache: "no-cache" }).then(r => { if (!r.ok) throw new Error(n); return r.json(); });
Promise.all([load("site"), load("projects"), load("archive")]).then(([s, p, a]) => {
  SITE = s || {}; SITE.name = SITE.name || "Maria Costa";
  P = (Array.isArray(p) ? p : []).map(normP);
  A = (Array.isArray(a) ? a : []).filter(x => x && x.title).map(x => ({ ...x, images: [x.video_url, ...(x.images || [])].filter(Boolean) }));
  motion(); parseHash(); render();
}).catch(() => {
  document.getElementById("app").innerHTML = '<p class="boot">Não foi possível carregar o conteúdo do site. Se você abriu o arquivo direto do computador, veja no LEIA-ME como testar localmente.</p>';
});

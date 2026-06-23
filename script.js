/* ============================================================
   BELA VISTA AUTO PEÇAS — script.js
   Config central + partials + busca de peças
   ============================================================ */

/* ── FAVICON — injeta em todas as páginas ────────────────── */
(function () {
  if (!document.querySelector('link[rel="icon"]')) {
    const l = document.createElement('link');
    l.rel = 'icon'; l.type = 'image/svg+xml'; l.href = '/favicon.svg';
    document.head.appendChild(l);
  }
})();

/* ── CONFIG NAP (Name, Address, Phone) — fonte única de verdade ── */
const CONFIG = {
  name:           'Bela Vista Auto Peças',
  whatsapp:       '5527997776244',        // formato internacional, sem +
  whatsappDisplay:'(27) 99777-6244',
  address:        'Av. Principal, 74 — Rio Marinho, Cariacica - ES',
  cep:            '29142-340',
  instagram:      'https://www.instagram.com/belavista_autopecas/',
  instagramHandle:'@belavista_autopecas',
  // TODO: confirmar horários com a loja antes de publicar
  hoursWeekdays:  'Seg–Sex: 08:00–18:00',
  hoursSaturday:  'Sábado: 08:00–12:00',
  hoursSunday:    'Domingo: Fechado',
};

/* ── CATEGORIAS E PALAVRAS-CHAVE ─────────────────────────── */
const CATEGORIES = [
  {
    key: 'motor',
    name: 'Motor',
    prefix: 'MT',
    keywords: ['motor','cabecote','junta','piston','valvula','valvulas','comando','virabrequim','biela','coletor','carter','bomba de oleo'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12"/></svg>`,
  },
  {
    key: 'freios',
    name: 'Freios',
    prefix: 'FR',
    keywords: ['freio','pastilha','disco','tambor','pinca','fluido de freio','abs','servo freio','cilindro mestre'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/><path d="M12 3v2M12 19v2M3 12h2M19 12h2"/></svg>`,
  },
  {
    key: 'iluminacao',
    name: 'Iluminação',
    prefix: 'IL',
    keywords: ['farol','lanterna','lampada','seta','milha','neblina','luz de freio','pisca','luz','iluminacao'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a7 7 0 0 1 7 7c0 3.87-3.13 7-7 7S5 12.87 5 9a7 7 0 0 1 7-7z"/><path d="M9 21h6M12 16v5"/></svg>`,
  },
  {
    key: 'bateria',
    name: 'Bateria e Alternador',
    prefix: 'BT',
    keywords: ['bateria','alternador','vela de carga','regulador','motor de arranque','motor de partida'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
  },
  {
    key: 'pneus',
    name: 'Pneus e Rodas',
    prefix: 'PN',
    keywords: ['pneu','roda','calota','aro','camara de ar','estepe','balanceamento','alinhamento'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><path d="M12 8v1M12 15v1M8 12H7M17 12h-1"/></svg>`,
  },
  {
    key: 'suspensao',
    name: 'Suspensão',
    prefix: 'SU',
    keywords: ['suspensao','amortecedor','mola','bandeja','batente','coxim','barra estabilizadora','pivô','pivo','terminal','buje','bucha'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/><circle cx="12" cy="12" r="3"/></svg>`,
  },
  {
    key: 'embreagem',
    name: 'Embreagem',
    prefix: 'EM',
    keywords: ['embreagem','plato','rolamento de embreagem','volante motor','kit de embreagem'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 4v2M12 18v2M4 12H2M22 12h-2"/></svg>`,
  },
  {
    key: 'arrefecimento',
    name: 'Arrefecimento',
    prefix: 'AR',
    keywords: ['radiador','arrefecimento','termostato','mangueira','ventoinha','reservatorio de agua','agua do radiador','aditivo','tampa do radiador'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-4 4-6 7-6 10a6 6 0 0 0 12 0c0-3-2-6-6-10z"/><path d="M12 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>`,
  },
  {
    key: 'transmissao',
    name: 'Transmissão e Correias',
    prefix: 'TR',
    keywords: ['correia','tensor','polia','dentada','correia dentada','kit de correia','transmissao','cambio','semi eixo','junta homocinética','junta homocinetica'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="5" cy="12" r="3"/><circle cx="19" cy="12" r="3"/><path d="M8 12h8M5 9V6M19 9V6"/></svg>`,
  },
  {
    key: 'filtros',
    name: 'Filtros e Fluidos',
    prefix: 'FT',
    keywords: ['filtro','oleo','combustivel','filtro de ar','filtro de oleo','filtro de combustivel','filtro de cabine','fluido de freio','fluido de embreagem','oleo de motor','oleo de cambio'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 L20 8 L20 20 L4 20 L4 8 Z"/><path d="M4 8 L20 8"/><path d="M9 8 L9 20"/><path d="M15 8 L15 20"/></svg>`,
  },
  {
    key: 'ignicao',
    name: 'Ignição',
    prefix: 'IG',
    keywords: ['vela','ignicao','bobina','cabo de vela','distribuidor','modulo de ignicao','sensor de rotacao'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"/></svg>`,
  },
  {
    key: 'espelhos',
    name: 'Espelhos',
    prefix: 'ES',
    keywords: ['retrovisor','espelho','espelho lateral','espelho retrovisor'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="14" height="12" rx="2"/><path d="M17 9l4 3-4 3"/></svg>`,
  },
  {
    key: 'vidros',
    name: 'Vidros e Limpadores',
    prefix: 'VD',
    keywords: ['vidro','parabrisa','palheta','limpador','limpador de parabrisa','borracha de palheta'],
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20 Q12 4 20 20"/><path d="M4 20 L20 20"/><line x1="12" y1="20" x2="6" y2="10"/></svg>`,
  },
];

const CATEGORY_GERAL = {
  key: 'geral',
  name: 'Peças em Geral',
  prefix: 'GP',
  keywords: [],
  icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
};

const GENERIC_TERMS = ['peca','produto','algo','coisa','item','pe','po','oi','ok','nao','sim'];
const LOADING_MSGS  = ['Consultando estoque…','Verificando disponibilidade…','Localizando peça…'];

/* Mapa de correções: chave = versão normalizada (sem acento, minúsculo) → exibição correta */
const CORRECTIONS = {
  /* Marcas */
  'citoen':       'Citroën',  'ctroen':    'Citroën',  'sitroen':  'Citroën',
  'citroen':      'Citroën',  'citro':     'Citroën',
  'volkswagem':   'Volkswagen', 'volks':   'Volkswagen', 'vw':      'Volkswagen',
  'chevrolet':    'Chevrolet', 'chevrole': 'Chevrolet', 'chevolé': 'Chevrolet',
  'chevrolé':     'Chevrolet', 'gm':       'Chevrolet',
  'hyundai':      'Hyundai',  'hiunday':   'Hyundai',  'hunday':   'Hyundai',
  'hyndai':       'Hyundai',  'hundai':    'Hyundai',
  'renault':      'Renault',  'renaut':    'Renault',  'reno':     'Renault',
  'peugeot':      'Peugeot',  'pugeot':    'Peugeot',  'peogeot':  'Peugeot',
  'pegeot':       'Peugeot',
  'mercedes':     'Mercedes', 'mercedez':  'Mercedes', 'merceides':'Mercedes',
  'mecedes':      'Mercedes',
  'nissan':       'Nissan',   'nisan':     'Nissan',
  'toyota':       'Toyota',   'toyotta':   'Toyota',
  'honda':        'Honda',    'handa':     'Honda',
  'mitsubishi':   'Mitsubishi','mitsubich':'Mitsubishi',
  'fiat':         'Fiat',
  'ford':         'Ford',
  'jeep':         'Jeep',
  'bmw':          'BMW',
  'audi':         'Audi',
  'subaru':       'Subaru',
  'suzuki':       'Suzuki',
  'kia':          'Kia',
  'volvo':        'Volvo',
  'dodge':        'Dodge',    'dodg':      'Dodge',
  'ram':          'RAM',
  'caoa':         'CAOA',
  'jac':          'JAC',
  'byd':          'BYD',
  /* Peças comuns */
  'pastila':      'pastilha', 'pastilias': 'pastilhas',
  'amortesedor':  'amortecedor', 'amortesedores':'amortecedores',
  'embreagen':    'embreagem',
  'suspensao':    'suspensão',  'suspenção':'suspensão',
  'radiado':      'radiador',
  'alernador':    'alternador', 'alternado':'alternador',
  'ignicao':      'ignição',
  'palheta':      'palheta',
  'parbrisa':     'parabrisa',  'parabriza':'parabrisa',
  'amortecedor':  'amortecedor',
};

/* ── UTILITÁRIOS ─────────────────────────────────────────── */
function normalize(str) {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

function toTitleCase(str) {
  const lower = ['de','da','do','das','dos','e','em','para','com','por','a','o','ao','do'];
  return str.split(' ').map((w, i) => {
    if (!w) return w;
    if (i > 0 && lower.includes(w.toLowerCase())) return w.toLowerCase();
    return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
  }).join(' ');
}

/* Aplica correções palavra a palavra; retorna { term, wasCorrected } */
function correctTerm(raw) {
  const words = raw.trim().split(/\s+/);
  let corrected = false;
  const out = words.map(w => {
    const key = normalize(w);
    if (CORRECTIONS[key]) { corrected = true; return CORRECTIONS[key]; }
    return w;
  });
  return { term: out.join(' '), wasCorrected: corrected };
}

function detectCategory(term) {
  const n = normalize(term);
  for (const cat of CATEGORIES) {
    for (const kw of cat.keywords) {
      if (n.includes(kw)) return cat;
    }
  }
  return CATEGORY_GERAL;
}

function genRef(prefix) {
  return `${prefix}-${Math.floor(1000 + Math.random() * 8999)}`;
}

function waLink(msg) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(msg)}`;
}

function wapIconSVG() {
  return `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.847L.057 23.272a.75.75 0 0 0 .916.916l5.425-1.472A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.992 0-3.867-.543-5.478-1.489l-.392-.233-3.221.874.874-3.221-.233-.392A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>`;
}

/* ── DOM HELPERS ─────────────────────────────────────────── */
function $(id) { return document.getElementById(id); }

function getSearchInput() { return $('search-input') || $('mobile-search-input'); }

function setPanelContent(html) {
  const c = $('search-panel-content');
  if (c) c.innerHTML = html;
}

function openPanel() {
  const panel = $('search-panel');
  if (!panel) return;
  panel.removeAttribute('hidden');
  requestAnimationFrame(() => panel.classList.add('open'));
  /* Garante que o painel fixo do header fique visível */
  if (window.scrollY > 10) window.scrollTo({ top: 0, behavior: 'smooth' });
}

function closePanel() {
  const panel = $('search-panel');
  if (!panel) return;
  panel.classList.remove('open');
  panel.addEventListener('transitionend', () => {
    if (!panel.classList.contains('open')) panel.setAttribute('hidden', '');
  }, { once: true });
}

/* ── BUSCA ───────────────────────────────────────────────── */
let _loadingInterval = null;

function clearLoadingInterval() {
  if (_loadingInterval) { clearInterval(_loadingInterval); _loadingInterval = null; }
}

function showLoading() {
  clearLoadingInterval();
  setPanelContent(`
    <div class="search-loading" role="status" aria-live="polite">
      <div class="spinner" aria-hidden="true"></div>
      <p class="loading-msg" id="loading-msg">${LOADING_MSGS[0]}</p>
    </div>
  `);
  let i = 0;
  _loadingInterval = setInterval(() => {
    i = (i + 1) % LOADING_MSGS.length;
    const el = $('loading-msg');
    if (el) el.textContent = LOADING_MSGS[i];
  }, 420);
}

function showTip() {
  openPanel();
  setPanelContent(`
    <div class="search-tip" role="status">
      <span class="tip-icon" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>
        </svg>
      </span>
      <div>
        <p>Quase lá! Me conta um pouco mais sobre a peça — e, se souber, a marca e o modelo do carro.</p>
        <p class="tip-example">Ex: <em>pastilha de freio civic 2018</em></p>
      </div>
    </div>
  `);
}

function showResult(term, category, ref, wasCorrected, originalTerm) {
  clearLoadingInterval();
  const titled    = toTitleCase(term);
  const safeTitle = titled.replace(/"/g, '&quot;');

  setPanelContent(`
    <div class="result-ticket" role="region" aria-label="Resultado da busca">
      <div class="ticket-header">
        <span class="ticket-category-icon" aria-hidden="true">${category.icon}</span>
        <div>
          <p class="ticket-label">Categoria</p>
          <p class="ticket-category-name">${category.name}</p>
        </div>
        <span class="ticket-ref">Ref: ${ref}</span>
      </div>
      <div class="ticket-body">
        <h3 class="ticket-piece-name">${titled}</h3>
        <p class="ticket-status" role="status">
          <span class="pulse-dot" aria-hidden="true"></span>
          Disponível em estoque
        </p>
        <p class="ticket-stock-warn">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" width="13" height="13"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          Últimas unidades — garanta o seu antes de esgotar o estoque.
        </p>
      </div>
      <div class="ticket-footer">
        <button type="button" class="btn-wap-result" id="btn-wap-result"
          data-piece="${safeTitle}">
          ${wapIconSVG()} Pedir no WhatsApp
        </button>
      </div>
    </div>
    <button type="button" class="search-back-btn" id="search-back-btn">← Nova busca</button>
  `);

  $('btn-wap-result').addEventListener('click', () => {
    const piece = $('btn-wap-result').dataset.piece;
    const msg   = `Olá! Vi no site que está disponível a peça: ${piece}. Preciso comprar, pode me passar o orçamento?`;
    window.open(waLink(msg), '_blank', 'noopener,noreferrer');
  });

  $('search-back-btn').addEventListener('click', () => {
    closePanel();
    const inp = getSearchInput();
    if (inp) { inp.value = ''; inp.focus(); }
  });
}

function shakeInput() {
  const inp = getSearchInput();
  if (!inp) return;
  inp.classList.remove('shake');
  void inp.offsetWidth; // reflow p/ reiniciar animação
  inp.classList.add('shake');
  inp.focus();
  inp.addEventListener('animationend', () => inp.classList.remove('shake'), { once: true });
}

function performSearch(term) {
  const trimmed = (term || '').trim();

  if (!trimmed) { shakeInput(); return; }

  const n = normalize(trimmed);
  const isGeneric = trimmed.length < 3 || GENERIC_TERMS.includes(n) || n === 'peca';
  if (isGeneric) { showTip(); return; }

  openPanel();
  showLoading();

  const delay = 900 + Math.random() * 600; // 0,9–1,5 s
  setTimeout(() => {
    const { term: corrected, wasCorrected } = correctTerm(trimmed);
    const cat = detectCategory(corrected);
    const ref = genRef(cat.prefix);
    showResult(corrected, cat, ref, wasCorrected, trimmed);
  }, delay);
}

/* ── INICIALIZAÇÃO DO HEADER ─────────────────────────────── */
function initHeader() {
  /* Scroll — blur no header */
  const header = document.querySelector('.site-header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* Hamburger */
  const hamburger = $('hamburger-btn');
  const mobileMenu = $('mobile-menu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!open));
      mobileMenu.toggleAttribute('hidden', open);
    });

    /* Fecha menu ao clicar num link interno */
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('hidden', '');
      });
    });
  }

  /* Fechar painel ao clicar fora */
  document.addEventListener('click', e => {
    const panel = $('search-panel');
    const wrap  = document.querySelector('.header-search-wrap');
    const mWrap = document.querySelector('.mobile-search-wrap');
    if (!panel) return;
    if (!panel.contains(e.target) && !wrap?.contains(e.target) && !mWrap?.contains(e.target)) {
      closePanel();
    }
  });
}

/* ── INICIALIZAÇÃO DA BUSCA ──────────────────────────────── */
function initSearch() {
  const inp  = $('search-input');
  const btn  = $('search-btn');
  const mInp = $('mobile-search-input');
  const mBtn = $('mobile-search-btn');
  const fInp = $('footer-search-input');
  const fBtn = $('footer-search-btn');

  /* Espelha o valor digitado em qualquer campo secundário no input do header */
  function mirror(val) { if (inp) inp.value = val; }

  /* Header desktop */
  if (inp) inp.addEventListener('keydown', e => { if (e.key === 'Enter') performSearch(inp.value); });
  if (btn && inp) btn.addEventListener('click', () => performSearch(inp.value));

  /* Mobile */
  if (mInp) mInp.addEventListener('keydown', e => { if (e.key === 'Enter') { mirror(mInp.value); performSearch(mInp.value); } });
  if (mBtn && mInp) mBtn.addEventListener('click', () => { mirror(mInp.value); performSearch(mInp.value); });

  /* Footer */
  if (fInp) fInp.addEventListener('keydown', e => { if (e.key === 'Enter') { mirror(fInp.value); performSearch(fInp.value); } });
  if (fBtn && fInp) fBtn.addEventListener('click', () => { mirror(fInp.value); performSearch(fInp.value); });
}

/* ── COMPORTAMENTO DAS ÂNCORAS / SCROLL ──────────────────── */
function initScrollBehavior() {
  /* Offset do header fixo ao navegar por âncoras */
  document.querySelectorAll('a[href^="#"], a[href*="/#"]').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      const hash = href.includes('#') ? '#' + href.split('#')[1] : null;
      if (!hash) return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY
                  - parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h') || '72', 10)
                  - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ── CATEGORIAS — cards são links, sem handler de busca ──── */
function initCategoryCards() {}

/* ── CAMPO DE BUSCA DA HERO ──────────────────────────────── */
function initHeroCTA() {
  const heroInp = $('hero-search-input');
  const heroBtn = $('hero-search-btn');
  if (!heroInp || !heroBtn) return;

  function triggerHeroSearch() {
    const term = heroInp.value.trim();
    /* Espelha no input do header para manter consistência */
    const headerInp = $('search-input');
    if (headerInp) headerInp.value = heroInp.value;
    performSearch(term || '');
  }

  heroInp.addEventListener('keydown', e => { if (e.key === 'Enter') triggerHeroSearch(); });
  heroBtn.addEventListener('click', triggerHeroSearch);
}

/* ── CARREGAMENTO DOS PARTIALS ───────────────────────────── */
async function loadPartials() {
  const headerSlot = $('site-header');
  const footerSlot = $('site-footer');

  try {
    const [hRes, fRes] = await Promise.all([
      fetch('/partials/header.html'),
      fetch('/partials/footer.html'),
    ]);

    if (!hRes.ok || !fRes.ok) throw new Error('Partials não encontrados');

    const [hHTML, fHTML] = await Promise.all([hRes.text(), fRes.text()]);

    if (headerSlot) headerSlot.innerHTML = hHTML;
    if (footerSlot) footerSlot.innerHTML = fHTML;

    /* Inicializa depois que o DOM do header está injetado */
    initHeader();
    initSearch();
    initScrollBehavior();
    initCategoryCards();
    initHeroCTA();
  } catch (err) {
    console.error('[Bela Vista] Erro ao carregar partials:', err);
    /* Fallback: inicializa o que estiver disponível no DOM */
    initHeader();
    initSearch();
    initScrollBehavior();
    initCategoryCards();
    initHeroCTA();
  }
}

/* ── BUSCA NAS PÁGINAS DE CIDADE / BAIRROS ──────────────── */
(function () {
  const WA = '5527997776244';
  function waLink(msg) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(msg); }

  const wapSVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" width="18" height="18"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.124.557 4.118 1.529 5.847L.057 23.272a.75.75 0 0 0 .916.916l5.425-1.472A11.947 11.947 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.992 0-3.867-.543-5.478-1.489l-.392-.233-3.221.874.874-3.221-.233-.392A9.953 9.953 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>';
  const warnSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true" width="13" height="13"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>';

  function showCityResult(container, searchWrap, input, peca, city, afterMode) {
    /* Remove resultado anterior */
    const scope = afterMode ? container.parentElement : container;
    const existing = scope && scope.querySelector('.city-result-card');
    if (existing) existing.remove();

    const btn = searchWrap.querySelector('.city-search-btn');
    const orig = btn.innerHTML;
    btn.innerHTML = '<span class="city-search-loading"><span></span><span></span><span></span></span>';
    btn.disabled = true;

    setTimeout(function () {
      btn.innerHTML = orig;
      btn.disabled = false;

      const display = peca.charAt(0).toUpperCase() + peca.slice(1);
      const msg = 'Olá! Vi no site que está disponível a peça: ' + display + '. Preciso comprar, pode me passar o orçamento?';

      const card = document.createElement('div');
      card.className = 'city-result-card';
      card.innerHTML =
        '<div class="city-result-status"><span class="pulse-dot" aria-hidden="true"></span>Disponível em estoque</div>' +
        '<p class="city-result-piece">' + display + '</p>' +
        '<p class="city-result-stock">' + warnSVG + ' Últimas unidades — garanta o seu antes de esgotar o estoque.</p>' +
        '<div class="city-result-actions">' +
          '<a href="' + waLink(msg) + '" class="btn btn-wap city-result-wap" target="_blank" rel="noopener noreferrer">' + wapSVG + ' Pedir no WhatsApp</a>' +
          '<button type="button" class="city-result-reset">← Nova busca</button>' +
        '</div>';

      /* Hero: insere após o container; conteúdo: dentro do bloco */
      if (afterMode) {
        container.insertAdjacentElement('afterend', card);
      } else {
        container.appendChild(card);
      }

      card.querySelector('.city-result-reset').addEventListener('click', function () {
        card.remove();
        input.value = '';
        input.focus();
      });
    }, 1800);
  }

  function handleSearch(btn) {
    const searchWrap = btn.closest('[role="search"]');
    const input = searchWrap && searchWrap.querySelector('.city-search-input');
    const peca = input ? input.value.trim() : '';
    const city = btn.dataset.city || '';
    if (!peca) { if (input) input.focus(); return; }
    const cityBlock = btn.closest('.city-search-block');
    if (cityBlock) {
      showCityResult(cityBlock, searchWrap, input, peca, city, false);
    } else {
      /* Contexto hero: container é o div pai do searchWrap; card vai depois dele */
      const heroContainer = searchWrap && searchWrap.parentElement;
      if (!heroContainer) return;
      showCityResult(heroContainer, searchWrap, input, peca, city, true);
    }
  }

  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.city-search-btn');
    if (btn) handleSearch(btn);
  });

  /* Suporte a Enter nos inputs de city-search */
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    const input = e.target.closest('.city-search-input');
    if (!input) return;
    const btn = input.closest('[role="search"]') && input.closest('[role="search"]').querySelector('.city-search-btn');
    if (btn) handleSearch(btn);
  });
})();

document.addEventListener('DOMContentLoaded', loadPartials);

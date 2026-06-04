/**
 * Rally Islas Canarias 2026 — Frontend Dashboard
 */

const API_URL = '';

// ================================================
// NAVIGATION
// ================================================
document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.ntab');
    const sections = document.querySelectorAll('.section');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const id = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            tab.classList.add('active');
            document.getElementById(id).classList.add('active');

            cargarSeccion(id);
        });
    });

    cargarEquipos();
    initCinematic();
    initCountdown();
    initStandingsBars();
});

// ================================================
// SECTION LOADER
// ================================================
function cargarSeccion(id) {
    switch (id) {
        case 'equipos':        cargarEquipos();        break;
        case 'pilotos':        cargarPilotos();        break;
        case 'etapas':         cargarEtapas();         break;
        case 'tramos':         cargarTramos();         break;
        case 'clasificacion':  renderClasificacion();  break;
    }
}

// ================================================
// EQUIPOS
// ================================================
async function cargarEquipos() {
    const grid = document.getElementById('equipos-grid');
    loading(grid);
    try {
        const r = await fetch(`${API_URL}/api/equipos`);
        if (!r.ok) throw new Error();
        renderEquipos(await r.json());
    } catch {
        renderEquipos(demoEquipos());
    }
}

function renderEquipos(equipos) {
    const grid = document.getElementById('equipos-grid');
    if (!equipos?.length) { empty(grid, '🏁', 'Sin equipos registrados'); return; }

    grid.innerHTML = equipos.map(e => {
        const tc = teamColors(e.marca);
        return `
        <div class="card eq-card" style="--eq-tc:${tc.stripe}; --eq-bg:${tc.bg}" data-wiki="${teamWiki(e.marca)}">
            <div class="eq-photo">
                <div class="eq-skeleton"></div>
                <img class="eq-img" alt="${x(e.nombre)}">
                <div class="eq-overlay"></div>
                <div class="eq-photo-content">
                    <span class="eq-chip">${x(e.marca || '?')}</span>
                    <h3 class="eq-name">${x(e.nombre)}</h3>
                </div>
                <div class="eq-line"></div>
            </div>
            <div class="eq-stats">
                <div class="eq-stat">
                    <span class="eq-sk">País</span>
                    <span class="eq-sv">${x(e.nacionalidad || 'N/A')}</span>
                </div>
                <div class="eq-sdiv"></div>
                <div class="eq-stat">
                    <span class="eq-sk">Fundación</span>
                    <span class="eq-sv">${e.anioFundacion || 'N/A'}</span>
                </div>
                <div class="eq-sdiv"></div>
                <div class="eq-stat">
                    <span class="eq-sk">Marca</span>
                    <span class="eq-sv">${x(e.marca || 'N/A')}</span>
                </div>
            </div>
        </div>`;
    }).join('');

    document.querySelectorAll('.eq-card[data-wiki]').forEach(loadWikiImage);
}

function teamColors(marca) {
    const m = (marca || '').toLowerCase();
    if (m.includes('toyota'))  return { bg:'#0e0600', stripe:'#EB0A1E' };
    if (m.includes('hyundai')) return { bg:'#00091a', stripe:'#003E8C' };
    if (m.includes('ford'))    return { bg:'#000814', stripe:'#1461CC' };
    if (m.includes('citro'))   return { bg:'#0e0400', stripe:'#C8000A' };
    if (m.includes('subaru'))  return { bg:'#00091a', stripe:'#003C8F' };
    if (m.includes('skoda') || m.includes('škoda')) return { bg:'#001408', stripe:'#007A3D' };
    return { bg:'#0e0000', stripe:'#E10600' };
}

// Lista de artículos a intentar en orden (el primero que tenga imagen gana)
const TEAM_WIKI_TRIES = {
    toyota:  ['Toyota_Yaris_WRC', 'Toyota_GR_Yaris_WRC'],
    hyundai: ['Hyundai_i20_N_Rally1', 'Hyundai_i20_WRC'],
    ford:    ['Ford_Fiesta_WRC', 'Ford_Puma_Rally1', 'Ford_Puma'],
    citroen: ['Citro%C3%ABn_C3_WRC', 'Citro%C3%ABn_DS3_WRC'],
    lancia:  ['Lancia_Rally_037', 'Lancia_Stratos', 'Lancia_Delta_HF_Integrale'],
    skoda:   ['%C5%A0koda_Fabia_R5', '%C5%A0koda_Fabia_RS_Rally2'],
};

function teamWiki(marca) {
    const m = (marca || '').toLowerCase();
    if (m.includes('toyota'))  return TEAM_WIKI_TRIES.toyota[0];
    if (m.includes('hyundai')) return TEAM_WIKI_TRIES.hyundai[0];
    if (m.includes('ford'))    return TEAM_WIKI_TRIES.ford[0];
    if (m.includes('citro'))   return TEAM_WIKI_TRIES.citroen[0];
    if (m.includes('lancia'))  return TEAM_WIKI_TRIES.lancia[0];
    if (m.includes('skoda') || m.includes('škoda')) return TEAM_WIKI_TRIES.skoda[0];
    return '';
}

async function fetchWikiImage(article) {
    const res = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${article}`);
    if (!res.ok) return null;
    const data = await res.json();
    let src = data.originalimage?.source || data.thumbnail?.source;
    if (!src) return null;
    // Upscale thumbnails, leave originals as-is
    if (src.includes('/thumb/')) src = src.replace(/\/\d+px-/, '/800px-');
    return src;
}

async function loadWikiImage(card) {
    const marca = (card.style.getPropertyValue('--eq-tc') ? '' : '');
    // Determinar qué lista de artículos usar según el color del equipo / data-wiki
    const firstArticle = card.dataset.wiki;
    if (!firstArticle) return;

    const img = card.querySelector('.eq-img');
    if (!img) return;

    // Identificar lista de fallbacks
    const m = Object.keys(TEAM_WIKI_TRIES).find(k =>
        TEAM_WIKI_TRIES[k][0] === firstArticle || TEAM_WIKI_TRIES[k].includes(firstArticle)
    );
    const articles = m ? TEAM_WIKI_TRIES[m] : [firstArticle];

    for (const article of articles) {
        try {
            const src = await fetchWikiImage(article);
            if (!src) continue;
            img.onload = () => {
                img.classList.add('eq-loaded');
                card.querySelector('.eq-skeleton')?.remove();
            };
            img.onerror = () => {};
            img.src = src;
            return;
        } catch {}
    }
    card.querySelector('.eq-skeleton')?.remove();
}

// ================================================
// PILOTOS
// ================================================
async function cargarPilotos() {
    const tbody = document.getElementById('pilotos-tbody');
    if (tbody) {
        tbody.innerHTML = `<tr><td colspan="6" style="padding:0"><div class="loading-wrap" style="padding:48px 20px"><div class="spinner"></div><p class="loading-txt">Cargando datos</p></div></td></tr>`;
    }
    try {
        const r = await fetch(`${API_URL}/api/pilotos`);
        if (!r.ok) throw new Error();
        renderPilotos(await r.json());
    } catch {
        renderPilotos(demoPilotos());
    }
}

function renderPilotos(pilotos) {
    const tbody = document.getElementById('pilotos-tbody');
    if (!tbody) return;

    if (!pilotos?.length) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:48px;color:var(--w35);font-family:var(--f-data);font-size:0.7rem;letter-spacing:3px;text-transform:uppercase;">Sin pilotos registrados</td></tr>`;
        return;
    }

    tbody.innerHTML = pilotos.map(p => `
        <tr>
            <td style="text-align:center"><span class="dorsal">${p.dorsal}</span></td>
            <td style="font-weight:500">${x(p.nombre)}</td>
            <td style="color:var(--w60)">${x(p.nacionalidad || 'N/A')}</td>
            <td><span class="cat-badge ${catClass(p.categoria)}">${x(p.categoria || 'N/A')}</span></td>
            <td style="color:var(--w60)">${x(p.equipo?.nombre || 'Sin equipo')}</td>
            <td>
                <span class="estado-badge ${p.activo ? 'estado-activo' : 'estado-inactivo'}">
                    <span class="estado-dot"></span>
                    ${p.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
        </tr>
    `).join('');
}

// ================================================
// ETAPAS
// ================================================
async function cargarEtapas() {
    const tl = document.getElementById('etapas-timeline');
    loading(tl);
    try {
        const r = await fetch(`${API_URL}/api/etapas`);
        if (!r.ok) throw new Error();
        renderEtapas(await r.json());
    } catch {
        renderEtapas(demoEtapas());
    }
}

function islaClass(isla) {
    const i = (isla || '').toLowerCase();
    if (i.includes('tenerife'))  return 'tenerife';
    if (i.includes('gran'))      return 'grancanaria';
    if (i.includes('lanzarote')) return 'lanzarote';
    return 'default';
}

function renderEtapas(etapas) {
    const tl = document.getElementById('etapas-timeline');
    if (!etapas?.length) { empty(tl, '🗺️', 'Sin etapas registradas'); return; }

    const totalKm     = etapas.reduce((s, e) => s + (e.km || (e.tramos?.reduce((a, t) => a + (t.km || 0), 0) || 0)), 0);
    const totalTramos = etapas.reduce((s, e) => s + (e.tramos?.length || 0), 0);
    const islas       = [...new Set(etapas.map(e => e.isla).filter(Boolean))];

    const summaryHtml = `
        <div class="etapa-summary">
            <div class="etapa-sumstat">
                <span class="etapa-sumval">${etapas.length}</span>
                <span class="etapa-sumlbl">Etapas</span>
            </div>
            <span class="etapa-sumdiv"></span>
            <div class="etapa-sumstat">
                <span class="etapa-sumval">${totalTramos}</span>
                <span class="etapa-sumlbl">Tramos</span>
            </div>
            <span class="etapa-sumdiv"></span>
            <div class="etapa-sumstat">
                <span class="etapa-sumval">${Math.round(totalKm)}</span>
                <span class="etapa-sumlbl">km totales</span>
            </div>
            <span class="etapa-sumdiv"></span>
            <div class="etapa-sumstat">
                <span class="etapa-sumval">${islas.length}</span>
                <span class="etapa-sumlbl">Islas</span>
            </div>
        </div>`;

    tl.innerHTML = summaryHtml + etapas.map((e, i) => {
        const slug    = islaClass(e.isla);
        const stageKm = e.km || (e.tramos?.reduce((s, t) => s + (t.km || 0), 0) || 0);
        const tramosHtml = e.tramos?.length ? `
            <div class="etapa-tramos">
                ${e.tramos.map(t => `
                    <div class="etapa-tramo">
                        <span class="etapa-tramo-dot"></span>
                        <span class="etapa-tramo-name">${x(t.nombre)}</span>
                        <span class="etapa-tramo-km">${t.km} km</span>
                        <span class="cin-tramo-dif ${(t.dificultad || '').toLowerCase()}">${x(t.dificultad)}</span>
                    </div>`).join('')}
            </div>` : '';

        return `
        <div class="etapa-item" data-isla="${x(e.isla || '')}">
            <div class="etapa-marker">
                <div class="etapa-num-badge etapa-isl-${slug}">E${e.numero || i + 1}</div>
            </div>
            <div class="etapa-card etapa-isl-${slug}">
                <div class="etapa-card-header">
                    <div class="etapa-card-title-group">
                        <span class="etapa-stage-label">ETAPA ${e.numero || i + 1}</span>
                        <h3 class="etapa-name">${x(e.nombre)}</h3>
                    </div>
                    <span class="etapa-date">${fecha(e.fecha)}</span>
                </div>
                <p class="etapa-desc">${x(e.descripcion || '')}</p>
                <div class="etapa-card-footer">
                    <span class="etapa-isla-badge etapa-isl-${slug}">
                        <span class="etapa-isla-dot"></span>${x(e.isla || 'Islas Canarias')}
                    </span>
                    ${stageKm ? `<span class="etapa-stat"><span class="etapa-stat-val">${stageKm.toFixed(1)}</span>&thinsp;km</span>` : ''}
                    ${e.tramos?.length ? `<span class="etapa-stat"><span class="etapa-stat-val">${e.tramos.length}</span>&thinsp;tramo${e.tramos.length !== 1 ? 's' : ''}</span>` : ''}
                </div>
                ${tramosHtml}
            </div>
        </div>`;
    }).join('');

    document.querySelectorAll('.etapa-flt').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.etapa-flt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const isla = btn.dataset.isla;
            document.querySelectorAll('.etapa-item').forEach(item => {
                item.style.display = (!isla || item.dataset.isla === isla) ? '' : 'none';
            });
        });
    });
}

// ================================================
// TRAMOS
// ================================================
async function cargarTramos() {
    const grid = document.getElementById('tramos-grid');
    loading(grid);
    try {
        const r = await fetch(`${API_URL}/api/tramos`);
        if (!r.ok) throw new Error();
        renderTramos(await r.json());
    } catch {
        renderTramos(demoTramos());
    }
}

function renderTramos(tramos) {
    const grid = document.getElementById('tramos-grid');
    if (!tramos?.length) { empty(grid, '🛣️', 'Sin tramos registrados'); return; }

    const totalKm  = tramos.reduce((s, t) => s + (t.distanciaKm || 0), 0);
    const maxKm    = Math.max(...tramos.map(t => t.distanciaKm || 0));
    const altas    = tramos.filter(t => ['alta','dificil'].includes((t.dificultad||'').toLowerCase())).length;
    const medias   = tramos.filter(t => (t.dificultad||'').toLowerCase() === 'media').length;
    const bajas    = tramos.length - altas - medias;

    function difClass(d) {
        const v = (d||'').toLowerCase();
        if (v==='alta'||v==='dificil') return 'alta';
        if (v==='baja'||v==='facil')   return 'baja';
        return 'media';
    }

    const statsHtml = `
    <div class="ts-stats">
        <div class="ts-stat"><span class="ts-stat-v">${tramos.length}</span><span class="ts-stat-l">Tramos</span></div>
        <div class="ts-sep"></div>
        <div class="ts-stat"><span class="ts-stat-v">${totalKm.toFixed(1)}</span><span class="ts-stat-l">km totales</span></div>
        <div class="ts-sep"></div>
        <div class="ts-stat"><span class="ts-stat-v">${(totalKm/tramos.length).toFixed(1)}</span><span class="ts-stat-l">km promedio</span></div>
        <div class="ts-sep"></div>
        <div class="ts-stat"><span class="ts-stat-v ts-v-alta">${altas}</span><span class="ts-stat-l">Alta</span></div>
        <div class="ts-sep"></div>
        <div class="ts-stat"><span class="ts-stat-v ts-v-media">${medias}</span><span class="ts-stat-l">Media</span></div>
        <div class="ts-sep"></div>
        <div class="ts-stat"><span class="ts-stat-v ts-v-baja">${bajas}</span><span class="ts-stat-l">Baja</span></div>
    </div>`;

    const filterHtml = `
    <div class="ts-filters">
        <button class="ts-flt active" data-dif="">TODOS <span class="ts-flt-count">${tramos.length}</span></button>
        <button class="ts-flt ts-flt-alta" data-dif="alta">ALTA <span class="ts-flt-count">${altas}</span></button>
        <button class="ts-flt ts-flt-media" data-dif="media">MEDIA <span class="ts-flt-count">${medias}</span></button>
        <button class="ts-flt ts-flt-baja" data-dif="baja">BAJA <span class="ts-flt-count">${bajas}</span></button>
    </div>`;

    const cardsHtml = `<div class="ts-grid">${tramos.map((t, i) => {
        const dc   = difClass(t.dificultad);
        const pct  = maxKm > 0 ? ((t.distanciaKm || 0) / maxKm * 100).toFixed(1) : 0;
        return `
        <div class="ts-card ts-dif-${dc}" data-dif="${dc}" style="animation-delay:${i*0.028}s">
            <div class="ts-accent-bar"></div>
            <div class="ts-head">
                <span class="ts-ss">SS${String(i+1).padStart(2,'0')}</span>
                <span class="ts-badge ts-badge-${dc}">${x(t.dificultad||'—')}</span>
            </div>
            <div class="ts-km">${t.distanciaKm??'—'}<span class="ts-km-u"> km</span></div>
            <div class="ts-bar-wrap"><div class="ts-bar-fill ts-bar-${dc}" style="width:${pct}%"></div></div>
            <div class="ts-name">${x(t.nombre)}</div>
            <div class="ts-foot">
                <span class="ts-chip">${x(t.superficie||'—')}</span>
                ${t.etapa ? `<span class="ts-etapa-lbl">${x(t.etapa.nombre)}</span>` : ''}
            </div>
        </div>`
    }).join('')}</div>`;

    grid.innerHTML = statsHtml + filterHtml + cardsHtml;

    grid.querySelectorAll('.ts-flt').forEach(btn => {
        btn.addEventListener('click', () => {
            grid.querySelectorAll('.ts-flt').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const dif = btn.dataset.dif;
            grid.querySelectorAll('.ts-card').forEach(c => {
                c.style.display = (!dif || c.dataset.dif === dif) ? '' : 'none';
            });
        });
    });
}

// ================================================
// COUNTDOWN TIMER
// ================================================
function initCountdown() {
    const EVENT = new Date('2026-06-25T19:00:00+02:00');

    function setDigits(id, value, len) {
        const s = String(Math.max(0, value)).padStart(len, '0');
        const el = document.getElementById(id);
        if (!el) return;
        const digits = el.querySelectorAll('.cd-digit');
        digits.forEach((d, i) => {
            const newVal = s[i] ?? '0';
            if (d.textContent !== newVal) {
                d.classList.add('flip');
                setTimeout(() => { d.textContent = newVal; d.classList.remove('flip'); }, 75);
            }
        });
    }

    function tick() {
        const diff = EVENT - Date.now();
        if (diff <= 0) { setDigits('cd-days',0,2); setDigits('cd-hours',0,2); setDigits('cd-mins',0,2); setDigits('cd-secs',0,2); return; }
        setDigits('cd-days',  Math.floor(diff / 86400000), 2);
        setDigits('cd-hours', Math.floor(diff / 3600000) % 24, 2);
        setDigits('cd-mins',  Math.floor(diff / 60000) % 60, 2);
        setDigits('cd-secs',  Math.floor(diff / 1000)  % 60, 2);
    }

    tick();
    setInterval(tick, 1000);
}

// ================================================
// STANDINGS BARS — animar al entrar en viewport
// ================================================
function initStandingsBars() {
    const section = document.getElementById('std-section');
    if (!section) return;

    const obs = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        section.querySelectorAll('.std-bar-fill').forEach((bar, i) => {
            bar.style.transition = `transform 1s cubic-bezier(0.22,1,0.36,1) ${i * 0.1}s`;
            bar.style.transform  = 'scaleX(1)';
        });
        obs.disconnect();
    }, { threshold: 0.25 });

    obs.observe(section);
}

// ================================================
// UTILITIES
// ================================================
function x(text) {
    if (!text) return '';
    const d = document.createElement('div');
    d.textContent = text;
    return d.innerHTML;
}

function catClass(cat) {
    if (!cat) return '';
    switch (cat.toUpperCase()) {
        case 'WRC':  return 'cat-wrc';
        case 'WRC2': return 'cat-wrc2';
        case 'JWRC': return 'cat-jwrc';
        default:     return '';
    }
}

function fecha(str) {
    if (!str) return 'Por definir';
    return new Date(str).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

function loading(el) {
    el.innerHTML = `
        <div class="loading-wrap">
            <div class="spinner"></div>
            <p class="loading-txt">Cargando datos</p>
        </div>`;
}

function empty(el, icon, msg) {
    el.innerHTML = `
        <div class="empty-wrap">
            <span class="empty-ico">${icon}</span>
            <p class="empty-txt">${msg}</p>
        </div>`;
}

// ================================================
// LIVE SEARCH
// ================================================
document.getElementById('buscar-equipo')?.addEventListener('input', () => {});
document.getElementById('buscar-piloto')?.addEventListener('input', () => {});

// ================================================
// CINEMATIC SCROLL — estilo Apple
// ================================================
function initCinematic() {
    const section = document.getElementById('cin-section');
    if (!section) return;

    const progressFill = document.getElementById('cin-progress');
    const counter      = document.getElementById('cin-counter');
    const states       = [
        document.getElementById('cin-s0'),
        document.getElementById('cin-s1'),
        document.getElementById('cin-s2'),
    ];
    const islands = [
        document.getElementById('cin-isl-0'),
        document.getElementById('cin-isl-1'),
        document.getElementById('cin-isl-2'),
    ];

    // Breakpoints: s0: 0–0.33 | s1: 0.33–0.70 | s2: 0.70–1
    const B = [0, 0.33, 0.70, 1];

    function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
    function invlerp(a, b, v) { return clamp((v - a) / (b - a), 0, 1); }
    // easeOutExpo: empieza rápido, frena suave al final
    function easeOutExpo(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
    // easeOutBack: llega ligeramente pasado y rebota
    function easeOutBack(t) {
        const c1 = 1.70158, c3 = c1 + 1;
        return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    }

    let raf = null;
    let lastVal = -1;
    let settledTimer = null;

    function update() {
        raf = null;
        const rect       = section.getBoundingClientRect();
        const scrollable = section.offsetHeight - window.innerHeight;
        const p          = clamp(-rect.top / scrollable, 0, 1);

        // Barra de progreso (sin transición CSS — se actualiza directamente)
        if (progressFill) progressFill.style.width = (p * 100) + '%';

        // Fase activa
        let active = 0;
        if (p >= B[2]) active = 2;
        else if (p >= B[1]) active = 1;

        states.forEach((s, i) => { if (s) s.classList.toggle('cin-on', i === active); });

        // ── Contador con easeOutExpo y efecto blur ──
        if (counter) {
            const t   = easeOutExpo(invlerp(0, B[1] * 0.85, p));
            const val = Math.round(t * 350);

            if (val !== lastVal) {
                lastVal = val;
                counter.textContent = val;

                // Blur mientras cambia, settle cuando llega a 350
                if (val < 350) {
                    counter.classList.add('cin-blur');
                    counter.classList.remove('cin-settled');
                    clearTimeout(settledTimer);
                } else {
                    counter.classList.remove('cin-blur');
                    settledTimer = setTimeout(() => counter.classList.add('cin-settled'), 80);
                }
            }
        }

        // ── Islas: entran en secuencia durante fase 1 ──
        const inIslands = active === 1 || active === 2;
        const s1p = invlerp(B[1], B[2], p);
        islands.forEach((isl, i) => {
            if (!isl) return;
            isl.classList.toggle('cin-isl-in', inIslands && s1p > i * 0.20);
        });
    }

    window.addEventListener('scroll', () => {
        if (!raf) raf = requestAnimationFrame(update);
    }, { passive: true });

    update();
}

// ================================================
// MODAL — CLASIFICACIÓN COMPLETA
// ================================================
// Flags ISO-2 por piloto
const STANDINGS_DATA = [
  { pos:1,  fn:'Elfyn',      ln:'EVANS',         m:'toyota',  flag:'gb', photo:'assets/evans-2026-1x1.avif',   cat:'WRC',  total:151, r:[26,34,6,8,27,22,28] },
  { pos:2,  fn:'Takamoto',   ln:'KATSUTA',       m:'toyota',  flag:'jp', photo:'assets/katsuta-2026-1x1.avif', cat:'WRC',  total:131, r:[6,24,25,26,18,12,20] },
  { pos:3,  fn:'Oliver',     ln:'SOLBERG',       m:'toyota',  flag:'no', photo:'assets/solberg-2026-1x1.avif', cat:'WRC',  total:102, r:[30,17,11,10,'R',24,10] },
  { pos:4,  fn:'Sami',       ln:'PAJARI',        m:'toyota',  flag:'fi', photo:'assets/pajari-2026-1x1.avif',  cat:'WRC2', total:96,  r:['R',17,15,20,20,6,18] },
  { pos:5,  fn:'Sébastien',  ln:'OGIER',         m:'toyota',  flag:'fr', photo:'assets/ogier-2026-1x1.avif',   cat:'WRC',  total:90,  r:[18,'—',8,'—',32,9,23] },
  { pos:6,  fn:'Adrien',     ln:'FOURMAUX',      m:'hyundai', flag:'fr', photo:null, cat:'WRC',  total:89,  r:[17,11,19,2,10,20,10] },
  { pos:7,  fn:'Thierry',    ln:'NEUVILLE',      m:'hyundai', flag:'be', photo:null, cat:'WRC',  total:73,  r:[10,11,4,'R',10,30,8] },
  { pos:8,  fn:'Hayden',     ln:'PADDON',        m:'hyundai', flag:'nz', photo:null, cat:'WRC2', total:21,  r:[0,'—','—',15,'—','—',6] },
  { pos:9,  fn:'Esapekka',   ln:'LAPPI',         m:'hyundai', flag:'fi', photo:null, cat:'WRC',  total:21,  r:['—',9,12,'—','—','—','—'] },
  { pos:10, fn:'Yohan',      ln:'ROSSEL',        m:'lancia',  flag:'fr', photo:null, cat:'WRC2', total:20,  r:[6,'—','—',12,2,'—','—'] },
  { pos:11, fn:'Léo',        ln:'ROSSEL',        m:'citroen', flag:'fr', photo:null, cat:'WRC2', total:18,  r:[8,'—','—',10,'—','—','—'] },
  { pos:12, fn:'Jon',        ln:'ARMSTRONG',     m:'ford',    flag:'gb', photo:null, cat:'WRC2', total:14,  r:['R',4,0,6,0,'R',4] },
  { pos:13, fn:'Robert',     ln:'VIRVES',        m:'skoda',   flag:'ee', photo:null, cat:'WRC2', total:10,  r:['—','—',10,'—','—','—','—'] },
  { pos:14, fn:'Nikolay',    ln:'GRYAZIN',       m:'lancia',  flag:'ru', photo:null, cat:'WRC2', total:10,  r:['—','—','—',8,'—','—',2] },
  { pos:15, fn:'Daniel',     ln:'SORDO',         m:'hyundai', flag:'es', photo:null, cat:'WRC',  total:10,  r:['—','—','—','—',6,4,'—'] },
  { pos:16, fn:'Gus',        ln:'GREENSMITH',    m:'toyota',  flag:'gb', photo:null, cat:'WRC2', total:8,   r:['—','—',8,'—','—','—','—'] },
  { pos:17, fn:'Alejandro',  ln:'CACHÓN',        m:'toyota',  flag:'es', photo:null, cat:'WRC2', total:7,   r:['—','—','—',6,1,'—','—'] },
  { pos:18, fn:'Joshua',     ln:'MCERLEAN',      m:'ford',    flag:'gb', photo:null, cat:'WRC2', total:7,   r:['R',2,'R',0,4,0,1] },
  { pos:19, fn:'Fabrizio',   ln:'ZALDIVAR',      m:'skoda',   flag:'py', photo:null, cat:'WRC2', total:6,   r:['—','—',6,'—','—','—','—'] },
  { pos:20, fn:'Roberto',    ln:'DAPRÀ',         m:'skoda',   flag:'it', photo:null, cat:'WRC2', total:6,   r:[4,'—','—',2,'—','—','—'] },
  { pos:21, fn:'Roope',      ln:'KORHONEN',      m:'toyota',  flag:'fi', photo:null, cat:'WRC2', total:5,   r:['—',1,'—',4,'—','—','—'] },
  { pos:22, fn:'Andreas',    ln:'MIKKELSEN',     m:'skoda',   flag:'no', photo:null, cat:'WRC2', total:4,   r:['—','—',4,'—','—','—','—'] },
  { pos:23, fn:'Mārtinš',    ln:'SESKS',         m:'ford',    flag:'lv', photo:null, cat:'WRC2', total:2,   r:['—',0,'—','—','—',2,'—'] },
  { pos:24, fn:'Diego',      ln:'DOMÍNGUEZ',     m:'toyota',  flag:'py', photo:null, cat:'WRC2', total:2,   r:['—','—',2,'—','—','—','—'] },
  { pos:25, fn:'Arthur',     ln:'PELAMOURGUES',  m:'hyundai', flag:'fr', photo:null, cat:'WRC2', total:2,   r:[2,'—','—','—','—','—','—'] },
  { pos:26, fn:'Matteo',     ln:'FONTANA',       m:'ford',    flag:'it', photo:null, cat:'WRC2', total:2,   r:[2,'—','—','—','—','—','—'] },
  { pos:27, fn:'Eric',       ln:'CAMILLI',       m:'skoda',   flag:'fr', photo:null, cat:'WRC2', total:1,   r:[1,'—','—','—','—','—','—'] },
  { pos:28, fn:'Emil',       ln:'LINDHOLM',      m:'skoda',   flag:'fi', photo:null, cat:'WRC2', total:1,   r:['—','—','—',1,'—','—','—'] },
  { pos:29, fn:'Teemu',      ln:'SUNINEN',       m:'toyota',  flag:'fi', photo:null, cat:'WRC2', total:1,   r:['—','—','—','—','—',1,'—'] },
  { pos:30, fn:'Grégoire',   ln:'MUNSTER',       m:'ford',    flag:'lu', photo:null, cat:'WRC2', total:0,   r:['R','—','—','—','—','—','—'] },
  { pos:31, fn:'Romet',      ln:'JÜRGENSON',     m:'ford',    flag:'ee', photo:null, cat:'WRC2', total:0,   r:['—','—','—','—','—','—','—'] },
  { pos:32, fn:'Lorenzo',    ln:'BERTELLI',      m:'toyota',  flag:'it', photo:null, cat:'WRC2', total:0,   r:['—',0,'—','—','—','—','—'] },
];

const LEADER_PTS = 151;

function rdCls(v) {
    if (v === 'R')  return 'cls-r cls-r-ret';
    if (v === '—')  return 'cls-r cls-r-none';
    if (v >= 25)    return 'cls-r cls-r-high';
    if (v >= 10)    return 'cls-r cls-r-med';
    if (v >= 1)     return 'cls-r cls-r-low';
    return 'cls-r cls-r-zero';
}

function renderClasificacion(filter = 'all') {
    const list = document.getElementById('cls-list');
    if (!list) return;

    const data = filter === 'all' ? STANDINGS_DATA
                : STANDINGS_DATA.filter(d => d.cat === filter);

    const photoCell = d => d.photo
        ? `<img src="${d.photo}" class="cls-avatar" alt="${d.fn} ${d.ln}" loading="lazy">`
        : `<span class="cls-initials">${d.fn[0]}${d.ln[0]}</span>`;

    list.innerHTML = `
        <div class="cls-table-wrap">
            <table class="cls-table">
                <thead>
                    <tr>
                        <th class="cls-th-pos">POS</th>
                        <th class="cls-th-driver">PILOTO</th>
                        <th class="cls-th-team">EQUIPO</th>
                        <th class="cls-th-pts">PTS</th>
                        <th class="cls-th-bar"></th>
                        <th>R1</th><th>R2</th><th>R3</th><th>R4</th><th>R5</th><th>R6</th><th>R7</th>
                        <th class="cls-th-fut">R8</th><th class="cls-th-fut">R9</th>
                        <th class="cls-th-fut">R10</th><th class="cls-th-fut">R11</th>
                        <th class="cls-th-fut">R12</th><th class="cls-th-fut">R13</th>
                        <th class="cls-th-fut">R14</th>
                    </tr>
                </thead>
                <tbody>
                    ${data.map(d => `
                    <tr class="cls-row">
                        <td class="cls-td-pos">
                            <span class="cls-pos ${d.pos<=3?'cls-pos-gold':d.pos<=7?'cls-pos-bright':''}">${d.pos}</span>
                        </td>
                        <td class="cls-td-driver">
                            <div class="cls-driver-wrap">
                                <div class="cls-photo-flag">
                                    <div class="cls-photo-wrap">${photoCell(d)}</div>
                                    <img class="cls-flag" src="https://flagcdn.com/w20/${d.flag}.png" width="20" height="14" alt="${d.flag}" loading="lazy">
                                </div>
                                <div class="cls-name">
                                    <span class="cls-fn">${d.fn}</span>
                                    <span class="cls-ln">${d.ln}</span>
                                </div>
                            </div>
                        </td>
                        <td class="cls-td-team">
                            <span class="sm-chip sm-chip-${d.m}">${d.m.toUpperCase()}</span>
                        </td>
                        <td class="cls-td-pts">
                            <span class="cls-pts ${d.pos===1?'cls-pts-gold':''}">${d.total}</span>
                        </td>
                        <td class="cls-td-bar">
                            <div class="cls-bar-bg">
                                <div class="cls-bar-fill sm-chip-${d.m}-bar" style="width:${Math.round(d.total/LEADER_PTS*100)}%"></div>
                            </div>
                        </td>
                        ${d.r.map(v=>`<td><span class="${rdCls(v)}">${v}</span></td>`).join('')}
                        <td class="cls-r cls-r-none">—</td><td class="cls-r cls-r-none">—</td>
                        <td class="cls-r cls-r-none">—</td><td class="cls-r cls-r-none">—</td>
                        <td class="cls-r cls-r-none">—</td><td class="cls-r cls-r-none">—</td>
                        <td class="cls-r cls-r-none">—</td>
                    </tr>`).join('')}
                </tbody>
            </table>
        </div>`;

    // Filtros
    list.querySelectorAll('.cls-btn')?.forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.cls-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderClasificacion(btn.dataset.cat);
        });
    });
}

// "Ver clasificación completa" navega al tab
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.std-viewall')?.addEventListener('click', e => {
        e.preventDefault();
        const tab = document.querySelector('[data-tab="clasificacion"]');
        if (tab) {
            tab.click();
            document.querySelector('.nav-tabs')?.scrollIntoView({ behavior:'smooth', block:'start' });
        }
    });
});

// ================================================
// DEMO DATA
// ================================================
function demoEquipos() {
    return [
        { id:1, nombre:'Toyota Gazoo Racing WRT', nacionalidad:'Japón',           marca:'Toyota',  anioFundacion:2015 },
        { id:2, nombre:'Hyundai Shell Mobis WRT', nacionalidad:'Corea del Sur',   marca:'Hyundai', anioFundacion:2013 },
        { id:3, nombre:'M-Sport Ford WRT',        nacionalidad:'Reino Unido',     marca:'Ford',    anioFundacion:1997 },
        { id:4, nombre:'Citroën Racing',          nacionalidad:'Francia',         marca:'Citroën', anioFundacion:2003 },
        { id:5, nombre:'Lancia Corse HF',         nacionalidad:'Italia',          marca:'Lancia',  anioFundacion:2024 },
        { id:6, nombre:'Škoda Motorsport',        nacionalidad:'República Checa', marca:'Škoda',   anioFundacion:1999 },
    ];
}

function demoPilotos() {
    return [
        { id:1, nombre:'Thierry Neuville',  dorsal:1,  nacionalidad:'Bélgica',  categoria:'WRC',  activo:true,  equipo:{nombre:'Hyundai Shell Mobis WRT'} },
        { id:2, nombre:'Ott Tänak',         dorsal:2,  nacionalidad:'Estonia',  categoria:'WRC',  activo:true,  equipo:{nombre:'Hyundai Shell Mobis WRT'} },
        { id:3, nombre:'Sébastien Ogier',   dorsal:3,  nacionalidad:'Francia',  categoria:'WRC',  activo:true,  equipo:{nombre:'Toyota Gazoo Racing WRT'} },
        { id:4, nombre:'Kalle Rovanperä',   dorsal:4,  nacionalidad:'Finlandia',categoria:'WRC',  activo:true,  equipo:{nombre:'Toyota Gazoo Racing WRT'} },
        { id:9, nombre:'Dani Sordo',        dorsal:9,  nacionalidad:'España',   categoria:'WRC',  activo:true,  equipo:{nombre:'Hyundai Shell Mobis WRT'} },
        { id:15,nombre:'Luis Monzón',       dorsal:15, nacionalidad:'España',   categoria:'WRC2', activo:true,  equipo:{nombre:'Citroën Total WRT'} },
        { id:22,nombre:'Andrea Crugnola',   dorsal:22, nacionalidad:'Italia',   categoria:'WRC2', activo:true,  equipo:{nombre:'M-Sport Ford World Rally Team'} },
        { id:55,nombre:'Marco Tempestini',  dorsal:55, nacionalidad:'Rumanía',  categoria:'JWRC', activo:false, equipo:{nombre:'M-Sport Ford World Rally Team'} },
    ];
}

function demoEtapas() {
    return [
        { id:1, numero:1, nombre:'Arafo',      fecha:'2026-03-15', descripcion:'Tramos rápidos con curvas técnicas en la zona norte de Tenerife. Asfalto abierto y vistas al Teide.',                        isla:'Tenerife',    km:37.7, tramos:[{nombre:'Arafo — La Cuesta',            km:15.2, dificultad:'ALTA'}, {nombre:'La Esperanza — El Portillo', km:22.5, dificultad:'MEDIA'}] },
        { id:2, numero:2, nombre:'Güimar',     fecha:'2026-03-16', descripcion:'Superficie mixta con tramos de tierra y asfalto que atraviesan el dramático barranco de Güimar.',                            isla:'Tenerife',    km:24.9, tramos:[{nombre:'Güimar — Fasnia',              km:12.4, dificultad:'MEDIA'}, {nombre:'Fasnia — Arico',                km:12.5, dificultad:'BAJA'}] },
        { id:4, numero:4, nombre:'Tejeda',     fecha:'2026-03-18', descripcion:'Alta montaña con cambios de altitud pronunciados. Roca volcánica y espectaculares vistas al Roque Nublo.',                  isla:'Gran Canaria',km:40.4, tramos:[{nombre:'Tejeda — Artenara',             km:17.9, dificultad:'ALTA'}, {nombre:'Artenara — Cruz de Tejeda',  km:22.5, dificultad:'MEDIA'}] },
        { id:5, numero:5, nombre:'Maspalomas', fecha:'2026-03-19', descripcion:'Tramos costeros entre dunas con arena y gravilla. Uno de los finales más espectaculares del campeonato.',                    isla:'Gran Canaria',km:27.0, tramos:[{nombre:'Maspalomas — Meloneras',       km:10.5, dificultad:'BAJA'},  {nombre:'Playa del Inglés — S.Agustín',km:16.5, dificultad:'MEDIA'}] },
        { id:7, numero:7, nombre:'Haría',      fecha:'2026-03-21', descripcion:'Paisaje volcánico único en el Valle de Mil Palmeras. Tramos estrechos a través del Parque Nacional de Timanfaya.',         isla:'Lanzarote',   km:25.0, tramos:[{nombre:'Haría — Orzola',               km:13.8, dificultad:'MEDIA'}, {nombre:'Timanfaya — Yaiza',           km:11.2, dificultad:'ALTA'}] },
    ];
}

function demoTramos() {
    return [
        { id:1,  nombre:'Arafo - La Cuesta',          distanciaKm:15.20, dificultad:'ALTA',  superficie:'ASFALTO', etapa:{nombre:'Etapa 1 — Arafo'} },
        { id:2,  nombre:'La Esperanza - El Portillo', distanciaKm:22.50, dificultad:'MEDIA', superficie:'ASFALTO', etapa:{nombre:'Etapa 1 — Arafo'} },
        { id:4,  nombre:'Güimar - Fasnia',            distanciaKm:12.40, dificultad:'MEDIA', superficie:'MIXTA',   etapa:{nombre:'Etapa 2 — Güimar'} },
        { id:9,  nombre:'Tejeda - Artenara',          distanciaKm:17.90, dificultad:'ALTA',  superficie:'ASFALTO', etapa:{nombre:'Etapa 4 — Tejeda'} },
        { id:13, nombre:'Maspalomas - Meloneras',     distanciaKm:10.50, dificultad:'BAJA',  superficie:'GRAVA',   etapa:{nombre:'Etapa 5 — Maspalomas'} },
        { id:17, nombre:'Haría - Orzola',             distanciaKm:13.80, dificultad:'MEDIA', superficie:'ASFALTO', etapa:{nombre:'Etapa 7 — Haría'} },
    ];
}

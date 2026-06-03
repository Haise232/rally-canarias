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
});

// ================================================
// SECTION LOADER
// ================================================
function cargarSeccion(id) {
    switch (id) {
        case 'equipos': cargarEquipos(); break;
        case 'pilotos': cargarPilotos(); break;
        case 'etapas':  cargarEtapas();  break;
        case 'tramos':  cargarTramos();  break;
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

    grid.innerHTML = equipos.map(e => `
        <div class="card">
            <div class="card-top">
                <div class="card-icon">🏎️</div>
                <div class="card-meta">
                    <span class="card-country">${x(e.nacionalidad)}</span>
                </div>
            </div>
            <div class="card-body">
                <div class="card-name">${x(e.nombre)}</div>
                <div class="card-sub">${x(e.marca || 'Sin marca')}</div>
                <div class="card-rows">
                    <div class="card-row">
                        <span class="row-k">País</span>
                        <span class="row-v">${x(e.nacionalidad || 'N/A')}</span>
                    </div>
                    <div class="card-row">
                        <span class="row-k">Marca</span>
                        <span class="row-v">${x(e.marca || 'N/A')}</span>
                    </div>
                    <div class="card-row">
                        <span class="row-k">Fundación</span>
                        <span class="row-v">${e.anioFundacion || 'N/A'}</span>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
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

function renderEtapas(etapas) {
    const tl = document.getElementById('etapas-timeline');
    if (!etapas?.length) { empty(tl, '🗺️', 'Sin etapas registradas'); return; }

    tl.innerHTML = etapas.map(e => `
        <div class="timeline-item">
            <div class="tl-top">
                <span class="tl-name">${x(e.nombre)}</span>
                <span class="tl-date">${fecha(e.fecha)}</span>
            </div>
            <p class="tl-desc">${x(e.descripcion || '')}</p>
            <span class="tl-isla">🏝 ${x(e.isla || 'Islas Canarias')}</span>
        </div>
    `).join('');
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

    grid.innerHTML = tramos.map(t => {
        const dif = (t.dificultad || 'MEDIA').toLowerCase();
        return `
        <div class="card">
            <div class="card-top">
                <span class="tramo-dist">${t.distanciaKm}<span class="tramo-unit"> km</span></span>
                <div class="card-meta">
                    <span class="card-country">${x(t.superficie || '')}</span>
                </div>
            </div>
            <div class="card-body">
                <div class="card-name">${x(t.nombre)}</div>
                <div class="diff-wrap">
                    <div class="diff-header">
                        <span class="diff-key">Dificultad</span>
                        <span class="diff-val ${dif}">${x(t.dificultad || 'N/A')}</span>
                    </div>
                    <div class="diff-track">
                        <div class="diff-fill ${dif}"></div>
                    </div>
                </div>
                <div class="card-rows">
                    <div class="card-row">
                        <span class="row-k">Superficie</span>
                        <span class="row-v">${x(t.superficie || 'N/A')}</span>
                    </div>
                    <div class="card-row">
                        <span class="row-k">Etapa</span>
                        <span class="row-v">${x(t.etapa?.nombre || 'N/A')}</span>
                    </div>
                </div>
            </div>
        </div>
    `}).join('');
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
// DEMO DATA
// ================================================
function demoEquipos() {
    return [
        { id:1, nombre:'Toyota Gazoo Racing WRT',      nacionalidad:'Japón',          marca:'Toyota',  anioFundacion:2015 },
        { id:2, nombre:'Hyundai Shell Mobis WRT',       nacionalidad:'Corea del Sur',  marca:'Hyundai', anioFundacion:2013 },
        { id:3, nombre:'M-Sport Ford World Rally Team', nacionalidad:'Reino Unido',    marca:'Ford',    anioFundacion:1997 },
        { id:4, nombre:'Citroën Total WRT',             nacionalidad:'Francia',        marca:'Citroën', anioFundacion:2003 },
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
        { id:1, nombre:'Etapa 1 — Arafo',       fecha:'2026-03-15', descripcion:'Tramos rápidos con curvas técnicas en la zona norte de Tenerife. Asfalto abierto y vistas al Teide.',         isla:'Tenerife' },
        { id:2, nombre:'Etapa 2 — Güimar',      fecha:'2026-03-16', descripcion:'Superficie mixta con tramos de tierra y asfalto que atraviesan el barranco de Güimar.',                       isla:'Tenerife' },
        { id:4, nombre:'Etapa 4 — Tejeda',      fecha:'2026-03-18', descripcion:'Alta montaña con cambios de altitud pronunciados. Roca volcánica y vistas al Roque Nublo.',                  isla:'Gran Canaria' },
        { id:5, nombre:'Etapa 5 — Maspalomas',  fecha:'2026-03-19', descripcion:'Tramos costeros entre dunas con arena y gravilla. Uno de los finales más espectaculares del campeonato.',     isla:'Gran Canaria' },
        { id:7, nombre:'Etapa 7 — Haría',       fecha:'2026-03-21', descripcion:'Paisaje volcánico único en el Valle de Mil Palmeras. Tramos estrechos a través del Parque Nacional de Timanfaya.', isla:'Lanzarote' },
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

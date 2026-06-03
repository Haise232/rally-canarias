/**
 * Rally Islas Canarias 2026 - Frontend Dashboard
 * Consumo de API REST con fetch
 */

// ============================================
// CONFIGURACIÓN
// ============================================
const API_URL = ''; // Misma URL (Spring Boot sirve static y API)

// ============================================
// MANEJO DE TABS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const sections = document.querySelectorAll('.section');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;

            // Desactivar todos los tabs y secciones
            tabButtons.forEach(b => b.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));

            // Activar el tab y sección seleccionados
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');

            // Cargar datos de la sección
            cargarSeccion(tabId);
        });
    });

    // Cargar equipos por defecto
    cargarEquipos();
});

// ============================================
// CARGAR SECCIÓN
// ============================================
function cargarSeccion(tabId) {
    switch(tabId) {
        case 'equipos':
            cargarEquipos();
            break;
        case 'pilotos':
            cargarPilotos();
            break;
        case 'etapas':
            cargarEtapas();
            break;
        case 'tramos':
            cargarTramos();
            break;
    }
}

// ============================================
// EQUIPOS
// ============================================
async function cargarEquipos() {
    const grid = document.getElementById('equipos-grid');
    mostrarLoading(grid);

    try {
        const response = await fetch(`${API_URL}/api/equipos`);
        if (!response.ok) throw new Error('Error al cargar equipos');
        const equipos = await response.json();
        renderizarEquipos(equipos);
    } catch (error) {
        console.warn('API no disponible, usando datos demo:', error);
        renderizarEquipos(getEquiposDemo());
    }
}

function renderizarEquipos(equipos) {
    const grid = document.getElementById('equipos-grid');
    
    if (!equipos || equipos.length === 0) {
        mostrarEmptyState(grid, '🏁', 'No hay equipos registrados');
        return;
    }

    grid.innerHTML = equipos.map(equipo => `
        <div class="card">
            <div class="card-header">
                <span class="card-icon">🏎️</span>
                <div>
                    <div class="card-title">${escapeHtml(equipo.nombre)}</div>
                    <div class="card-subtitle">${escapeHtml(equipo.marca || 'Sin marca')}</div>
                </div>
            </div>
            <div class="card-info">
                <div class="info-row">
                    <span class="info-label">🌍 País</span>
                    <span class="info-value">${escapeHtml(equipo.nacionalidad || 'N/A')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">🏭 Marca</span>
                    <span class="info-value">${escapeHtml(equipo.marca || 'N/A')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📅 Fundación</span>
                    <span class="info-value">${equipo.anioFundacion || 'N/A'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// PILOTOS
// ============================================
async function cargarPilotos() {
    const tbody = document.getElementById('pilotos-tbody');
    mostrarLoading(document.querySelector('.table-container'));

    try {
        const response = await fetch(`${API_URL}/api/pilotos`);
        if (!response.ok) throw new Error('Error al cargar pilotos');
        const pilotos = await response.json();
        renderizarPilotos(pilotos);
    } catch (error) {
        console.warn('API no disponible, usando datos demo:', error);
        renderizarPilotos(getPilotosDemo());
    }
}

function renderizarPilotos(pilotos) {
    const tbody = document.getElementById('pilotos-tbody');
    
    if (!pilotos || pilotos.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: var(--text-muted);">No hay pilotos registrados</td></tr>`;
        return;
    }

    tbody.innerHTML = pilotos.map(piloto => `
        <tr>
            <td><span class="dorsal">${piloto.dorsal}</span></td>
            <td>${escapeHtml(piloto.nombre)}</td>
            <td>${escapeHtml(piloto.nacionalidad || 'N/A')}</td>
            <td><span class="card-badge ${getCategoriaClass(piloto.categoria)}">${escapeHtml(piloto.categoria || 'N/A')}</span></td>
            <td>${escapeHtml(piloto.equipo?.nombre || 'Sin equipo')}</td>
            <td class="${piloto.activo ? 'estado-activo' : 'estado-inactivo'}">
                ${piloto.activo ? '🟢 Activo' : '🔴 Inactivo'}
            </td>
        </tr>
    `).join('');
}

// ============================================
// ETAPAS
// ============================================
async function cargarEtapas() {
    const timeline = document.getElementById('etapas-timeline');
    mostrarLoading(timeline);

    try {
        const response = await fetch(`${API_URL}/api/etapas`);
        if (!response.ok) throw new Error('Error al cargar etapas');
        const etapas = await response.json();
        renderizarEtapas(etapas);
    } catch (error) {
        console.warn('API no disponible, usando datos demo:', error);
        renderizarEtapas(getEtapasDemo());
    }
}

function renderizarEtapas(etapas) {
    const timeline = document.getElementById('etapas-timeline');
    
    if (!etapas || etapas.length === 0) {
        mostrarEmptyState(timeline, '🗺️', 'No hay etapas registradas');
        return;
    }

    timeline.innerHTML = etapas.map(etapa => `
        <div class="timeline-item">
            <div class="timeline-header">
                <span class="timeline-title">${escapeHtml(etapa.nombre)}</span>
                <span class="timeline-date">${formatearFecha(etapa.fecha)}</span>
            </div>
            <p style="color: var(--text-muted); margin-bottom: 8px;">${escapeHtml(etapa.descripcion || '')}</p>
            <span class="timeline-isla">🏝️ ${escapeHtml(etapa.isla || 'Islas Canarias')}</span>
        </div>
    `).join('');
}

// ============================================
// TRAMOS
// ============================================
async function cargarTramos() {
    const grid = document.getElementById('tramos-grid');
    mostrarLoading(grid);

    try {
        const response = await fetch(`${API_URL}/api/tramos`);
        if (!response.ok) throw new Error('Error al cargar tramos');
        const tramos = await response.json();
        renderizarTramos(tramos);
    } catch (error) {
        console.warn('API no disponible, usando datos demo:', error);
        renderizarTramos(getTramosDemo());
    }
}

function renderizarTramos(tramos) {
    const grid = document.getElementById('tramos-grid');
    
    if (!tramos || tramos.length === 0) {
        mostrarEmptyState(grid, '🛣️', 'No hay tramos registrados');
        return;
    }

    grid.innerHTML = tramos.map(tramo => `
        <div class="card">
            <div class="card-header">
                <span class="card-icon">🛣️</span>
                <div>
                    <div class="card-title">${escapeHtml(tramo.nombre)}</div>
                    <div class="card-subtitle">${tramo.distanciaKm} km</div>
                </div>
            </div>
            <div class="card-info">
                <div class="info-row">
                    <span class="info-label">📏 Distancia</span>
                    <span class="info-value">${tramo.distanciaKm} km</span>
                </div>
                <div class="info-row">
                    <span class="info-label">⚡ Dificultad</span>
                    <span class="info-value">${escapeHtml(tramo.dificultad || 'N/A')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">🛤️ Superficie</span>
                    <span class="info-value">${escapeHtml(tramo.superficie || 'N/A')}</span>
                </div>
                <div class="info-row">
                    <span class="info-label">📍 Etapa</span>
                    <span class="info-value">${escapeHtml(tramo.etapa?.nombre || 'N/A')}</span>
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// UTILIDADES
// ============================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getCategoriaClass(categoria) {
    if (!categoria) return '';
    switch(categoria.toUpperCase()) {
        case 'WRC': return 'badge-wrc';
        case 'WRC2': return 'badge-wrc2';
        case 'JWRC': return 'badge-jwrc';
        default: return '';
    }
}

function formatearFecha(fechaStr) {
    if (!fechaStr) return 'Fecha por definir';
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function mostrarLoading(container) {
    container.innerHTML = `
        <div class="loading">
            <div class="loading-spinner"></div>
            <p>Cargando datos...</p>
        </div>
    `;
}

function mostrarEmptyState(container, icon, mensaje) {
    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">${icon}</div>
            <p>${mensaje}</p>
        </div>
    `;
}

// ============================================
// DATOS DEMO (Fallback cuando la API no responde)
// ============================================
function getEquiposDemo() {
    return [
        { id: 1, nombre: 'Toyota Gazoo Racing', nacionalidad: 'Japón', marca: 'Toyota', anioFundacion: 2015 },
        { id: 2, nombre: 'Hyundai Shell Mobis WRT', nacionalidad: 'Corea del Sur', marca: 'Hyundai', anioFundacion: 2013 },
        { id: 3, nombre: 'M-Sport Ford WRT', nacionalidad: 'Reino Unido', marca: 'Ford', anioFundacion: 1997 },
        { id: 4, nombre: 'Citroën Racing', nacionalidad: 'Francia', marca: 'Citroën', anioFundacion: 2003 }
    ];
}

function getPilotosDemo() {
    return [
        { id: 1, nombre: 'Thierry Neuville', dorsal: 1, nacionalidad: 'Bélgica', categoria: 'WRC', activo: true, equipo: { nombre: 'Hyundai Shell Mobis WRT' } },
        { id: 2, nombre: 'Ott Tänak', dorsal: 2, nacionalidad: 'Estonia', categoria: 'WRC', activo: true, equipo: { nombre: 'Hyundai Shell Mobis WRT' } },
        { id: 3, nombre: 'Sébastien Ogier', dorsal: 3, nacionalidad: 'Francia', categoria: 'WRC', activo: true, equipo: { nombre: 'Toyota Gazoo Racing' } },
        { id: 4, nombre: 'Kalle Rovanperä', dorsal: 4, nacionalidad: 'Finlandia', categoria: 'WRC', activo: true, equipo: { nombre: 'Toyota Gazoo Racing' } },
        { id: 9, nombre: 'Dani Sordo', dorsal: 9, nacionalidad: 'España', categoria: 'WRC', activo: true, equipo: { nombre: 'Hyundai Shell Mobis WRT' } },
        { id: 15, nombre: 'Luis Monzón', dorsal: 15, nacionalidad: 'España', categoria: 'WRC2', activo: true, equipo: { nombre: 'Citroën Racing' } }
    ];
}

function getEtapasDemo() {
    return [
        { id: 1, nombre: 'Etapa 1: Arafo', fecha: '2026-03-15', descripcion: 'Tramos rápidos con curvas técnicas en la zona norte de Tenerife', isla: 'Tenerife' },
        { id: 2, nombre: 'Etapa 2: Güimar', fecha: '2026-03-16', descripcion: 'Superficie mixta con tramos de tierra y asfalto', isla: 'Tenerife' },
        { id: 4, nombre: 'Etapa 4: Tejeda', fecha: '2026-03-18', descripcion: 'Alta montaña con cambios de altitud pronunciados', isla: 'Gran Canaria' },
        { id: 5, nombre: 'Etapa 5: Maspalomas', fecha: '2026-03-19', descripcion: 'Tramos costeros con arena y gravilla', isla: 'Gran Canaria' },
        { id: 7, nombre: 'Etapa 7: Haría', fecha: '2026-03-21', descripcion: 'Paisaje volcánico único en Lanzarote', isla: 'Lanzarote' }
    ];
}

function getTramosDemo() {
    return [
        { id: 1, nombre: 'Tramo Arafo - La Cuesta', distanciaKm: 15.20, dificultad: 'ALTA', superficie: 'ASFALTO', etapa: { nombre: 'Etapa 1: Arafo' } },
        { id: 2, nombre: 'Tramo La Esperanza - El Portillo', distanciaKm: 22.50, dificultad: 'MEDIA', superficie: 'ASFALTO', etapa: { nombre: 'Etapa 1: Arafo' } },
        { id: 4, nombre: 'Tramo Güimar - Fasnia', distanciaKm: 12.40, dificultad: 'MEDIA', superficie: 'MIXTA', etapa: { nombre: 'Etapa 2: Güimar' } },
        { id: 9, nombre: 'Tramo Tejeda - Artenara', distanciaKm: 17.90, dificultad: 'ALTA', superficie: 'ASFALTO', etapa: { nombre: 'Etapa 4: Tejeda' } },
        { id: 13, nombre: 'Tramo Maspalomas - Meloneras', distanciaKm: 10.50, dificultad: 'BAJA', superficie: 'GRAVA', etapa: { nombre: 'Etapa 5: Maspalomas' } },
        { id: 17, nombre: 'Tramo Haría - Orzola', distanciaKm: 13.80, dificultad: 'MEDIA', superficie: 'ASFALTO', etapa: { nombre: 'Etapa 7: Haría' } }
    ];
}

// ============================================
// BÚSQUEDA EN TIEMPO REAL (solo demo local)
// ============================================
document.getElementById('buscar-equipo')?.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase();
    // Filtrado local de equipos demo (cuando la API esté lista, se hará fetch)
});

document.getElementById('buscar-piloto')?.addEventListener('input', (e) => {
    const termino = e.target.value.toLowerCase();
    // Filtrado local de pilotos demo
});

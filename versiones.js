// ---------- SISTEMA DE VERSIONES PROFESIONAL ----------
const VERSION_HISTORY = {
    actual: "2.0.1",
    historial: [
        {
            version: "2.0.1",
            nombre: "Beta",
            fecha: "2026-02-15",
            tipo: "patch",
            cambios: [
                "🔔 Sistema de notificaciones de versiones (badge rojo)",
                "🐛 Corrección: Modal de versiones ya no interfiere con el juego",
                "🐛 Corrección: Ya no se suman puntos extra al cerrar versiones"
            ]
        },
        {
            version: "2.0.0",
            nombre: "Beta",
            fecha: "2026-02-15",
            tipo: "major",
            cambios: [
                "🔄 Sistema de cambiar palabra durante el juego",
                "🎮 Tutorial interactivo completo (22 pasos)",
                "🐺 Múltiples lobos con lógica mejorada",
                "🎨 Rediseño completo con glass morphism",
                "📊 Estadísticas con medallas y ranking",
                "🎵 Música ambiental y efectos de sonido",
                "🐑 Orden aleatorio de preguntas",
                "🤝 Manejo de empates en votación"
            ]
        },
        {
            version: "1.5.0",
            nombre: "Alpha",
            fecha: "2026-02-01",
            tipo: "minor",
            cambios: [
                "🎵 Música ambiental añadida",
                "🔊 Efectos de sonido para acciones",
                "🐑 Sistema de votación mejorado",
                "📱 Diseño responsive para móviles"
            ]
        },
        {
            version: "1.0.0",
            nombre: "Alpha",
            fecha: "2026-01-15",
            tipo: "major",
            cambios: [
                "🎮 Lanzamiento inicial del juego",
                "🐺 Lobo vs Ovejas (1 lobo)",
                "📋 Sistema básico de roles",
                "🗳️ Votación simple",
                "📊 Estadísticas básicas"
            ]
        }
    ]
};

const VERSION_ACTUAL = VERSION_HISTORY.actual;

// ---------- SISTEMA DE NOTIFICACIONES DE VERSIONES ----------
let notificacionesVersion = {
    ultimaVersionVista: localStorage.getItem('ultima_version_vista') || "1.0.0",
    notificacionesPendientes: 0
};

function calcularNotificacionesPendientes() {
    let versionesNoLeidas = VERSION_HISTORY.historial.filter(v => 
        esVersionMayor(v.version, notificacionesVersion.ultimaVersionVista)
    );
    notificacionesVersion.notificacionesPendientes = versionesNoLeidas.length;
    return notificacionesVersion.notificacionesPendientes;
}

function esVersionMayor(v1, v2) {
    let v1parts = v1.split('.').map(Number);
    let v2parts = v2.split('.').map(Number);
    
    for (let i = 0; i < 3; i++) {
        if (v1parts[i] > v2parts[i]) return true;
        if (v1parts[i] < v2parts[i]) return false;
    }
    return false;
}

function marcarVersionesComoLeidas() {
    notificacionesVersion.ultimaVersionVista = VERSION_ACTUAL;
    notificacionesVersion.notificacionesPendientes = 0;
    localStorage.setItem('ultima_version_vista', VERSION_ACTUAL);
    
    if (typeof currentScreen !== 'undefined' && currentScreen === 'menu') {
        actualizarBadgeVersion();
    }
}

function actualizarBadgeVersion() {
    let badge = document.getElementById('versionBadge');
    let pendientes = calcularNotificacionesPendientes();
    
    if (badge) {
        if (pendientes > 0) {
            badge.style.display = 'flex';
            badge.textContent = pendientes > 9 ? '9+' : pendientes;
        } else {
            badge.style.display = 'none';
        }
    }
}

// ---------- FUNCIONES PARA MODAL DE VERSIONES (INDEPENDIENTE) ----------
function mostrarVersionModal(titulo, contenido) {
    if (typeof versionModalTitle !== 'undefined' && versionModalTitle) {
        versionModalTitle.textContent = titulo;
        versionModalBody.innerHTML = contenido;
        versionModal.classList.remove('hidden');
    }
}

function cerrarVersionModal() {
    if (typeof versionModal !== 'undefined' && versionModal) {
        versionModal.classList.add('hidden');
    }
}

// ---------- MOSTRAR VERSIÓN ACTUAL ----------
function mostrarVersionActual() {
    let versionActual = VERSION_HISTORY.historial.find(v => v.version === VERSION_ACTUAL);
    
    let contenido = `
        <div style="text-align: center; padding: 15px;">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 15px; padding: 15px; margin-bottom: 15px;">
                <p style="color: white; font-size: 1.2rem;">🏷️ v${versionActual.version}</p>
                <p style="color: #ffd700;">${versionActual.fecha}</p>
                <p style="color: white; margin-top: 5px; background: rgba(255,255,255,0.2); border-radius: 20px; padding: 5px 10px; display: inline-block;">
                    ${versionActual.tipo === 'major' ? '🌟 Gran Actualización' : (versionActual.tipo === 'minor' ? '✨ Mejoras' : '🔧 Correcciones')}
                </p>
            </div>
            
            <p style="color: white; margin-bottom: 10px;">📋 Novedades:</p>
            <div style="color: #a0a0a0; text-align: left; background: rgba(0,0,0,0.3); border-radius: 15px; padding: 15px; max-height: 200px; overflow-y: auto;">
                ${versionActual.cambios.map(c => `• ${c}`).join('<br>')}
            </div>
            
            <p style="color: #a0a0a0; font-size: 0.8rem; margin-top: 15px;">
                ¡Gracias por jugar!
            </p>
        </div>
    `;
    
    mostrarVersionModal(`📦 Versión ${versionActual.version} ${versionActual.nombre}`, contenido);
    marcarVersionesComoLeidas();
}

// ---------- MOSTRAR CHANGELOG ----------
function mostrarChangelog() {
    let historialHTML = VERSION_HISTORY.historial.map(v => {
        let color = v.tipo === 'major' ? '#ff6b6b' : (v.tipo === 'minor' ? '#ffd700' : '#4CAF50');
        let badge = v.tipo === 'major' ? '🌟' : (v.tipo === 'minor' ? '✨' : '🔧');
        let esNueva = esVersionMayor(v.version, notificacionesVersion.ultimaVersionVista);
        let destacado = esNueva ? 'border: 2px solid #ffd700; box-shadow: 0 0 15px #ffd700;' : '';
        
        let cambios = v.cambios.map(c => `<span style="display: block; margin: 5px 0;">&nbsp;&nbsp;• ${c}</span>`).join('');
        
        return `
            <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 15px; border-left: 4px solid ${color}; ${destacado}">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="color: ${color}; font-weight: bold; font-size: 1.1rem;">
                        ${badge} v${v.version} ${v.nombre} ${esNueva ? '🆕' : ''}
                    </span>
                    <span style="color: #a0a0a0; font-size: 0.8rem;">${v.fecha}</span>
                </div>
                <div style="color: white; font-size: 0.9rem; line-height: 1.5;">${cambios}</div>
            </div>
        `;
    }).join('');

    let contenido = `
        <div style="max-height: 400px; overflow-y: auto; padding: 5px;">
            <div style="text-align: center; margin-bottom: 15px;">
                <span style="background: #667eea; color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.9rem;">
                    Versión actual: v${VERSION_ACTUAL}
                </span>
            </div>
            ${historialHTML}
            <p style="color: #a0a0a0; text-align: center; font-size: 0.8rem; margin-top: 15px;">
                Seguimos mejorando el juego día a día ✨
            </p>
        </div>
    `;
    
    mostrarVersionModal("📋 Historial de Versiones", contenido);
    marcarVersionesComoLeidas();
}

// ---------- VERIFICAR ACTUALIZACIONES ----------
function verificarActualizaciones() {
    let pendientes = calcularNotificacionesPendientes();
    
    if (pendientes > 0) {
        if (typeof mostrarToast !== 'undefined') {
            mostrarToast(`📦 Hay ${pendientes} ${pendientes === 1 ? 'novedad' : 'novedades'} en las versiones`);
        }
        
        setTimeout(() => {
            let versionesNuevas = VERSION_HISTORY.historial
                .filter(v => esVersionMayor(v.version, notificacionesVersion.ultimaVersionVista))
                .map(v => `• v${v.version}: ${v.cambios[0]}...`)
                .join('<br>');
            
            let contenido = `
                <div style="text-align: center; padding: 15px;">
                    <p style="color: #ffd700; margin-bottom: 10px;">Han llegado ${pendientes} ${pendientes === 1 ? 'actualización' : 'actualizaciones'}</p>
                    <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 15px; text-align: left; color: white; max-height: 200px; overflow-y: auto;">
                        ${versionesNuevas}
                    </div>
                    <p style="color: #a0a0a0; margin-top: 15px;">Toca el botón 📋 Historial para ver todos los cambios</p>
                    <div style="display: flex; gap: 10px; margin-top: 15px;">
                        <button class="btn-modern" id="verAhoraBtn" style="flex: 1;">🔍 Ver</button>
                        <button class="btn-modern" id="cerrarNotifBtn" style="flex: 1; background: #2a2a3a;">🔔 Luego</button>
                    </div>
                </div>
            `;
            
            mostrarVersionModal("📦 ¡Novedades disponibles!", contenido);
            
            setTimeout(() => {
                document.getElementById('verAhoraBtn')?.addEventListener('click', () => {
                    if (typeof versionModal !== 'undefined') versionModal.classList.add('hidden');
                    mostrarChangelog();
                });
                
                document.getElementById('cerrarNotifBtn')?.addEventListener('click', () => {
                    if (typeof versionModal !== 'undefined') versionModal.classList.add('hidden');
                });
            }, 100);
        }, 1500);
    }
}
// ---------- TUTORIAL ----------
let tutorialActivo = false;
let tutorialCompletado = localStorage.getItem('tutorial_completado') === 'true';
let pasoActualTutorial = 0;

// ---------- VARIABLES PARA TUTORIAL INTERACTIVO ----------
let tutorialEnCurso = false;
let tutorialEsperandoInteraccion = false;
let tutorialListenersActivos = [];

// ---------- PASOS DEL TUTORIAL INTERACTIVO ----------
const pasosTutorial = [
    {
        id: 1,
        titulo: "🐑 ¡Bienvenido a Ovejas y Lobos!",
        descripcion: "Vamos a aprender a jugar. Te guiaré paso a paso.",
        imagen: "🐺🐑",
        pantalla: "menu",
        accion: "esperar",
        elemento: null
    },
    {
        id: 2,
        titulo: "👥 Agregar un Jugador",
        descripcion: "Primero, necesitamos jugadores. Toca el botón '➕ Agregar Jugador'",
        imagen: "➕",
        pantalla: "menu",
        accion: "clic",
        elemento: "btnAddPlayer",
        feedback: "¡Bien! Ahora escribe un nombre"
    },
    {
        id: 3,
        titulo: "✏️ Escribe un nombre",
        descripcion: "Escribe 'Jugador1' y toca 'Guardar'",
        imagen: "✏️",
        pantalla: "addPlayer",
        accion: "escribirYGuardar",
        elementoInput: "newPlayerName",
        elementoBoton: "saveNewPlayer",
        valorEjemplo: "Jugador1",
        feedback: "¡Perfecto! El jugador fue agregado"
    },
    {
        id: 4,
        titulo: "🐑 Ver el Rebaño",
        descripcion: "Ahora toca el botón '🐑 Rebaño' para ver los jugadores",
        imagen: "🐑",
        pantalla: "menu",
        accion: "clic",
        elemento: "btnGroupManager",
        feedback: "¡Bien! Aquí puedes ver, editar o eliminar jugadores"
    },
    {
        id: 5,
        titulo: "🔙 Volver al menú",
        descripcion: "Toca 'Volver al Corral' para regresar",
        imagen: "🔙",
        pantalla: "groupManager",
        accion: "clic",
        elemento: "backToMenu",
        feedback: "¡Excelente! Sigamos"
    },
    {
        id: 6,
        titulo: "⚙️ Configurar Partida",
        descripcion: "Toca '⚙️ Configurar' para ajustar el juego",
        imagen: "⚙️",
        pantalla: "menu",
        accion: "clic",
        elemento: "btnGameSetup",
        feedback: "Muy bien. Aquí decidiremos cuántos lobos habrá"
    },
    {
        id: 7,
        titulo: "🐺 Elegir número de Lobos",
        descripcion: "Mueve el deslizador para elegir 2 lobos",
        imagen: "🐺",
        pantalla: "gameSetup",
        accion: "moverSlider",
        elemento: "impRange",
        valorObjetivo: 2,
        feedback: "¡Así se hace! Ahora hay 2 lobos"
    },
    {
        id: 8,
        titulo: "👁️ Opción del Lobo",
        descripcion: "Activa esta opción para que el lobo vea la categoría",
        imagen: "👁️",
        pantalla: "gameSetup",
        accion: "marcarCheckbox",
        elemento: "impostorVeCategoria",
        feedback: "Correcto. El lobo tendrá una pista"
    },
    {
        id: 9,
        titulo: "📁 Seleccionar Categoría",
        descripcion: "Elige la categoría 'Animales'",
        imagen: "📁",
        pantalla: "gameSetup",
        accion: "seleccionarOpcion",
        elemento: "categoriaSelect",
        valorObjetivo: "Animales",
        feedback: "¡Bien! La categoría será Animales"
    },
    {
        id: 10,
        titulo: "💾 Guardar Configuración",
        descripcion: "¡IMPORTANTE! Toca '💾 GUARDAR CONFIGURACIÓN'",
        imagen: "💾",
        pantalla: "gameSetup",
        accion: "clic",
        elemento: "guardarConfigBtn",
        feedback: "✅ Configuración guardada"
    },
    {
        id: 11,
        titulo: "🔙 Volver al menú",
        descripcion: "Toca 'Volver al Corral' para regresar",
        imagen: "🔙",
        pantalla: "gameSetup",
        accion: "clic",
        elemento: "backToMenu",
        feedback: "Ya casi estamos listos"
    },
    {
        id: 12,
        titulo: "▶️ Iniciar Partida de Prueba",
        descripcion: "Toca '▶ Iniciar Partida' para comenzar la partida de prueba",
        imagen: "▶️",
        pantalla: "menu",
        accion: "clicTutorialIniciar",
        elemento: "btnStartGame",
        feedback: "¡Comenzamos! Verás la asignación de roles"
    },
{
    id: 13,
    titulo: "🎭 Mostrar Rol",
    descripcion: "Toca la tarjeta para revelar tu rol",
    imagen: "✨",
    pantalla: "asignarRolesTutorial",
    accion: "clic",
    elemento: "rolCardTutorial",  // Cambiado de "revelarRolTutorial" a "rolCardTutorial"
    feedback: "¡Mira qué rol te tocó!"
},
{
    id: 14,
    titulo: "🐺 Rol de Lobo",
    descripcion: "Este es el rol de lobo. Toca 'Continuar'",
    imagen: "🐺",
    pantalla: "asignarRolesTutorial",
    accion: "clic",
    elemento: "siguienteRolTutorial",
    feedback: "Bien. Pasamos al siguiente"
},
{
    id: 15,
    titulo: "🐑 Rol de Oveja",
    descripcion: "Este es el rol de oveja. Toca 'Continuar'",
    imagen: "🐑",
    pantalla: "asignarRolesTutorial",
    accion: "clic",
    elemento: "siguienteRolTutorial",
    feedback: "Perfecto. Todos tienen rol"
},
    {
        id: 16,
        titulo: "❓ Ronda de Preguntas",
        descripcion: "Toca '🗳️ Iniciar Votación'",
        imagen: "🔄",
        pantalla: "juegoTutorial",
        accion: "clic",
        elemento: "abrirVotacionBtnTutorial",
        feedback: "Muy bien. Vamos a votar"
    },
    {
        id: 17,
        titulo: "🗳️ Ver Resultado",
        descripcion: "Toca '🔍 Resultado' para ver qué pasó",
        imagen: "🗳️",
        pantalla: "votacionTutorial",
        accion: "clic",
        elemento: "finalizarVotacionBtnTutorial",
        feedback: "¡Mira el resultado!"
    },
    {
        id: 18,
        titulo: "🎉 Fin de la Partida",
        descripcion: "Toca 'Cerrar' para continuar",
        imagen: "🎉",
        pantalla: "modal",
        accion: "clic",
        elemento: "tutorialModalCloseBtn",
        feedback: "¡Excelente!"
    },
    {
        id: 19,
        titulo: "📊 Ver Estadísticas",
        descripcion: "Toca '📊 Estadísticas'",
        imagen: "📊",
        pantalla: "menu",
        accion: "clic",
        elemento: "btnStats",
        feedback: "¡Bien! Aquí están tus estadísticas"
    },
    {
        id: 20,
        titulo: "📊 Tabla de Estadísticas",
        descripcion: "Observa las columnas: 🐺 Victorias Lobo, 🐑 Victorias Oveja, ⭐ Puntos",
        imagen: "📋",
        pantalla: "stats",
        accion: "temporizador",
        tiempo: 8,
        feedback: "Tiempo completado"
    },
    {
        id: 21,
        titulo: "🎉 ¡Tutorial Completado!",
        descripcion: "¡Ya sabes jugar! Puedes repetir el tutorial cuando quieras.",
        imagen: "🎉",
        pantalla: "menu",
        accion: "final",
        feedback: "¡A disfrutar el juego!"
    }
];

// ---------- FUNCIONES DEL TUTORIAL ----------
function iniciarTutorial() {
    console.log('🎮 Iniciando tutorial interactivo');
    tutorialActivo = true;
    tutorialCompletado = false;
    tutorialPasoActual = 0;
    tutorialEnCurso = true;
    
    eliminarListenersTutorial();
    mostrarPasoTutorial();
}

function eliminarListenersTutorial() {
    tutorialListenersActivos.forEach(({elemento, tipo, listener}) => {
        if (elemento) {
            elemento.removeEventListener(tipo, listener);
        }
    });
    tutorialListenersActivos = [];
}

function mostrarPasoTutorial() {
    let paso = pasosTutorial[tutorialPasoActual];
    if (!paso) {
        tutorialActivo = false;
        tutorialCompletado = true;
        localStorage.setItem('tutorial_completado', 'true');
        renderMenu();
        return;
    }
    
    console.log(`📋 Paso ${tutorialPasoActual + 1}: ${paso.titulo}`);
    
    navegarAPantallaTutorial(paso.pantalla, paso);
    
    setTimeout(() => {
        mostrarOverlayTutorial(paso);
        
        if (paso.accion !== 'esperar' && paso.accion !== 'final') {
            configurarListenerPaso(paso);
        }
    }, 300);
}

function navegarAPantallaTutorial(pantalla, paso) {
    if (pantalla === 'menu') renderMenuTutorial();
    else if (pantalla === 'addPlayer') renderAddPlayerTutorial();
    else if (pantalla === 'groupManager') renderGroupManagerTutorial();
    else if (pantalla === 'gameSetup') renderGameSetupTutorial();
    else if (pantalla === 'stats') renderStatsTutorial();
    else if (pantalla === 'asignarRolesTutorial') renderAsignarRolesTutorial();
    else if (pantalla === 'juegoTutorial') renderJuegoTutorial();
    else if (pantalla === 'votacionTutorial') renderVotacionTutorial();
}

// ---------- RENDER PARA TUTORIAL ----------
function renderMenuTutorial() {
    currentScreen = 'menu';
    let html = `
        <div class="screen" style="padding: 15px;">
            <h1 class="neon-title">🐑Ovejas y Lobos🐺</h1>
            <p class="subtitle" style="color: #ffd700; text-align: center;">🎓 MODO TUTORIAL ACTIVO</p>
            
            <div class="glass-card" style="display: flex; flex-direction: column; gap: 8px; margin-top: 20px;">
                <button class="btn-modern" id="btnAddPlayer">➕ Agregar Jugador</button>
                <button class="btn-modern" id="btnGroupManager">🐑 Rebaño</button>
                <button class="btn-modern" id="btnDictionary">📚 Diccionario</button>
                <button class="btn-modern" id="btnGameSetup">⚙️ Configurar</button>
                <button class="btn-modern" id="btnStats">📊 Estadísticas</button>
                <button class="btn-modern" id="btnStartGame" style="background: linear-gradient(135deg, #00b09b, #96c93d);">▶ Iniciar Partida</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
}

function renderAddPlayerTutorial() {
    let html = `
        <div class="screen" style="padding: 15px;">
            <h2 class="neon-title" style="font-size: 2rem;">➕ Nuevo Jugador</h2>
            
            <div class="glass-card" style="margin: 20px 0;">
                <input type="text" id="newPlayerName" placeholder="Escribe 'Jugador1'" 
                       style="width: 100%; padding: 15px; border-radius: 15px; border: 2px solid #667eea; 
                              background: rgba(255,255,255,0.1); color: white;">
            </div>
            
            <button class="btn-modern" id="saveNewPlayer" style="margin: 10px 0;">💾 Guardar</button>
            <button class="btn-modern" id="backToMenu" style="background: #2a2a3a;">🔙 Volver</button>
        </div>
    `;
    app.innerHTML = html;
}

function renderGroupManagerTutorial() {
    let playersList = players.map((p, index) => `
        <div class="vote-card-modern" style="margin: 5px 0;">
            <div class="vote-avatar-modern">${p.nombre.charAt(0).toUpperCase()}</div>
            <div class="vote-info-modern">
                <div class="vote-name-modern">${p.nombre}</div>
                <div class="vote-status-modern">🐑 Oveja</div>
            </div>
        </div>
    `).join('') || '<p style="color: gray; text-align: center;">No hay jugadores</p>';

    let html = `
        <div class="screen" style="padding: 15px;">
            <h2 class="neon-title">🐑 Rebaño</h2>
            
            <div class="glass-card" style="max-height: 400px; overflow-y: auto; padding: 10px;">
                ${playersList}
            </div>
            
            <button class="btn-modern" id="backToMenu" style="background: #2a2a3a; margin-top: 15px;">🔙 Volver</button>
        </div>
    `;
    app.innerHTML = html;
}

function renderGameSetupTutorial() {
    let totalJugadores = players.length;
    
    let html = `
        <div class="screen" style="padding: 15px;">
            <h2 class="neon-title">⚙️ Configurar</h2>
            
            <div class="order-container" style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between;">
                    <span>🐑 Jugadores:</span>
                    <span style="color: #ffd700;">${totalJugadores}</span>
                </div>
            </div>
            
            <div class="glass-card" style="margin: 15px 0;">
                <h3 style="color: white;">🐺 Lobos: <span id="impCountDisplay">1</span></h3>
                <input type="range" id="impRange" min="1" max="3" value="1" step="1" style="width: 100%;">
                
                <div style="background: #2a2a3a; border-radius: 15px; padding: 15px; margin-top: 15px;">
                    <span>🐑 Ovejas: <span style="color: #4CAF50;" id="ciudCountDisplay">${totalJugadores - 1}</span></span>
                </div>
            </div>
            
            <div class="glass-card" style="margin: 15px 0;">
                <label style="display: flex; align-items: center; gap: 10px;">
                    <input type="checkbox" id="impostorVeCategoria" style="width: 20px; height: 20px;">
                    <span>Mostrar categoría al Lobo</span>
                </label>
            </div>
            
            <div class="glass-card" style="margin: 15px 0;">
                <select id="categoriaSelect" style="width: 100%; padding: 15px; border-radius: 15px; background: #2a2a3a; color: white; border: 2px solid #667eea;">
                    <option value="aleatoria">🎲 Aleatoria</option>
                    <option value="Animales">📁 Animales</option>
                    <option value="Lugares">📁 Lugares</option>
                </select>
            </div>
            
            <button class="btn-modern" id="guardarConfigBtn" style="background: linear-gradient(135deg, #00b09b, #96c93d);">💾 GUARDAR</button>
            <button class="btn-modern" id="backToMenu" style="background: #2a2a3a; margin-top: 10px;">🔙 Volver</button>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('impRange').addEventListener('input', function() {
        document.getElementById('impCountDisplay').textContent = this.value;
        document.getElementById('ciudCountDisplay').textContent = totalJugadores - this.value;
    });
}

function renderStatsTutorial() {
    let statsEjemplo = [
        { nombre: "Jugador 1", partidas: 5, victoriasImp: 2, victoriasCiud: 3, totalPuntos: 19 },
        { nombre: "Jugador 2", partidas: 5, victoriasImp: 1, victoriasCiud: 4, totalPuntos: 14 }
    ];
    
    let rows = statsEjemplo.map((p, idx) => `
        <div class="vote-card-modern" style="margin: 5px 0;">
            <div class="vote-avatar-modern" style="background: ${idx === 0 ? 'gold' : 'silver'};">#${idx+1}</div>
            <div class="vote-info-modern">
                <div class="vote-name-modern">${p.nombre}</div>
                <div class="vote-status-modern">🐺 ${p.victoriasImp} • 🐑 ${p.victoriasCiud}</div>
            </div>
            <div style="color: #ffd700;">${p.totalPuntos} ⭐</div>
        </div>
    `).join('');

    let html = `
        <div class="screen" style="padding: 15px;">
            <h2 class="neon-title">📊 Estadísticas</h2>
            
            <div class="glass-card" style="margin: 10px 0; display: flex; justify-content: space-around;">
                <span>🐺 Lobo</span> <span>🐑 Oveja</span> <span>⭐ Puntos</span>
            </div>
            
            <div style="max-height: 400px; overflow-y: auto;">
                ${rows}
            </div>
            
            <button class="btn-modern" id="backToMenu" style="background: #2a2a3a; margin-top: 15px;">🔙 Volver</button>
        </div>
    `;
    app.innerHTML = html;
}

/// ---------- RENDER ASIGNAR ROLES PARA TUTORIAL (VERSIÓN SIMPLIFICADA) ----------
function renderAsignarRolesTutorial() {
    let paso = pasosTutorial[tutorialPasoActual];
    
    // Determinar qué rol mostrar según el ID del paso
    let esLobo = (paso.id === 13 || paso.id === 14);
    let esOveja = (paso.id === 15);
    
    console.log(`🎭 Tutorial - Paso ${paso.id}: ${esLobo ? 'LOBO' : (esOveja ? 'OVEJA' : 'DESCONOCIDO')}`);
    
    let contenidoRol = '';
    
    if (esLobo) {
        contenidoRol = `
            <div style="text-align: center; padding: 10px;">
                <p style="font-size: 2.2rem; color: #ff6b6b; text-shadow: 0 0 15px #ff0000; margin-bottom: 15px;">🐺 ERES EL LOBO</p>
                <div style="background: rgba(255,215,0,0.15); border: 3px solid #ffd700; border-radius: 25px; padding: 20px;">
                    <p style="color: #ffd700; font-size: 1.2rem;">📁 Categoría: Animales</p>
                    <p style="color: #a0a0a0; font-size: 0.9rem; margin-top: 10px;">(Debes adivinar la palabra)</p>
                </div>
            </div>
        `;
    } else if (esOveja) {
        contenidoRol = `
            <div style="text-align: center; padding: 10px;">
                <p style="color: #4CAF50; font-size: 2rem; margin-bottom: 15px; text-shadow: 0 0 10px #00ff00;">🐑 ERES UNA OVEJA</p>
                <div style="background: rgba(102,126,234,0.15); border: 3px solid #667eea; border-radius: 25px; padding: 25px;">
                    <p style="color: white; font-size: 2.5rem; font-weight: bold; margin-bottom: 10px;">LOBO</p>
                    <p style="color: #ffd700; font-size: 1.2rem;">📁 Animales</p>
                    <p style="color: #a0a0a0; font-size: 0.9rem; margin-top: 10px;">(Tú ves la palabra, el lobo no)</p>
                </div>
            </div>
        `;
    }
    
    let html = `
        <div class="screen" style="justify-content: center; padding: 15px;">
            <!-- Barra de progreso -->
            <div style="background: rgba(255,255,255,0.1); border-radius: 30px; height: 8px; margin: 10px 0 20px 0;">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); width: ${((tutorialPasoActual + 1) / pasosTutorial.length) * 100}%; height: 8px; border-radius: 30px;"></div>
            </div>
            <p style="color: #a0a0a0; text-align: center; margin-bottom: 15px;">Paso ${tutorialPasoActual + 1} de ${pasosTutorial.length}</p>
            
            <!-- Tarjeta de rol - SIN ANIMACIÓN COMPLEJA -->
            <div id="tarjetaRol" class="rol-card" style="background: linear-gradient(145deg, #2a2a4a, #1a1a3a); border: 3px solid #667eea; border-radius: 40px; padding: 30px 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5); min-height: 300px; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
                <!-- Contenido que cambia con display -->
                <div id="contenidoRol" style="width: 100%;">
                    <h2 style="font-size: 2.5rem; color: white; text-align: center; text-shadow: 0 0 15px #667eea; margin-bottom: 20px;">Jugador 1</h2>
                    <div style="background: rgba(255,255,255,0.1); border-radius: 20px; padding: 15px; text-align: center;">
                        <p style="color: #ffd700; font-size: 1.1rem;">👆 Toca el botón para revelar</p>
                    </div>
                </div>
            </div>
            
            <!-- Botón Mostrar Rol -->
            <button class="btn-modern" id="revelarRolBtn" style="margin-top: 20px; padding: 15px; font-size: 1.2rem; background: linear-gradient(135deg, #667eea, #764ba2);">
                ✨ Mostrar Rol
            </button>
            
            <!-- Botón de continuar (inicialmente oculto) -->
            <button class="btn-modern" id="siguienteRolBtn" style="display: none; margin-top: 20px; background: linear-gradient(135deg, #00b09b, #96c93d); padding: 15px; font-size: 1.2rem;">
                ➡️ Continuar
            </button>
        </div>
    `;
    app.innerHTML = html;
    
    // Configurar botón Mostrar Rol
    document.getElementById('revelarRolBtn').addEventListener('click', function() {
        SoundEffects.playRevealSound();
        
        // Cambiar el contenido de la tarjeta directamente
        document.getElementById('contenidoRol').innerHTML = contenidoRol;
        
        // Ocultar botón Mostrar Rol y mostrar botón Continuar
        this.style.display = 'none';
        document.getElementById('siguienteRolBtn').style.display = 'block';
    });
    
    // Configurar botón Continuar
    document.getElementById('siguienteRolBtn').addEventListener('click', () => {
        let overlay = document.getElementById('tutorialOverlay');
        if (overlay) overlay.remove();
        
        tutorialPasoActual++;
        mostrarPasoTutorial();
    });
}

//Render Juego Tutorial

function renderJuegoTutorial() {
    let html = `
        <div class="screen game-screen-modern" style="padding: 15px;">
            <h2 class="neon-title">🔍 Juego en curso</h2>
            <div class="round-indicator">⚔️ Ronda 1</div>
            <div class="category-tag">📁 Animales</div>
            
            <div class="order-container">
                <div class="order-title">🔄 Orden de preguntas</div>
                <div class="order-names">Jugador 1 → Jugador 2 → Jugador 3</div>
            </div>
            
            <div class="time-message">⏳ ¡TIEMPO PARA PREGUNTAR!</div>
            
            <button class="btn-modern" id="abrirVotacionBtnTutorial" style="margin-top: 15px;">🗳️ Iniciar Votación</button>
        </div>
    `;
    app.innerHTML = html;
}

// ---------- RENDER VOTACIÓN PARA TUTORIAL ----------
function renderVotacionTutorial() {
    let html = `
        <div class="screen" style="padding: 15px;">
            <h2 class="neon-title">🗳️ VOTACIÓN</h2>
            <div class="round-indicator">Ronda 1</div>
            
            <div class="order-container" style="background: linear-gradient(135deg, #667eea, #764ba2); margin: 10px 0; text-align: center;">
                <div style="color: white;">🎯 VOTA AHORA</div>
            </div>
            
            <div style="margin: 15px 0;">
                <div class="vote-card-modern">
                    <div class="vote-avatar-modern">J1</div>
                    <div class="vote-info-modern">
                        <div class="vote-name-modern">Jugador 1</div>
                        <div class="vote-status-modern">👤 Jugador</div>
                    </div>
                </div>
                <div class="vote-card-modern">
                    <div class="vote-avatar-modern">J2</div>
                    <div class="vote-info-modern">
                        <div class="vote-name-modern">Jugador 2</div>
                        <div class="vote-status-modern">👤 Jugador</div>
                    </div>
                </div>
                <div class="vote-card-modern">
                    <div class="vote-avatar-modern">J3</div>
                    <div class="vote-info-modern">
                        <div class="vote-name-modern">Jugador 3</div>
                        <div class="vote-status-modern">👤 Jugador</div>
                    </div>
                </div>
            </div>
            
            <button class="btn-modern" id="finalizarVotacionBtnTutorial" style="width: 100%;">🔍 Ver Resultado</button>
        </div>
    `;
    app.innerHTML = html;
    
    // 🔥 IMPORTANTE: Configurar el evento para mostrar el modal
    document.getElementById('finalizarVotacionBtnTutorial').addEventListener('click', () => {
        mostrarModalResultadoTutorial();
    });
}

// ---------- MOSTRAR MODAL DE RESULTADO PARA TUTORIAL ----------
function mostrarModalResultadoTutorial() {
    let modal = document.createElement('div');
    modal.id = 'tutorialModal';
    modal.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.9);
        z-index: 3500;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        animation: fadeInScale 0.3s ease;
    `;
    
    modal.innerHTML = `
        <div style="background: linear-gradient(135deg, #00b09b, #96c93d); border-radius: 30px; padding: 30px; max-width: 350px; border: 3px solid white; text-align: center;">
            <div style="font-size: 4rem; margin-bottom: 15px;">🎉</div>
            <h2 style="color: white; font-size: 1.8rem; margin-bottom: 15px;">¡LOBO DESCUBIERTO!</h2>
            <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 15px; margin: 15px 0;">
                <p style="color: #ffd700; font-size: 1.2rem;">🐺 El Lobo era:</p>
                <p style="color: white; font-size: 2rem; font-weight: bold;">Jugador 1</p>
            </div>
            <p style="color: white; margin-bottom: 20px;">✅ ¡Correcto! Has descubierto al lobo.</p>
            
            <button id="tutorialModalCloseBtn" class="btn-modern" style="background: white; color: #1a1a2e; width: 100%; padding: 15px; font-size: 1.2rem;">✖ Cerrar</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Configurar botón cerrar
    document.getElementById('tutorialModalCloseBtn').addEventListener('click', () => {
        modal.remove();
        
        // Eliminar overlay del tutorial si existe
        let overlay = document.getElementById('tutorialOverlay');
        if (overlay) overlay.remove();
        
        // Avanzar al siguiente paso
        setTimeout(() => {
            tutorialPasoActual++;
            mostrarPasoTutorial();
        }, 500);
    });
}

// ---------- CONFIGURAR LISTENERS DEL TUTORIAL ----------
function configurarListenerPaso(paso) {
    eliminarListenersTutorial();
    
    setTimeout(() => {
        switch (paso.accion) {
            case 'clic':
                configurarListenerClic(paso);
                break;
            case 'clicTutorialIniciar':
                configurarListenerClicTutorialIniciar(paso);
                break;
            case 'escribirYGuardar':
                configurarListenerEscribirYGuardar(paso);
                break;
            case 'moverSlider':
                configurarListenerSlider(paso);
                break;
            case 'marcarCheckbox':
                configurarListenerCheckbox(paso);
                break;
            case 'seleccionarOpcion':
                configurarListenerSelect(paso);
                break;
            case 'clicEnJugador':
                configurarListenerClicEnJugador(paso);
                break;
            case 'temporizador':
                console.log(`⏳ Paso ${paso.id} con temporizador`);
                break;
        }
    }, 200);
}

function configurarListenerClic(paso) {
    let elemento = document.getElementById(paso.elemento);
    if (!elemento) return;
    
    elemento.style.animation = 'pulse 1s infinite';
    elemento.style.border = '4px solid #ffd700';
    
    let listener = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        elemento.style.animation = '';
        elemento.style.border = '';
        elemento.removeEventListener('click', listener);
        
        let overlay = document.getElementById('tutorialOverlay');
        if (overlay) overlay.remove();
        
        mostrarToast(paso.feedback);
        
        setTimeout(() => {
            tutorialPasoActual++;
            mostrarPasoTutorial();
        }, 500);
    };
    
    elemento.addEventListener('click', listener);
    tutorialListenersActivos.push({elemento, tipo: 'click', listener});
}

function configurarListenerClicTutorialIniciar(paso) {
    let elemento = document.getElementById(paso.elemento);
    if (!elemento) return;
    
    elemento.style.animation = 'pulse 1s infinite';
    elemento.style.border = '4px solid #ffd700';
    
    let listener = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        elemento.style.animation = '';
        elemento.style.border = '';
        elemento.removeEventListener('click', listener);
        
        let overlay = document.getElementById('tutorialOverlay');
        if (overlay) overlay.remove();
        
        mostrarToast(paso.feedback);
        
        setTimeout(() => {
            tutorialPasoActual++;
            renderAsignarRolesTutorial();
            
            setTimeout(() => {
                let siguientePaso = pasosTutorial[tutorialPasoActual];
                if (siguientePaso) {
                    mostrarOverlayTutorial(siguientePaso);
                    if (siguientePaso.accion !== 'esperar' && siguientePaso.accion !== 'final') {
                        configurarListenerPaso(siguientePaso);
                    }
                }
            }, 300);
        }, 500);
    };
    
    elemento.addEventListener('click', listener);
    tutorialListenersActivos.push({elemento, tipo: 'click', listener});
}

function configurarListenerEscribirYGuardar(paso) {
    let input = document.getElementById(paso.elementoInput);
    let boton = document.getElementById(paso.elementoBoton);
    
    if (!input || !boton) return;
    
    input.style.animation = 'pulse 1s infinite';
    input.style.border = '4px solid #ffd700';
    boton.style.animation = 'pulse 1s infinite';
    boton.style.border = '4px solid #ffd700';
    
    let inputListener = () => {
        if (input.value.trim() !== '') {
            boton.style.animation = 'pulse 1s infinite';
            boton.style.border = '4px solid #ffd700';
        }
    };
    
    let botonListener = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        if (input.value.trim() !== '') {
            input.style.animation = '';
            input.style.border = '';
            boton.style.animation = '';
            boton.style.border = '';
            
            input.removeEventListener('input', inputListener);
            boton.removeEventListener('click', botonListener);
            
            let overlay = document.getElementById('tutorialOverlay');
            if (overlay) overlay.remove();
            
            mostrarToast(paso.feedback);
            
            setTimeout(() => {
                tutorialPasoActual++;
                mostrarPasoTutorial();
            }, 500);
        }
    };
    
    input.addEventListener('input', inputListener);
    boton.addEventListener('click', botonListener);
    
    tutorialListenersActivos.push({elemento: input, tipo: 'input', listener: inputListener});
    tutorialListenersActivos.push({elemento: boton, tipo: 'click', listener: botonListener});
}

function configurarListenerSlider(paso) {
    let slider = document.getElementById(paso.elemento);
    if (!slider) return;
    
    slider.style.animation = 'pulse 1s infinite';
    slider.style.border = '4px solid #ffd700';
    
    let listener = () => {
        if (parseInt(slider.value) === paso.valorObjetivo) {
            slider.style.animation = '';
            slider.style.border = '';
            
            slider.removeEventListener('input', listener);
            
            let overlay = document.getElementById('tutorialOverlay');
            if (overlay) overlay.remove();
            
            mostrarToast(paso.feedback);
            
            setTimeout(() => {
                tutorialPasoActual++;
                mostrarPasoTutorial();
            }, 500);
        }
    };
    
    slider.addEventListener('input', listener);
    tutorialListenersActivos.push({elemento: slider, tipo: 'input', listener});
}

function configurarListenerCheckbox(paso) {
    let checkbox = document.getElementById(paso.elemento);
    if (!checkbox) return;
    
    checkbox.style.animation = 'pulse 1s infinite';
    checkbox.style.outline = '4px solid #ffd700';
    
    let listener = () => {
        if (checkbox.checked) {
            checkbox.style.animation = '';
            checkbox.style.outline = '';
            
            checkbox.removeEventListener('change', listener);
            
            let overlay = document.getElementById('tutorialOverlay');
            if (overlay) overlay.remove();
            
            mostrarToast(paso.feedback);
            
            setTimeout(() => {
                tutorialPasoActual++;
                mostrarPasoTutorial();
            }, 500);
        }
    };
    
    checkbox.addEventListener('change', listener);
    tutorialListenersActivos.push({elemento: checkbox, tipo: 'change', listener});
}

function configurarListenerSelect(paso) {
    let select = document.getElementById(paso.elemento);
    if (!select) return;
    
    select.style.animation = 'pulse 1s infinite';
    select.style.border = '4px solid #ffd700';
    
    let listener = () => {
        if (select.value === paso.valorObjetivo) {
            select.style.animation = '';
            select.style.border = '';
            
            select.removeEventListener('change', listener);
            
            let overlay = document.getElementById('tutorialOverlay');
            if (overlay) overlay.remove();
            
            mostrarToast(paso.feedback);
            
            setTimeout(() => {
                tutorialPasoActual++;
                mostrarPasoTutorial();
            }, 500);
        }
    };
    
    select.addEventListener('change', listener);
    tutorialListenersActivos.push({elemento: select, tipo: 'change', listener});
}

function configurarListenerClicEnJugador(paso) {
    let jugadores = document.querySelectorAll(`.${paso.elemento}`);
    if (jugadores.length === 0) return;
    
    let jugadorObjetivo = jugadores[paso.indiceJugador];
    if (!jugadorObjetivo) return;
    
    jugadorObjetivo.style.animation = 'pulse 1s infinite';
    jugadorObjetivo.style.border = '4px solid #ffd700';
    
    let listener = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        jugadorObjetivo.style.animation = '';
        jugadorObjetivo.style.border = '';
        
        jugadorObjetivo.removeEventListener('click', listener);
        
        let overlay = document.getElementById('tutorialOverlay');
        if (overlay) overlay.remove();
        
        mostrarToast(paso.feedback);
        
        setTimeout(() => {
            tutorialPasoActual++;
            mostrarPasoTutorial();
        }, 500);
    };
    
    jugadorObjetivo.addEventListener('click', listener);
    tutorialListenersActivos.push({elemento: jugadorObjetivo, tipo: 'click', listener});
}

// ---------- MOSTRAR OVERLAY DEL TUTORIAL ----------
function mostrarOverlayTutorial(paso) {
    let overlayExistente = document.getElementById('tutorialOverlay');
    if (overlayExistente) overlayExistente.remove();
    
    if (paso.accion === 'esperar' || paso.accion === 'final') {
        mostrarOverlayConBoton(paso);
    } else {
        mostrarOverlayInformativo(paso);
    }
}

function mostrarOverlayConBoton(paso) {
    let overlay = document.createElement('div');
    overlay.id = 'tutorialOverlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.8);
        z-index: 3000;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 20px;
        pointer-events: auto;
        animation: fadeInScale 0.3s ease;
    `;
    
    let progreso = ((tutorialPasoActual + 1) / pasosTutorial.length) * 100;
    
    overlay.innerHTML = `
        <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 30px; padding: 25px; max-width: 350px; border: 3px solid white; text-align: center;">
            <div style="font-size: 4rem;">${paso.imagen}</div>
            <h2 style="color: white;">${paso.titulo}</h2>
            <p style="color: #e0e0e0;">${paso.descripcion}</p>
            
            <div style="background: rgba(255,255,255,0.3); border-radius: 10px; height: 8px; margin: 15px 0;">
                <div style="background: #ffd700; width: ${progreso}%; height: 8px; border-radius: 10px;"></div>
            </div>
            <p style="color: white;">Paso ${tutorialPasoActual + 1}/${pasosTutorial.length}</p>
            
            <button id="tutorialContinueBtn" class="btn-modern" style="background: #4CAF50; width: 100%; margin-top: 10px;">👉 Continuar</button>
            <button id="tutorialSkipBtn" class="btn-modern" style="background: #2a2a3a; width: 100%; margin-top: 10px;">⏭️ Omitir</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    
    document.getElementById('tutorialContinueBtn').addEventListener('click', () => {
        overlay.remove();
        tutorialPasoActual++;
        mostrarPasoTutorial();
    });
    
    document.getElementById('tutorialSkipBtn').addEventListener('click', () => {
        eliminarListenersTutorial();
        tutorialActivo = false;
        tutorialCompletado = true;
        localStorage.setItem('tutorial_completado', 'true');
        overlay.remove();
        renderMenu();
    });
}

function mostrarOverlayInformativo(paso) {
    let esPantallaStats = (paso.pantalla === 'stats');
    
    let overlay = document.createElement('div');
    overlay.id = 'tutorialOverlay';
    
    if (esPantallaStats) {
        overlay.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            z-index: 3000;
            padding: 15px;
            border-radius: 20px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.5);
            border: 2px solid white;
            pointer-events: none;
            animation: fadeInScale 0.3s ease;
            max-width: 280px;
        `;
    } else {
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: linear-gradient(135deg, #667eea, #764ba2);
            z-index: 3000;
            padding: 15px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            border-bottom: 3px solid white;
            pointer-events: none;
            animation: slideDown 0.3s ease;
        `;
    }
    
    let progreso = ((tutorialPasoActual + 1) / pasosTutorial.length) * 100;
    
    let temporizadorHTML = '';
    if (paso.accion === 'temporizador' && paso.tiempo) {
        temporizadorHTML = `
            <div style="margin-top: 10px; background: rgba(0,0,0,0.3); border-radius: 30px; padding: 8px; text-align: center;">
                <span style="color: #ffd700; font-weight: bold;" id="temporizador">${paso.tiempo}s</span>
            </div>
        `;
    }
    
    if (esPantallaStats) {
        overlay.innerHTML = `
            <div style="display: flex; flex-direction: column; gap: 8px;">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="font-size: 2rem;">${paso.imagen}</div>
                    <div>
                        <h3 style="color: white; font-size: 1rem;">${paso.titulo}</h3>
                        <p style="color: #e0e0e0; font-size: 0.85rem;">${paso.descripcion}</p>
                    </div>
                </div>
                ${temporizadorHTML}
            </div>
        `;
    } else {
        overlay.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px; max-width: 400px; margin: 0 auto;">
                <div style="font-size: 2rem;">${paso.imagen}</div>
                <div style="flex: 1;">
                    <h3 style="color: white; font-size: 1rem;">${paso.titulo}</h3>
                    <p style="color: #e0e0e0; font-size: 0.9rem;">${paso.descripcion}</p>
                    ${temporizadorHTML}
                </div>
            </div>
        `;
    }
    
    document.body.appendChild(overlay);
    
    if (paso.accion === 'temporizador' && paso.tiempo) {
        iniciarTemporizadorTutorial(paso.tiempo);
    }
}

function iniciarTemporizadorTutorial(segundos) {
    let tiempoRestante = segundos;
    let temporizadorElement = document.getElementById('temporizador');
    
    let intervalo = setInterval(() => {
        tiempoRestante--;
        if (temporizadorElement) {
            temporizadorElement.textContent = `${tiempoRestante}s`;
        }
        
        if (tiempoRestante <= 0) {
            clearInterval(intervalo);
            
            let overlay = document.getElementById('tutorialOverlay');
            if (overlay) overlay.remove();
            
            mostrarToast('⏭️ Continuando...');
            
            setTimeout(() => {
                tutorialPasoActual++;
                mostrarPasoTutorial();
            }, 500);
        }
    }, 1000);
    
    tutorialListenersActivos.push({ elemento: null, tipo: 'intervalo', listener: intervalo });
}
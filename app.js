// ---------- Estado Global ----------
let players = JSON.parse(localStorage.getItem('undercover_players')) || [];

// Categorías con 25 palabras cada una
let categorias = {
    'Lugares': ['PLAYA', 'MONTAÑA', 'BOSQUE', 'DESIERTO', 'ISLA', 'LAGO', 'RÍO', 'VALLE', 'CUEVA', 'VOLCÁN', 'SELVA', 'GLACIAR', 'OCÉANO', 'CASCADA', 'CAMPING', 'MIRADOR', 'SENDERO', 'PRADERA', 'ACANTILADO', 'ARROYO', 'CUMBRE', 'LLANURA', 'PANTANO', 'ARRECIFE', 'CAÑÓN'],
    'Ciudades': ['MADRID', 'BARCELONA', 'LONDRES', 'PARÍS', 'ROMA', 'BERLÍN', 'TOKIO', 'NUEVA YORK', 'MOSCÚ', 'DUBAI', 'SIDNEY', 'CIUDAD DE MÉXICO', 'BUENOS AIRES', 'LIMA', 'BOGOTÁ', 'SANTIAGO', 'CARACAS', 'LA PAZ', 'QUITO', 'MONTEVIDEO', 'ASUNCIÓN', 'PANAMÁ', 'SAN JOSÉ', 'LA HABANA', 'SANTO DOMINGO'],
    'Fútbol': ['BALÓN', 'CANCHA', 'ARCO', 'PENALTI', 'CÓRNER', 'FUERA DE JUEGO', 'ÁRBITRO', 'TARJETA AMARILLA', 'TARJETA ROJA', 'VAR', 'LESIÓN', 'CAMBIOS', 'PRÓRROGA', 'TANDA DE PENALES', 'FINAL', 'COPA', 'LIGA', 'CHAMPIONS', 'MUNDIAL', 'ENTRENADOR', 'CAPITÁN', 'DELANTERO', 'DEFENSA', 'MEDIOCAMPISTA', 'PORTERO'],
    'Futbolistas': ['MESSI', 'CR7', 'NEYMAR', 'MBAPPÉ', 'HAALAND', 'BENZEMA', 'LEWANDOWSKI', 'MODRIĆ', 'DE BRUYNE', 'SALAH', 'MANÉ', 'KANE', 'VINICIUS', 'BELLINGHAM', 'PEDRI', 'GAVI', 'MUSIALA', 'VALVERDE', 'COUTINHO', 'SUÁREZ', 'AGÜERO', 'DI MARÍA', 'INIESTA', 'XAVI', 'CASILLAS'],
    'Animales': ['PERRO', 'GATO', 'LEÓN', 'TIGRE', 'ELEFANTE', 'JIRAFA', 'CEBRA', 'RINOCERONTE', 'HIPOPÓTAMO', 'MONO', 'GORILA', 'OSO', 'LOBO', 'ZORRO', 'CIERVO', 'CANGURO', 'KOALA', 'PANDA', 'COALA', 'SERPIENTE', 'COCODRILO', 'TORTUGA', 'ÁGUILA', 'HALCÓN', 'PINGÜINO'],
    'Comida': ['PIZZA', 'HAMBURGUESA', 'PERRO CALIENTE', 'TACOS', 'ENCHILADAS', 'POLLO FRITO', 'PASTA', 'LASAGÑA', 'SUSHI', 'ARROZ', 'FRIJOLES', 'TORTILLA', 'QUESADILLA', 'BURRITO', 'CHILAQUILES', 'MOLE', 'POZOLE', 'TAMALES', 'EMPANADAS', 'AREPS', 'CACHAPA', 'PABELLÓN', 'BANDEJA PAISA', 'CEVICHE', 'CAUSA']
};

// Convertir categorías a array de palabras para compatibilidad
let palabrasPorDefecto = [];
Object.values(categorias).forEach(lista => {
    palabrasPorDefecto.push(...lista);
});

let words = JSON.parse(localStorage.getItem('undercover_words')) || palabrasPorDefecto;

let currentScreen = 'menu';
let gameState = {
    status: 'off',
    playersInGame: [],
    impostorIndexes: [],
    palabraSecreta: '',
    categoriaSecreta: '',
    impostorVeCategoria: false,
    currentRolIndex: 0,
    round: 1,
    votes: [],
    eliminatedPlayers: []
};

const app = document.getElementById('app');

// Modales
const modal = document.getElementById('modal');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

const voteModal = document.getElementById('voteModal');
const guessModal = document.getElementById('guessModal');
const guessInput = document.getElementById('guessInput');
const submitGuessBtn = document.getElementById('submitGuessBtn');
const guessModalClose = document.getElementById('guessModal-close');

// ---------- RENDER PRINCIPAL ----------
function renderScreen() {
    if (currentScreen === 'menu') renderMenu();
    else if (currentScreen === 'addPlayer') renderAddPlayer();
    else if (currentScreen === 'groupManager') renderGroupManager();
    else if (currentScreen === 'dictionary') renderDictionary();
    else if (currentScreen === 'gameSetup') renderGameSetup();
    else if (currentScreen === 'stats') renderStats();
    else if (currentScreen === 'asignarRoles') renderAsignarRoles();
    else if (currentScreen === 'juego') renderJuego();
    else if (currentScreen === 'votacion') renderVotacion();
    else if (currentScreen === 'finRonda') renderFinRonda();
    else renderMenu();
}

// ---------- MENÚ PRINCIPAL ----------
function renderMenu() {
    currentScreen = 'menu';
    let html = `
        <div class="screen">
            <h1>🔍 UNDERCOVER</h1>
            <p class="subtitle">El juego del impostor</p>
            <div class="menu-grid">
                <button class="btn btn-primary" id="btnAddPlayer">➕ Agregar Jugador</button>
                <button class="btn btn-primary" id="btnGroupManager">👥 Grupo</button>
                <button class="btn btn-primary" id="btnDictionary">📚 Diccionario</button>
                <button class="btn btn-primary" id="btnGameSetup">⚙️ Configurar Partida</button>
                <button class="btn btn-primary" id="btnStats">📊 Estadísticas</button>
                <button class="btn btn-success" id="btnStartGame">▶️ Iniciar Partida</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('btnAddPlayer')?.addEventListener('click', () => renderAddPlayer());
    document.getElementById('btnGroupManager')?.addEventListener('click', () => renderGroupManager());
    document.getElementById('btnDictionary')?.addEventListener('click', () => renderDictionary());
    document.getElementById('btnGameSetup')?.addEventListener('click', () => renderGameSetup());
    document.getElementById('btnStats')?.addEventListener('click', () => renderStats());
    document.getElementById('btnStartGame')?.addEventListener('click', () => iniciarPartida());
}

// ---------- AGREGAR JUGADOR ----------
function renderAddPlayer() {
    let html = `
        <div class="screen">
            <h2>Nuevo Jugador</h2>
            <input type="text" id="newPlayerName" placeholder="Nombre del jugador">
            <button class="btn btn-primary" id="saveNewPlayer">Guardar</button>
            <div class="back-button-container">
                <button class="btn btn-secondary" id="backToMenu">Volver</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('saveNewPlayer')?.addEventListener('click', () => {
        let name = document.getElementById('newPlayerName').value.trim();
        if(name) {
            players.push({
                id: Date.now() + Math.random(),
                nombre: name,
                partidas: 0,
                victoriasImp: 0,
                victoriasCiud: 0,
                derrotasImp: 0,
                derrotasCiud: 0,
                totalPuntos: 0,
                palabrasAdivinadas: 0
            });
            localStorage.setItem('undercover_players', JSON.stringify(players));
            renderGroupManager();
        } else alert('Escribe un nombre');
    });
    
    document.getElementById('backToMenu')?.addEventListener('click', renderMenu);
}

// ---------- GESTIÓN DE GRUPO ----------
function renderGroupManager() {
    let playersList = players.map((p, index) => `
        <div class="player-item">
            <span class="player-name">${p.nombre}</span>
            <div class="player-actions">
                <button class="edit-player" data-index="${index}">✏️</button>
                <button class="delete-player" data-index="${index}">❌</button>
            </div>
        </div>
    `).join('') || '<p style="color: gray;">No hay jugadores. Agrega uno.</p>';

    let html = `
        <div class="screen">
            <h2>Grupo de Jugadores</h2>
            <button class="btn btn-primary" id="addNewFromGroup">➕ Nuevo</button>
            <div class="players-list">
                ${playersList}
            </div>
            <div class="back-button-container">
                <button class="btn btn-secondary" id="backToMenu">Volver</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('addNewFromGroup')?.addEventListener('click', renderAddPlayer);
    document.getElementById('backToMenu')?.addEventListener('click', renderMenu);
    
    document.querySelectorAll('.delete-player').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let index = e.target.dataset.index;
            players.splice(index, 1);
            localStorage.setItem('undercover_players', JSON.stringify(players));
            renderGroupManager();
        });
    });
    
    document.querySelectorAll('.edit-player').forEach(btn => {
        btn.addEventListener('click', (e) => {
            let index = e.target.dataset.index;
            let newName = prompt('Nuevo nombre:', players[index].nombre);
            if(newName) {
                players[index].nombre = newName;
                localStorage.setItem('undercover_players', JSON.stringify(players));
                renderGroupManager();
            }
        });
    });
}

// ---------- DICCIONARIO CON CATEGORÍAS ----------
function renderDictionary() {
    let categoriasHtml = Object.keys(categorias).map(cat => `
        <div style="margin-bottom: 20px;">
            <h3 style="color: white; margin-bottom: 10px;">📁 ${cat}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 5px; margin-bottom: 10px;">
                ${categorias[cat].map(palabra => `
                    <span style="background: #2a2a3a; color: white; padding: 5px 10px; border-radius: 15px; font-size: 0.8rem;">${palabra}</span>
                `).join('')}
            </div>
        </div>
    `).join('');

    let html = `
        <div class="screen">
            <h2>📚 Diccionario por Categorías</h2>
            <p style="color: #a0a0a0; text-align: center; margin-bottom: 15px;">Cada categoría tiene 25 palabras</p>
            
            <div style="max-height: 400px; overflow-y: auto; padding: 10px;">
                ${categoriasHtml}
            </div>
            
            <div style="margin-top: 20px;">
                <button class="btn btn-primary" id="btnVolverDic">Volver al Menú</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('btnVolverDic')?.addEventListener('click', renderMenu);
}

// ---------- CONFIGURACIÓN DE PARTIDA (CON OPCIÓN DE CATEGORÍA PARA IMPOSTOR) ----------
function renderGameSetup() {
    let totalJugadores = players.length;
    let categoriasList = Object.keys(categorias).map(cat => 
        `<option value="${cat}">${cat}</option>`
    ).join('');
    
    let html = `
        <div class="screen">
            <h2>⚙️ Configurar Partida</h2>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin-bottom: 10px;">📊 Jugadores</h3>
                <div class="range-container">
                    <span>Jugadores disponibles: ${totalJugadores}</span>
                </div>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin-bottom: 10px;">🎭 Roles</h3>
                <div class="range-container">
                    <span>Número de impostores: <span id="impCount">1</span></span>
                    <input type="range" id="impRange" min="1" max="${Math.max(1, Math.min(3, Math.floor(totalJugadores/2)))}" value="1" step="1">
                </div>
                <div class="range-container">
                    <span>Ciudadanos: <span id="ciudCount">${totalJugadores-1}</span></span>
                </div>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin-bottom: 10px;">🔪 Impostor</h3>
                <label style="display: flex; align-items: center; gap: 10px; color: white;">
                    <input type="checkbox" id="impostorVeCategoria">
                    <span>El impostor puede ver la categoría de la palabra</span>
                </label>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 15px; margin: 10px 0;">
                <h3 style="color: white; margin-bottom: 10px;">📁 Categoría</h3>
                <select id="categoriaSelect" style="width: 100%; padding: 15px; border-radius: 15px; background: #2a2a3a; color: white; border: 1px solid #3a3a4a;">
                    <option value="aleatoria">🎲 Categoría Aleatoria</option>
                    ${categoriasList}
                </select>
            </div>
            
            <div class="back-button-container" style="margin-top: 20px;">
                <button class="btn btn-secondary" id="backToMenu">Volver</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    let impRange = document.getElementById('impRange');
    let impSpan = document.getElementById('impCount');
    let ciudSpan = document.getElementById('ciudCount');
    
    if(impRange) {
        impRange.addEventListener('input', () => {
            let imp = parseInt(impRange.value);
            impSpan.innerText = imp;
            ciudSpan.innerText = totalJugadores - imp;
        });
    }
    
    document.getElementById('backToMenu')?.addEventListener('click', renderMenu);
}

// ---------- ESTADÍSTICAS ----------
function renderStats() {
    let statsPlayers = [...players].sort((a,b) => b.totalPuntos - a.totalPuntos);
    let rows = statsPlayers.map((p, idx) => {
        let posClass = idx === 0 ? 'pos-1' : (idx === 1 ? 'pos-2' : (idx === 2 ? 'pos-3' : 'pos-rest'));
        return `
            <div class="stats-row">
                <span class="${posClass}">#${idx+1}</span>
                <span>${p.nombre}</span>
                <span>${p.partidas}</span>
                <span>${p.victoriasImp}</span>
                <span>${p.totalPuntos}</span>
            </div>
        `;
    }).join('');

    let html = `
        <div class="screen">
            <h2>📊 Estadísticas</h2>
            <div class="stats-table">
                <div class="stats-row stats-header">
                    <span>#</span><span>Nombre</span><span>PJ</span><span>V-Imp</span><span>Pts</span>
                </div>
                ${rows}
            </div>
            <div class="back-button-container">
                <button class="btn btn-secondary" id="backToMenu">Volver</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    document.getElementById('backToMenu')?.addEventListener('click', renderMenu);
}

// ---------- INICIAR PARTIDA (CON CATEGORÍAS) ----------
function iniciarPartida() {
    if(players.length < 3) {
        alert('Necesitas al menos 3 jugadores');
        return;
    }
    
    // Obtener configuración
    let numImpostores = parseInt(document.getElementById('impRange')?.value || '1');
    let impostorVeCategoria = document.getElementById('impostorVeCategoria')?.checked || false;
    let categoriaElegida = document.getElementById('categoriaSelect')?.value || 'aleatoria';
    
    // Seleccionar categoría y palabra
    let categoriaSeleccionada = '';
    let palabraSeleccionada = '';
    
    if (categoriaElegida === 'aleatoria') {
        let categoriasList = Object.keys(categorias);
        categoriaSeleccionada = categoriasList[Math.floor(Math.random() * categoriasList.length)];
        let palabrasCategoria = categorias[categoriaSeleccionada];
        palabraSeleccionada = palabrasCategoria[Math.floor(Math.random() * palabrasCategoria.length)];
    } else {
        categoriaSeleccionada = categoriaElegida;
        let palabrasCategoria = categorias[categoriaElegida];
        palabraSeleccionada = palabrasCategoria[Math.floor(Math.random() * palabrasCategoria.length)];
    }
    
    gameState = {
        status: 'asignando',
        playersInGame: players.map(p => ({ ...p })),
        impostorIndexes: [],
        palabraSecreta: palabraSeleccionada,
        categoriaSecreta: categoriaSeleccionada,
        impostorVeCategoria: impostorVeCategoria,
        currentRolIndex: 0,
        round: 1,
        votes: [],
        eliminatedPlayers: []
    };

    let total = gameState.playersInGame.length;
    while(gameState.impostorIndexes.length < numImpostores) {
        let r = Math.floor(Math.random() * total);
        if(!gameState.impostorIndexes.includes(r)) gameState.impostorIndexes.push(r);
    }

    currentScreen = 'asignarRoles';
    renderScreen();
}

// ---------- ASIGNAR ROLES (CON CATEGORÍA PARA IMPOSTOR) ----------
function renderAsignarRoles() {
    if(gameState.currentRolIndex >= gameState.playersInGame.length) {
        currentScreen = 'juego';
        renderScreen();
        return;
    }

    let jugador = gameState.playersInGame[gameState.currentRolIndex];
    let esImpostor = gameState.impostorIndexes.includes(gameState.currentRolIndex);
    
    let contenidoRol = '';
    if (esImpostor) {
        if (gameState.impostorVeCategoria) {
            contenidoRol = `<p class="impostor-msg">🔪 ERES EL IMPOSTOR</p><p style="color: #ffd700; margin-top: 10px;">Categoría: ${gameState.categoriaSecreta}</p>`;
        } else {
            contenidoRol = '<p class="impostor-msg">🔪 ERES EL IMPOSTOR</p>';
        }
    } else {
        contenidoRol = `<p>Palabra: ${gameState.palabraSecreta}</p><p style="color: #a0a0a0; font-size: 0.9rem;">Categoría: ${gameState.categoriaSecreta}</p>`;
    }
    
    let html = `
        <div class="screen" style="justify-content: center;">
            <div class="rol-card" id="rolCard">
                <h2 id="playerNameDisplay">${jugador.nombre}</h2>
                <div id="rolContent" style="display: none;">
                    ${contenidoRol}
                </div>
            </div>
            <button class="btn btn-primary" id="revelarRol">Mostrar Rol</button>
            <button class="btn btn-success" id="siguienteRol" style="display: none;">Aceptar y Siguiente</button>
        </div>
    `;
    app.innerHTML = html;

    document.getElementById('revelarRol').addEventListener('click', () => {
        document.getElementById('playerNameDisplay').style.display = 'none';
        document.getElementById('rolContent').style.display = 'block';
        document.getElementById('revelarRol').style.display = 'none';
        document.getElementById('siguienteRol').style.display = 'block';
    });

    document.getElementById('siguienteRol').addEventListener('click', () => {
        gameState.currentRolIndex++;
        renderAsignarRoles();
    });
}

// ---------- PANTALLA DE JUEGO ----------
function renderJuego() {
    if(gameState.eliminatedPlayers.length === gameState.playersInGame.length - 1) {
        terminarJuego('impostor');
        return;
    }

    currentScreen = 'juego';
    let html = `
        <div class="screen game-screen-black">
            <h2>🔍 Juego en curso</h2>
            <p style="color: #aaa;">Ronda ${gameState.round}</p>
            <p style="color: #ccc; text-align:center;">Categoría: ${gameState.categoriaSecreta}</p>
            <p style="color: #ccc; text-align:center;">Hagan preguntas de sí/no<br>en persona</p>
            <button class="btn btn-primary" id="abrirVotacionBtn">🗳️ Iniciar Votación</button>
            <div class="back-button-container" style="width:100%;">
                <button class="btn btn-secondary" id="salirAlMenu">Salir al menú</button>
            </div>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('abrirVotacionBtn').addEventListener('click', () => {
        currentScreen = 'votacion';
        renderScreen();
    });
    
    document.getElementById('salirAlMenu').addEventListener('click', renderMenu);
}

// ---------- VOTACIÓN DEFINITIVA ----------
function renderVotacion() {
    let activePlayers = gameState.playersInGame.filter((_, idx) => !gameState.eliminatedPlayers.includes(idx));
    let votos = [];
    let votanteActual = 0;
    
    let html = `
        <div class="screen">
            <h2>🗳️ VOTACIÓN - Ronda ${gameState.round}</h2>
            
            <!-- Indicador de quién vota ahora -->
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 20px; padding: 20px; margin: 10px 0; text-align: center;">
                <div style="font-size: 1.2rem; color: white; margin-bottom: 5px;">🎯 Le toca votar a:</div>
                <div style="font-size: 2rem; color: white; font-weight: bold;" id="nombreVotante">${activePlayers[0]?.nombre || ''}</div>
                <div style="color: rgba(255,255,255,0.8); margin-top: 5px;" id="contadorVotos">Voto 1 de ${activePlayers.length}</div>
            </div>
            
            <!-- Lista de jugadores para votar -->
            <p style="color: #a0a0a0; text-align: center; margin: 10px 0;">Toca el nombre de tu sospechoso</p>
            
            <div class="players-list" id="votacionList" style="margin-top: 5px;">
                ${activePlayers.map((p, idx) => {
                    let originalIndex = gameState.playersInGame.findIndex(sp => sp.id === p.id);
                    return `
                        <div class="vote-player-card" data-originalindex="${originalIndex}" data-voteforindex="${originalIndex}">
                            <div class="vote-player-avatar">${p.nombre.charAt(0).toUpperCase()}</div>
                            <div class="vote-player-info">
                                <div class="vote-player-name">${p.nombre}</div>
                                <div class="vote-player-status">
                                    ${gameState.impostorIndexes.includes(originalIndex) ? '🔪 Impostor' : '👤 Ciudadano'}
                                </div>
                            </div>
                            <div class="vote-count-badge" style="display: none;">0</div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <!-- Botones de control -->
            <div style="display: flex; gap: 10px; margin-top: 20px;">
                <button class="btn btn-secondary" style="flex: 1;" id="reiniciarVotosBtn">🔄 Reiniciar</button>
                <button class="btn btn-primary" style="flex: 1;" id="finalizarVotacionBtn">🔍 Ver Resultado</button>
            </div>
            
            <div class="back-button-container">
                <button class="btn btn-secondary" id="volverJuego">◀️ Volver al juego</button>
            </div>
        </div>
    `;
    
    app.innerHTML = html;
    
    let nombreVotante = document.getElementById('nombreVotante');
    let contadorVotos = document.getElementById('contadorVotos');
    let reiniciarBtn = document.getElementById('reiniciarVotosBtn');
    let finalizarBtn = document.getElementById('finalizarVotacionBtn');
    
    // Función para actualizar badges de votos
    function actualizarBadges() {
        document.querySelectorAll('.vote-count-badge').forEach(badge => {
            badge.style.display = 'none';
        });
        
        let conteo = {};
        votos.forEach(v => {
            conteo[v.votadoIndex] = (conteo[v.votadoIndex] || 0) + 1;
        });
        
        Object.keys(conteo).forEach(idx => {
            let card = document.querySelector(`.vote-player-card[data-originalindex="${idx}"]`);
            if (card) {
                let badge = card.querySelector('.vote-count-badge');
                badge.style.display = 'block';
                badge.textContent = `${conteo[idx]} ${conteo[idx] === 1 ? 'voto' : 'votos'}`;
            }
        });
    }
    
    // Función para actualizar el votante actual
    function actualizarVotanteActual() {
        if (votanteActual < activePlayers.length) {
            nombreVotante.textContent = activePlayers[votanteActual].nombre;
            contadorVotos.textContent = `Voto ${votos.length + 1} de ${activePlayers.length}`;
        } else {
            nombreVotante.textContent = "✓ Votación completa";
            contadorVotos.textContent = `${activePlayers.length} votos emitidos`;
        }
    }
    
    // Event listener para las tarjetas (votar)
    document.querySelectorAll('.vote-player-card').forEach(card => {
        card.addEventListener('click', function() {
            if (votanteActual >= activePlayers.length) {
                mostrarToast('✓ Todos ya votaron');
                return;
            }
            
            let votadoIndex = parseInt(this.dataset.voteforindex);
            let votanteNombre = activePlayers[votanteActual].nombre;
            let votadoNombre = gameState.playersInGame[votadoIndex].nombre;
            
            votos.push({
                votanteIndex: votanteActual,
                votadoIndex: votadoIndex
            });
            
            this.style.backgroundColor = '#2a2a4a';
            this.style.borderColor = '#667eea';
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.style.borderColor = '';
            }, 200);
            
            mostrarToast(`🗳️ ${votanteNombre} votó por ${votadoNombre}`);
            
            actualizarBadges();
            
            votanteActual++;
            actualizarVotanteActual();
        });
    });
    
    // Botón reiniciar
    reiniciarBtn.addEventListener('click', () => {
        votos = [];
        votanteActual = 0;
        actualizarBadges();
        actualizarVotanteActual();
        mostrarToast('🔄 Votación reiniciada');
    });
    
    // Botón finalizar
    finalizarBtn.addEventListener('click', () => {
        if (votos.length === 0) {
            mostrarToast('❌ Debe haber al menos un voto');
            return;
        }
        
        let conteo = {};
        votos.forEach(v => {
            conteo[v.votadoIndex] = (conteo[v.votadoIndex] || 0) + 1;
        });
        
        let maxVotos = 0;
        let masVotado = null;
        
        Object.keys(conteo).forEach(idx => {
            if (conteo[idx] > maxVotos) {
                maxVotos = conteo[idx];
                masVotado = parseInt(idx);
            }
        });
        
        let eliminadoIdx = masVotado;
        let jugadorEliminado = gameState.playersInGame[eliminadoIdx];
        let esImpostor = gameState.impostorIndexes.includes(eliminadoIdx);
        
        modalTitle.textContent = esImpostor ? '🎉 ¡Impostor Descubierto!' : '😢 ¡Votación Errónea!';
        
        let mensaje = esImpostor 
            ? `✅ ¡Correcto! ${jugadorEliminado.nombre} era el IMPOSTOR.`
            : `❌ Oh no... ${jugadorEliminado.nombre} NO era el impostor. Era un ciudadano.`;
        
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 3rem; margin-bottom: 15px;">${esImpostor ? '🎯' : '💔'}</div>
                <h3 style="color: ${esImpostor ? '#00ff00' : '#ff6b6b'}; font-size: 2rem; margin: 10px 0;">${jugadorEliminado.nombre}</h3>
                <p style="color: white; margin: 20px 0; font-size: 1.2rem;">${mensaje}</p>
                <div style="background: #1e1e2e; border-radius: 15px; padding: 15px; margin-top: 15px;">
                    <p style="color: #ffd700; margin: 0;">🗳️ Recibió ${maxVotos} ${maxVotos === 1 ? 'voto' : 'votos'}</p>
                    <p style="color: #a0a0a0; margin-top: 5px; font-size: 0.9rem;">Total de votos: ${votos.length}</p>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        modalClose.onclick = () => {
            modal.classList.add('hidden');
            
            if (esImpostor) {
                gameState.eliminatedPlayers.push(eliminadoIdx);
                terminarJuego('ciudadanos');
            } else {
                if (!gameState.eliminatedPlayers.includes(eliminadoIdx)) {
                    gameState.eliminatedPlayers.push(eliminadoIdx);
                }
                
                let active = gameState.playersInGame.filter((_, idx) => !gameState.eliminatedPlayers.includes(idx));
                
                if (active.length <= 2) {
                    terminarJuego('impostor');
                } else {
                    gameState.round++;
                    currentScreen = 'juego';
                    renderScreen();
                }
            }
        };
    });
    
    document.getElementById('volverJuego').addEventListener('click', () => {
        currentScreen = 'juego';
        renderScreen();
    });
    
    actualizarVotanteActual();
}

// ---------- TERMINAR JUEGO ----------
function terminarJuego(ganador) {
    let impostorIndexes = gameState.impostorIndexes;
    let ciudadanoIndexes = gameState.playersInGame.map((_, idx) => idx).filter(i => !impostorIndexes.includes(i));

    if (ganador === 'ciudadanos') {
        ciudadanoIndexes.forEach(idx => {
            if (!gameState.eliminatedPlayers.includes(idx)) {
                let p = gameState.playersInGame[idx];
                let originalPlayer = players.find(pl => pl.id === p.id);
                if (originalPlayer) {
                    originalPlayer.partidas++;
                    originalPlayer.victoriasCiud++;
                    originalPlayer.totalPuntos += 2;
                }
            }
        });
        
        impostorIndexes.forEach(idx => {
            let p = gameState.playersInGame[idx];
            let originalPlayer = players.find(pl => pl.id === p.id);
            if (originalPlayer) {
                originalPlayer.partidas++;
                originalPlayer.derrotasImp++;
            }
        });
    } else {
        impostorIndexes.forEach(idx => {
            if (!gameState.eliminatedPlayers.includes(idx)) {
                let p = gameState.playersInGame[idx];
                let originalPlayer = players.find(pl => pl.id === p.id);
                if (originalPlayer) {
                    originalPlayer.partidas++;
                    originalPlayer.victoriasImp++;
                    originalPlayer.totalPuntos += 5;
                }
            }
        });
        
        ciudadanoIndexes.forEach(idx => {
            let p = gameState.playersInGame[idx];
            let originalPlayer = players.find(pl => pl.id === p.id);
            if (originalPlayer) {
                originalPlayer.partidas++;
                originalPlayer.derrotasCiud++;
            }
        });
    }

    localStorage.setItem('undercover_players', JSON.stringify(players));

    currentScreen = 'finRonda';
    renderFinRonda(ganador);
}

// ---------- FIN DE RONDA ----------
function renderFinRonda(ganador) {
    let mensaje = ganador === 'ciudadanos' 
        ? '🎉 ¡Victoria de los Ciudadanos!' 
        : '🔪 ¡El Impostor Gana!';
    
    let impostorNames = gameState.impostorIndexes.map(idx => gameState.playersInGame[idx].nombre).join(', ');
    
    let html = `
        <div class="screen" style="justify-content: center; text-align: center; gap:20px;">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 30px; padding: 30px; margin: 0;">
                <h1 style="color: white; font-size: 2rem;">${mensaje}</h1>
                <p style="color: #ffd700; margin-top: 20px;">🔪 El impostor era: <strong>${impostorNames}</strong></p>
                <p style="color: white;">Palabra: <strong>${gameState.palabraSecreta}</strong></p>
                <p style="color: #a0a0a0;">Categoría: ${gameState.categoriaSecreta}</p>
            </div>
            
            <div style="background: #1e1e2e; border-radius: 20px; padding: 20px;">
                <h3 style="color: white;">📊 Puntos</h3>
                <p style="color: #a0a0a0;">Ciudadanos: +2 cada uno</p>
                <p style="color: #a0a0a0;">Impostor: +5 si gana</p>
            </div>
            
            <button class="btn btn-primary" id="nuevaPartida">🔄 Jugar otra ronda</button>
            <button class="btn btn-secondary" id="menuPrincipal">🏠 Menú Principal</button>
        </div>
    `;
    
    app.innerHTML = html;
    
    document.getElementById('nuevaPartida')?.addEventListener('click', () => {
        iniciarPartida();
    });
    
    document.getElementById('menuPrincipal')?.addEventListener('click', renderMenu);
}

// ---------- FUNCIÓN AUXILIAR PARA TOAST ----------
function mostrarToast(mensaje) {
    let toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 15px 25px;
        border-radius: 30px;
        font-size: 1rem;
        z-index: 2000;
        animation: fadeInUp 0.3s ease;
        border-left: 5px solid #667eea;
        box-shadow: 0 5px 20px rgba(0,0,0,0.5);
        font-weight: 500;
    `;
    toast.textContent = mensaje;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 2000);
}

// Inicializar
renderScreen();

// Cerrar modales
modalClose.addEventListener('click', () => modal.classList.add('hidden'));
guessModalClose.addEventListener('click', () => guessModal.classList.add('hidden'));
window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.add('hidden');
    if (e.target === guessModal) guessModal.classList.add('hidden');
});
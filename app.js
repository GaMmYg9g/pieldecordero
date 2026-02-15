// ---------- MÚSICA DE FONDO AMBIENTAL ----------
const AmbientMusic = {
    audioContext: null,
    isPlaying: false,
    gainNode: null,
    lowOscillator: null,
    midOscillator: null,
    highOscillator: null,
    
    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        return this.audioContext;
    },
    
    createOscillators() {
        const ctx = this.audioContext;
        
        this.gainNode = ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
        this.gainNode.connect(ctx.destination);
        
        this.lowOscillator = ctx.createOscillator();
        this.lowOscillator.type = 'sine';
        this.lowOscillator.frequency.setValueAtTime(65.41, ctx.currentTime);
        
        this.midOscillator = ctx.createOscillator();
        this.midOscillator.type = 'sine';
        this.midOscillator.frequency.setValueAtTime(130.81, ctx.currentTime);
        
        this.highOscillator = ctx.createOscillator();
        this.highOscillator.type = 'sine';
        this.highOscillator.frequency.setValueAtTime(261.63, ctx.currentTime);
        
        this.lowOscillator.connect(this.gainNode);
        this.midOscillator.connect(this.gainNode);
        this.highOscillator.connect(this.gainNode);
    },
    
    play() {
        if (this.isPlaying) return;
        
        const ctx = this.initAudio();
        if (ctx.state === 'suspended') {
            ctx.resume();
        }
        
        this.createOscillators();
        
        const now = ctx.currentTime;
        
        this.lowOscillator.start(now);
        this.lowOscillator.frequency.setValueAtTime(65.41, now);
        this.lowOscillator.frequency.linearRampToValueAtTime(73.42, now + 8);
        this.lowOscillator.frequency.linearRampToValueAtTime(65.41, now + 16);
        this.lowOscillator.frequency.linearRampToValueAtTime(61.74, now + 24);
        this.lowOscillator.frequency.linearRampToValueAtTime(65.41, now + 32);
        
        this.midOscillator.start(now);
        this.midOscillator.frequency.setValueAtTime(130.81, now);
        this.midOscillator.frequency.linearRampToValueAtTime(146.83, now + 6);
        this.midOscillator.frequency.linearRampToValueAtTime(130.81, now + 12);
        this.midOscillator.frequency.linearRampToValueAtTime(123.47, now + 18);
        this.midOscillator.frequency.linearRampToValueAtTime(130.81, now + 24);
        this.midOscillator.frequency.linearRampToValueAtTime(110.00, now + 30);
        this.midOscillator.frequency.linearRampToValueAtTime(130.81, now + 36);
        
        setTimeout(() => {
            if (this.isPlaying) {
                this.highOscillator.start(ctx.currentTime);
                this.highOscillator.frequency.setValueAtTime(261.63, ctx.currentTime);
                this.highOscillator.frequency.linearRampToValueAtTime(293.66, ctx.currentTime + 10);
                this.highOscillator.frequency.linearRampToValueAtTime(261.63, ctx.currentTime + 20);
                this.highOscillator.frequency.linearRampToValueAtTime(246.94, ctx.currentTime + 30);
                this.highOscillator.frequency.linearRampToValueAtTime(261.63, ctx.currentTime + 40);
            }
        }, 4000);
        
        this.isPlaying = true;
    },
    
    stop() {
        if (!this.isPlaying) return;
        
        const now = this.audioContext?.currentTime;
        if (now) {
            this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
            this.gainNode.gain.linearRampToValueAtTime(0, now + 2);
            
            setTimeout(() => {
                try {
                    this.lowOscillator?.stop();
                    this.midOscillator?.stop();
                    this.highOscillator?.stop();
                } catch (e) {}
                this.isPlaying = false;
            }, 2000);
        } else {
            this.isPlaying = false;
        }
    },
    
    toggleForScreen(screenName) {
        if (screenName === 'menu' || screenName === 'asignarRoles' || screenName === 'juego' || screenName === 'votacion') {
            this.play();
        } else {
            this.stop();
        }
    }
};

// ---------- SISTEMA DE SONIDO ----------
const SoundEffects = {
    audioContext: null,
    
    initAudio() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    },
    
    playRevealSound() {
        this.initAudio();
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
        
        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.3);
    },
    
    playVoteSound() {
        this.initAudio();
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(330, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(660, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
        
        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.15);
    },
    
    playImpostorFoundSound() {
        this.initAudio();
        const now = this.audioContext.currentTime;
        
        const frequencies = [523.25, 659.25, 783.99, 1046.50];
        frequencies.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            osc.type = 'sine';
            osc.frequency.value = freq;
            
            gainNode.gain.setValueAtTime(0.3, now + i * 0.15);
            gainNode.gain.exponentialRampToValueAtTime(0.01, now + i * 0.15 + 0.3);
            
            osc.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.3);
        });
    },
    
    playErrorSound() {
        this.initAudio();
        const osc = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(110, this.audioContext.currentTime + 0.3);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        
        osc.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        osc.start();
        osc.stop(this.audioContext.currentTime + 0.4);
    },
    
    playRoundEndSound(ganador) {
        this.initAudio();
        if (ganador === 'ciudadanos') {
            this.playImpostorFoundSound();
        } else {
            const osc = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(110, this.audioContext.currentTime);
            osc.frequency.exponentialRampToValueAtTime(55, this.audioContext.currentTime + 0.5);
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.6);
            
            osc.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            osc.start();
            osc.stop(this.audioContext.currentTime + 0.6);
        }
    }
};

// ---------- SISTEMA DE VERSIONES PROFESIONAL ----------
const VERSION_HISTORY = {
    actual: "2.0.0",
    historial: [
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

// ---------- ANIMACIONES CSS ----------
const animacionesCSS = `
    @keyframes fadeInScale {
        0% { opacity: 0; transform: scale(0.8); }
        100% { opacity: 1; transform: scale(1); }
    }
    
    @keyframes slideInFromBottom {
        0% { opacity: 0; transform: translateY(50px); }
        100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes pulse {
        0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(102, 126, 234, 0.7); }
        70% { transform: scale(1.05); box-shadow: 0 0 0 10px rgba(102, 126, 234, 0); }
        100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(102, 126, 234, 0); }
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    @keyframes glow {
        0% { box-shadow: 0 0 5px #667eea; }
        50% { box-shadow: 0 0 20px #667eea, 0 0 30px #764ba2; }
        100% { box-shadow: 0 0 5px #667eea; }
    }
    
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }
    
    @keyframes bounceIn {
        0% { transform: scale(0); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    @keyframes slideUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes rotateY {
        from { transform: rotateY(0deg); }
        to { transform: rotateY(360deg); }
    }
    
    @keyframes slideDown {
        from { transform: translateY(-100%); }
        to { transform: translateY(0); }
    }
    
    .animate-fade-in { animation: fadeInScale 0.5s ease-out; }
    .animate-slide-up { animation: slideInFromBottom 0.5s ease-out; }
    .animate-pulse { animation: pulse 1s infinite; }
    .animate-shake { animation: shake 0.5s ease-in-out; }
    .animate-glow { animation: glow 2s infinite; }
    .animate-float { animation: float 3s ease-in-out infinite; }
    .animate-bounce { animation: bounceIn 0.3s ease; }
    
    .vote-player-card {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .vote-player-card:hover {
        transform: translateY(-5px) scale(1.02);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }
    
    .vote-player-card:active {
        transform: scale(0.98);
    }
    
    .rol-card {
        transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }
    
    .rol-card.revealed {
        animation: rotateY 0.5s ease-out;
    }
    
    .vote-count-badge {
        animation: bounceIn 0.3s ease;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = animacionesCSS;
document.head.appendChild(styleSheet);

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
    eliminatedPlayers: [],
    ordenPreguntas: []
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

// Iniciar música con el primer click
document.addEventListener('click', function initMusicOnFirstClick() {
    AmbientMusic.play();
    document.removeEventListener('click', initMusicOnFirstClick);
}, { once: true });

// ---------- RENDER PRINCIPAL ----------
function renderScreen() {
    AmbientMusic.toggleForScreen(currentScreen);
    
    // Si es la primera vez, iniciar tutorial automáticamente
    if (!tutorialCompletado && !tutorialActivo && currentScreen === 'menu') {
        setTimeout(() => {
            iniciarTutorial();
        }, 500);
    }
    
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

// ---------- MENÚ PRINCIPAL (CON VERSIONES) ----------
function renderMenu() {
    currentScreen = 'menu';
    let html = `
        <div class="screen" style="padding: 15px;">
            <h1 class="neon-title">🐑Ovejas y Lobos🐺</h1>
            <p class="subtitle" style="color: #a0a0a0; text-align: center; margin-bottom: 20px;">¡Descubre al Lobo antes de que sea tarde!</p>
            
            <!-- Controles de música con estilo -->
            <div class="glass-card" style="display: flex; justify-content: center; gap: 10px; margin-bottom: 15px;">
                <button class="btn-modern" id="musicOnBtn" style="background: #4CAF50; flex: 1; ${AmbientMusic.isPlaying ? 'display: none;' : ''}">🎵 Activar</button>
                <button class="btn-modern" id="musicOffBtn" style="background: #f44336; flex: 1; ${!AmbientMusic.isPlaying ? 'display: none;' : ''}">🔇 Silenciar</button>
            </div>
            
            <!-- Botón de Tutorial destacado -->
            <div style="margin: 15px 0;">
                <button class="btn-warning-modern" id="btnTutorial" style="width: 100%;">
                    📖 ${tutorialCompletado ? 'Ver Tutorial' : '🎮 ¡Tutorial Interactivo!'}
                </button>
            </div>
            
            <!-- Versión y changelog -->
            <div style="display: flex; justify-content: center; gap: 10px; margin: 15px 0;">
                <button class="btn-version" id="btnVersion" style="background: transparent; color: #667eea; border: 2px solid #667eea; border-radius: 25px; padding: 8px 20px; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease; display: flex; align-items: center; gap: 5px;">
                    <span style="font-size: 1.2rem;">🏷️</span>
                    <span style="font-weight: bold;">v${VERSION_ACTUAL}</span>
                    <span style="background: #ffd700; color: #1a1a2e; border-radius: 15px; padding: 2px 8px; font-size: 0.7rem; margin-left: 5px;">Beta</span>
                </button>
                
                <button class="btn-version" id="btnChangelog" style="background: transparent; color: #4CAF50; border: 2px solid #4CAF50; border-radius: 25px; padding: 8px 20px; font-size: 0.9rem; cursor: pointer; transition: all 0.3s ease;">
                    📋 Historial
                </button>
            </div>
            
            <!-- Menú principal con tarjetas -->
            <div class="glass-card" style="display: flex; flex-direction: column; gap: 8px;">
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
    
    // Event listeners
    document.getElementById('musicOnBtn')?.addEventListener('click', () => {
        AmbientMusic.play();
        renderMenu();
    });
    
    document.getElementById('musicOffBtn')?.addEventListener('click', () => {
        AmbientMusic.stop();
        renderMenu();
    });
    
    document.getElementById('btnTutorial')?.addEventListener('click', iniciarTutorial);
    document.getElementById('btnVersion')?.addEventListener('click', mostrarVersionActual);
    document.getElementById('btnChangelog')?.addEventListener('click', mostrarChangelog);
    
    document.getElementById('btnAddPlayer')?.addEventListener('click', () => renderAddPlayer());
    document.getElementById('btnGroupManager')?.addEventListener('click', () => renderGroupManager());
    document.getElementById('btnDictionary')?.addEventListener('click', () => renderDictionary());
    document.getElementById('btnGameSetup')?.addEventListener('click', () => renderGameSetup());
    document.getElementById('btnStats')?.addEventListener('click', () => renderStats());
    document.getElementById('btnStartGame')?.addEventListener('click', () => iniciarPartida());
}

// ---------- FUNCIONES DE VERSIÓN ----------
function mostrarVersionActual() {
    let versionActual = VERSION_HISTORY.historial.find(v => v.version === VERSION_ACTUAL);
    
    modalTitle.textContent = `📦 Versión ${versionActual.version} ${versionActual.nombre}`;
    modalBody.innerHTML = `
        <div style="text-align: center; padding: 15px;">
            <div style="background: linear-gradient(135deg, #667eea, #764ba2); border-radius: 15px; padding: 15px; margin-bottom: 15px;">
                <p style="color: white; font-size: 1.2rem;">🏷️ v${versionActual.version}</p>
                <p style="color: #ffd700;">${versionActual.fecha}</p>
                <p style="color: white; margin-top: 5px; background: rgba(255,255,255,0.2); border-radius: 20px; padding: 5px 10px; display: inline-block;">
                    ${versionActual.tipo === 'major' ? '🌟 Gran Actualización' : '✨ Mejoras'}
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
    modal.classList.remove('hidden');
}

function mostrarChangelog() {
    let historialHTML = VERSION_HISTORY.historial.map(v => {
        let color = v.tipo === 'major' ? '#ff6b6b' : (v.tipo === 'minor' ? '#ffd700' : '#4CAF50');
        let badge = v.tipo === 'major' ? '🌟' : (v.tipo === 'minor' ? '✨' : '🔧');
        let cambios = v.cambios.map(c => `<span style="display: block; margin: 5px 0;">&nbsp;&nbsp;• ${c}</span>`).join('');
        
        return `
            <div style="margin-bottom: 20px; padding: 15px; background: rgba(255,255,255,0.05); border-radius: 15px; border-left: 4px solid ${color};">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="color: ${color}; font-weight: bold; font-size: 1.1rem;">
                        ${badge} v${v.version} ${v.nombre}
                    </span>
                    <span style="color: #a0a0a0; font-size: 0.8rem;">${v.fecha}</span>
                </div>
                <div style="color: white; font-size: 0.9rem; line-height: 1.5;">${cambios}</div>
            </div>
        `;
    }).join('');

    modalTitle.textContent = "📋 Historial de Versiones";
    modalBody.innerHTML = `
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
    modal.classList.remove('hidden');
}

// ---------- AGREGAR JUGADOR ----------
function renderAddPlayer() {
    let html = `
        <div class="screen" style="padding: 15px;">
            <h2 class="neon-title" style="font-size: 2rem;">➕ Nuevo Jugador</h2>
            
            <div class="glass-card" style="margin: 20px 0;">
                <input type="text" id="newPlayerName" placeholder="Nombre del jugador" 
                       style="width: 100%; padding: 15px; border-radius: 15px; border: 2px solid #667eea; 
                              background: rgba(255,255,255,0.1); color: white; font-size: 1.1rem;
                              box-shadow: 0 0 15px rgba(102,126,234,0.3);">
            </div>
            
            <button class="btn-modern" id="saveNewPlayer" style="margin: 10px 0; padding: 15px; font-size: 1.1rem;">
                💾 Guardar Jugador
            </button>
            
            <button class="btn-modern" id="backToMenu" style="background: #2a2a3a; margin-top: 10px;">
                🔙 Volver al Corral
            </button>
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
        } else {
            mostrarToast('❌ Escribe un nombre');
        }
    });
    
    document.getElementById('backToMenu')?.addEventListener('click', renderMenu);
}

// ---------- GESTIÓN DE GRUPO ----------
function renderGroupManager() {
    let playersList = players.map((p, index) => `
        <div class="vote-card-modern" style="animation-delay: ${index * 0.1}s; margin: 5px 0;">
            <div class="vote-avatar-modern">${p.nombre.charAt(0).toUpperCase()}</div>
            <div class="vote-info-modern">
                <div class="vote-name-modern">${p.nombre}</div>
                <div class="vote-status-modern">🐑 Oveja del rebaño</div>
            </div>
            <div style="display: flex; gap: 5px;">
                <button class="edit-player" data-index="${index}" 
                        style="background: #ff9800; border: none; border-radius: 10px; padding: 8px 12px; color: white; cursor: pointer;">✏️</button>
                <button class="delete-player" data-index="${index}" 
                        style="background: #f44336; border: none; border-radius: 10px; padding: 8px 12px; color: white; cursor: pointer;">❌</button>
            </div>
        </div>
    `).join('') || '<p style="color: gray; text-align: center; padding: 20px;">🐑 No hay ovejas en el rebaño. Agrega una.</p>';

    let html = `
        <div class="screen" style="padding: 15px;">
            <h2 class="neon-title" style="font-size: 2rem;">🐑 Rebaño 🐑</h2>
            
            <button class="btn-modern" id="addNewFromGroup" style="margin: 10px 0; background: linear-gradient(135deg, #00b09b, #96c93d);">
                ➕ Agregar Nueva Oveja
            </button>
            
            <div class="glass-card" style="max-height: 400px; overflow-y: auto; padding: 10px;">
                ${playersList}
            </div>
            
            <button class="btn-modern" id="backToMenu" style="background: #2a2a3a; margin-top: 15px;">
                🔙 Volver al Corral
            </button>
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

// ---------- DICCIONARIO ----------
function renderDictionary() {
    let categoriasHtml = Object.keys(categorias).map(cat => `
        <div class="glass-card" style="margin-bottom: 20px; padding: 15px;">
            <h3 style="color: #ffd700; margin-bottom: 15px; font-size: 1.3rem;">📁 ${cat}</h3>
            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${categorias[cat].map(palabra => `
                    <span style="background: rgba(102,126,234,0.2); border: 1px solid #667eea; 
                               color: white; padding: 6px 12px; border-radius: 20px; font-size: 0.85rem;
                               box-shadow: 0 2px 5px rgba(0,0,0,0.2);">${palabra}</span>
                `).join('')}
            </div>
        </div>
    `).join('');

    let html = `
        <div class="screen" style="padding: 15px;">
            <h2 class="neon-title" style="font-size: 2rem;">📚 Diccionario</h2>
            <p style="color: #a0a0a0; text-align: center; margin-bottom: 15px;">${Object.keys(categorias).length} categorías • 25 palabras cada una</p>
            
            <div style="max-height: 450px; overflow-y: auto; padding: 5px;">
                ${categoriasHtml}
            </div>
            
            <button class="btn-modern" id="btnVolverDic" style="background: #2a2a3a; margin-top: 15px;">
                🔙 Volver al Corral
            </button>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('btnVolverDic')?.addEventListener('click', renderMenu);
}

// ---------- CONFIGURACIÓN DE PARTIDA ----------
function renderGameSetup() {
    let totalJugadores = players.length;
    
    // Cargar configuración guardada
    let configGuardada = JSON.parse(localStorage.getItem('undercover_config')) || {
        numImpostores: 1,
        impostorVeCategoria: false,
        categoria: 'aleatoria'
    };
    
    let html = `
        <div class="screen" style="padding: 15px;">
            <h2 class="neon-title" style="font-size: 2rem;">⚙️ Configurar</h2>
            
            <!-- Jugadores disponibles -->
            <div class="order-container" style="margin: 10px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span style="color: white;">🐑 Ovejas disponibles:</span>
                    <span style="color: #ffd700; font-size: 1.8rem; font-weight: bold;">${totalJugadores}</span>
                </div>
            </div>
            
            <!-- Roles -->
            <div class="glass-card" style="margin: 15px 0;">
                <h3 style="color: white; margin-bottom: 15px;">🎭 Roles</h3>
                
                <div style="margin-bottom: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: white;">🐺 Lobos:</span>
                        <span style="color: #ffd700; font-weight: bold; background: #2a2a3a; padding: 5px 15px; border-radius: 20px;" id="impCountDisplay">${configGuardada.numImpostores}</span>
                    </div>
                    <input type="range" id="impRange" min="1" max="${Math.max(1, Math.min(3, Math.floor(totalJugadores/2)))}" 
                           value="${configGuardada.numImpostores}" step="1" 
                           style="width: 100%; height: 8px; border-radius: 10px; background: linear-gradient(135deg, #667eea, #764ba2);">
                </div>
                
                <div style="display: flex; justify-content: space-between; background: #2a2a3a; border-radius: 15px; padding: 15px;">
                    <span style="color: white;">🐑 Ovejas:</span>
                    <span style="color: #4CAF50; font-weight: bold; font-size: 1.3rem;" id="ciudCountDisplay">${totalJugadores - configGuardada.numImpostores}</span>
                </div>
            </div>
            
            <!-- Opción del Lobo -->
            <div class="glass-card" style="margin: 15px 0;">
                <h3 style="color: white; margin-bottom: 15px;">🐺 Lobo</h3>
                
                <label style="display: flex; align-items: center; gap: 15px; background: #2a2a3a; border-radius: 15px; padding: 15px; cursor: pointer;">
                    <input type="checkbox" id="impostorVeCategoria" ${configGuardada.impostorVeCategoria ? 'checked' : ''} 
                           style="width: 22px; height: 22px; accent-color: #ff9800;">
                    <span style="color: white; flex: 1;">Mostrar categoría al Lobo</span>
                </label>
            </div>
            
            <!-- Categoría -->
            <div class="glass-card" style="margin: 15px 0;">
                <h3 style="color: white; margin-bottom: 15px;">📁 Categoría</h3>
                
                <select id="categoriaSelect" style="width: 100%; padding: 15px; border-radius: 15px; 
                        background: #2a2a3a; color: white; border: 2px solid #667eea; font-size: 1rem;">
                    <option value="aleatoria" ${configGuardada.categoria === 'aleatoria' ? 'selected' : ''}>🎲 Aleatoria</option>
                    ${Object.keys(categorias).map(cat => 
                        `<option value="${cat}" ${configGuardada.categoria === cat ? 'selected' : ''}>📁 ${cat}</option>`
                    ).join('')}
                </select>
            </div>
            
            <!-- Botón Guardar -->
            <button class="btn-modern" id="guardarConfigBtn" style="background: linear-gradient(135deg, #00b09b, #96c93d); margin: 10px 0;">
                💾 GUARDAR CONFIGURACIÓN
            </button>
            
            <!-- Mensaje de confirmación -->
            <div id="configSavedMessage" style="display: none; background: #4CAF50; color: white; padding: 12px; 
                  border-radius: 15px; text-align: center; margin: 10px 0; animation: slideUp 0.3s ease;">
                ✅ Configuración guardada
            </div>
            
            <button class="btn-modern" id="backToMenu" style="background: #2a2a3a;">
                🔙 Volver al Corral
            </button>
        </div>
    `;
    
    app.innerHTML = html;
    
    let impRange = document.getElementById('impRange');
    let impCountDisplay = document.getElementById('impCountDisplay');
    let ciudCountDisplay = document.getElementById('ciudCountDisplay');
    let guardarBtn = document.getElementById('guardarConfigBtn');
    let configSavedMessage = document.getElementById('configSavedMessage');
    
    impRange.addEventListener('input', () => {
        let imp = parseInt(impRange.value);
        impCountDisplay.textContent = imp;
        ciudCountDisplay.textContent = totalJugadores - imp;
    });
    
    guardarBtn.addEventListener('click', () => {
        let numImpostores = parseInt(impRange.value);
        let impostorVeCategoria = document.getElementById('impostorVeCategoria').checked;
        let categoria = document.getElementById('categoriaSelect').value;
        
        let config = {
            numImpostores: numImpostores,
            impostorVeCategoria: impostorVeCategoria,
            categoria: categoria,
            fechaGuardado: new Date().toLocaleString()
        };
        
        localStorage.setItem('undercover_config', JSON.stringify(config));
        
        configSavedMessage.style.display = 'block';
        setTimeout(() => {
            configSavedMessage.style.display = 'none';
        }, 2000);
        
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
        
        console.log('📋 Configuración guardada:', config);
    });
    
    document.getElementById('backToMenu').addEventListener('click', renderMenu);
}

// ---------- ESTADÍSTICAS ----------
function renderStats() {
    let statsPlayers = [...players].sort((a,b) => b.totalPuntos - a.totalPuntos);
    let rows = statsPlayers.map((p, idx) => {
        let posClass = idx === 0 ? '🥇' : (idx === 1 ? '🥈' : (idx === 2 ? '🥉' : `#${idx+1}`));
        return `
            <div class="vote-card-modern" style="animation-delay: ${idx * 0.1}s; margin: 5px 0;">
                <div class="vote-avatar-modern" style="background: ${idx === 0 ? 'gold' : (idx === 1 ? 'silver' : (idx === 2 ? '#cd7f32' : '#667eea'))};">${posClass}</div>
                <div class="vote-info-modern">
                    <div class="vote-name-modern">${p.nombre}</div>
                    <div class="vote-status-modern">🐺 ${p.victoriasImp} victorias • 🐑 ${p.victoriasCiud} victorias</div>
                </div>
                <div style="text-align: right;">
                    <div style="color: #ffd700; font-size: 1.2rem; font-weight: bold;">${p.totalPuntos} pts</div>
                    <div style="color: #a0a0a0; font-size: 0.8rem;">${p.partidas} partidas</div>
                </div>
            </div>
        `;
    }).join('') || '<p style="color: gray; text-align: center; padding: 20px;">📊 No hay estadísticas aún</p>';

    let html = `
        <div class="screen" style="padding: 15px;">
            <h2 class="neon-title" style="font-size: 2rem;">📊 Estadísticas</h2>
            
            <div class="glass-card" style="margin: 10px 0; display: flex; justify-content: space-around; padding: 12px;">
                <div style="text-align: center;">
                    <span style="color: #ffd700; font-size: 1.2rem;">🐺</span>
                    <span style="color: white; margin-left: 5px;">Victorias Lobo</span>
                </div>
                <div style="text-align: center;">
                    <span style="color: #4CAF50; font-size: 1.2rem;">🐑</span>
                    <span style="color: white; margin-left: 5px;">Victorias Oveja</span>
                </div>
                <div style="text-align: center;">
                    <span style="color: #ffd700; font-size: 1.2rem;">⭐</span>
                    <span style="color: white; margin-left: 5px;">Puntos</span>
                </div>
            </div>
            
            <div style="max-height: 450px; overflow-y: auto; padding: 5px;">
                ${rows}
            </div>
            
            <button class="btn-modern" id="backToMenu" style="background: #2a2a3a; margin-top: 15px;">
                🔙 Volver al Corral
            </button>
        </div>
    `;
    app.innerHTML = html;
    document.getElementById('backToMenu')?.addEventListener('click', renderMenu);
}

// ---------- INICIAR PARTIDA ----------
function iniciarPartida() {
    if(players.length < 3) {
        alert('Necesitas al menos 3 jugadores');
        return;
    }
    
    let config = JSON.parse(localStorage.getItem('undercover_config')) || {
        numImpostores: 1,
        impostorVeCategoria: false,
        categoria: 'aleatoria'
    };
    
    let numImpostores = config.numImpostores;
    let impostorVeCategoria = config.impostorVeCategoria;
    let categoriaElegida = config.categoria;
    
    let maxImpostores = Math.floor(players.length / 2);
    if (numImpostores > maxImpostores) {
        numImpostores = maxImpostores;
    }
    
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
        eliminatedPlayers: [],
        ordenPreguntas: []
    };

    let total = gameState.playersInGame.length;
    while(gameState.impostorIndexes.length < numImpostores) {
        let r = Math.floor(Math.random() * total);
        if(!gameState.impostorIndexes.includes(r)) gameState.impostorIndexes.push(r);
    }
    
    gameState.ordenPreguntas = generarOrdenPreguntas();

    currentScreen = 'asignarRoles';
    renderScreen();
}

// ---------- ASIGNAR ROLES ----------
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
            contenidoRol = `
                <div style="text-align: center;">
                    <p class="impostor-msg" style="font-size: 2.5rem; margin-bottom: 20px; color: #ff6b6b; text-shadow: 0 0 20px #ff0000;">🐺 ERES EL LOBO</p>
                    <div style="background: rgba(255,215,0,0.15); border: 3px solid #ffd700; border-radius: 25px; padding: 20px; margin: 15px 0; box-shadow: 0 0 30px rgba(255,215,0,0.3);">
                        <p style="color: #ffd700; font-size: 1.2rem; margin-bottom: 5px;">📁 Categoría de la palabra:</p>
                        <p style="color: white; font-size: 2.5rem; font-weight: bold; text-shadow: 0 0 15px #ffd700;">${gameState.categoriaSecreta}</p>
                        <p style="color: #a0a0a0; font-size: 0.9rem; margin-top: 10px;">(Tienes que adivinar la palabra exacta)</p>
                    </div>
                </div>
            `;
        } else {
            contenidoRol = `
                <div style="text-align: center;">
                    <p class="impostor-msg" style="font-size: 2.5rem; margin-bottom: 20px; color: #ff6b6b; text-shadow: 0 0 20px #ff0000;">🐺 ERES EL LOBO</p>
                    <div style="background: rgba(255,0,0,0.1); border: 3px solid #ff6b6b; border-radius: 25px; padding: 20px; margin: 15px 0;">
                        <p style="color: white; font-size: 1.5rem;">¡Oculta tu identidad!</p>
                        <p style="color: #a0a0a0; font-size: 1rem;">Las ovejas tienen la palabra, tú debes descubrirla.</p>
                    </div>
                </div>
            `;
        }
    } else {
        contenidoRol = `
            <div style="text-align: center;">
                <p style="color: #4CAF50; font-size: 1.5rem; margin-bottom: 10px; text-shadow: 0 0 10px #00ff00;">🐑 ¡ERES UNA OVEJA!</p>
                <div style="background: rgba(102,126,234,0.15); border: 3px solid #667eea; border-radius: 25px; padding: 25px; margin: 15px 0; box-shadow: 0 0 30px rgba(102,126,234,0.3);">
                    <p style="color: white; font-size: 2.8rem; font-weight: bold; margin-bottom: 10px; text-shadow: 0 0 20px #667eea;">${gameState.palabraSecreta}</p>
                    <p style="color: #ffd700; font-size: 1.2rem;">📁 Categoría: ${gameState.categoriaSecreta}</p>
                </div>
            </div>
        `;
    }
    
    let progreso = ((gameState.currentRolIndex + 1) / gameState.playersInGame.length) * 100;
    
    let html = `
        <div class="screen" style="justify-content: center; padding: 15px;">
            <div style="background: rgba(255,255,255,0.1); border-radius: 30px; height: 8px; margin: 10px 0 20px 0;">
                <div style="background: linear-gradient(135deg, #667eea, #764ba2); width: ${progreso}%; height: 8px; border-radius: 30px; transition: width 0.3s ease;"></div>
            </div>
            <p style="color: #a0a0a0; text-align: center; margin-bottom: 10px;">Jugador ${gameState.currentRolIndex + 1} de ${gameState.playersInGame.length}</p>
            
            <div class="rol-card" id="rolCard" style="background: linear-gradient(145deg, #2a2a4a, #1a1a3a); border: 3px solid #667eea; border-radius: 40px; padding: 30px 20px; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
                <h2 id="playerNameDisplay" class="animate-float" style="font-size: 2.8rem; color: white; margin-bottom: 20px; text-shadow: 0 0 15px #667eea;">${jugador.nombre}</h2>
                <div id="rolContent" style="display: none;">
                    ${contenidoRol}
                </div>
            </div>
            
            <button class="btn-modern" id="revelarRol" style="margin-top: 20px; padding: 15px; font-size: 1.2rem;">
                ✨ Mostrar Rol
            </button>
            
            <button class="btn-modern" id="siguienteRol" style="display: none; margin-top: 15px; background: linear-gradient(135deg, #00b09b, #96c93d); padding: 15px; font-size: 1.2rem;">
                ➡️ Aceptar y pasar
            </button>
        </div>
    `;
    app.innerHTML = html;

    document.getElementById('revelarRol').addEventListener('click', () => {
        SoundEffects.playRevealSound();
        
        let rolCard = document.getElementById('rolCard');
        rolCard.classList.add('revealed');
        
        setTimeout(() => {
            document.getElementById('playerNameDisplay').style.display = 'none';
            document.getElementById('rolContent').style.display = 'block';
            document.getElementById('revelarRol').style.display = 'none';
            document.getElementById('siguienteRol').style.display = 'block';
        }, 300);
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
    
    let mostrarCategoria = gameState.impostorVeCategoria;
    
    let ordenNombres = gameState.ordenPreguntas
        .map(idx => gameState.playersInGame[idx].nombre)
        .join(' → ');
    
    let html = `
        <div class="screen game-screen-modern">
            <h2 class="neon-title" style="font-size: 1.8rem;">🔍 Juego en curso</h2>
            
            <div class="round-indicator">⚔️ Ronda ${gameState.round}</div>
            
            ${mostrarCategoria ? 
                `<div class="category-tag">📁 ${gameState.categoriaSecreta}</div>` : 
                `<div class="category-tag" style="border-color: #666; color: #666;">🔒 Categoría oculta</div>`
            }
            
            <div class="order-container">
                <div class="order-title">🔄 Orden de preguntas</div>
                <div class="order-names">${ordenNombres}</div>
                <p style="color: #a0a0a0; font-size: 0.8rem; text-align: center; margin-top: 8px;">Sigan este orden</p>
            </div>
            
            <div class="time-message">⏳ ¡TIEMPO PARA PREGUNTAR!</div>
            
            <button class="btn-modern" id="abrirVotacionBtn" style="margin: 5px 0;">
                🗳️ Iniciar Votación
            </button>
            
            <button class="btn-warning-modern" id="cambiarPalabraJuegoBtn" style="margin: 5px 0;">
                🔄 Cambiar Palabra
            </button>
            
            <button class="btn-modern" id="salirAlMenu" style="background: #2a2a3a; margin-top: 10px;">
                🏠 Volver al Corral
            </button>
        </div>
    `;
    app.innerHTML = html;
    
    document.getElementById('abrirVotacionBtn').addEventListener('click', () => {
        currentScreen = 'votacion';
        renderScreen();
    });
    
    document.getElementById('cambiarPalabraJuegoBtn').addEventListener('click', cambiarPalabraDuranteJuego);
    
    document.getElementById('salirAlMenu').addEventListener('click', renderMenu);
}

// ---------- FUNCIÓN PARA CAMBIAR PALABRA ----------
function cambiarPalabraDuranteJuego() {
    if (!confirm('⚠️ ¿Seguro que quieres cambiar la palabra?\n\nSe reiniciará la asignación de roles para que todos vean la nueva información.')) {
        return;
    }
    
    let palabrasCategoria = categorias[gameState.categoriaSecreta];
    let nuevaPalabra;
    
    do {
        nuevaPalabra = palabrasCategoria[Math.floor(Math.random() * palabrasCategoria.length)];
    } while (nuevaPalabra === gameState.palabraSecreta && palabrasCategoria.length > 1);
    
    gameState.palabraSecreta = nuevaPalabra;
    gameState.currentRolIndex = 0;
    currentScreen = 'asignarRoles';
    
    mostrarToast('🔄 Palabra cambiada correctamente');
    SoundEffects.playRevealSound();
    renderScreen();
}

// ---------- VOTACIÓN ----------
function renderVotacion() {
    let activePlayers = gameState.playersInGame.filter((_, idx) => !gameState.eliminatedPlayers.includes(idx));
    let votos = [];
    let votanteActual = 0;
    
    let html = `
        <div class="screen" style="padding: 15px;">
            <h2 class="neon-title" style="font-size: 1.8rem;">🗳️ VOTACIÓN</h2>
            <div class="round-indicator" style="margin-bottom: 10px;">Ronda ${gameState.round}</div>
            
            <div class="order-container" style="background: linear-gradient(135deg, #667eea, #764ba2); margin: 10px 0;">
                <div style="color: white; font-size: 1rem; margin-bottom: 5px;">🎯 Le toca votar a:</div>
                <div class="order-names" style="font-size: 1.8rem; background: rgba(0,0,0,0.2);" id="nombreVotante">${activePlayers[0]?.nombre || ''}</div>
                <div style="color: rgba(255,255,255,0.8); margin-top: 5px; font-size: 0.9rem;" id="contadorVotos">Voto 1 de ${activePlayers.length}</div>
            </div>
            
            <p style="color: #a0a0a0; text-align: center; margin: 10px 0;">👆 Toca el nombre de tu sospechoso</p>
            
            <div class="players-list" id="votacionList" style="max-height: 350px; overflow-y: auto; margin-bottom: 10px;">
                ${activePlayers.map((p, idx) => {
                    let originalIndex = gameState.playersInGame.findIndex(sp => sp.id === p.id);
                    return `
                        <div class="vote-card-modern" data-originalindex="${originalIndex}" data-voteforindex="${originalIndex}" style="animation-delay: ${idx * 0.1}s;">
                            <div class="vote-avatar-modern">${p.nombre.charAt(0).toUpperCase()}</div>
                            <div class="vote-info-modern">
                                <div class="vote-name-modern">${p.nombre}</div>
                                <div class="vote-status-modern">👤 Jugador</div>
                            </div>
                            <div class="vote-badge-modern" style="display: none;">0</div>
                        </div>
                    `;
                }).join('')}
            </div>
            
            <div style="display: flex; gap: 10px; margin: 15px 0;">
                <button class="btn-modern" id="reiniciarVotosBtn" style="flex: 1; background: #2a2a3a; padding: 12px;">🔄 Reiniciar</button>
                <button class="btn-modern" id="finalizarVotacionBtn" style="flex: 1; padding: 12px;">🔍 Resultado</button>
            </div>
            
            <button class="btn-modern" id="volverJuego" style="background: #2a2a3a; width: 100%;">◀️ Seguir preguntando</button>
        </div>
    `;
    
    app.innerHTML = html;
    
    let nombreVotante = document.getElementById('nombreVotante');
    let contadorVotos = document.getElementById('contadorVotos');
    let reiniciarBtn = document.getElementById('reiniciarVotosBtn');
    let finalizarBtn = document.getElementById('finalizarVotacionBtn');
    
    function actualizarBadges() {
        document.querySelectorAll('.vote-badge-modern').forEach(badge => {
            badge.style.display = 'none';
        });
        
        let conteo = {};
        votos.forEach(v => {
            conteo[v.votadoIndex] = (conteo[v.votadoIndex] || 0) + 1;
        });
        
        Object.keys(conteo).forEach(idx => {
            let card = document.querySelector(`.vote-card-modern[data-originalindex="${idx}"]`);
            if (card) {
                let badge = card.querySelector('.vote-badge-modern');
                badge.style.display = 'block';
                badge.textContent = `${conteo[idx]} ${conteo[idx] === 1 ? 'voto' : 'votos'}`;
                badge.style.animation = 'pulse 0.5s';
                setTimeout(() => {
                    badge.style.animation = '';
                }, 500);
            }
        });
    }
    
    function actualizarVotanteActual() {
        if (votanteActual < activePlayers.length) {
            nombreVotante.textContent = activePlayers[votanteActual].nombre;
            contadorVotos.textContent = `Voto ${votos.length + 1} de ${activePlayers.length}`;
            nombreVotante.style.animation = 'pulse 0.5s';
            setTimeout(() => {
                nombreVotante.style.animation = '';
            }, 500);
        } else {
            nombreVotante.textContent = "✓ Votación completa";
            contadorVotos.textContent = `${activePlayers.length} votos emitidos`;
        }
    }
    
    document.querySelectorAll('.vote-card-modern').forEach(card => {
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
            
            SoundEffects.playVoteSound();
            this.classList.add('animate-shake');
            setTimeout(() => {
                this.classList.remove('animate-shake');
            }, 500);
            
            this.style.backgroundColor = '#2a2a4a';
            this.style.borderColor = '#667eea';
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.backgroundColor = '';
                this.style.borderColor = '';
                this.style.transform = '';
            }, 200);
            
            mostrarToast(`🗳️ ${votanteNombre} votó por ${votadoNombre}`);
            
            actualizarBadges();
            
            votanteActual++;
            actualizarVotanteActual();
        });
    });
    
    reiniciarBtn.addEventListener('click', () => {
        votos = [];
        votanteActual = 0;
        actualizarBadges();
        actualizarVotanteActual();
        
        document.querySelectorAll('.vote-card-modern').forEach(card => {
            card.style.animation = 'shake 0.5s';
            setTimeout(() => {
                card.style.animation = '';
            }, 500);
        });
        
        mostrarToast('🔄 Votación reiniciada');
    });
    
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
        Object.values(conteo).forEach(votos => {
            if (votos > maxVotos) maxVotos = votos;
        });
        
        let masVotados = [];
        Object.keys(conteo).forEach(idx => {
            if (conteo[idx] === maxVotos) {
                masVotados.push(parseInt(idx));
            }
        });
        
        if (masVotados.length > 1) {
            SoundEffects.playErrorSound();
            
            modalTitle.textContent = '🤝 ¡EMPATE!';
            
            let nombresEmpate = masVotados.map(idx => gameState.playersInGame[idx].nombre).join(' y ');
            
            modalBody.innerHTML = `
                <div style="text-align: center; padding: 20px;" class="animate-fade-in">
                    <div style="font-size: 3rem; margin-bottom: 15px;">🤝</div>
                    <h3 style="color: #ffd700; font-size: 2rem;">¡EMPATE!</h3>
                    <p style="color: white; margin: 20px 0;">${nombresEmpate} empataron con ${maxVotos} votos.</p>
                    <p style="color: #a0a0a0;">Nadie es eliminado. Siguiente ronda.</p>
                </div>
            `;
            
            modal.classList.remove('hidden');
            
            modalClose.onclick = () => {
                modal.classList.add('hidden');
                gameState.round++;
                gameState.ordenPreguntas = generarOrdenPreguntas();
                currentScreen = 'juego';
                renderScreen();
            };
            
            return;
        }
        
        let eliminadoIdx = masVotados[0];
        let jugadorEliminado = gameState.playersInGame[eliminadoIdx];
        let esImpostor = gameState.impostorIndexes.includes(eliminadoIdx);
        
        if (esImpostor) {
            SoundEffects.playImpostorFoundSound();
        } else {
            SoundEffects.playErrorSound();
        }
        
        modalTitle.textContent = esImpostor ? '🎉 ¡LOBO DESCUBIERTO!' : '😢 ¡Votación Errónea!';
        
        let mensaje = esImpostor 
            ? `✅ ${jugadorEliminado.nombre} era un LOBO.`
            : `❌ ${jugadorEliminado.nombre} NO era el LOBO.`;
        
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <div style="font-size: 3rem;">${esImpostor ? '🐺' : '💔'}</div>
                <h3 style="color: ${esImpostor ? '#00ff00' : '#ff6b6b'};">${jugadorEliminado.nombre}</h3>
                <p>${mensaje}</p>
                <p>🗳️ Recibió ${maxVotos} votos</p>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        modalClose.onclick = () => {
            modal.classList.add('hidden');
            
            if (!gameState.eliminatedPlayers.includes(eliminadoIdx)) {
                gameState.eliminatedPlayers.push(eliminadoIdx);
            }
            
            let lobosEliminados = gameState.impostorIndexes.every(idx => gameState.eliminatedPlayers.includes(idx));
            let ovejasRestantes = gameState.playersInGame.filter((_, idx) => 
                !gameState.impostorIndexes.includes(idx) && !gameState.eliminatedPlayers.includes(idx)
            ).length;
            let lobosVivos = gameState.impostorIndexes.filter(idx => !gameState.eliminatedPlayers.includes(idx)).length;
            
            if (lobosEliminados) {
                terminarJuego('ciudadanos');
            } else if (ovejasRestantes <= lobosVivos) {
                terminarJuego('impostor');
            } else {
                gameState.round++;
                gameState.ordenPreguntas = generarOrdenPreguntas();
                currentScreen = 'juego';
                renderScreen();
            }
        };
    });
    
    document.getElementById('volverJuego').addEventListener('click', () => {
        currentScreen = 'juego';
        renderScreen();
    });
    
    actualizarVotanteActual();
}

// ---------- FUNCIONES AUXILIARES ----------
function mezclarArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function generarOrdenPreguntas() {
    let activos = [];
    gameState.playersInGame.forEach((_, idx) => {
        if (!gameState.eliminatedPlayers.includes(idx)) {
            activos.push(idx);
        }
    });
    return mezclarArray(activos);
}

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

// ---------- RENDER ASIGNAR ROLES PARA TUTORIAL (VERSIÓN SIMPLIFICADA) ----------
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

// ---------- TERMINAR JUEGO ----------
function terminarJuego(ganador) {
    SoundEffects.playRoundEndSound(ganador);
    
    let impostorIndexes = gameState.impostorIndexes;
    let ciudadanoIndexes = gameState.playersInGame.map((_, idx) => idx).filter(i => !impostorIndexes.includes(i));

    let todosLobosEliminados = impostorIndexes.every(idx => gameState.eliminatedPlayers.includes(idx));
    
    if (ganador === 'ciudadanos' || todosLobosEliminados) {
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
    let todosLobosEliminados = gameState.impostorIndexes.every(idx => gameState.eliminatedPlayers.includes(idx));
    
    let mensaje = (ganador === 'ciudadanos' || todosLobosEliminados)
        ? '🎉 ¡VICTORIA DE LAS OVEJAS!' 
        : '🐺 ¡DERROTA! LOS LOBOS DEVORAN EL REBAÑO';
    
    let fondoGradiente = (ganador === 'ciudadanos' || todosLobosEliminados)
        ? 'linear-gradient(135deg, #00b09b, #96c93d)'
        : 'linear-gradient(135deg, #f43b47, #453a94)';
    
    let puntosTexto = (ganador === 'ciudadanos' || todosLobosEliminados)
        ? '🐑 OVEJAS +2 ⭐'
        : `🐺 ${gameState.impostorIndexes.length === 1 ? 'LOBO' : 'LOBOS'} +5 ⭐`;
    
    let impostorNames = gameState.impostorIndexes.map(idx => gameState.playersInGame[idx].nombre).join(', ');
    
    let lobosTitulo = gameState.impostorIndexes.length === 1 
        ? '🐺 El Lobo era:' 
        : '🐺 Los Lobos eran:';
    
    let lobosInfo = gameState.impostorIndexes.length > 1 
        ? `<p style="color: #a0a0a0;">Había ${gameState.impostorIndexes.length} lobos</p>` 
        : '';
    
    let html = `
        <div class="screen" style="padding: 15px; justify-content: center;">
            <div style="background: ${fondoGradiente}; border-radius: 30px; padding: 25px; border: 2px solid white;">
                <h1 style="color: white; font-size: 1.8rem; text-align: center;">${mensaje}</h1>
                
                <div style="background: rgba(0,0,0,0.3); border-radius: 15px; padding: 15px; margin: 15px 0;">
                    <p style="color: #ffd700;">${lobosTitulo}</p>
                    <p style="color: white; font-size: 1.8rem;">${impostorNames}</p>
                    ${lobosInfo}
                </div>
                
                <div style="background: rgba(255,255,255,0.15); border-radius: 15px; padding: 15px;">
                    <p style="color: #ffd700; font-size: 1.5rem;">${gameState.palabraSecreta}</p>
                    <p style="color: #e0e0e0;">${gameState.categoriaSecreta}</p>
                </div>
                
                <div style="background: #2a2a3a; border-radius: 15px; padding: 15px; margin-top: 15px; text-align: center;">
                    <p style="color: #ffd700; font-size: 1.5rem;">${puntosTexto}</p>
                </div>
            </div>
            
            <button class="btn-modern" id="nuevaPartida" style="margin-top: 20px;">🔄 Jugar otra ronda</button>
            <button class="btn-modern" id="menuPrincipal" style="background: #2a2a3a; margin-top: 10px;">🏠 Volver</button>
        </div>
    `;
    
    app.innerHTML = html;
    
    document.getElementById('nuevaPartida')?.addEventListener('click', iniciarPartida);
    document.getElementById('menuPrincipal')?.addEventListener('click', renderMenu);
}

// ---------- TOAST ----------
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
        animation: slideInFromBottom 0.3s ease;
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

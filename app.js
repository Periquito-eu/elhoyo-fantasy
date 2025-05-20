import { createApp, ref, computed, watch } from 'vue';

const app = createApp({
  setup() {
    // Estado del juego
    const gameState = ref('init'); // init, playing, simulating, finished
    const currentTab = ref('players');
    const standingsView = ref('general');
    const selectedTeamDetails = ref(null);
    const matchFinished = ref(false);
    
    // Configuración inicial
    const playerSetup = ref({
      nickname: '',
      aiCount: 2,
      aiDifficulty: 'normal',
      gameMode: 'fantasy',
      selectedTeam: null
    });
    
    // Notificaciones
    const notifications = ref([]);
    const showNotifications = ref(false);
    
    // Datos de jugadores y equipos
    const footballers = ref([]);
    const teams = ref([
      'FC Hollowborn', 'FC Royal Velvet', 'FC Liyue Phantoms', 'FC Yharnam Moon',
      'FC Inaba United', 'FC Phantom Hearts', 'FC Blue Butterfly', 'FC Ashen Ring',
      'FC Old Hunters', 'FC Abysswatchers', 'FC Midnight TV', 'FC Mementos Depths', 
      'ElHoyo CF', 'GP NERV', 'FC FALCONS'
    ]);
    
    // Jugadores (usuario y IAs)
    const players = ref([]);
    const currentUser = ref(null);
    const playerInventory = ref([]);
    const playerOffers = ref([]);
    const showAllFootballers = ref(false);
    const selectedPlayer = ref(null);
    
    // Calendario y partidos
    const schedule = ref([]);
    const currentDay = ref(0);
    const matchHistory = ref([]);
    const currentMatch = ref(null);
    const simulationLog = ref([]);
    const simulationEvents = ref([]);
    const teamStandings = ref({});
    
    // Mercado
    const marketPlayers = ref([]);
    
    // Pestañas disponibles
    const tabs = [
      { id: 'players', name: 'Jugadores activos' },
      { id: 'squad', name: 'Plantilla' },
      { id: 'market', name: 'Mercado de fichajes' },
      { id: 'calendar', name: 'Calendario' },
      { id: 'summary', name: 'Resumen de jornadas' },
      { id: 'standings', name: 'Clasificación de equipos' }
    ];
    
    // Chat system
    const showChat = ref(false);
    const chatMessages = ref([]);
    const chatDraft = ref('');
    const chatRecipient = ref('');
    const unreadChatMessages = ref(0);
    
    // Inventory filter
    const inventoryFilter = ref('all');
    
    const aiNames = [
      'Gideon Ofnir',
      'Rennala de la Luna Llena',
      'Ranni la Bruja',
      'Radagon de la Orden Dorada',
      'D, Cazador de los Muertos', 
      'Shuji Ikutsuki',
      'Mitsuru Kirijo',
      'Ryotaro Dojima',
      'Sae Niijima',
      'Sojiro Sakura',
      'Solaire de Astora',
      'Andre de Astora',
      'Siegmeyer de Catarina',
      'Kingseeker Frampt'
    ];
    
    // Nuevas variables de estado
    const isMobileUI = ref(false);
    const devMode = ref(false);
    const devModeClicks = ref(0);
    const selectedPlayerToEdit = ref(null);
    const editingPlayer = ref(null);
    const bannedWords = ['polla', 'pito', 'chocho', 'maricon'];

    watch(selectedPlayerToEdit, (newPlayerId) => {
      if (newPlayerId) {
        const playerDetails = footballers.value.find(p => p.id === newPlayerId);
        if (playerDetails) {
          editingPlayer.value = { 
            ...playerDetails, 
            injured: playerDetails.injured || false,
            injuryGamesLeft: playerDetails.injuryGamesLeft || 0 
          }; 
        } else {
          editingPlayer.value = null; // Player not found
        }
      } else {
        editingPlayer.value = null; // No player selected
      }
    });

    const initFootballers = () => {
      const data = [
        // FC Hollowborn
        { name: 'Artorias', team: 'FC Hollowborn', cost: 85000, quality: 94, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Solaire', team: 'FC Hollowborn', cost: 45000, quality: 82, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Gwyn', team: 'FC Hollowborn', cost: 88000, quality: 96, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Ornstein', team: 'FC Hollowborn', cost: 55000, quality: 85, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Smough', team: 'FC Hollowborn', cost: 47000, quality: 83, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Siegmeyer', team: 'FC Hollowborn', cost: 38000, quality: 78, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Gwynevere', team: 'FC Hollowborn', cost: 30000, quality: 74, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Lautrec', team: 'FC Hollowborn', cost: 26000, quality: 72, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Priscilla', team: 'FC Hollowborn', cost: 69000, quality: 90, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // FC Royal Velvet
        { name: 'Elizabeth', team: 'FC Royal Velvet', cost: 83000, quality: 93, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Theodore', team: 'FC Royal Velvet', cost: 40000, quality: 80, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Margaret', team: 'FC Royal Velvet', cost: 63000, quality: 87, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Igor', team: 'FC Royal Velvet', cost: 46000, quality: 82, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Lavenza', team: 'FC Royal Velvet', cost: 74000, quality: 91, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Justine', team: 'FC Royal Velvet', cost: 33000, quality: 75, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Caroline', team: 'FC Royal Velvet', cost: 33000, quality: 75, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Marie', team: 'FC Royal Velvet', cost: 36000, quality: 78, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Sho Minazuki', team: 'FC Royal Velvet', cost: 68000, quality: 89, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // FC Liyue Phantoms
        { name: 'Xiao', team: 'FC Liyue Phantoms', cost: 81000, quality: 92, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Ganyu', team: 'FC Liyue Phantoms', cost: 67000, quality: 89, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Zhongli', team: 'FC Liyue Phantoms', cost: 85000, quality: 94, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Hu Tao', team: 'FC Liyue Phantoms', cost: 62000, quality: 86, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Shenhe', team: 'FC Liyue Phantoms', cost: 54000, quality: 84, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Yanfei', team: 'FC Liyue Phantoms', cost: 38000, quality: 78, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Qiqi', team: 'FC Liyue Phantoms', cost: 35000, quality: 76, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Ningguang', team: 'FC Liyue Phantoms', cost: 42000, quality: 80, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Chongyun', team: 'FC Liyue Phantoms', cost: 31000, quality: 74, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // FC Yharnam Moon
        { name: 'Gehrman', team: 'FC Yharnam Moon', cost: 76000, quality: 89, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Lady Maria', team: 'FC Yharnam Moon', cost: 82000, quality: 91, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Eileen the Crow', team: 'FC Yharnam Moon', cost: 38000, quality: 78, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'The Doll', team: 'FC Yharnam Moon', cost: 33000, quality: 75, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Laurence', team: 'FC Yharnam Moon', cost: 49000, quality: 84, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Gascoigne', team: 'FC Yharnam Moon', cost: 41000, quality: 80, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Vicar Amelia', team: 'FC Yharnam Moon', cost: 58000, quality: 86, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Micolash', team: 'FC Yharnam Moon', cost: 26000, quality: 73, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Rom', team: 'FC Yharnam Moon', cost: 67000, quality: 88, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // FC Inaba United
        { name: 'Yu Narukami', team: 'FC Inaba United', cost: 79000, quality: 92, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Yosuke Hanamura', team: 'FC Inaba United', cost: 48000, quality: 83, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Chie Satonaka', team: 'FC Inaba United', cost: 41000, quality: 81, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Kanji Tatsumi', team: 'FC Inaba United', cost: 45000, quality: 84, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Naoto Shirogane', team: 'FC Inaba United', cost: 52000, quality: 85, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Rise Kujikawa', team: 'FC Inaba United', cost: 38000, quality: 78, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Teddie', team: 'FC Inaba United', cost: 36000, quality: 77, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Adachi', team: 'FC Inaba United', cost: 62000, quality: 87, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Izanami', team: 'FC Inaba United', cost: 84000, quality: 94, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // FC Phantom Hearts
        { name: 'Joker', team: 'FC Phantom Hearts', cost: 87000, quality: 95, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Ryuji Sakamoto', team: 'FC Phantom Hearts', cost: 43000, quality: 82, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Ann Takamaki', team: 'FC Phantom Hearts', cost: 47000, quality: 83, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Morgana', team: 'FC Phantom Hearts', cost: 35000, quality: 76, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Yusuke Kitagawa', team: 'FC Phantom Hearts', cost: 49000, quality: 84, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Makoto Niijima', team: 'FC Phantom Hearts', cost: 55000, quality: 86, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Haru Okumura', team: 'FC Phantom Hearts', cost: 42000, quality: 80, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Futaba Sakura', team: 'FC Phantom Hearts', cost: 27000, quality: 72, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Akechi', team: 'FC Phantom Hearts', cost: 81000, quality: 91, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // FC Blue Butterfly
        { name: 'Makoto Yuki', team: 'FC Blue Butterfly', cost: 86000, quality: 94, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Yukari Takeba', team: 'FC Blue Butterfly', cost: 44000, quality: 82, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Junpei Iori', team: 'FC Blue Butterfly', cost: 39000, quality: 79, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Mitsuru Kirijo', team: 'FC Blue Butterfly', cost: 62000, quality: 87, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Akihiko Sanada', team: 'FC Blue Butterfly', cost: 55000, quality: 85, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Aigis', team: 'FC Blue Butterfly', cost: 70000, quality: 90, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Koromaru', team: 'FC Blue Butterfly', cost: 29000, quality: 74, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Shinjiro Aragaki', team: 'FC Blue Butterfly', cost: 47000, quality: 83, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Ryoji Mochizuki', team: 'FC Blue Butterfly', cost: 80000, quality: 92, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // FC Ashen Ring
        { name: 'Tarnished', team: 'FC Ashen Ring', cost: 79000, quality: 91, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Blaidd', team: 'FC Ashen Ring', cost: 51000, quality: 85, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Rya', team: 'FC Ashen Ring', cost: 33000, quality: 76, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Miriel', team: 'FC Ashen Ring', cost: 35000, quality: 77, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Patches', team: 'FC Ashen Ring', cost: 22000, quality: 70, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Alexander', team: 'FC Ashen Ring', cost: 41000, quality: 80, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Millicent', team: 'FC Ashen Ring', cost: 46000, quality: 83, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Ensha', team: 'FC Ashen Ring', cost: 28000, quality: 73, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Rykard', team: 'FC Ashen Ring', cost: 66000, quality: 89, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // FC Old Hunters
        { name: 'Ludwig', team: 'FC Old Hunters', cost: 85000, quality: 94, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Brador', team: 'FC Old Hunters', cost: 43000, quality: 82, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Valtr', team: 'FC Old Hunters', cost: 39000, quality: 78, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Djura', team: 'FC Old Hunters', cost: 33000, quality: 75, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Yamamura', team: 'FC Old Hunters', cost: 24000, quality: 71, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Lady Maria (2ª forma)', team: 'FC Old Hunters', cost: 80000, quality: 92, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Adella', team: 'FC Old Hunters', cost: 29000, quality: 74, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Brainsucker', team: 'FC Old Hunters', cost: 20000, quality: 68, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Laurence (Beast)', team: 'FC Old Hunters', cost: 61000, quality: 86, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // FC Abysswatchers
        { name: 'Abyss Watcher', team: 'FC Abysswatchers', cost: 81000, quality: 93, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Lothric', team: 'FC Abysswatchers', cost: 76000, quality: 89, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Lorian', team: 'FC Abysswatchers', cost: 78000, quality: 90, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Firekeeper', team: 'FC Abysswatchers', cost: 44000, quality: 81, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Eygon of Carim', team: 'FC Abysswatchers', cost: 31000, quality: 75, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Anri of Astora', team: 'FC Abysswatchers', cost: 46000, quality: 83, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Hawkwood', team: 'FC Abysswatchers', cost: 22000, quality: 69, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Greirat', team: 'FC Abysswatchers', cost: 26000, quality: 72, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Pontiff Sulyvahn', team: 'FC Abysswatchers', cost: 67000, quality: 88, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // FC Midnight TV
        { name: 'Shadow Yu', team: 'FC Midnight TV', cost: 82000, quality: 92, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Shadow Naoto', team: 'FC Midnight TV', cost: 69000, quality: 88, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Shadow Chie', team: 'FC Midnight TV', cost: 43000, quality: 80, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Shadow Yosuke', team: 'FC Midnight TV', cost: 40000, quality: 79, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Shadow Kanji', team: 'FC Midnight TV', cost: 48000, quality: 84, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Shadow Rise', team: 'FC Midnight TV', cost: 51000, quality: 85, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Mitsuo', team: 'FC Midnight TV', cost: 37000, quality: 77, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Tohru Adachi (Awakened)', team: 'FC Midnight TV', cost: 79000, quality: 91, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Ameno-sagiri', team: 'FC Midnight TV', cost: 88000, quality: 95, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // FC Mementos Depths
        { name: 'Shadow Akechi', team: 'FC Mementos Depths', cost: 85000, quality: 93, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Cognitive Wakaba', team: 'FC Mementos Depths', cost: 45000, quality: 82, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Shadow Sae', team: 'FC Mementos Depths', cost: 60000, quality: 86, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Kamoshida (Shadow)', team: 'FC Mementos Depths', cost: 37000, quality: 78, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Madarame (Shadow)', team: 'FC Mementos Depths', cost: 34000, quality: 76, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Okumura (Shadow)', team: 'FC Mementos Depths', cost: 33000, quality: 75, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Shido (Shadow)', team: 'FC Mementos Depths', cost: 73000, quality: 90, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Yaldabaoth', team: 'FC Mementos Depths', cost: 90000, quality: 99, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Jose', team: 'FC Mementos Depths', cost: 25000, quality: 71, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // ElHoyo CF
        { name: 'Petisui', team: 'ElHoyo CF', cost: 84000, quality: 97, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Yosuke Simeone', team: 'ElHoyo CF', cost: 61000, quality: 83, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Dydier', team: 'ElHoyo CF', cost: 84000, quality: 92, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Kent', team: 'ElHoyo CF', cost: 37670, quality: 75, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'YosukeLover', team: 'ElHoyo CF', cost: 37000, quality: 80, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Elso', team: 'ElHoyo CF', cost: 81500, quality: 91, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Alex', team: 'ElHoyo CF', cost: 12010, quality: 59, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Alesin', team: 'ElHoyo CF', cost: 45090, quality: 69, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Luis', team: 'ElHoyo CF', cost: 49000, quality: 71, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // GP NERV
        { name: 'Shinji Ikari', team: 'GP NERV', cost: 84000, quality: 93, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Asuka Langley', team: 'GP NERV', cost: 77000, quality: 90, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Rei Ayanami', team: 'GP NERV', cost: 69000, quality: 88, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Kaworu Nagisa', team: 'GP NERV', cost: 81000, quality: 91, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Misato Katsuragi', team: 'GP NERV', cost: 58000, quality: 85, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Ritsuko Akagi', team: 'GP NERV', cost: 42000, quality: 80, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Gendo Ikari', team: 'GP NERV', cost: 37000, quality: 77, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Eva-01 (Berserk Mode)', team: 'GP NERV', cost: 88000, quality: 96, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Mari Makinami', team: 'GP NERV', cost: 51000, quality: 84, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        
        // FC FALCONS
        { name: 'Guts', team: 'FC FALCONS', cost: 89000, quality: 96, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Griffith', team: 'FC FALCONS', cost: 90000, quality: 98, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Casca', team: 'FC FALCONS', cost: 67000, quality: 88, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Skull Knight', team: 'FC FALCONS', cost: 85000, quality: 94, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Judeau', team: 'FC FALCONS', cost: 41000, quality: 80, position: 'MCE', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Serpico', team: 'FC FALCONS', cost: 44000, quality: 81, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Farnese', team: 'FC FALCONS', cost: 36000, quality: 76, position: 'DFC', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Isidro', team: 'FC FALCONS', cost: 29000, quality: 73, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false },
        { name: 'Zodd', team: 'FC FALCONS', cost: 86000, quality: 95, position: 'ATQ', goals: 0, injured: false, injuryGamesLeft: 0, hasGoldenBoot: false }
      ];
      
      // Añadir ID único y puntos a cada jugador
      footballers.value = data.map((footballer, index) => ({
        ...footballer,
        id: `f${index}`,
        points: 0,
        owner: null
      }));
    };
    
    // Inicializar clasificación de equipos
    const initTeamStandings = () => {
      const standings = {};
      
      teams.value.forEach(team => {
        standings[team] = {
          name: team,
          played: 0,
          won: 0,
          drawn: 0,
          lost: 0,
          goalsFor: 0,
          goalsAgainst: 0,
          goalDifference: 0,
          points: 0
        };
      });
      
      teamStandings.value = standings;
    };
    
    // Crear calendario de partidos
    const createSchedule = () => {
      const teamsList = [...teams.value];
      const rounds = [];
      
      // Si hay un número impar de equipos, añadir un equipo ficticio para los descansos
      if (teamsList.length % 2 !== 0) {
        teamsList.push('DESCANSO');
      }
      
      const numTeams = teamsList.length;
      const numRounds = numTeams - 1;
      const matchesPerRound = numTeams / 2;
      
      // Algoritmo de generación de calendario (Round Robin)
      for (let round = 0; round < numRounds; round++) {
        const roundMatches = [];
        
        for (let match = 0; match < matchesPerRound; match++) {
          const homeTeam = teamsList[match];
          const awayTeam = teamsList[numTeams - 1 - match];
          
          // Evitar partidos con el equipo de descanso
          if (homeTeam !== 'DESCANSO' && awayTeam !== 'DESCANSO') {
            roundMatches.push({
              homeTeam,
              awayTeam,
              simulated: false,
              homeScore: 0,
              awayScore: 0,
              events: []
            });
          }
        }
        
        rounds.push(roundMatches);
        
        // Rotar equipos para la siguiente ronda (el primero se queda fijo)
        teamsList.splice(1, 0, teamsList.pop());
      }
      
      // Duplicar el calendario para partidos de ida y vuelta, invirtiendo local y visitante
      const fullSchedule = [...rounds];
      
      rounds.forEach(round => {
        const returnRound = round.map(match => ({
          homeTeam: match.awayTeam,
          awayTeam: match.homeTeam,
          simulated: false,
          homeScore: 0,
          awayScore: 0,
          events: []
        }));
        
        fullSchedule.push(returnRound);
      });
      
      schedule.value = fullSchedule;
    };
    
    // Seleccionar jugadores aleatorios para crear la plantilla inicial
    const getRandomSquad = () => {
      const availablePlayers = footballers.value.filter(player => player.owner === null && player.quality < 90);
      const squad = [];
      
      // Seleccionar 3 ATQ, 3 MCE, 3 DFC
      const atq = availablePlayers.filter(player => player.position === 'ATQ');
      const mce = availablePlayers.filter(player => player.position === 'MCE');
      const dfc = availablePlayers.filter(player => player.position === 'DFC');
      
      // Asegurar al menos 1 jugador de cada posición
      if (atq.length > 0) {
        const randomIndex = Math.floor(Math.random() * atq.length);
        squad.push(atq.splice(randomIndex, 1)[0]);
      }
      
      if (mce.length > 0) {
        const randomIndex = Math.floor(Math.random() * mce.length);
        squad.push(mce.splice(randomIndex, 1)[0]);
      }
      
      if (dfc.length > 0) {
        const randomIndex = Math.floor(Math.random() * dfc.length);
        squad.push(dfc.splice(randomIndex, 1)[0]);
      }
      
      // Completar el resto hasta tener 3 de cada
      for (let i = squad.filter(p => p.position === 'ATQ').length; i < 3; i++) {
        if (atq.length > 0) {
          const randomIndex = Math.floor(Math.random() * atq.length);
          squad.push(atq.splice(randomIndex, 1)[0]);
        }
      }
      
      for (let i = squad.filter(p => p.position === 'MCE').length; i < 3; i++) {
        if (mce.length > 0) {
          const randomIndex = Math.floor(Math.random() * mce.length);
          squad.push(mce.splice(randomIndex, 1)[0]);
        }
      }
      
      for (let i = squad.filter(p => p.position === 'DFC').length; i < 3; i++) {
        if (dfc.length > 0) {
          const randomIndex = Math.floor(Math.random() * dfc.length);
          squad.push(dfc.splice(randomIndex, 1)[0]);
        }
      }
      
      return squad;
    };
    
    // Inicializar jugadores (usuario y IAs)
    const initPlayers = () => {
      // Jugador usuario
      const userSquad = getRandomSquad();
      const user = {
        id: 'user',
        nickname: playerSetup.value.nickname || 'Jugador',
        money: 100000,
        squad: userSquad,
        inventory: [],
        totalPoints: 0,
        isAI: false
      };
      
      // Marcar jugadores como asignados a este usuario
      userSquad.forEach(player => {
        player.owner = user.id;
      });
      
      // Jugadores IA
      const aiPlayers = [];
      const selectedNames = [];
      
      for (let i = 0; i < playerSetup.value.aiCount; i++) {
        let aiName;
        do {
          aiName = aiNames[Math.floor(Math.random() * aiNames.length)];
        } while (selectedNames.includes(aiName));
        selectedNames.push(aiName);
        
        const aiSquad = getRandomSquad();
        const ai = {
          id: `ai${i}`,
          nickname: aiName,
          money: 100000,
          squad: aiSquad,
          inventory: [],
          totalPoints: 0,
          isAI: true,
          difficulty: playerSetup.value.aiDifficulty
        };
        
        // Marcar jugadores como asignados a esta IA
        aiSquad.forEach(player => {
          player.owner = ai.id;
        });
        
        aiPlayers.push(ai);
      }
      
      players.value = [user, ...aiPlayers];
      currentUser.value = user;
      playerInventory.value = user.inventory;
    };
    
    // Inicializar mercado de fichajes
    const initMarket = () => {
      refreshMarket();
    };
    
    // Refrescar mercado de fichajes (5 jugadores aleatorios)
    const refreshMarket = () => {
      const availablePlayers = footballers.value.filter(player => player.owner === null);
      const newMarketPlayers = [];
      
      for (let i = 0; i < 5; i++) {
        if (availablePlayers.length > 0) {
          const randomIndex = Math.floor(Math.random() * availablePlayers.length);
          newMarketPlayers.push(availablePlayers.splice(randomIndex, 1)[0]);
        }
      }
      
      marketPlayers.value = newMarketPlayers;
    };
    
    // Iniciar el juego
    const startGame = () => {
      if (!playerSetup.value.nickname) {
        playerSetup.value.nickname = 'Jugador';
      }
      
      // Comprobar palabra malsonante
      if (checkBannedWords(playerSetup.value.nickname)) {
        return;
      }
      
      initFootballers();
      initTeamStandings();
      createSchedule();
      
      if (playerSetup.value.gameMode === 'teams') {
        initPlayersTeamMode();
      } else {
        initPlayers();
      }
      
      initMarket();
      
      addNotification(`¡Bienvenido a ElHoyo Fantasy, ${playerSetup.value.nickname}! Tu equipo ha sido creado.`);
      
      gameState.value = 'playing';
      currentDay.value = 1;
      setTab('players');
      
      // Agregar listener de teclado para modo desarrollador
      window.addEventListener('keyup', handleDevModeKey);
    };
    
    // Inicializar jugadores para modo equipos
    const initPlayersTeamMode = () => {
      const userSquad = footballers.value.filter(p => p.team === playerSetup.value.selectedTeam);
      const user = {
        id: 'user',
        nickname: playerSetup.value.nickname,
        money: 1000000,
        squad: userSquad,
        inventory: [],
        totalPoints: 0,
        isAI: false
      };
      
      userSquad.forEach(player => {
        player.owner = user.id;
      });
      
      const aiPlayers = [];
      const availableTeams = teams.value.filter(t => t !== playerSetup.value.selectedTeam);
      const selectedNames = [];
      
      for (let i = 0; i < playerSetup.value.aiCount; i++) {
        const teamIndex = Math.floor(Math.random() * availableTeams.length);
        const team = availableTeams.splice(teamIndex, 1)[0];
        const aiSquad = footballers.value.filter(p => p.team === team);
        
        let aiName;
        do {
          aiName = aiNames[Math.floor(Math.random() * aiNames.length)];
        } while (selectedNames.includes(aiName));
        selectedNames.push(aiName);
        
        const ai = {
          id: `ai${i}`,
          nickname: aiName,
          money: 1000000,
          squad: aiSquad,
          inventory: [],
          totalPoints: 0,
          isAI: true,
          difficulty: playerSetup.value.aiDifficulty
        };
        
        aiSquad.forEach(player => {
          player.owner = ai.id;
        });
        
        aiPlayers.push(ai);
      }
      
      players.value = [user, ...aiPlayers];
      currentUser.value = user;
      playerInventory.value = user.inventory;
    };
    
    // Sistema de notificaciones
    const addNotification = (message, category = 'general') => {
      notifications.value.unshift({
        message,
        timestamp: new Date(),
        read: false,
        category // 'personal' o 'general'
      });
    };
    
    const toggleNotifications = () => {
      showNotifications.value = !showNotifications.value;
    };
    
    const markAsRead = (index) => {
      notifications.value[index].read = true;
    };
    
    const markAllAsRead = () => {
      notifications.value.forEach(notification => {
        notification.read = true;
      });
    };
    
    const clearNotifications = () => {
      notifications.value = [];
    };
    
    const formatNotificationTime = (timestamp) => {
      const now = new Date();
      const diff = Math.floor((now - timestamp) / 60000); // diferencia en minutos
      
      if (diff < 1) return 'hace un momento';
      if (diff < 60) return `hace ${diff} minutos`;
      
      const hours = Math.floor(diff / 60);
      if (hours < 24) return `hace ${hours} horas`;
      
      const days = Math.floor(hours / 24);
      return `hace ${days} días`;
    };
    
    const unreadNotifications = computed(() => {
      return notifications.value.filter(notif => !notif.read).length;
    });
    
    // Comprar un jugador del mercado
    const buyPlayer = (player) => {
      if (!canBuyPlayer(player)) return;
      
      // Actualizar el dinero del usuario
      currentUser.value.money -= player.cost;
      
      // Asignar jugador al usuario
      player.owner = currentUser.value.id;
      
      // Si tiene espacio en la plantilla, añadir a la plantilla, si no, al inventario
      if (currentUser.value.squad.filter(p => p.position === player.position).length < 3) {
        currentUser.value.squad.push(player);
      } else {
        currentUser.value.inventory.push(player);
        playerInventory.value = currentUser.value.inventory;
      }
      
      // Quitar del mercado
      marketPlayers.value = marketPlayers.value.filter(p => p.id !== player.id);
      
      // Refrescar mercado con un nuevo jugador
      refreshMarket();
      
      addNotification(`Has comprado a ${player.name} por ${formatMoney(player.cost)}.`);
    };
    
    // Vender un jugador
    const sellPlayer = (player) => {
      if (!canSellPlayer(player)) return;
      
      // Devolver la mitad del dinero al usuario
      const sellPrice = Math.floor(player.cost / 2);
      currentUser.value.money += sellPrice;
      
      // Quitar jugador del usuario (plantilla o inventario)
      const inSquad = currentUser.value.squad.some(p => p.id === player.id);
      
      if (inSquad) {
        currentUser.value.squad = currentUser.value.squad.filter(p => p.id !== player.id);
      } else {
        currentUser.value.inventory = currentUser.value.inventory.filter(p => p.id !== player.id);
        playerInventory.value = currentUser.value.inventory;
      }
      
      // Marcar como disponible
      player.owner = null;
      
      addNotification(`Has vendido a ${player.name} por ${formatMoney(sellPrice)}.`);
    };
    
    // Comprobar si se puede comprar un jugador
    const canBuyPlayer = (player) => {
      if (!currentUser.value) return false;
      
      // Comprobar si tiene suficiente dinero
      return currentUser.value.money >= player.cost;
    };
    
    // Comprobar si se puede vender un jugador
    const canSellPlayer = (player) => {
      if (!currentUser.value) return false;
      
      // Si el jugador está en el inventario, siempre se puede vender
      const inInventory = currentUser.value.inventory.some(p => p.id === player.id);
      if (inInventory) return true;
      
      // Comprobar que tiene al menos 1 jugador de cada posición después de vender
      const positionCount = currentUser.value.squad.filter(p => p.position === player.position).length;
      return positionCount > 1;
    };
    
    // Formatear dinero
    const formatMoney = (value) => {
      return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value).replace('€', '¥');
    };
    
    // Obtener jugadores de cada posición para el equipo del usuario
    const userATQPlayers = computed(() => {
      return currentUser.value ? currentUser.value.squad.filter(player => player.position === 'ATQ') : [];
    });
    
    const userMCEPlayers = computed(() => {
      return currentUser.value ? currentUser.value.squad.filter(player => player.position === 'MCE') : [];
    });
    
    const userDFCPlayers = computed(() => {
      return currentUser.value ? currentUser.value.squad.filter(player => player.position === 'DFC') : [];
    });
    
    // Jugadores ordenados por puntos (clasificación)
    const sortedPlayers = computed(() => {
      return [...players.value].sort((a, b) => b.totalPoints - a.totalPoints);
    });
    
    // Clasificación de equipos ordenada por puntos
    const sortedTeamStandings = computed(() => {
      return Object.values(teamStandings.value).sort((a, b) => {
        // Ordenar por puntos y si hay empate, por diferencia de goles
        if (a.points !== b.points) {
          return b.points - a.points;
        }
        return b.goalDifference - a.goalDifference;
      });
    });
    
    // Obtener clasificación para un día específico
    const getStandingsForDay = computed(() => {
      if (standingsView.value === 'general') {
        return sortedPlayers.value;
      }
      
      const day = parseInt(standingsView.value);
      return [...players.value].sort((a, b) => {
        const aPoints = getPlayerPointsForDay(a, day);
        const bPoints = getPlayerPointsForDay(b, day);
        return bPoints - aPoints;
      });
    });
    
    // Calcular puntos de un jugador para un día específico
    const getPlayerPointsForDay = (player, day = null) => {
      if (day === null) return player.totalPoints;
      
      let points = 0;
      matchHistory.value.forEach(match => {
        if (match.day <= day) {
          match.playerPoints.forEach(pointEvent => {
            if (pointEvent.includes(player.nickname)) {
              const pointMatch = pointEvent.match(/([+-]\d+)/);
              if (pointMatch) {
                points += parseInt(pointMatch[0]);
              }
            }
          });
        }
      });
      return points;
    };
    
    // Cambiar pestaña actual
    const setTab = (tabId) => {
      currentTab.value = tabId;
    };
    
    // Función para mostrar la plantilla de un jugador
    const showPlayerSquad = (player) => {
      selectedPlayer.value = player;
    };
    
    // Cerrar modal de plantilla
    const closePlayerModal = () => {
      selectedPlayer.value = null;
    };
    
    // Obtener jugadores por posición para cualquier jugador
    const getPlayersByPosition = (player, position) => {
      return player ? player.squad.filter(p => p.position === position) : [];
    };
    
    // Simular siguiente partido
    const simulateNextMatch = async () => {
      const match = nextMatchToSimulate.value;
      if (!match) return;
      
      gameState.value = 'simulating';
      simulationLog.value = [];
      currentMatch.value = match;
      
      // Iniciar simulación
      await simulateMatch(match);
    };
    
    // Lógica de simulación del partido
    const simulateMatch = async (match) => {
      if (!match) return;
      
      const homeTeam = match.homeTeam;
      const awayTeam = match.awayTeam;
      
      // Initialize match events array if it doesn't exist
      if (!match.events) {
        match.events = [];
      }
      
      simulationEvents.value = []; // Reiniciar eventos para la línea de tiempo
      
      const homeQuality = getTeamQuality(homeTeam);
      const awayQuality = getTeamQuality(awayTeam);
      
      let homeScore = 0;
      let awayScore = 0;
      
      // Simular 90 minutos
      let minute = 1;
      let increment = Math.floor(Math.random() * 3) + 2;
      
      while (minute <= 90) {
        const eventLog = `Minuto ${minute}`;
        simulationLog.value.push(eventLog);
        
        // Añadir evento a la línea de tiempo
        simulationEvents.value.push({
          minute,
          text: "Juego en curso",
          isGoal: false
        });
        
        // Probabilidad de gol en este minuto
        const goalChance = Math.random();
        
        if (goalChance < 0.06) { // 6% de probabilidad de gol por minuto
          // Determinar quién marca
          const homeChance = 0.5 + (homeQuality - awayQuality) * 0.2 / 100;
          const homeScores = Math.random() < homeChance;
          
          if (homeScores) {
            homeScore++;
            
            // Elegir un jugador aleatorio de ese equipo para marcar
            const scoringPlayer = getRandomScoringPlayer(homeTeam);
            if (scoringPlayer) {
              const goalEvent = `¡GOL! ${minute}' - ${scoringPlayer.name} marca para ${homeTeam}`;
              simulationLog.value.push(goalEvent);
              match.events.push(goalEvent);
              
              // Añadir gol a la línea de tiempo
              simulationEvents.value.push({
                minute,
                text: `${scoringPlayer.name} marca para ${homeTeam}`,
                isGoal: true
              });
              
              // Asegurarse de que el jugador existe antes de actualizar sus stats
              if (scoringPlayer.points !== undefined) {
                updatePlayerStatsForGoal(scoringPlayer);
                scoringPlayer.goals++;
              }
            }
          } else {
            awayScore++;
            
            // Elegir un jugador aleatorio de ese equipo para marcar
            const scoringPlayer = getRandomScoringPlayer(awayTeam);
            if (scoringPlayer) {
              const goalEvent = `¡GOL! ${minute}' - ${scoringPlayer.name} marca para ${awayTeam}`;
              simulationLog.value.push(goalEvent);
              match.events.push(goalEvent);
              
              // Añadir gol a la línea de tiempo
              simulationEvents.value.push({
                minute,
                text: `${scoringPlayer.name} marca para ${awayTeam}`,
                isGoal: true
              });
              
              // Asegurarse de que el jugador existe antes de actualizar sus stats
              if (scoringPlayer.points !== undefined) {
                updatePlayerStatsForGoal(scoringPlayer);
                scoringPlayer.goals++;
              }
            }
          }
          
          // Actualizar resultado en tiempo real
          if (currentMatch.value) {
            currentMatch.value.homeScore = homeScore;
            currentMatch.value.awayScore = awayScore;
          }
        }
        
        minute += increment;
        increment = Math.floor(Math.random() * 3) + 2;
        
        // Pequeña pausa para efecto visual
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Finalizar partido
      match.homeScore = homeScore;
      match.awayScore = awayScore;
      match.simulated = true;
      
      // Generar narrativa del partido
      const matchNarrative = generateMatchNarrative(homeTeam, awayTeam, homeScore, awayScore);
      match.narrative = matchNarrative;
      
      // Actualizar estadísticas de los equipos si existen
      if (teamStandings.value && teamStandings.value[homeTeam] && teamStandings.value[awayTeam]) {
        updateTeamStandings(homeTeam, awayTeam, homeScore, awayScore);
      }
      
      // Actualizar stats de los jugadores según el resultado
      updatePlayersStats(homeTeam, awayTeam, homeScore, awayScore);
      
      // ... existing code ...
      
      // Mensaje final
      const finalMessage = `Resultado final: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`;
      simulationLog.value.push(finalMessage);
      simulationLog.value.push(matchNarrative);
      
      // Añadir evento final a la línea de tiempo
      simulationEvents.value.push({
        minute: 90,
        text: `Final: ${homeTeam} ${homeScore} - ${awayScore} ${awayTeam}`,
        isGoal: false
      });
      
      matchFinished.value = true;
    };
    
    // Generar narrativa para el partido
    const generateMatchNarrative = (homeTeam, awayTeam, homeScore, awayScore) => {
      const scoreDiff = Math.abs(homeScore - awayScore);
      const winningTeam = homeScore > awayScore ? homeTeam : awayTeam;
      const losingTeam = homeScore > awayScore ? awayTeam : homeTeam;
      
      if (homeScore === awayScore) {
        return `Un empate justo entre ${homeTeam} y ${awayTeam}. Ambos equipos mostraron sus fortalezas y debilidades por igual.`;
      }
      
      if (scoreDiff >= 4) {
        return `¡Qué locura la victoria de ${winningTeam}! Qué pena con el ${losingTeam}, esperemos que ${losingTeam} aprenda de esta derrota para mejorar en el próximo partido.`;
      } else if (scoreDiff >= 2) {
        return `${winningTeam} ha mostrado superioridad clara sobre ${losingTeam} hoy. Una victoria bien merecida.`;
      } else {
        return `Victoria ajustada de ${winningTeam} contra ${losingTeam} en un partido muy disputado.`;
      }
    };
    
    // Obtener un jugador aleatorio para marcar un gol
    const getRandomScoringPlayer = (teamName) => {
      const teamPlayers = footballers.value.filter(player => player.team === teamName);
      const attackers = teamPlayers.filter(player => player.position === 'ATQ');
      const midfielders = teamPlayers.filter(player => player.position === 'MCE');
      
      // Más probabilidad para delanteros, luego mediocampistas, rara vez defensas
      const roll = Math.random();
      
      if (roll < 0.7 && attackers.length > 0) {
        return attackers[Math.floor(Math.random() * attackers.length)];
      } else if (roll < 0.95 && midfielders.length > 0) {
        return midfielders[Math.floor(Math.random() * midfielders.length)];
      } else {
        return teamPlayers[Math.floor(Math.random() * teamPlayers.length)];
      }
    };
    
    // Actualizar estadísticas de jugador al marcar gol
    const updatePlayerStatsForGoal = (player) => {
      // Esta función es un placeholder - los stats reales se actualizan después
      // cuando se procesa el resultado completo del partido
      if (player.points !== undefined) {
        player.points += 4;
        player.quality += 2;
        player.cost += 7000;
      }
    };
    
    // Actualizar estadísticas de equipos
    const updateTeamStandings = (homeTeam, awayTeam, homeScore, awayScore) => {
      // Equipo local
      teamStandings.value[homeTeam].played += 1;
      teamStandings.value[homeTeam].goalsFor += homeScore;
      teamStandings.value[homeTeam].goalsAgainst += awayScore;
      
      // Equipo visitante
      teamStandings.value[awayTeam].played += 1;
      teamStandings.value[awayTeam].goalsFor += awayScore;
      teamStandings.value[awayTeam].goalsAgainst += homeScore;
      
      // Determinar resultado
      if (homeScore > awayScore) {
        // Victoria local
        teamStandings.value[homeTeam].won += 1;
        teamStandings.value[homeTeam].points += 3;
        teamStandings.value[awayTeam].lost += 1;
      } else if (homeScore < awayScore) {
        // Victoria visitante
        teamStandings.value[awayTeam].won += 1;
        teamStandings.value[awayTeam].points += 3;
        teamStandings.value[homeTeam].lost += 1;
      } else {
        // Empate
        teamStandings.value[homeTeam].drawn += 1;
        teamStandings.value[homeTeam].points += 1;
        teamStandings.value[awayTeam].drawn += 1;
        teamStandings.value[awayTeam].points += 1;
      }
      
      // Actualizar diferencia de goles
      teamStandings.value[homeTeam].goalDifference = 
        teamStandings.value[homeTeam].goalsFor - teamStandings.value[homeTeam].goalsAgainst;
      
      teamStandings.value[awayTeam].goalDifference = 
        teamStandings.value[awayTeam].goalsFor - teamStandings.value[awayTeam].goalsAgainst;
    };
    
    // Calcular calidad total de un equipo (para la simulación)
    const getTeamQuality = (teamName) => {
      const teamPlayers = footballers.value.filter(player => player.team === teamName);
      return teamPlayers.reduce((sum, player) => sum + player.quality, 0) / teamPlayers.length;
    };
    
    // Acabar simulación y volver al juego
    const finishSimulation = () => {
      if (!matchFinished.value) return;
      
      gameState.value = 'playing';
      
      // Comprobar si es el último partido de la jornada
      if (schedule.value[currentDay.value - 1].every(match => match.simulated)) {
        // Recopilar clasificación de la jornada actual antes de avanzar
        const dayStandings = [...players.value].sort((a, b) => {
          return getPlayerPointsForDay(b, currentDay.value) - getPlayerPointsForDay(a, currentDay.value);
        });
        
        // Premios para los mejores de la jornada
        if (dayStandings.length > 0) {
          if (dayStandings[0]) {
            dayStandings[0].money += 50000;
            addNotification(`${dayStandings[0].nickname} ha ganado 50.000¥ por quedar primero en la jornada ${currentDay.value}!`);
          }
          if (dayStandings.length > 1 && dayStandings[1]) {
            dayStandings[1].money += 25000;
            addNotification(`${dayStandings[1].nickname} ha ganado 25.000¥ por quedar segundo en la jornada ${currentDay.value}!`);
          }
          if (dayStandings.length > 2 && dayStandings[2]) {
            dayStandings[2].money += 10000;
            addNotification(`${dayStandings[2].nickname} ha ganado 10.000¥ por quedar tercero en la jornada ${currentDay.value}!`);
          }
        }
        
        // Avanzar al siguiente día
        currentDay.value++;
        
        // Notificar nueva jornada
        addNotification(`¡Ha comenzado la jornada ${currentDay.value}!`);
        
        // Refrescar mercado con nuevos jugadores
        refreshMarket();
        
        // Actualizar comportamiento de las IAs
        updateAIPlayers();
        
        // Si se han jugado todas las jornadas, finalizar el juego
        if (currentDay.value > schedule.value.length) {
          gameState.value = 'finished';
          
          const winner = sortedPlayers.value[0];
          if (winner.id === currentUser.value.id) {
            addNotification("¡Felicidades! Has ganado la liga.");
          } else {
            addNotification(`La liga ha terminado. ${winner.nickname} es el campeón.`);
          }
        }
      }
      
      matchFinished.value = false;
    };
    
    // Reiniciar el juego
    const restartGame = () => {
      // Reiniciar todas las variables de estado
      gameState.value = 'init';
      currentDay.value = 0;
      currentTab.value = 'players';
      players.value = [];
      currentUser.value = null;
      schedule.value = [];
      matchHistory.value = [];
      currentMatch.value = null;
      simulationLog.value = [];
      simulationEvents.value = [];
      marketPlayers.value = [];
      teamStandings.value = {};
      notifications.value = [];
      playerInventory.value = [];
      playerOffers.value = [];
      showAllFootballers.value = false;
      selectedPlayer.value = null;
      
      // Reiniciar configuración inicial
      playerSetup.value = {
        nickname: '',
        aiCount: 2,
        aiDifficulty: 'normal',
        gameMode: 'fantasy',
        selectedTeam: null
      };
      
      // Reiniciar los futbolistas
      footballers.value = [];
    };
    
    // Actualizar jugadores IA
    const updateAIPlayers = () => {
      players.value.filter(player => player.isAI).forEach(ai => {
        // Sumar puntos totales
        const totalPoints = ai.squad.reduce((sum, player) => sum + player.points, 0);
        ai.totalPoints = totalPoints;
        
        // Lógica de IA para comprar/vender según dificultad
        const difficulty = ai.difficulty;
        
        // Asegurarse de que las IA tengan al menos 9 jugadores
        ensureMinimumSquadSize(ai);
        
        if (difficulty === 'normal') {
          // IA normal: compra aleatoriamente si tiene dinero
          simpleAIBehavior(ai);
        } else if (difficulty === 'hard') {
          // IA difícil: más estratégica
          advancedAIBehavior(ai);
        } else if (difficulty === 'kebab') {
          // IA muy difícil: cooperación y estrategia avanzada
          expertAIBehavior(ai);
        } else if (difficulty === 'motos') {
          // IA extremadamente difícil: hace trampas
          cheatingAIBehavior(ai);
        }
        
        // Vender jugadores en el mercado de fichajes ocasionalmente
        if (Math.random() < 0.2 && ai.squad.length > 9) { // 20% de probabilidad
          aiSellPlayerInMarket(ai);
        }
      });
    };
    
    // Asegurar que las IA tengan al menos 9 jugadores
    const ensureMinimumSquadSize = (ai) => {
      if (ai.squad.length >= 9) return;
      
      // Contar jugadores por posición
      const positionCounts = {
        'ATQ': ai.squad.filter(p => p.position === 'ATQ').length,
        'MCE': ai.squad.filter(p => p.position === 'MCE').length,
        'DFC': ai.squad.filter(p => p.position === 'DFC').length
      };
      
      // Determinar posiciones necesarias
      const neededPositions = [];
      if (positionCounts['ATQ'] < 1) neededPositions.push('ATQ');
      if (positionCounts['MCE'] < 1) neededPositions.push('MCE');
      if (positionCounts['DFC'] < 1) neededPositions.push('DFC');
      
      // Priorizar la compra de posiciones necesarias
      if (neededPositions.length > 0) {
        for (const position of neededPositions) {
          const availableForPosition = marketPlayers.value.filter(p => p.position === position && p.cost <= ai.money);
          if (availableForPosition.length > 0) {
            // Elegir el mejor jugador para esta posición
            availableForPosition.sort((a, b) => b.quality - a.quality);
            const playerToBuy = availableForPosition[0];
            
            // Comprar jugador
            ai.money -= playerToBuy.cost;
            ai.squad.push(playerToBuy);
            playerToBuy.owner = ai.id;
            
            // Quitar del mercado
            marketPlayers.value = marketPlayers.value.filter(p => p.id !== playerToBuy.id);
            
            addNotification(`${ai.nickname} ha comprado a ${playerToBuy.name} por ${formatMoney(playerToBuy.cost)} (posición necesaria).`, 'general');
            return; // Comprar un jugador por ciclo
          }
        }
      }
      
      // Comprar jugadores hasta tener 9
      const availablePlayers = footballers.value.filter(p => p.owner === null && p.cost <= ai.money);
      
      while (ai.squad.length < 9 && availablePlayers.length > 0) {
        // Priorizar posiciones necesarias
        let filteredPlayers = availablePlayers;
        if (neededPositions.length > 0) {
          filteredPlayers = availablePlayers.filter(p => neededPositions.includes(p.position));
          if (filteredPlayers.length === 0) filteredPlayers = availablePlayers;
        }
        
        // Seleccionar mejor jugador disponible para cada posición
        filteredPlayers.sort((a, b) => b.quality - a.quality); // Ordenar por calidad
        
        if (filteredPlayers.length > 0) {
          const playerToBuy = filteredPlayers[0];
          
          // Comprar jugador
          ai.money -= playerToBuy.cost;
          ai.squad.push(playerToBuy);
          playerToBuy.owner = ai.id;
          
          // Quitar del mercado
          const index = availablePlayers.indexOf(playerToBuy);
          if (index > -1) {
            availablePlayers.splice(index, 1);
          }
          
          // Actualizar conteos de posición
          positionCounts[playerToBuy.position]++;
          if (positionCounts[playerToBuy.position] >= 3) {
            neededPositions.splice(neededPositions.indexOf(playerToBuy.position), 1);
          }
          
          // Notificar
          addNotification(`${ai.nickname} ha comprado a ${playerToBuy.name} por ${formatMoney(playerToBuy.cost)}.`, 'general');
        }
      }
    };
    
    // IA pone jugador en el mercado
    const aiSellPlayerInMarket = (ai) => {
      // Buscar jugador de bajo rendimiento o aleatorio para vender
      const candidates = ai.squad.filter(p => p.points < 0);
      let playerToSell;
      
      if (candidates.length > 0) {
        playerToSell = candidates[Math.floor(Math.random() * candidates.length)];
      } else {
        // Elegir un jugador aleatorio que no sea crítico
        const positionCounts = {
          'ATQ': ai.squad.filter(p => p.position === 'ATQ').length,
          'MCE': ai.squad.filter(p => p.position === 'MCE').length,
          'DFC': ai.squad.filter(p => p.position === 'DFC').length
        };
        
        const possibleSellers = ai.squad.filter(p => positionCounts[p.position] > 3);
        if (possibleSellers.length === 0) return;
        
        playerToSell = possibleSellers[Math.floor(Math.random() * possibleSellers.length)];
      }
      
      if (!playerToSell) return;
      
      // Quitar de la IA
      ai.squad = ai.squad.filter(p => p.id !== playerToSell.id);
      
      // Poner en el mercado
      playerToSell.owner = 'market';
      marketPlayers.value.push(playerToSell);
      
      addNotification(`${ai.nickname} ha puesto a ${playerToSell.name} en el mercado.`, 'general');
    };
    
    // Comportamiento de IA que hace trampas (Pablo Motos) - Versión mejorada
    const cheatingAIBehavior = (ai) => {
      // Intentar robar un jugador del usuario si es posible
      const shouldTryToSteal = Math.random() < 0.3; // 30% de probabilidad (aumentada)
      
      if (shouldTryToSteal && currentUser.value.squad.length > 3) {
        // Encontrar el mejor jugador del usuario
        const userPlayers = currentUser.value.squad.sort((a, b) => b.quality - a.quality);
        const targetPlayer = userPlayers[0]; // El mejor jugador
        const stealPrice = targetPlayer.cost * 2;
        
        // Si la IA puede pagar el doble o recibe dinero extra en caso necesario
        if (ai.money < stealPrice && Math.random() < 0.5) {
          // Hacer trampa recibiendo dinero extra
          const extraMoney = stealPrice - ai.money + 10000;
          ai.money += extraMoney;
          addNotification(`${ai.nickname} ha recibido ${formatMoney(extraMoney)} misteriosamente.`, 'general');
        }
        
        if (ai.money >= stealPrice) {
          // Robar jugador
          ai.money -= stealPrice;
          currentUser.value.money += stealPrice;
          
          // Quitar del usuario
          currentUser.value.squad = currentUser.value.squad.filter(p => p.id !== targetPlayer.id);
          
          // Añadir a la IA
          targetPlayer.owner = ai.id;
          ai.squad.push(targetPlayer);
          
          addNotification(`¡${ai.nickname} ha robado a tu jugador ${targetPlayer.name} pagando ${formatMoney(stealPrice)}!`, 'personal');
        }
      }
      
      // Sabotear a otros jugadores
      const shouldSabotage = Math.random() < 0.4; // 40% de probabilidad
      if (shouldSabotage) {
        const potentialTargets = players.value.filter(p => !p.isAI && p.id !== ai.id);
        if (potentialTargets.length > 0) {
          // Elegir un jugador al azar para sabotear
          const targetPlayer = potentialTargets[Math.floor(Math.random() * potentialTargets.length)];
          
          // Espiar información
          if (targetPlayer.id === currentUser.value.id) {
            const randomMessage = [
              "Te estoy vigilando. Tu estrategia no funcionará.",
              "No creo que puedas ganarme tan fácilmente.",
              "Tengo grandes planes para mi equipo esta temporada.",
              "¿Has visto el último partido? ¡Qué locura!",
              "Estoy buscando mejorar mi plantilla, ¿tienes algún jugador para vender?",
              "Tu equipo parece fuerte, pero el mío lo será más pronto.",
              "La próxima jornada será decisiva.",
              "¿Cuánto quieres por ese delantero?",
              "No vendo a mis mejores jugadores. Ni lo intentes.",
              "Esta liga está muy reñida, ¿no crees?"
            ][Math.floor(Math.random() * 10)];
            
            // Enviar mensaje amenazante
            chatMessages.value.push({
              from: 'ai',
              sender: ai.nickname,
              content: randomMessage,
              time: new Date(),
              read: false
            });
            
            if (!showChat.value) {
              unreadChatMessages.value++;
            }
          }
        }
      }
      
      // Además de hacer trampas, usar comportamiento experto
      expertAIBehavior(ai);
      
      // Ocasionalmente recibir mejora de calidad
      if (Math.random() < 0.15) { // 15% de probabilidad
        // Elegir un jugador aleatorio
        const luckyPlayer = ai.squad[Math.floor(Math.random() * ai.squad.length)];
        luckyPlayer.quality += 5;
        luckyPlayer.cost += 15000;
        
        addNotification(`¡${luckyPlayer.name} del equipo de ${ai.nickname} ha mejorado misteriosamente su calidad en 5 puntos!`, 'general');
      }
    };
    
    // Simulación de jornada completa
    const simulateFullMatchday = async () => {
      if (allMatchesSimulated.value || currentMatchdayCompleted.value) return;
      
      while (nextMatchToSimulate.value) {
        // Simular un partido
        await simulateNextMatch();
        
        // Esperar un breve momento para evitar problemas de renderizado
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    };
    
    // Verificar si la jornada actual está completa
    const currentMatchdayCompleted = computed(() => {
      if (currentDay.value > schedule.value.length) return true;
      return schedule.value[currentDay.value - 1].every(match => match.simulated);
    });
    
    // Comportamiento de IA simple
    const simpleAIBehavior = (ai) => {
      // Verificar si tenemos las posiciones mínimas cubiertas
      const positionCounts = {
        'ATQ': ai.squad.filter(p => p.position === 'ATQ').length,
        'MCE': ai.squad.filter(p => p.position === 'MCE').length,
        'DFC': ai.squad.filter(p => p.position === 'DFC').length
      };
      
      const neededPositions = [];
      if (positionCounts['ATQ'] < 1) neededPositions.push('ATQ');
      if (positionCounts['MCE'] < 1) neededPositions.push('MCE');
      if (positionCounts['DFC'] < 1) neededPositions.push('DFC');
      
      // Priorizar la compra de posiciones necesarias
      if (neededPositions.length > 0) {
        for (const position of neededPositions) {
          const availableForPosition = marketPlayers.value.filter(p => p.position === position && p.cost <= ai.money);
          if (availableForPosition.length > 0) {
            // Elegir el mejor jugador para esta posición
            availableForPosition.sort((a, b) => b.quality - a.quality);
            const playerToBuy = availableForPosition[0];
            
            // Comprar jugador
            ai.money -= playerToBuy.cost;
            ai.squad.push(playerToBuy);
            playerToBuy.owner = ai.id;
            
            // Quitar del mercado
            marketPlayers.value = marketPlayers.value.filter(p => p.id !== playerToBuy.id);
            
            addNotification(`${ai.nickname} ha comprado a ${playerToBuy.name} por ${formatMoney(playerToBuy.cost)} (posición necesaria).`, 'general');
            return; // Comprar un jugador por ciclo
          }
        }
      }
      
      // Intenta comprar un jugador si tiene dinero suficiente
      const availablePlayers = marketPlayers.value.filter(player => player.cost <= ai.money);
      
      if (availablePlayers.length > 0 && ai.squad.length < 9) {
        // Comprobar capacidad por posición
        const updatedPositionCounts = {
          'ATQ': ai.squad.filter(p => p.position === 'ATQ').length,
          'MCE': ai.squad.filter(p => p.position === 'MCE').length,
          'DFC': ai.squad.filter(p => p.position === 'DFC').length
        };
        
        // Filtrar por posiciones disponibles
        const buyablePlayers = availablePlayers.filter(
          p => updatedPositionCounts[p.position] < 3
        ).sort((a, b) => b.quality - a.quality); // Ordenar por calidad
        
        if (buyablePlayers.length > 0) {
          // Elegir el mejor jugador para comprar
          const playerToBuy = buyablePlayers[0];
          
          // Comprar jugador
          ai.money -= playerToBuy.cost;
          ai.squad.push(playerToBuy);
          playerToBuy.owner = ai.id;
          
          // Quitar del mercado
          marketPlayers.value = marketPlayers.value.filter(p => p.id !== playerToBuy.id);
          
          addNotification(`${ai.nickname} ha comprado a ${playerToBuy.name} por ${formatMoney(playerToBuy.cost)}.`, 'general');
        }
      }
    };
    
    // Comportamiento de IA avanzada
    const advancedAIBehavior = (ai) => {
      // Verificar si tenemos las posiciones mínimas cubiertas
      const positionCounts = {
        'ATQ': ai.squad.filter(p => p.position === 'ATQ').length,
        'MCE': ai.squad.filter(p => p.position === 'MCE').length,
        'DFC': ai.squad.filter(p => p.position === 'DFC').length
      };
      
      const neededPositions = [];
      if (positionCounts['ATQ'] < 1) neededPositions.push('ATQ');
      if (positionCounts['MCE'] < 1) neededPositions.push('MCE');
      if (positionCounts['DFC'] < 1) neededPositions.push('DFC');
      
      // Priorizar la compra de posiciones necesarias
      if (neededPositions.length > 0) {
        for (const position of neededPositions) {
          const availableForPosition = marketPlayers.value.filter(p => p.position === position && p.cost <= ai.money);
          if (availableForPosition.length > 0) {
            // Elegir el mejor jugador para esta posición
            availableForPosition.sort((a, b) => b.quality - a.quality);
            const playerToBuy = availableForPosition[0];
            
            // Comprar jugador
            ai.money -= playerToBuy.cost;
            ai.squad.push(playerToBuy);
            playerToBuy.owner = ai.id;
            
            // Quitar del mercado
            marketPlayers.value = marketPlayers.value.filter(p => p.id !== playerToBuy.id);
            
            addNotification(`${ai.nickname} ha comprado a ${playerToBuy.name} por ${formatMoney(playerToBuy.cost)} (posición necesaria).`, 'general');
            return; // Comprar un jugador por ciclo
          }
        }
      }
      
      // Primero intentar vender jugadores de bajo rendimiento
      const lowPerformers = ai.squad
        .filter(player => player.points < 0 && positionCounts[player.position] > 1)
        .sort((a, b) => a.points - b.points);
      
      // Vender el jugador con peor rendimiento si tenemos más de 1 de su posición
      if (lowPerformers.length > 0) {
        const worstPlayer = lowPerformers[0];
        
        // Vender jugador
        const sellPrice = Math.floor(worstPlayer.cost / 2);
        ai.money += sellPrice;
        ai.squad = ai.squad.filter(p => p.id !== worstPlayer.id);
        worstPlayer.owner = null;
        
        // Añadir al mercado si hay espacio
        if (marketPlayers.value.length < 5) {
          marketPlayers.value.push(worstPlayer);
        }
        
        addNotification(`${ai.nickname} ha vendido a ${worstPlayer.name} por ${formatMoney(sellPrice)} (mal rendimiento).`, 'general');
      }
      
      // Luego intentar comprar mejores jugadores
      const affordablePlayers = marketPlayers.value
        .filter(player => player.cost <= ai.money)
        .sort((a, b) => b.quality - a.quality);
      
      if (affordablePlayers.length > 0 && ai.squad.length < 9) {
        // Actualizar conteo de posiciones después de posible venta
        const updatedPositionCounts = {
          'ATQ': ai.squad.filter(p => p.position === 'ATQ').length,
          'MCE': ai.squad.filter(p => p.position === 'MCE').length,
          'DFC': ai.squad.filter(p => p.position === 'DFC').length
        };
        
        // Filtrar por posiciones disponibles
        const buyablePlayers = affordablePlayers.filter(
          p => updatedPositionCounts[p.position] < 3
        );
        
        if (buyablePlayers.length > 0) {
          // Elegir el mejor jugador que podamos permitirnos
          const playerToBuy = buyablePlayers[0];
          
          // Comprar jugador
          ai.money -= playerToBuy.cost;
          ai.squad.push(playerToBuy);
          playerToBuy.owner = ai.id;
          
          // Quitar del mercado
          marketPlayers.value = marketPlayers.value.filter(p => p.id !== playerToBuy.id);
          
          addNotification(`${ai.nickname} ha comprado a ${playerToBuy.name} por ${formatMoney(playerToBuy.cost)}.`, 'general');
        }
      }
      
      // Mejorar plantilla sustituyendo jugadores de baja calidad si tenemos dinero
      if (ai.money > 50000) {
        // Buscar el jugador de menor calidad que podamos sustituir
        const squadByPosition = {
          'ATQ': ai.squad.filter(p => p.position === 'ATQ').sort((a, b) => a.quality - a.quality),
          'MCE': ai.squad.filter(p => p.position === 'MCE').sort((a, b) => a.quality - a.quality),
          'DFC': ai.squad.filter(p => p.position === 'DFC').sort((a, b) => a.quality - a.quality)
        };
        
        // Seleccionar posición con mayor oportunidad de mejora
        let positionToImprove = null;
        let worstPlayer = null;
        
        if (squadByPosition['ATQ'].length > 0 && squadByPosition['ATQ'][0].quality < 75) {
          positionToImprove = 'ATQ';
          worstPlayer = squadByPosition['ATQ'][0];
        } else if (squadByPosition['MCE'].length > 0 && squadByPosition['MCE'][0].quality < 75) {
          positionToImprove = 'MCE';
          worstPlayer = squadByPosition['MCE'][0];
        } else if (squadByPosition['DFC'].length > 0 && squadByPosition['DFC'][0].quality < 75) {
          positionToImprove = 'DFC';
          worstPlayer = squadByPosition['DFC'][0];
        }
        
        if (positionToImprove && worstPlayer) {
          // Buscar un jugador mejor en el mercado
          const betterPlayers = marketPlayers.value.filter(
            p => p.position === positionToImprove && 
                 p.quality > worstPlayer.quality + 5 && 
                 p.cost <= ai.money + (worstPlayer.cost / 2)
          ).sort((a, b) => b.quality - a.quality);
          
          if (betterPlayers.length > 0) {
            const playerToBuy = betterPlayers[0];
            
            // Vender jugador actual
            const sellPrice = Math.floor(worstPlayer.cost / 2);
            ai.money += sellPrice;
            ai.squad = ai.squad.filter(p => p.id !== worstPlayer.id);
            worstPlayer.owner = null;
            
            // Comprar nuevo jugador
            ai.money -= playerToBuy.cost;
            ai.squad.push(playerToBuy);
            playerToBuy.owner = ai.id;
            
            // Quitar del mercado
            marketPlayers.value = marketPlayers.value.filter(p => p.id !== playerToBuy.id);
            
            addNotification(`${ai.nickname} ha vendido a ${worstPlayer.name} y comprado a ${playerToBuy.name} para mejorar su plantilla.`, 'general');
          }
        }
      }
    };
    
    // Comportamiento de IA experta (con cooperación)
    const expertAIBehavior = (ai) => {
      // Comportamiento similar al avanzado pero con cooperación
      advancedAIBehavior(ai);
      
      // Adicionalmente, comprobar si hay algún jugador en el mercado que beneficiaría
      // al líder (usuario) y evitar comprarlo, o comprar jugadores que perjudiquen al líder
      const leader = sortedPlayers.value[0];
      
      // Si el líder no soy yo, intentar bloquear sus movimientos
      if (leader.id !== ai.id) {
        const leaderPositionNeeds = {
          'ATQ': leader.squad.filter(p => p.position === 'ATQ').length < 3,
          'MCE': leader.squad.filter(p => p.position === 'MCE').length < 3,
          'DFC': leader.squad.filter(p => p.position === 'DFC').length < 3
        };
        
        // Comprobar jugadores que podrían beneficiar al líder
        const strategicPlayers = marketPlayers.value.filter(
          p => leaderPositionNeeds[p.position] && p.cost <= leader.money && p.quality > 85
        );
        
        if (strategicPlayers.length > 0 && ai.money >= strategicPlayers[0].cost) {
          // Comprar el jugador para evitar que lo compre el líder
          const playerToBlock = strategicPlayers[0];
          
          // Verificar si podemos añadirlo a nuestra plantilla
          const myPositionCount = ai.squad.filter(p => p.position === playerToBlock.position).length;
          
          if (myPositionCount < 3 && ai.squad.length < 9) {
            // Comprar jugador
            ai.money -= playerToBlock.cost;
            ai.squad.push(playerToBlock);
            playerToBlock.owner = ai.id;
            
            // Quitar del mercado
            marketPlayers.value = marketPlayers.value.filter(p => p.id !== playerToBlock.id);
          }
        }
      }
    };
    
    // Actualizar estadísticas de jugadores después de un partido
    const updatePlayersStats = (homeTeam, awayTeam, homeScore, awayScore) => {
      // Obtener jugadores de ambos equipos
      const homeTeamPlayers = footballers.value.filter(p => p.team === homeTeam);
      const awayTeamPlayers = footballers.value.filter(p => p.team === awayTeam);
      
      // Determinar si ganó el equipo local o visitante
      const homeWon = homeScore > awayScore;
      const awayWon = awayScore > homeScore;
      const draw = homeScore === awayScore;
      
      // Crear eventos para el historial de partidos
      const matchRecord = {
        day: currentDay.value,
        homeTeam,
        awayTeam,
        homeScore,
        awayScore,
        events: [],
        playerPoints: []
      };
      
      // Actualizar stats de jugadores del equipo local
      homeTeamPlayers.forEach(player => {
        let pointsAwarded = 0;
        
        if (homeWon) {
          // Victoria
          player.quality += 1;
          player.cost += 5000;
          if (player.points !== undefined) {
            player.points += 3;
            pointsAwarded += 3;
          }
          
          // Simular goles
          if (Math.random() < 0.4 && player.position === 'ATQ') {
            if (player.points !== undefined) {
              player.points += 4;
              player.quality += 2;
              player.cost += 7000;
              pointsAwarded += 4;
              
              matchRecord.events.push(`${player.name} marcó un gol para ${homeTeam}`);
            }
          }
        } else if (draw) {
          // Empate
          if (player.points !== undefined) {
            player.points += 1;
            pointsAwarded += 1;
          }
        } else {
          // Derrota
          player.quality = Math.max(50, player.quality - 1);
          player.cost = Math.max(10000, player.cost - 4000);
          if (player.points !== undefined) {
            player.points -= 2;
            pointsAwarded -= 2;
          }
          
          // Simular autogoles (raro)
          if (Math.random() < 0.05 && player.position === 'DFC') {
            if (player.points !== undefined) {
              player.points -= 6;
              player.quality = Math.max(50, player.quality - 3);
              player.cost = Math.max(10000, player.cost - 10000);
              pointsAwarded -= 6;
              
              matchRecord.events.push(`${player.name} marcó un autogol para ${homeTeam}`);
            }
          }
        }
        
        // Agregar los puntos al historial del partido
        if (player.owner && pointsAwarded !== 0) {
          const ownerPlayer = players.value.find(p => p.id === player.owner);
          if (ownerPlayer) {
            matchRecord.playerPoints.push(`${player.name} (${ownerPlayer.nickname}): ${pointsAwarded > 0 ? '+' + pointsAwarded : pointsAwarded}`);
          }
        }
        
        // Asegurar que los valores no bajen de mínimos
        player.quality = Math.max(50, player.quality);
        player.cost = Math.max(10000, player.cost);
      });
      
      // Actualizar stats de jugadores del equipo visitante
      awayTeamPlayers.forEach(player => {
        let pointsAwarded = 0;
        
        if (awayWon) {
          // Victoria
          player.quality += 1;
          player.cost += 5000;
          if (player.points !== undefined) {
            player.points += 3;
            pointsAwarded += 3;
          }
          
          // Simular goles
          if (Math.random() < 0.4 && player.position === 'ATQ') {
            if (player.points !== undefined) {
              player.points += 4;
              player.quality += 2;
              player.cost += 7000;
              pointsAwarded += 4;
              
              matchRecord.events.push(`${player.name} marcó un gol para ${awayTeam}`);
            }
          }
        } else if (draw) {
          // Empate
          if (player.points !== undefined) {
            player.points += 1;
            pointsAwarded += 1;
          }
        } else {
          // Derrota
          player.quality = Math.max(50, player.quality - 1);
          player.cost = Math.max(10000, player.cost - 4000);
          if (player.points !== undefined) {
            player.points -= 2;
            pointsAwarded -= 2;
          }
          
          // Simular autogoles (raro)
          if (Math.random() < 0.05 && player.position === 'DFC') {
            if (player.points !== undefined) {
              player.points -= 6;
              player.quality = Math.max(50, player.quality - 3);
              player.cost = Math.max(10000, player.cost - 10000);
              pointsAwarded -= 6;
              
              matchRecord.events.push(`${player.name} marcó un autogol para ${awayTeam}`);
            }
          }
        }
        
        // Agregar los puntos al historial del partido
        if (player.owner && pointsAwarded !== 0) {
          const ownerPlayer = players.value.find(p => p.id === player.owner);
          if (ownerPlayer) {
            matchRecord.playerPoints.push(`${player.name} (${ownerPlayer.nickname}): ${pointsAwarded > 0 ? '+' + pointsAwarded : pointsAwarded}`);
          }
        }
        
        // Asegurar que los valores no bajen de mínimos
        player.quality = Math.max(50, player.quality);
        player.cost = Math.max(10000, player.cost);
      });
      
      // Actualizar puntos totales para cada jugador
      players.value.forEach(player => {
        let totalPoints = 0;
        for (const footballer of [...player.squad, ...player.inventory]) {
          totalPoints += footballer.points || 0;
        }
        player.totalPoints = totalPoints;
      });
      
      // Agregar el registro del partido al historial
      matchHistory.value.push(matchRecord);
    };
    
    // Mostrar detalles de un equipo
    const showTeamDetails = (team) => {
      const teamPlayers = footballers.value.filter(p => p.team === team);
      const marketValue = teamPlayers.reduce((total, p) => total + p.cost, 0);
      
      selectedTeamDetails.value = {
        name: team,
        squad: teamPlayers,
        marketValue
      };
    };
    
    // Cerrar detalles de equipo
    const closeTeamDetails = () => {
      selectedTeamDetails.value = null;
    };
    
    // Comprobar si todos los partidos han sido simulados
    const allMatchesSimulated = computed(() => {
      return schedule.value.flat().every(match => match.simulated);
    });
    
    // Obtener el próximo partido para simular
    const nextMatchToSimulate = computed(() => {
      if (currentDay.value > schedule.value.length) return null;
      
      const day = schedule.value[currentDay.value - 1];
      return day.find(match => !match.simulated);
    });
    
    // Calculate squad value for any player
    const calculateSquadValue = (player) => {
      if (!player) return 0;
      return player.squad.reduce((total, p) => total + p.cost, 0);
    };
    
    // Observar cuando todos los partidos se han simulado para terminar el juego
    watch(allMatchesSimulated, (isAllSimulated) => {
      if (isAllSimulated) {
        gameState.value = 'finished';
      }
    });
    
    // Funciones para el inventario
    const moveToInventory = (player) => {
      if (!canSellPlayer(player)) return;
      
      // Quitar jugador de la plantilla
      currentUser.value.squad = currentUser.value.squad.filter(p => p.id !== player.id);
      
      // Añadir al inventario
      currentUser.value.inventory.push(player);
      playerInventory.value = currentUser.value.inventory;
      
      addNotification(`Has movido a ${player.name} a tu inventario.`);
    };
    
    const moveToSquad = (player) => {
      if (!canAddToSquad(player)) return;
      
      // Quitar jugador del inventario
      currentUser.value.inventory = currentUser.value.inventory.filter(p => p.id !== player.id);
      
      // Añadir a la plantilla
      currentUser.value.squad.push(player);
      playerInventory.value = currentUser.value.inventory;
      
      addNotification(`Has añadido a ${player.name} a tu plantilla.`);
    };
    
    const canAddToSquad = (player) => {
      if (!currentUser.value) return false;
      
      // Comprobar si ya tiene los 3 jugadores de esa posición
      const positionCount = currentUser.value.squad.filter(p => p.position === player.position).length;
      return positionCount < 3;
    };
    
    // Funciones para el mercado
    const addToMarket = (player) => {
      // Verificar si el jugador puede ser vendido
      if (!canSellPlayer(player)) return;
      
      // Quitar jugador del usuario (plantilla o inventario)
      const inSquad = currentUser.value.squad.some(p => p.id === player.id);
      
      if (inSquad) {
        currentUser.value.squad = currentUser.value.squad.filter(p => p.id !== player.id);
      } else {
        currentUser.value.inventory = currentUser.value.inventory.filter(p => p.id !== player.id);
        playerInventory.value = currentUser.value.inventory;
      }
      
      // Marcar el jugador como disponible en el mercado y añadirlo
      player.owner = 'market';
      marketPlayers.value.push(player);
      
      addNotification(`Has puesto a ${player.name} en el mercado.`);
      
      // Las IAs pueden hacer ofertas
      setTimeout(() => {
        makeBidForPlayer(player);
      }, 1000);
    };
    
    // IA hace ofertas por jugadores
    const makeBidForPlayer = (player) => {
      const aiPlayers = players.value.filter(p => p.isAI);
      
      // Seleccionar IA aleatoria que tenga interés y dinero
      const interestedAIs = aiPlayers.filter(ai => {
        // Verificar si la IA tiene suficiente dinero
        if (ai.money < player.cost) return false;
        
        // Verificar si la IA necesita un jugador de esa posición
        const positionCount = ai.squad.filter(p => p.position === player.position).length;
        return positionCount < 3;
      });
      
      if (interestedAIs.length > 0) {
        const bidder = interestedAIs[Math.floor(Math.random() * interestedAIs.length)];
        const bidAmount = Math.floor(player.cost * (1 + Math.random() * 0.3)); // Entre 100% y 130% del valor
        
        playerOffers.value.push({
          id: Date.now(),
          player,
          bidder,
          amount: bidAmount
        });
        
        addNotification(`${bidder.nickname} ha ofrecido ${formatMoney(bidAmount)} por tu jugador ${player.name}.`);
      }
    };
    
    // Aceptar oferta
    const acceptOffer = (offer) => {
      // Transferir jugador al comprador
      offer.player.owner = offer.bidder.id;
      offer.bidder.squad.push(offer.player);
      
      // Transferir dinero al usuario
      currentUser.value.money += offer.amount;
      offer.bidder.money -= offer.amount;
      
      // Quitar jugador del mercado
      marketPlayers.value = marketPlayers.value.filter(p => p.id !== offer.player.id);
      
      // Quitar oferta de la lista
      playerOffers.value = playerOffers.value.filter(o => o.id !== offer.id);
      
      addNotification(`Has vendido a ${offer.player.name} a ${offer.bidder.nickname} por ${formatMoney(offer.amount)}.`);
    };
    
    // Rechazar oferta
    const rejectOffer = (offer) => {
      playerOffers.value = playerOffers.value.filter(o => o.id !== offer.id);
      addNotification(`Has rechazado la oferta de ${offer.bidder.nickname} por ${offer.player.name}.`);
    };
    
    // Jugadores disponibles para comprar (todos los que no tienen dueño)
    const availableFootballers = computed(() => {
      return footballers.value.filter(player => player.owner === null);
    });
    
    // Chat system
    const toggleChat = () => {
      showChat.value = !showChat.value;
      if (showChat.value) {
        unreadChatMessages.value = 0;
      }
    };
    
    const sendChatMessage = () => {
      if (!chatDraft.value.trim()) return;
      
      const newMessage = {
        from: 'you',
        content: chatDraft.value,
        time: new Date(),
        read: true
      };
      
      chatMessages.value.push(newMessage);
      chatDraft.value = '';
      
      // Generate AI response
      setTimeout(() => {
        generateAIChatResponse(newMessage.content, chatRecipient.value);
      }, 1000 + Math.random() * 2000);
    };
    
    const generateAIChatResponse = (message, recipient) => {
      const responses = [
        "Interesante estrategia. Veamos cómo funciona.",
        "No creo que puedas ganarme tan fácilmente.",
        "Tengo grandes planes para mi equipo esta temporada.",
        "¿Has visto el último partido? ¡Qué locura!",
        "Estoy buscando mejorar mi plantilla, ¿tienes algún jugador para vender?",
        "Tu equipo parece fuerte, pero el mío lo será más pronto.",
        "La próxima jornada será decisiva.",
        "¿Cuánto quieres por ese delantero?",
        "No vendo a mis mejores jugadores. Ni lo intentes.",
        "Esta liga está muy reñida, ¿no crees?"
      ];
      
      let responder;
      if (recipient) {
        responder = players.value.find(p => p.id === recipient);
      } else {
        // Select random AI player
        const aiPlayers = players.value.filter(p => p.isAI);
        responder = aiPlayers[Math.floor(Math.random() * aiPlayers.length)];
      }
      
      if (!responder) return;
      
      const responseContent = responses[Math.floor(Math.random() * responses.length)];
      
      const aiResponse = {
        from: 'ai',
        sender: responder.nickname,
        content: responseContent,
        time: new Date(),
        read: false
      };
      
      chatMessages.value.push(aiResponse);
      
      // If chat is not open, increment unread count
      if (!showChat.value) {
        unreadChatMessages.value++;
      }
    };
    
    const formatChatTime = (time) => {
      return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
    
    // Filtrar inventario según el filtro seleccionado
    const filteredInventory = computed(() => {
      if (inventoryFilter.value === 'all') {
        return playerInventory.value;
      } else {
        return playerInventory.value.filter(player => player.position === inventoryFilter.value);
      }
    });
    
    // Obtener jugadores IA para chat
    const aiPlayers = computed(() => {
      return players.value.filter(player => player.isAI);
    });
    
    // Check banned words
    const checkBannedWords = (nickname) => {
      const lowerNick = nickname.toLowerCase();
      for (const word of bannedWords) {
        if (lowerNick.includes(word)) {
          alert('¡Palabra malsonante detectada! Por favor, elige otro nickname.');
          return true;
        }
      }
      return false;
    };
    
    // Toggle Mobile UI
    const toggleMobileUI = () => {
      isMobileUI.value = !isMobileUI.value;
      document.body.classList.toggle('mobile-ui', isMobileUI.value);
    };
    
    // Handle Dev Mode Key
    const handleDevModeKey = (event) => {
      if (event.key.toLowerCase() === 'u') {
        devModeClicks.value++;
        if (devModeClicks.value === 3) {
          devMode.value = true;
          alert('¡Modo desarrollador activado!');
        } else if (devMode.value) {
          devMode.value = false;
          alert('Modo desarrollador desactivado.');
          devModeClicks.value = 0; // Reset clicks
        }
        setTimeout(() => {
          if (!devMode.value) { // Only reset if not activated
            devModeClicks.value = 0;
          }
        }, 1000);
      }
    };
    
    // Edit Player
    const editPlayer = (playerId) => {
      const player = footballers.value.find(p => p.id === playerId);
      if (player) {
        editingPlayer.value = { 
          ...player, 
          injured: player.injured || false,
          injuryGamesLeft: player.injuryGamesLeft || 0 
        }; 
      }
    };
    
    // Save Player Edits
    const savePlayerEdits = () => {
      if (!editingPlayer.value) return;
      
      const player = footballers.value.find(p => p.id === editingPlayer.value.id);
      if (player) {
        Object.assign(player, editingPlayer.value);
        if (player.injured && player.injuryGamesLeft <= 0) {
          player.injuryGamesLeft = 3; // Default to 3 games if injured and not specified
        }
        if (!player.injured) {
            player.injuryGamesLeft = 0;
        }
      }
      
      selectedPlayerToEdit.value = null;
      editingPlayer.value = null;
    };
    
    // Award Golden Boot
    const awardGoldenBoot = () => {
      if (currentDay.value === schedule.value.length - 1) {
        // Find player with most goals
        const players = footballers.value.filter(p => p.goals > 0)
          .sort((a, b) => b.goals - a.goals);
        
        if (players.length > 0) {
          const winner = players[0];
          winner.quality += 10;
          winner.hasGoldenBoot = true;
          
          addNotification(`¡${winner.name} ha ganado la Bota de Oro con ${winner.goals} goles!`, 'general');
        }
      }
    };
    
    return {
      // Estado
      gameState,
      currentTab,
      footballers,
      teams,
      players,
      currentUser,
      schedule,
      currentDay,
      matchHistory,
      currentMatch,
      simulationLog,
      simulationEvents,
      marketPlayers,
      teamStandings,
      playerSetup,
      tabs,
      notifications,
      showNotifications,
      playerInventory,
      playerOffers,
      showAllFootballers,
      selectedPlayer,
      standingsView,
      selectedTeamDetails,
      matchFinished,
      showChat,
      chatMessages,
      chatDraft,
      chatRecipient,
      unreadChatMessages,
      inventoryFilter,
      isMobileUI,
      devMode,
      selectedPlayerToEdit,
      editingPlayer,
      
      // Computed
      userATQPlayers,
      userMCEPlayers,
      userDFCPlayers,
      sortedPlayers,
      sortedTeamStandings,
      getStandingsForDay,
      allMatchesSimulated,
      nextMatchToSimulate,
      unreadNotifications,
      availableFootballers,
      filteredInventory,
      aiPlayers,
      currentMatchdayCompleted,
      
      // Métodos
      setTab,
      startGame,
      restartGame,
      formatMoney,
      buyPlayer,
      sellPlayer,
      canBuyPlayer,
      canSellPlayer,
      simulateNextMatch,
      finishSimulation,
      addNotification,
      toggleNotifications,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      formatNotificationTime,
      moveToInventory,
      moveToSquad,
      canAddToSquad,
      addToMarket,
      acceptOffer,
      rejectOffer,
      showPlayerSquad,
      closePlayerModal,
      getPlayersByPosition,
      calculateSquadValue,
      getPlayerPointsForDay,
      showTeamDetails,
      closeTeamDetails,
      simulateFullMatchday,
      toggleChat,
      sendChatMessage,
      formatChatTime,
      generateMatchNarrative,
      checkBannedWords,
      toggleMobileUI,
      editPlayer,
      savePlayerEdits,
      awardGoldenBoot
    };
  }
}).mount('#app');
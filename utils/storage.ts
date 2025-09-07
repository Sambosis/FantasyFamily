import { Player, LoggedEvent, EventDefinition } from '../types';

// Storage keys
const STORAGE_KEYS = {
  PLAYERS: 'fantasy-family-players',
  EVENTS: 'fantasy-family-events',
  LIFE_EVENTS: 'fantasy-family-life-events',
  LAST_SAVED: 'fantasy-family-last-saved',
} as const;

// Storage interface for type safety
export interface GameData {
  players: Player[];
  loggedEvents: LoggedEvent[];
  lifeEvents: EventDefinition[];
  lastSaved: string;
}

/**
 * Safely parse JSON with fallback
 */
function safeJsonParse<T>(jsonString: string | null, fallback: T): T {
  if (!jsonString) return fallback;
  
  try {
    const parsed = JSON.parse(jsonString);
    // Convert timestamp strings back to Date objects for LoggedEvent
    if (Array.isArray(parsed)) {
      return parsed.map((item: any) => {
        if (item.timestamp && typeof item.timestamp === 'string') {
          return { ...item, timestamp: new Date(item.timestamp) };
        }
        return item;
      }) as T;
    }
    return parsed;
  } catch (error) {
    console.warn('Failed to parse stored data:', error);
    return fallback;
  }
}

/**
 * Load players from localStorage
 */
export function loadPlayers(fallback: Player[] = []): Player[] {
  const stored = localStorage.getItem(STORAGE_KEYS.PLAYERS);
  return safeJsonParse(stored, fallback);
}

/**
 * Save players to localStorage
 */
export function savePlayers(players: Player[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PLAYERS, JSON.stringify(players));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (error) {
    console.error('Failed to save players:', error);
  }
}

/**
 * Load logged events from localStorage
 */
export function loadLoggedEvents(fallback: LoggedEvent[] = []): LoggedEvent[] {
  const stored = localStorage.getItem(STORAGE_KEYS.EVENTS);
  return safeJsonParse(stored, fallback);
}

/**
 * Save logged events to localStorage
 */
export function saveLoggedEvents(events: LoggedEvent[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (error) {
    console.error('Failed to save events:', error);
  }
}

/**
 * Load life events from localStorage
 */
export function loadLifeEvents(fallback: EventDefinition[] = []): EventDefinition[] {
  const stored = localStorage.getItem(STORAGE_KEYS.LIFE_EVENTS);
  return safeJsonParse(stored, fallback);
}

/**
 * Save life events to localStorage
 */
export function saveLifeEvents(events: EventDefinition[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.LIFE_EVENTS, JSON.stringify(events));
    localStorage.setItem(STORAGE_KEYS.LAST_SAVED, new Date().toISOString());
  } catch (error) {
    console.error('Failed to save life events:', error);
  }
}

/**
 * Load all game data at once
 */
export function loadGameData(fallbackData: Partial<GameData> = {}): GameData {
  const players = loadPlayers(fallbackData.players);
  const loggedEvents = loadLoggedEvents(fallbackData.loggedEvents);
  const lifeEvents = loadLifeEvents(fallbackData.lifeEvents);
  const lastSaved = localStorage.getItem(STORAGE_KEYS.LAST_SAVED) || new Date().toISOString();

  return {
    players,
    loggedEvents,
    lifeEvents,
    lastSaved,
  };
}

/**
 * Save all game data at once
 */
export function saveGameData(data: Omit<GameData, 'lastSaved'>): void {
  savePlayers(data.players);
  saveLoggedEvents(data.loggedEvents);
  saveLifeEvents(data.lifeEvents);
}

/**
 * Export game data as JSON for backup
 */
export function exportGameData(): string {
  const data = loadGameData();
  return JSON.stringify(data, null, 2);
}

/**
 * Import game data from JSON backup
 */
export function importGameData(jsonData: string): GameData {
  try {
    const data = JSON.parse(jsonData) as GameData;
    
    // Validate the data structure
    if (!Array.isArray(data.players) || !Array.isArray(data.loggedEvents) || !Array.isArray(data.lifeEvents)) {
      throw new Error('Invalid data structure');
    }

    // Convert timestamp strings back to Date objects
    const processedData = {
      ...data,
      loggedEvents: data.loggedEvents.map(event => ({
        ...event,
        timestamp: new Date(event.timestamp),
      })),
    };

    saveGameData(processedData);
    return processedData;
  } catch (error) {
    console.error('Failed to import game data:', error);
    throw new Error('Invalid backup file format');
  }
}

/**
 * Clear all stored data
 */
export function clearGameData(): void {
  Object.values(STORAGE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Check if there's any stored data
 */
export function hasStoredData(): boolean {
  return Object.values(STORAGE_KEYS).some(key => localStorage.getItem(key) !== null);
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): { lastSaved: string | null; hasData: boolean } {
  return {
    lastSaved: localStorage.getItem(STORAGE_KEYS.LAST_SAVED),
    hasData: hasStoredData(),
  };
}
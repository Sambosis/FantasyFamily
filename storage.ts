import { Player, LoggedEvent, EventDefinition } from './types';

const STORAGE_KEYS = {
  players: 'ff_players',
  events: 'ff_events',
  lifeEvents: 'ff_life_events',
} as const;

function safeParseJson<T>(value: string | null): T | undefined {
  if (!value) return undefined;
  try {
    return JSON.parse(value) as T;
  } catch {
    return undefined;
  }
}

export function loadPlayers(): Player[] | undefined {
  return safeParseJson<Player[]>(window.localStorage.getItem(STORAGE_KEYS.players));
}

export function savePlayers(players: Player[]): void {
  window.localStorage.setItem(STORAGE_KEYS.players, JSON.stringify(players));
}

export function loadLoggedEvents(): LoggedEvent[] | undefined {
  const raw = safeParseJson<Array<Omit<LoggedEvent, 'timestamp'> & { timestamp: string | number }>>(
    window.localStorage.getItem(STORAGE_KEYS.events)
  );
  if (!raw) return undefined;
  return raw.map((e) => ({
    ...e,
    timestamp: new Date(e.timestamp),
  }));
}

export function saveLoggedEvents(events: LoggedEvent[]): void {
  window.localStorage.setItem(STORAGE_KEYS.events, JSON.stringify(events));
}

export function loadLifeEvents(): EventDefinition[] | undefined {
  return safeParseJson<EventDefinition[]>(window.localStorage.getItem(STORAGE_KEYS.lifeEvents));
}

export function saveLifeEvents(events: EventDefinition[]): void {
  window.localStorage.setItem(STORAGE_KEYS.lifeEvents, JSON.stringify(events));
}

export function clearAllStoredData(): void {
  window.localStorage.removeItem(STORAGE_KEYS.players);
  window.localStorage.removeItem(STORAGE_KEYS.events);
  window.localStorage.removeItem(STORAGE_KEYS.lifeEvents);
}


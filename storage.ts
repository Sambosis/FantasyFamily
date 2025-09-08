import { Player, LoggedEvent, EventDefinition } from './types';

export interface AppStatePayload {
  players: Player[];
  events: Array<Omit<LoggedEvent, 'timestamp'> & { timestamp: string }>;
  lifeEvents: EventDefinition[];
}

export interface AppState {
  players: Player[];
  events: LoggedEvent[];
  lifeEvents: EventDefinition[];
}

export async function loadState(): Promise<AppState | undefined> {
  try {
    const response = await fetch('/api/state', { method: 'GET' });
    if (!response.ok) return undefined;
    const data = (await response.json()) as AppStatePayload;
    const events: LoggedEvent[] = (data.events || []).map((e) => ({
      ...e,
      timestamp: new Date(e.timestamp),
    }));
    return {
      players: data.players || [],
      events,
      lifeEvents: data.lifeEvents || [],
    };
  } catch {
    return undefined;
  }
}

export async function saveState(
  players: Player[],
  events: LoggedEvent[],
  lifeEvents: EventDefinition[]
): Promise<void> {
  const payload: AppStatePayload = {
    players,
    events: events.map((e) => ({ ...e, timestamp: e.timestamp.toISOString() })),
    lifeEvents,
  };
  await fetch('/api/state', {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}


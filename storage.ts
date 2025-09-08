import { Player, LoggedEvent, EventDefinition, FamilyMember } from './types';

const API_BASE = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '';

// Helper function for API calls
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}/api${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }

  return response.json();
}

// Players
export async function loadPlayers(): Promise<Player[]> {
  try {
    return await apiCall<Player[]>('/players');
  } catch (error) {
    console.error('Error loading players:', error);
    return [];
  }
}

export async function createPlayer(player: Player): Promise<void> {
  await apiCall('/players', {
    method: 'POST',
    body: JSON.stringify(player),
  });
}

export async function updatePlayer(playerId: string, updates: Partial<Player>): Promise<void> {
  await apiCall(`/players/${playerId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
}

export async function deletePlayer(playerId: string): Promise<void> {
  await apiCall(`/players/${playerId}`, {
    method: 'DELETE',
  });
}

// Family Members
export async function createFamilyMember(member: { id: string; name: string; player_id: string }): Promise<void> {
  await apiCall('/family-members', {
    method: 'POST',
    body: JSON.stringify(member),
  });
}

export async function updateFamilyMemberPlayer(memberId: string, newPlayerId: string): Promise<void> {
  await apiCall(`/family-members/${memberId}/player`, {
    method: 'PUT',
    body: JSON.stringify({ player_id: newPlayerId }),
  });
}

// Logged Events
export async function loadLoggedEvents(): Promise<LoggedEvent[]> {
  try {
    const events = await apiCall<Array<Omit<LoggedEvent, 'timestamp'> & { timestamp: string }>>(
      '/logged-events'
    );
    return events.map((e) => ({
      ...e,
      timestamp: new Date(e.timestamp),
    }));
  } catch (error) {
    console.error('Error loading logged events:', error);
    return [];
  }
}

export async function createLoggedEvent(event: LoggedEvent): Promise<void> {
  await apiCall('/logged-events', {
    method: 'POST',
    body: JSON.stringify({
      id: event.id,
      member_name: event.memberName,
      player_name: event.playerName,
      event_name: event.eventName,
      points: event.points,
      category: event.category,
      timestamp: event.timestamp.toISOString(),
    }),
  });
}

// Event Definitions
export async function loadLifeEvents(): Promise<EventDefinition[]> {
  try {
    return await apiCall<EventDefinition[]>('/event-definitions');
  } catch (error) {
    console.error('Error loading life events:', error);
    return [];
  }
}

export async function createLifeEvent(event: EventDefinition): Promise<void> {
  await apiCall('/event-definitions', {
    method: 'POST',
    body: JSON.stringify(event),
  });
}

// Legacy functions for backward compatibility (now no-ops or fallbacks)
export function savePlayers(players: Player[]): void {
  // This is now handled by individual API calls
  console.log('savePlayers called - now using API');
}

export function saveLoggedEvents(events: LoggedEvent[]): void {
  // This is now handled by individual API calls
  console.log('saveLoggedEvents called - now using API');
}

export function saveLifeEvents(events: EventDefinition[]): void {
  // This is now handled by individual API calls
  console.log('saveLifeEvents called - now using API');
}

export function clearAllStoredData(): void {
  // Clear localStorage as fallback, but main data is now in database
  window.localStorage.clear();
}


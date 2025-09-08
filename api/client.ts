import { io, Socket } from 'socket.io-client';
import { Player, LoggedEvent, EventDefinition } from '../types';

const API_BASE_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';

class ApiClient {
  private socket: Socket | null = null;
  private dataUpdateCallbacks: Set<(data: any) => void> = new Set();

  constructor() {
    this.initSocket();
  }

  private initSocket() {
    this.socket = io(API_BASE_URL);

    this.socket.on('connect', () => {
      console.log('Connected to server');
    });

    this.socket.on('dataUpdate', (data) => {
      // Notify all registered callbacks about the update
      this.dataUpdateCallbacks.forEach(callback => callback(data));
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  // Register a callback for data updates
  onDataUpdate(callback: (data: any) => void) {
    this.dataUpdateCallbacks.add(callback);
    return () => {
      this.dataUpdateCallbacks.delete(callback);
    };
  }

  // Emit a data update to other clients
  emitDataUpdate(type: string, data: any) {
    if (this.socket) {
      this.socket.emit('dataUpdate', { type, data });
    }
  }

  // API methods
  async fetchAllData(): Promise<{
    players: Player[];
    lifeEvents: EventDefinition[];
    loggedEvents: LoggedEvent[];
  }> {
    const response = await fetch(`${API_BASE_URL}/api/data`);
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    
    // Convert timestamps to Date objects
    data.loggedEvents = data.loggedEvents.map((e: any) => ({
      ...e,
      timestamp: new Date(e.timestamp)
    }));
    
    return data;
  }

  async createPlayer(player: Player): Promise<Player> {
    const response = await fetch(`${API_BASE_URL}/api/players`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(player)
    });
    if (!response.ok) throw new Error('Failed to create player');
    
    this.emitDataUpdate('playerCreated', player);
    return response.json();
  }

  async updatePlayer(id: string, updates: Partial<Player>): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/players/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    if (!response.ok) throw new Error('Failed to update player');
    
    this.emitDataUpdate('playerUpdated', { id, updates });
  }

  async deletePlayer(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/players/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete player');
    
    this.emitDataUpdate('playerDeleted', { id });
  }

  async createFamilyMember(playerId: string, member: any): Promise<any> {
    const response = await fetch(`${API_BASE_URL}/api/players/${playerId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(member)
    });
    if (!response.ok) throw new Error('Failed to create family member');
    
    this.emitDataUpdate('memberCreated', { playerId, member });
    return response.json();
  }

  async tradeFamilyMember(memberId: string, fromPlayerId: string, toPlayerId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/members/${memberId}/trade`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fromPlayerId, toPlayerId })
    });
    if (!response.ok) throw new Error('Failed to trade family member');
    
    this.emitDataUpdate('memberTraded', { memberId, fromPlayerId, toPlayerId });
  }

  async createLifeEvent(event: EventDefinition): Promise<EventDefinition> {
    const response = await fetch(`${API_BASE_URL}/api/life-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(event)
    });
    if (!response.ok) throw new Error('Failed to create life event');
    
    this.emitDataUpdate('lifeEventCreated', event);
    return response.json();
  }

  async createLoggedEvent(event: LoggedEvent): Promise<LoggedEvent> {
    const response = await fetch(`${API_BASE_URL}/api/logged-events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...event,
        timestamp: event.timestamp.toISOString()
      })
    });
    if (!response.ok) throw new Error('Failed to create logged event');
    
    this.emitDataUpdate('loggedEventCreated', event);
    return response.json();
  }
}

export const apiClient = new ApiClient();
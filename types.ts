export type EventCategory = 'positive' | 'negative' | 'neutral';

export interface EventDefinition {
  id: string;
  name: string;
  points: number;
  category: EventCategory;
}

export interface FamilyMember {
  id: string;
  name: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  members: FamilyMember[];
}

export interface LoggedEvent {
  id: string;
  memberName: string;
  playerName: string;
  eventName: string;
  points: number;
  timestamp: Date;
  category: EventCategory;
}
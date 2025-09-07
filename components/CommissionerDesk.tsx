import React from 'react';
import { Player, EventDefinition, EventCategory } from '../types';
import { AddPlayerForm } from './AddPlayerForm';
import { AddMemberForm } from './AddMemberForm';
import { LogEventForm } from './LogEventForm';
import { RenamePlayerForm } from './RenamePlayerForm';
import { DeletePlayerForm } from './DeletePlayerForm';
import { AddEventForm } from './AddEventForm';

interface CommissionerDeskProps {
  players: Player[];
  lifeEvents: EventDefinition[];
  onAddPlayer: (name: string) => void;
  onAddMember: (playerId: string, memberName: string) => void;
  onLogEvent: (memberId: string, eventId: string) => void;
  onRenamePlayer: (playerId: string, newName: string) => void;
  onDeletePlayer: (playerId: string) => void;
  onAddEvent: (name: string, points: number, category: EventCategory) => void;
}

export const CommissionerDesk: React.FC<CommissionerDeskProps> = ({
  players,
  lifeEvents,
  onAddPlayer,
  onAddMember,
  onLogEvent,
  onRenamePlayer,
  onDeletePlayer,
  onAddEvent,
}) => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-cyan-400 mb-4">Commissioner's Desk</h2>
        <div className="space-y-6">
          <AddPlayerForm onAddPlayer={onAddPlayer} />
          <AddMemberForm players={players} onAddMember={onAddMember} />
          <LogEventForm players={players} lifeEvents={lifeEvents} onLogEvent={onLogEvent} />
          <RenamePlayerForm players={players} onRenamePlayer={onRenamePlayer} />
          <DeletePlayerForm players={players} onDeletePlayer={onDeletePlayer} />
          <hr className="border-slate-700" />
          <AddEventForm onAddEvent={onAddEvent} />
        </div>
      </div>
    </div>
  );
};


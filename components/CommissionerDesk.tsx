import React from 'react';
import { Player, EventDefinition, EventCategory } from '../types';
import { AddPlayerForm } from './AddPlayerForm';
import { AddMemberForm } from './AddMemberForm';
import { LogEventForm } from './LogEventForm';
import { RenamePlayerForm } from './RenamePlayerForm';
import { DeletePlayerForm } from './DeletePlayerForm';
import { AddEventForm } from './AddEventForm';
import { TradeMemberForm } from './TradeMemberForm';

interface CommissionerDeskProps {
  players: Player[];
  lifeEvents: EventDefinition[];
  onAddPlayer: (name: string) => void;
  onAddMember: (playerId: string, memberName: string) => void;
  onLogEvent: (memberId: string, eventId: string) => void;
  onTradeMember: (memberId: string, toPlayerId: string) => void;
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
  onTradeMember,
  onRenamePlayer,
  onDeletePlayer,
  onAddEvent,
}) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold tracking-tight mb-2">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">Commissioner's Desk</span>
        </h2>
        <p className="text-slate-400">Manage players, rosters, and events from one place.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="bg-slate-800/50 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-cyan-300 mb-4">Player Management</h3>
          <div className="space-y-6">
            <AddPlayerForm onAddPlayer={onAddPlayer} />
            <RenamePlayerForm players={players} onRenamePlayer={onRenamePlayer} />
            <DeletePlayerForm players={players} onDeletePlayer={onDeletePlayer} />
          </div>
        </section>

        <section className="bg-slate-800/50 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-purple-300 mb-4">Roster Management</h3>
          <div className="space-y-6">
            <AddMemberForm players={players} onAddMember={onAddMember} />
            <TradeMemberForm players={players} onTradeMember={onTradeMember} />
          </div>
        </section>

        <section className="bg-slate-800/50 p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-yellow-300 mb-4">Event Management</h3>
          <div className="space-y-6">
            <LogEventForm players={players} lifeEvents={lifeEvents} onLogEvent={onLogEvent} />
            <AddEventForm onAddEvent={onAddEvent} />
          </div>
        </section>
      </div>
    </div>
  );
};


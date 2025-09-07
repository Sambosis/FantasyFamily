import React from 'react';
import { Player, EventDefinition, EventCategory } from '../types';
import { AddPlayerForm } from './AddPlayerForm';
import { AddMemberForm } from './AddMemberForm';
import { LogEventForm } from './LogEventForm';
import { RenamePlayerForm } from './RenamePlayerForm';
import { DeletePlayerForm } from './DeletePlayerForm';
import { AddEventForm } from './AddEventForm';

interface CommissionerViewProps {
  players: Player[];
  lifeEvents: EventDefinition[];
  onAddPlayer: (name: string) => void;
  onAddMember: (playerId: string, memberName: string) => void;
  onLogEvent: (memberId: string, eventId: string) => void;
  onRenamePlayer: (playerId: string, newName: string) => void;
  onDeletePlayer: (playerId: string) => void;
  onAddEvent: (name: string, points: number, category: EventCategory) => void;
}

export const CommissionerView: React.FC<CommissionerViewProps> = ({
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
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500">
              Commissioner's Desk
            </span>
          </h1>
          <p className="text-lg text-slate-400">Manage players, events, and keep the family drama organized.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Player Management */}
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">Player Management</h2>
              <div className="space-y-4">
                <AddPlayerForm onAddPlayer={onAddPlayer} />
                <AddMemberForm players={players} onAddMember={onAddMember} />
                <RenamePlayerForm players={players} onRenamePlayer={onRenamePlayer} />
                <DeletePlayerForm players={players} onDeletePlayer={onDeletePlayer} />
              </div>
            </div>
          </div>

          {/* Event Management */}
          <div className="space-y-6">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">Event Management</h2>
              <div className="space-y-4">
                <LogEventForm players={players} lifeEvents={lifeEvents} onLogEvent={onLogEvent} />
                <hr className="border-slate-700" />
                <AddEventForm onAddEvent={onAddEvent} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="mt-8 bg-slate-800 p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold text-cyan-400 mb-4">Quick Stats</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-400">{players.length}</div>
              <div className="text-sm text-slate-400">Total Players</div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {players.reduce((total, player) => total + player.members.length, 0)}
              </div>
              <div className="text-sm text-slate-400">Family Members</div>
            </div>
            <div className="bg-slate-700 p-4 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">{lifeEvents.length}</div>
              <div className="text-sm text-slate-400">Available Events</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
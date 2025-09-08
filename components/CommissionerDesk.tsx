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
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-cyan-400 mb-2">Commissioner's Desk</h2>
        <p className="text-slate-400">Manage players, family members, and events</p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Player Management Section */}
        <div className="space-y-6 animate-slide-in-left">
          <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center animate-bounce-in">
                <span className="text-cyan-400 text-xl font-bold">👥</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-cyan-400">Player Management</h3>
                <p className="text-sm text-slate-400">Add and manage team players</p>
              </div>
            </div>
            <div className="space-y-6">
              <AddPlayerForm onAddPlayer={onAddPlayer} />
              <div className="border-t border-slate-700 pt-4">
                <RenamePlayerForm players={players} onRenamePlayer={onRenamePlayer} />
              </div>
              <div className="border-t border-slate-700 pt-4">
                <DeletePlayerForm players={players} onDeletePlayer={onDeletePlayer} />
              </div>
            </div>
          </div>

          {/* Family Management Section */}
          <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center animate-bounce-in" style={{animationDelay: '0.2s'}}>
                <span className="text-purple-400 text-xl font-bold">👨‍👩‍👧‍👦</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-purple-400">Family Management</h3>
                <p className="text-sm text-slate-400">Manage family members and trades</p>
              </div>
            </div>
            <div className="space-y-6">
              <AddMemberForm players={players} onAddMember={onAddMember} />
              <div className="border-t border-slate-700 pt-4">
                <TradeMemberForm players={players} onTradeMember={onTradeMember} />
              </div>
            </div>
          </div>
        </div>

        {/* Events Section */}
        <div className="space-y-6 animate-slide-in-right">
          <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center animate-bounce-in" style={{animationDelay: '0.3s'}}>
                <span className="text-green-400 text-xl font-bold">📝</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-green-400">Event Logging</h3>
                <p className="text-sm text-slate-400">Log life events and award points</p>
              </div>
            </div>
            <div className="space-y-6">
              <LogEventForm players={players} lifeEvents={lifeEvents} onLogEvent={onLogEvent} />
            </div>
          </div>

          {/* Event Configuration Section */}
          <div className="bg-slate-800/60 p-6 rounded-xl shadow-lg border border-slate-700/50 hover:border-slate-600/70 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center animate-bounce-in" style={{animationDelay: '0.4s'}}>
                <span className="text-yellow-400 text-xl font-bold">⚙️</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-yellow-400">Event Configuration</h3>
                <p className="text-sm text-slate-400">Create custom life events</p>
              </div>
            </div>
            <div className="space-y-6">
              <AddEventForm onAddEvent={onAddEvent} />
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 p-6 rounded-xl shadow-lg border border-slate-600/50 hover:border-slate-500/70 transition-all duration-300 hover:shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-slate-600/30 rounded-lg flex items-center justify-center animate-bounce-in" style={{animationDelay: '0.5s'}}>
                <span className="text-slate-300 text-lg">📊</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-300">Quick Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="text-2xl font-bold text-cyan-400 animate-bounce-in" style={{animationDelay: '0.6s'}}>{players.length}</div>
                <div className="text-sm text-slate-400">Players</div>
              </div>
              <div className="text-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="text-2xl font-bold text-purple-400 animate-bounce-in" style={{animationDelay: '0.7s'}}>
                  {players.reduce((sum, player) => sum + player.members.length, 0)}
                </div>
                <div className="text-sm text-slate-400">Family Members</div>
              </div>
              <div className="text-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="text-2xl font-bold text-yellow-400 animate-bounce-in" style={{animationDelay: '0.8s'}}>{lifeEvents.length}</div>
                <div className="text-sm text-slate-400">Life Events</div>
              </div>
              <div className="text-center p-3 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-colors">
                <div className="text-2xl font-bold text-green-400 animate-bounce-in" style={{animationDelay: '0.9s'}}>
                  {Math.max(...players.map(p => p.score), 0)}
                </div>
                <div className="text-sm text-slate-400">High Score</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


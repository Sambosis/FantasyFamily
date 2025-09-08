import React, { useState } from 'react';
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

interface Section {
  id: string;
  title: string;
  icon: string;
  color: string;
  description: string;
}

const sections: Section[] = [
  { id: 'players', title: 'Player Management', icon: '👥', color: 'from-cyan-500 to-blue-500', description: 'Add and manage players' },
  { id: 'members', title: 'Family Members', icon: '👨‍👩‍👧‍👦', color: 'from-purple-500 to-pink-500', description: 'Draft and trade family members' },
  { id: 'events', title: 'Life Events', icon: '📊', color: 'from-green-500 to-emerald-500', description: 'Log events and manage point system' },
  { id: 'admin', title: 'Administration', icon: '⚙️', color: 'from-orange-500 to-red-500', description: 'Advanced player operations' },
];

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
  const [activeSection, setActiveSection] = useState<string>('players');

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
          Commissioner's Desk
        </h2>
        <p className="text-slate-400">Manage your Fantasy Family league with style</p>
      </div>

      {/* Section Tabs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`relative p-4 rounded-xl transition-all duration-300 transform hover:scale-105 ${
              activeSection === section.id
                ? 'bg-gradient-to-br ' + section.color + ' text-white shadow-xl scale-105'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <div className="flex flex-col items-center space-y-2">
              <span className="text-3xl">{section.icon}</span>
              <h3 className="font-semibold text-sm">{section.title}</h3>
              <p className="text-xs opacity-80">{section.description}</p>
            </div>
            {activeSection === section.id && (
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[10px] border-t-white"></div>
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700">
        <div className="space-y-6">
          {/* Players Section */}
          {activeSection === 'players' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">👥</span>
                <h3 className="text-xl font-bold text-cyan-400">Player Management</h3>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <AddPlayerForm onAddPlayer={onAddPlayer} />
              </div>
            </div>
          )}

          {/* Members Section */}
          {activeSection === 'members' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
                <h3 className="text-xl font-bold text-purple-400">Family Members</h3>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <AddMemberForm players={players} onAddMember={onAddMember} />
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <TradeMemberForm players={players} onTradeMember={onTradeMember} />
              </div>
            </div>
          )}

          {/* Events Section */}
          {activeSection === 'events' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">📊</span>
                <h3 className="text-xl font-bold text-green-400">Life Events</h3>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <LogEventForm players={players} lifeEvents={lifeEvents} onLogEvent={onLogEvent} />
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <AddEventForm onAddEvent={onAddEvent} />
              </div>
            </div>
          )}

          {/* Admin Section */}
          {activeSection === 'admin' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center space-x-3 mb-6">
                <span className="text-2xl">⚙️</span>
                <h3 className="text-xl font-bold text-orange-400">Administration</h3>
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <RenamePlayerForm players={players} onRenamePlayer={onRenamePlayer} />
              </div>
              <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                <DeletePlayerForm players={players} onDeletePlayer={onDeletePlayer} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Players</p>
              <p className="text-2xl font-bold text-cyan-400">{players.length}</p>
            </div>
            <span className="text-3xl opacity-50">👤</span>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Members</p>
              <p className="text-2xl font-bold text-purple-400">{players.reduce((acc, p) => acc + p.members.length, 0)}</p>
            </div>
            <span className="text-3xl opacity-50">👥</span>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Event Types</p>
              <p className="text-2xl font-bold text-green-400">{lifeEvents.length}</p>
            </div>
            <span className="text-3xl opacity-50">📋</span>
          </div>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Leading Score</p>
              <p className="text-2xl font-bold text-orange-400">{Math.max(...players.map(p => p.score), 0)}</p>
            </div>
            <span className="text-3xl opacity-50">🏆</span>
          </div>
        </div>
      </div>
    </div>
  );
};


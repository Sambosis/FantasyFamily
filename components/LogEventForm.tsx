import React, { useState, useMemo } from 'react';
import { Player, EventDefinition } from '../types';

interface LogEventFormProps {
  players: Player[];
  lifeEvents: EventDefinition[];
  onLogEvent: (memberId: string, eventId: string) => void;
}

export const LogEventForm: React.FC<LogEventFormProps> = ({ players, lifeEvents, onLogEvent }) => {
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogEvent(selectedMember, selectedEvent);
    setSelectedMember('');
    setSelectedEvent('');
  };

  const allMembers = useMemo(() => {
    return players.flatMap(player => 
        player.members.map(member => ({...member, teamName: player.name}))
    );
  }, [players]);

  const sortedEvents = useMemo(() => {
    return [...lifeEvents].sort((a, b) => a.name.localeCompare(b.name));
  }, [lifeEvents]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl">📊</span>
            <label htmlFor="memberSelect" className="text-lg font-semibold text-green-300">
                Log Life Event
            </label>
        </div>
        <div className="space-y-3">
            <div className="relative">
                <select
                id="memberSelect"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-400 focus:border-transparent focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                >
                    <option value="">Select Family Member...</option>
                    {allMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                        {member.name} ({member.teamName})
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <span className="text-slate-400">▼</span>
                </div>
            </div>
            <div className="relative">
                <select
                id="eventSelect"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-green-400 focus:border-transparent focus:outline-none transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedMember}
                >
                    <option value="">Select Event...</option>
                    {sortedEvents.map((event) => (
                        <option key={event.id} value={event.id} className={event.points > 0 ? 'text-green-300' : event.points < 0 ? 'text-red-300' : 'text-slate-300'}>
                        {event.name} ({event.points > 0 ? '+' : ''}{event.points} pts)
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <span className="text-slate-400">▼</span>
                </div>
            </div>
        </div>
        <button
            type="submit"
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold py-3 px-4 rounded-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
            disabled={!selectedMember || !selectedEvent}
        >
            <span className="flex items-center justify-center space-x-2">
                <span>✨</span>
                <span>Log Event</span>
            </span>
        </button>
    </form>
  );
};
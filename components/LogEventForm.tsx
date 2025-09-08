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
        <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-6 h-6 bg-green-500/20 text-green-400 text-sm font-bold rounded-full">3</span>
            <label htmlFor="memberSelect" className="text-sm font-medium text-slate-300">
                Log Life Event
            </label>
        </div>
        <div className="space-y-3">
            <div className="relative">
                <select
                id="memberSelect"
                value={selectedMember}
                onChange={(e) => setSelectedMember(e.target.value)}
                className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                >
                    <option value="">Select Family Member...</option>
                    {allMembers.map((member) => (
                        <option key={member.id} value={member.id}>
                        {member.name} ({member.teamName})
                        </option>
                    ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <span className="text-slate-400">▼</span>
                </div>
            </div>
            <div className="relative">
                <select
                id="eventSelect"
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-green-500 focus:border-green-500 focus:outline-none transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!selectedMember}
                >
                    <option value="">Select Event...</option>
                    {sortedEvents.map((event) => {
                        const pointColor = event.points > 0 ? 'text-green-400' : event.points < 0 ? 'text-red-400' : 'text-slate-400';
                        const pointSign = event.points > 0 ? '+' : '';
                        return (
                            <option key={event.id} value={event.id}>
                            {event.name} ({pointSign}{event.points} pts)
                            </option>
                        );
                    })}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <span className="text-slate-400">▼</span>
                </div>
            </div>
        </div>
        <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-green-500/25"
            disabled={!selectedMember || !selectedEvent}
        >
            <span>📝</span>
            Log Event
        </button>
    </form>
  );
};
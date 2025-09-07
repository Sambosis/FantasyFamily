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
    <form onSubmit={handleSubmit} className="space-y-3">
        <label htmlFor="memberSelect" className="block text-sm font-medium text-slate-300">
            3. Log Life Event
        </label>
        <div className="flex flex-col gap-2">
            <select
            id="memberSelect"
            value={selectedMember}
            onChange={(e) => setSelectedMember(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
            >
                <option value="">Select Family Member...</option>
                {allMembers.map((member) => (
                    <option key={member.id} value={member.id}>
                    {member.name} ({member.teamName})
                    </option>
                ))}
            </select>
            <select
            id="eventSelect"
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
            className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
            disabled={!selectedMember}
            >
                <option value="">Select Event...</option>
                {sortedEvents.map((event) => (
                    <option key={event.id} value={event.id}>
                    {event.name} ({event.points > 0 ? '+' : ''}{event.points} pts)
                    </option>
                ))}
            </select>
        </div>
        <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            disabled={!selectedMember || !selectedEvent}
        >
            Log Event
        </button>
    </form>
  );
};
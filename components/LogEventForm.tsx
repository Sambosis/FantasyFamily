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
  type SortOption = 'alphabetical' | 'points-high' | 'points-low';
  type FilterOption = 'all' | 'positive' | 'negative';
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchTerm, setSearchTerm] = useState('');

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

  const processedEvents = useMemo<EventDefinition[]>(() => {
    let filtered: EventDefinition[] = [...lifeEvents];

    if (filterBy !== 'all') {
      filtered = filtered.filter(event => event.category === filterBy);
    }

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(event => event.name.toLowerCase().includes(lower));
    }

    switch (sortBy) {
      case 'alphabetical':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'points-high':
        filtered.sort((a, b) => b.points - a.points);
        break;
      case 'points-low':
        filtered.sort((a, b) => a.points - b.points);
        break;
    }

    return filtered;
  }, [lifeEvents, sortBy, filterBy, searchTerm]);

  const groupedEvents = useMemo<Record<string, EventDefinition[]>>(() => {
    const groups: { [key: string]: EventDefinition[] } = {
      'Epic (+200+)': [],
      'Major (+100 to +199)': [],
      'Medium (+50 to +99)': [],
      'Minor (+1 to +49)': [],
      'Minor Negative (-1 to -49)': [],
      'Medium Negative (-50 to -99)': [],
      'Major Negative (-100 to -199)': [],
      'Catastrophic (-200+)': [],
    };

    processedEvents.forEach(event => {
      if (event.points >= 200) {
        groups['Epic (+200+)'].push(event);
      } else if (event.points >= 100) {
        groups['Major (+100 to +199)'].push(event);
      } else if (event.points >= 50) {
        groups['Medium (+50 to +99)'].push(event);
      } else if (event.points >= 1) {
        groups['Minor (+1 to +49)'].push(event);
      } else if (event.points >= -49) {
        groups['Minor Negative (-1 to -49)'].push(event);
      } else if (event.points >= -99) {
        groups['Medium Negative (-50 to -99)'].push(event);
      } else if (event.points >= -199) {
        groups['Major Negative (-100 to -199)'].push(event);
      } else {
        groups['Catastrophic (-200+)'].push(event);
      }
    });

    // Remove empty groups
    Object.keys(groups).forEach(key => {
      if (groups[key].length === 0) {
        delete groups[key];
      }
    });

    return groups;
  }, [processedEvents]);

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
            {/* Controls for filtering/sorting/searching events */}
            <div className="bg-slate-900/50 border-2 border-slate-600 rounded-lg p-3 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                        type="text"
                        placeholder="🔍 Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                    <select
                        value={filterBy}
                        onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                        className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                        <option value="all">All Categories</option>
                        <option value="positive">Positive Only</option>
                        <option value="negative">Negative Only</option>
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as SortOption)}
                        className="px-3 py-2 bg-slate-900 border border-slate-600 rounded-md text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    >
                        <option value="alphabetical">A-Z</option>
                        <option value="points-high">Highest Points First</option>
                        <option value="points-low">Lowest Points First</option>
                    </select>
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
                    {(Object.entries(groupedEvents) as Array<[string, EventDefinition[]]>).map(([groupName, events]) => (
                        <optgroup key={groupName} label={groupName}>
                            {events.map((event) => (
                                <option
                                    key={event.id}
                                    value={event.id}
                                    className={
                                        event.points > 0
                                            ? event.points >= 200
                                                ? 'text-yellow-300'
                                                : event.points >= 100
                                                    ? 'text-purple-300'
                                                    : event.points >= 50
                                                        ? 'text-blue-300'
                                                        : 'text-green-300'
                                            : event.points <= -200
                                                ? 'text-red-600'
                                                : event.points <= -100
                                                    ? 'text-red-500'
                                                    : event.points <= -50
                                                        ? 'text-orange-400'
                                                        : 'text-yellow-500'
                                    }
                                >
                                    {event.name} ({event.points > 0 ? '+' : ''}{event.points} pts)
                                </option>
                            ))}
                        </optgroup>
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
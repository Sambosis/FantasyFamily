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
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [showEventDropdown, setShowEventDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogEvent(selectedMember, selectedEvent);
    setSelectedMember('');
    setSelectedEvent('');
    setEventSearchTerm('');
  };

  const allMembers = useMemo(() => {
    return players.flatMap(player => 
        player.members.map(member => ({...member, teamName: player.name}))
    );
  }, [players]);

  // Group events by point ranges similar to LifeEventsView
  const groupedEvents = useMemo(() => {
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

    // Filter events by search term
    let filteredEvents = [...lifeEvents];
    if (eventSearchTerm) {
      filteredEvents = filteredEvents.filter(event =>
        event.name.toLowerCase().includes(eventSearchTerm.toLowerCase())
      );
    }

    // Sort alphabetically within groups
    filteredEvents.sort((a, b) => a.name.localeCompare(b.name));

    // Group events
    filteredEvents.forEach(event => {
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
  }, [lifeEvents, eventSearchTerm]);

  const getEventColorClass = (points: number) => {
    if (points >= 200) return 'text-yellow-400';
    if (points >= 100) return 'text-purple-400';
    if (points >= 50) return 'text-blue-400';
    if (points >= 1) return 'text-green-400';
    if (points >= -49) return 'text-yellow-600';
    if (points >= -99) return 'text-orange-500';
    if (points >= -199) return 'text-red-500';
    return 'text-red-600';
  };

  const getGroupHeaderClass = (groupName: string) => {
    if (groupName.includes('Epic')) return 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 text-yellow-400';
    if (groupName.includes('Major') && groupName.includes('+')) return 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-purple-400';
    if (groupName.includes('Medium') && groupName.includes('+')) return 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 text-blue-400';
    if (groupName.includes('Minor') && groupName.includes('+')) return 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 text-green-400';
    if (groupName.includes('Catastrophic')) return 'bg-gradient-to-r from-red-900/30 to-red-800/30 text-red-600';
    if (groupName.includes('Major Negative')) return 'bg-gradient-to-r from-red-700/20 to-red-600/20 text-red-500';
    if (groupName.includes('Medium Negative')) return 'bg-gradient-to-r from-orange-700/20 to-red-700/20 text-orange-500';
    return 'bg-gradient-to-r from-yellow-700/20 to-orange-700/20 text-yellow-600';
  };

  const selectedEventDetails = useMemo(() => {
    return lifeEvents.find(e => e.id === selectedEvent);
  }, [selectedEvent, lifeEvents]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2 mb-4">
            <span className="text-xl">📊</span>
            <label htmlFor="memberSelect" className="text-lg font-semibold text-green-300">
                Log Life Event
            </label>
        </div>
        <div className="space-y-3">
            {/* Member Selection */}
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
            
            {/* Event Selection with Custom Dropdown */}
            <div className="relative">
                {/* Search Input / Selected Event Display */}
                <div 
                    className={`w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 pr-10 focus-within:ring-2 focus-within:ring-green-400 focus-within:border-transparent transition-all duration-200 cursor-pointer ${!selectedMember ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => selectedMember && setShowEventDropdown(!showEventDropdown)}
                >
                    {selectedEvent && selectedEventDetails ? (
                        <div className="flex items-center justify-between">
                            <span className="font-medium">{selectedEventDetails.name}</span>
                            <span className={`font-bold ${getEventColorClass(selectedEventDetails.points)}`}>
                                {selectedEventDetails.points > 0 ? '+' : ''}{selectedEventDetails.points} pts
                            </span>
                        </div>
                    ) : (
                        <input
                            type="text"
                            placeholder="Search or select event..."
                            value={eventSearchTerm}
                            onChange={(e) => {
                                setEventSearchTerm(e.target.value);
                                setShowEventDropdown(true);
                            }}
                            onFocus={() => setShowEventDropdown(true)}
                            onClick={(e) => e.stopPropagation()}
                            disabled={!selectedMember}
                            className="w-full bg-transparent outline-none placeholder-slate-400 disabled:cursor-not-allowed"
                        />
                    )}
                </div>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <span className="text-slate-400">▼</span>
                </div>

                {/* Custom Dropdown */}
                {showEventDropdown && selectedMember && (
                    <div className="absolute z-10 w-full mt-2 bg-slate-900 border-2 border-slate-600 rounded-lg shadow-2xl max-h-96 overflow-y-auto">
                        {/* Clear Selection Button (if event is selected) */}
                        {selectedEvent && (
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedEvent('');
                                    setEventSearchTerm('');
                                }}
                                className="w-full px-4 py-2 text-left text-sm text-slate-400 hover:bg-slate-800 border-b border-slate-700"
                            >
                                ✕ Clear selection
                            </button>
                        )}

                        {/* Grouped Events */}
                        {Object.entries(groupedEvents).length > 0 ? (
                            Object.entries(groupedEvents).map(([groupName, events]) => (
                                <div key={groupName}>
                                    {/* Group Header */}
                                    <div className={`px-4 py-2 text-sm font-bold ${getGroupHeaderClass(groupName)}`}>
                                        {groupName}
                                    </div>
                                    {/* Events in Group */}
                                    {events.map((event) => (
                                        <button
                                            key={event.id}
                                            type="button"
                                            onClick={() => {
                                                setSelectedEvent(event.id);
                                                setShowEventDropdown(false);
                                                setEventSearchTerm('');
                                            }}
                                            className={`w-full px-4 py-3 text-left hover:bg-slate-800 transition-colors flex items-center justify-between ${
                                                selectedEvent === event.id ? 'bg-slate-800' : ''
                                            }`}
                                        >
                                            <span className="text-white">{event.name}</span>
                                            <span className={`font-bold ${getEventColorClass(event.points)}`}>
                                                {event.points > 0 ? '+' : ''}{event.points} pts
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            ))
                        ) : (
                            <div className="px-4 py-8 text-center text-slate-400">
                                No events found matching "{eventSearchTerm}"
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Click outside to close dropdown */}
            {showEventDropdown && (
                <div 
                    className="fixed inset-0 z-0" 
                    onClick={() => setShowEventDropdown(false)}
                />
            )}
        </div>

        {/* Selected Event Preview */}
        {selectedEventDetails && (
            <div className={`p-3 rounded-lg border-2 ${
                selectedEventDetails.points >= 200 ? 'bg-yellow-900/20 border-yellow-600/50' :
                selectedEventDetails.points >= 100 ? 'bg-purple-900/20 border-purple-600/50' :
                selectedEventDetails.points >= 50 ? 'bg-blue-900/20 border-blue-600/50' :
                selectedEventDetails.points >= 1 ? 'bg-green-900/20 border-green-600/50' :
                selectedEventDetails.points >= -49 ? 'bg-yellow-900/20 border-yellow-700/50' :
                selectedEventDetails.points >= -99 ? 'bg-orange-900/20 border-orange-600/50' :
                selectedEventDetails.points >= -199 ? 'bg-red-900/20 border-red-600/50' :
                'bg-red-950/30 border-red-700/50'
            }`}>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-slate-400 uppercase tracking-wider">Selected Event</p>
                        <p className="text-white font-medium">{selectedEventDetails.name}</p>
                    </div>
                    <div className={`text-2xl font-bold ${getEventColorClass(selectedEventDetails.points)}`}>
                        {selectedEventDetails.points > 0 ? '+' : ''}{selectedEventDetails.points}
                    </div>
                </div>
            </div>
        )}

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
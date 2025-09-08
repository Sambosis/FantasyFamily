import React, { useState, useMemo } from 'react';
import { EventDefinition } from '../types';

interface LifeEventsViewProps {
  lifeEvents: EventDefinition[];
}

type SortOption = 'alphabetical' | 'points-high' | 'points-low';
type FilterOption = 'all' | 'positive' | 'negative';

export const LifeEventsView: React.FC<LifeEventsViewProps> = ({ lifeEvents }) => {
  const [sortBy, setSortBy] = useState<SortOption>('alphabetical');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const processedEvents = useMemo(() => {
    let filtered = [...lifeEvents];

    // Apply filter
    if (filterBy !== 'all') {
      filtered = filtered.filter(event => event.category === filterBy);
    }

    // Apply search
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply sort
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

  // Group events by point ranges for better organization
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

  const stats = useMemo(() => {
    const positive = lifeEvents.filter(e => e.category === 'positive');
    const negative = lifeEvents.filter(e => e.category === 'negative');
    const avgPositive = positive.length > 0 
      ? Math.round(positive.reduce((sum, e) => sum + e.points, 0) / positive.length)
      : 0;
    const avgNegative = negative.length > 0
      ? Math.round(negative.reduce((sum, e) => sum + e.points, 0) / negative.length)
      : 0;
    
    return {
      total: lifeEvents.length,
      positive: positive.length,
      negative: negative.length,
      avgPositive,
      avgNegative,
      maxPoints: Math.max(...lifeEvents.map(e => e.points)),
      minPoints: Math.min(...lifeEvents.map(e => e.points)),
    };
  }, [lifeEvents]);

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-4">Life Events Catalog</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-800/50 rounded-lg p-3">
            <p className="text-slate-400 text-sm">Total Events</p>
            <p className="text-2xl font-bold text-white">{stats.total}</p>
          </div>
          <div className="bg-green-900/30 rounded-lg p-3 border border-green-800/50">
            <p className="text-green-400 text-sm">Positive Events</p>
            <p className="text-2xl font-bold text-green-400">{stats.positive}</p>
            <p className="text-xs text-green-500">Avg: +{stats.avgPositive} pts</p>
          </div>
          <div className="bg-red-900/30 rounded-lg p-3 border border-red-800/50">
            <p className="text-red-400 text-sm">Negative Events</p>
            <p className="text-2xl font-bold text-red-400">{stats.negative}</p>
            <p className="text-xs text-red-500">Avg: {stats.avgNegative} pts</p>
          </div>
          <div className="bg-purple-900/30 rounded-lg p-3 border border-purple-800/50">
            <p className="text-purple-400 text-sm">Point Range</p>
            <p className="text-lg font-bold text-purple-400">
              {stats.minPoints} to +{stats.maxPoints}
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="🔍 Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          {/* Filter */}
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as FilterOption)}
            className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="all">All Categories</option>
            <option value="positive">Positive Only</option>
            <option value="negative">Negative Only</option>
          </select>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
          >
            <option value="alphabetical">A-Z</option>
            <option value="points-high">Highest Points First</option>
            <option value="points-low">Lowest Points First</option>
          </select>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-6">
        {Object.entries(groupedEvents).map(([groupName, events]) => (
          <div key={groupName} className="bg-slate-800/30 rounded-xl border border-slate-700 overflow-hidden">
            <div className={`px-6 py-3 ${
              groupName.includes('Epic') ? 'bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border-b border-yellow-600/30' :
              groupName.includes('Major') && groupName.includes('+') ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-purple-600/30' :
              groupName.includes('Medium') && groupName.includes('+') ? 'bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border-b border-blue-600/30' :
              groupName.includes('Minor') && groupName.includes('+') ? 'bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-b border-green-600/30' :
              groupName.includes('Catastrophic') ? 'bg-gradient-to-r from-red-900/30 to-red-800/30 border-b border-red-700/50' :
              groupName.includes('Major Negative') ? 'bg-gradient-to-r from-red-700/20 to-red-600/20 border-b border-red-600/30' :
              groupName.includes('Medium Negative') ? 'bg-gradient-to-r from-orange-700/20 to-red-700/20 border-b border-orange-600/30' :
              'bg-gradient-to-r from-yellow-700/20 to-orange-700/20 border-b border-yellow-700/30'
            }`}>
              <h3 className="text-lg font-bold text-white flex items-center justify-between">
                <span>{groupName}</span>
                <span className="text-sm font-normal text-slate-400">{events.length} events</span>
              </h3>
            </div>
            <div className="p-4">
              <div className="grid gap-2">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg hover:bg-slate-900/70 transition-colors"
                  >
                    <span className="text-white font-medium">{event.name}</span>
                    <span className={`font-bold text-lg ${
                      event.points > 0 
                        ? event.points >= 200 ? 'text-yellow-400' :
                          event.points >= 100 ? 'text-purple-400' :
                          event.points >= 50 ? 'text-blue-400' :
                          'text-green-400'
                        : event.points <= -200 ? 'text-red-600' :
                          event.points <= -100 ? 'text-red-500' :
                          event.points <= -50 ? 'text-orange-500' :
                          'text-yellow-600'
                    }`}>
                      {event.points > 0 ? '+' : ''}{event.points} pts
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {processedEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-slate-400 text-lg">No events found matching your criteria</p>
        </div>
      )}
    </div>
  );
};
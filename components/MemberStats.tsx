import React, { useMemo } from 'react';
import { FamilyMember, LoggedEvent, EventCategory } from '../types';

interface MemberStatsProps {
  member: FamilyMember;
  playerName: string;
  events: LoggedEvent[];
}

interface StatsSummary {
  totalEvents: number;
  totalPoints: number;
  positiveEvents: number;
  negativeEvents: number;
  neutralEvents: number;
  bestEvent: LoggedEvent | null;
  worstEvent: LoggedEvent | null;
  recentEvents: LoggedEvent[];
  eventsByCategory: Map<EventCategory, LoggedEvent[]>;
}

export const MemberStats: React.FC<MemberStatsProps> = ({ member, playerName, events }) => {
  const memberEvents = useMemo(() => {
    return events.filter(e => e.memberName === member.name);
  }, [events, member.name]);

  const stats: StatsSummary = useMemo(() => {
    const eventsByCategory = new Map<EventCategory, LoggedEvent[]>();
    eventsByCategory.set('positive', []);
    eventsByCategory.set('negative', []);
    eventsByCategory.set('neutral', []);

    memberEvents.forEach(event => {
      eventsByCategory.get(event.category)?.push(event);
    });

    const sortedByPoints = [...memberEvents].sort((a, b) => b.points - a.points);
    const recentEvents = [...memberEvents].slice(0, 5);

    return {
      totalEvents: memberEvents.length,
      totalPoints: memberEvents.reduce((sum, e) => sum + e.points, 0),
      positiveEvents: eventsByCategory.get('positive')?.length || 0,
      negativeEvents: eventsByCategory.get('negative')?.length || 0,
      neutralEvents: eventsByCategory.get('neutral')?.length || 0,
      bestEvent: sortedByPoints[0] || null,
      worstEvent: sortedByPoints[sortedByPoints.length - 1] || null,
      recentEvents,
      eventsByCategory,
    };
  }, [memberEvents]);

  const getPointsColor = (points: number) => {
    if (points > 0) return 'text-green-400';
    if (points < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  const getCategoryColor = (category: EventCategory) => {
    switch (category) {
      case 'positive':
        return 'bg-green-500/20 border-green-500/30 text-green-300';
      case 'negative':
        return 'bg-red-500/20 border-red-500/30 text-red-300';
      case 'neutral':
        return 'bg-slate-500/20 border-slate-500/30 text-slate-300';
    }
  };

  const getCategoryIcon = (category: EventCategory) => {
    switch (category) {
      case 'positive':
        return '📈';
      case 'negative':
        return '📉';
      case 'neutral':
        return '➡️';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full mb-4 border border-cyan-500/30">
          <span className="text-4xl">👤</span>
        </div>
        <h2 className="text-2xl font-bold text-white">{member.name}</h2>
        <p className="text-slate-400 mt-1">Playing for {playerName}</p>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-sm text-slate-400 mb-1">Total Points</p>
          <p className={`text-2xl font-bold ${getPointsColor(stats.totalPoints)}`}>
            {stats.totalPoints > 0 ? '+' : ''}{stats.totalPoints}
          </p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700">
          <p className="text-sm text-slate-400 mb-1">Total Events</p>
          <p className="text-2xl font-bold text-white">{stats.totalEvents}</p>
        </div>
      </div>

      {/* Event Categories */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-white">Event Breakdown</h3>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-green-500/10 p-3 rounded-lg border border-green-500/20">
            <div className="flex items-center justify-between">
              <span className="text-green-400 text-sm">Positive</span>
              <span className="text-xl">📈</span>
            </div>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.positiveEvents}</p>
          </div>
          <div className="bg-red-500/10 p-3 rounded-lg border border-red-500/20">
            <div className="flex items-center justify-between">
              <span className="text-red-400 text-sm">Negative</span>
              <span className="text-xl">📉</span>
            </div>
            <p className="text-2xl font-bold text-red-400 mt-1">{stats.negativeEvents}</p>
          </div>
          <div className="bg-slate-500/10 p-3 rounded-lg border border-slate-500/20">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 text-sm">Neutral</span>
              <span className="text-xl">➡️</span>
            </div>
            <p className="text-2xl font-bold text-slate-400 mt-1">{stats.neutralEvents}</p>
          </div>
        </div>
      </div>

      {/* Best and Worst Events */}
      {(stats.bestEvent || stats.worstEvent) && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Notable Events</h3>
          {stats.bestEvent && stats.bestEvent.points > 0 && (
            <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-green-300 mb-1">Best Event</p>
                  <p className="text-white font-medium">{stats.bestEvent.eventName}</p>
                </div>
                <span className="text-2xl font-bold text-green-400">+{stats.bestEvent.points}</span>
              </div>
            </div>
          )}
          {stats.worstEvent && stats.worstEvent.points < 0 && (
            <div className="bg-red-500/10 p-4 rounded-lg border border-red-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-red-300 mb-1">Worst Event</p>
                  <p className="text-white font-medium">{stats.worstEvent.eventName}</p>
                </div>
                <span className="text-2xl font-bold text-red-400">{stats.worstEvent.points}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Events */}
      {stats.recentEvents.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-white">Recent Events</h3>
          <div className="space-y-2">
            {stats.recentEvents.map(event => (
              <div
                key={event.id}
                className="bg-slate-800/50 p-3 rounded-lg border border-slate-700 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{getCategoryIcon(event.category)}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{event.eventName}</p>
                    <p className="text-xs text-slate-500">
                      {new Date(event.timestamp).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <span className={`font-bold ${getPointsColor(event.points)}`}>
                  {event.points > 0 ? '+' : ''}{event.points}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No Events Message */}
      {stats.totalEvents === 0 && (
        <div className="text-center py-8 bg-slate-800/30 rounded-xl border border-slate-700">
          <div className="text-5xl mb-3 opacity-50">📊</div>
          <p className="text-slate-400">No events logged yet</p>
          <p className="text-sm text-slate-500 mt-1">Events will appear here once they're logged</p>
        </div>
      )}
    </div>
  );
};
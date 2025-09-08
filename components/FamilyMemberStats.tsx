import React, { useMemo } from 'react';
import { FamilyMember, LoggedEvent, Player } from '../types';

interface FamilyMemberStatsProps {
  member: FamilyMember;
  playerName: string;
  playerId: string;
  allEvents: LoggedEvent[];
  onClose: () => void;
}

const timeSince = (date: Date): string => {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " minutes ago";
  return Math.floor(seconds) + " seconds ago";
};

export const FamilyMemberStats: React.FC<FamilyMemberStatsProps> = ({ 
  member, 
  playerName, 
  playerId, 
  allEvents, 
  onClose 
}) => {
  const memberEvents = useMemo(() => {
    return allEvents
      .filter(event => event.memberName === member.name)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [allEvents, member.name]);

  const memberStats = useMemo(() => {
    const totalPoints = memberEvents.reduce((sum, event) => sum + event.points, 0);
    const positiveEvents = memberEvents.filter(event => event.points > 0);
    const negativeEvents = memberEvents.filter(event => event.points < 0);
    const neutralEvents = memberEvents.filter(event => event.points === 0);
    
    const bestEvent = memberEvents.reduce((best, event) => 
      event.points > (best?.points || -Infinity) ? event : best, null
    );
    
    const worstEvent = memberEvents.reduce((worst, event) => 
      event.points < (worst?.points || Infinity) ? event : worst, null
    );

    return {
      totalPoints,
      totalEvents: memberEvents.length,
      positiveEvents: positiveEvents.length,
      negativeEvents: negativeEvents.length,
      neutralEvents: neutralEvents.length,
      bestEvent,
      worstEvent,
      averagePoints: memberEvents.length > 0 ? Math.round((totalPoints / memberEvents.length) * 10) / 10 : 0
    };
  }, [memberEvents]);

  const categoryStyles = {
    positive: {
      border: 'border-green-500/50',
      bg: 'from-green-500/10 to-green-600/10',
      icon: '🎉',
      iconBg: 'bg-green-500/20'
    },
    negative: {
      border: 'border-red-500/50',
      bg: 'from-red-500/10 to-red-600/10',
      icon: '😔',
      iconBg: 'bg-red-500/20'
    },
    neutral: {
      border: 'border-slate-500/50',
      bg: 'from-slate-500/10 to-slate-600/10',
      icon: '📝',
      iconBg: 'bg-slate-500/20'
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-700 bg-gradient-to-r from-purple-500/20 to-pink-500/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-xl bg-purple-500/20 border border-purple-500/30">
                <span className="text-3xl">👤</span>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">{member.name}</h2>
                <p className="text-purple-300">
                  Member of <span className="font-semibold">{playerName}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-700/50 hover:bg-slate-600/50 text-slate-400 hover:text-white transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Stats Overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 p-4 rounded-xl border border-blue-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-300 text-sm font-medium">Total Points</p>
                  <p className={`text-2xl font-bold ${
                    memberStats.totalPoints > 0 ? 'text-green-400' : 
                    memberStats.totalPoints < 0 ? 'text-red-400' : 'text-slate-400'
                  }`}>
                    {memberStats.totalPoints > 0 ? '+' : ''}{memberStats.totalPoints}
                  </p>
                </div>
                <span className="text-3xl opacity-70">🎯</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-4 rounded-xl border border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-300 text-sm font-medium">Total Events</p>
                  <p className="text-2xl font-bold text-white">{memberStats.totalEvents}</p>
                </div>
                <span className="text-3xl opacity-70">📊</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-xl border border-green-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-300 text-sm font-medium">Positive Events</p>
                  <p className="text-2xl font-bold text-white">{memberStats.positiveEvents}</p>
                </div>
                <span className="text-3xl opacity-70">🎉</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 p-4 rounded-xl border border-red-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-300 text-sm font-medium">Negative Events</p>
                  <p className="text-2xl font-bold text-white">{memberStats.negativeEvents}</p>
                </div>
                <span className="text-3xl opacity-70">😔</span>
              </div>
            </div>
          </div>

          {/* Best and Worst Events */}
          {(memberStats.bestEvent || memberStats.worstEvent) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {memberStats.bestEvent && memberStats.bestEvent.points > 0 && (
                <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 p-6 rounded-xl border border-green-500/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-green-500/20">
                      <span className="text-2xl">🏆</span>
                    </div>
                    <h3 className="text-lg font-bold text-green-400">Best Event</h3>
                  </div>
                  <p className="text-white font-semibold">{memberStats.bestEvent.eventName}</p>
                  <p className="text-green-400 text-xl font-bold">+{memberStats.bestEvent.points} points</p>
                  <p className="text-slate-400 text-sm mt-2">{timeSince(new Date(memberStats.bestEvent.timestamp))}</p>
                </div>
              )}

              {memberStats.worstEvent && memberStats.worstEvent.points < 0 && (
                <div className="bg-gradient-to-br from-red-500/10 to-red-600/10 p-6 rounded-xl border border-red-500/30">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-red-500/20">
                      <span className="text-2xl">💔</span>
                    </div>
                    <h3 className="text-lg font-bold text-red-400">Worst Event</h3>
                  </div>
                  <p className="text-white font-semibold">{memberStats.worstEvent.eventName}</p>
                  <p className="text-red-400 text-xl font-bold">{memberStats.worstEvent.points} points</p>
                  <p className="text-slate-400 text-sm mt-2">{timeSince(new Date(memberStats.worstEvent.timestamp))}</p>
                </div>
              )}
            </div>
          )}

          {/* Event History */}
          <div className="bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-6 rounded-xl border border-slate-600">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-3xl">📅</span>
              <h3 className="text-xl font-bold text-white">Event History</h3>
            </div>

            {memberEvents.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                {memberEvents.map(event => {
                  const pointColor = event.points > 0 ? 'text-green-400' : event.points < 0 ? 'text-red-400' : 'text-slate-400';
                  const pointSign = event.points > 0 ? '+' : '';
                  const style = categoryStyles[event.category] || categoryStyles.neutral;

                  return (
                    <div 
                      key={event.id} 
                      className={`bg-gradient-to-br ${style.bg} p-4 rounded-xl border ${style.border} transition-all duration-300 hover:scale-[1.01]`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-3 flex-1">
                          <div className={`p-2 rounded-lg ${style.iconBg} flex-shrink-0`}>
                            <span className="text-lg">{style.icon}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-white">{event.eventName}</p>
                            <p className="text-xs text-slate-400 mt-1">{timeSince(new Date(event.timestamp))}</p>
                          </div>
                        </div>
                        <div className={`text-lg font-bold ${pointColor} bg-slate-800/50 px-3 py-1 rounded-lg`}>
                          {pointSign}{event.points}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 bg-slate-800/50 rounded-xl border border-slate-700">
                <div className="text-4xl mb-3 opacity-50">📝</div>
                <p className="text-lg text-slate-400 font-medium">No events yet</p>
                <p className="text-sm text-slate-500 mt-1">This member hasn't had any life events logged</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
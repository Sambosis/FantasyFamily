import React, { useMemo, useState } from 'react';
import { Player, FamilyMember, LoggedEvent } from '../types';
import { MemberStatsModal } from './MemberStatsModal';

interface MembersOverviewProps {
  players: Player[];
  events: LoggedEvent[];
}

interface MemberWithStats extends FamilyMember {
  playerName: string;
  playerId: string;
  totalPoints: number;
  eventCount: number;
  lastEvent: LoggedEvent | null;
}

export const MembersOverview: React.FC<MembersOverviewProps> = ({ players, events }) => {
  const [selectedMember, setSelectedMember] = useState<{
    member: FamilyMember;
    playerName: string;
  } | null>(null);

  const membersWithStats: MemberWithStats[] = useMemo(() => {
    const allMembers: MemberWithStats[] = [];

    players.forEach(player => {
      player.members.forEach(member => {
        const memberEvents = events.filter(e => e.memberName === member.name);
        const totalPoints = memberEvents.reduce((sum, e) => sum + e.points, 0);
        const lastEvent = memberEvents[0] || null;

        allMembers.push({
          ...member,
          playerName: player.name,
          playerId: player.id,
          totalPoints,
          eventCount: memberEvents.length,
          lastEvent,
        });
      });
    });

    // Sort by total points (descending)
    return allMembers.sort((a, b) => b.totalPoints - a.totalPoints);
  }, [players, events]);

  const getPointsColor = (points: number) => {
    if (points > 0) return 'text-green-400';
    if (points < 0) return 'text-red-400';
    return 'text-slate-400';
  };

  const getPerformanceIcon = (points: number) => {
    if (points > 100) return '🔥';
    if (points > 50) return '⭐';
    if (points > 0) return '✨';
    if (points < -50) return '💔';
    if (points < 0) return '😔';
    return '😴';
  };

  const topPerformers = membersWithStats.slice(0, 3);

  return (
    <>
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700 animate-fade-in">
        <div className="flex items-center space-x-3 mb-6">
          <span className="text-3xl">👨‍👩‍👧‍👦</span>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            Family Members
          </h2>
        </div>

        {membersWithStats.length > 0 ? (
          <div className="space-y-6">
            {/* Top Performers */}
            {topPerformers.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 mb-3">⭐ Top Performers</h3>
                <div className="grid grid-cols-1 gap-3">
                  {topPerformers.map((member, index) => (
                    <div
                      key={member.id}
                      className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 p-4 rounded-lg border border-purple-500/20 cursor-pointer hover:border-purple-400/40 transition-all hover:scale-[1.02]"
                      onClick={() => setSelectedMember({ member, playerName: member.playerName })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 bg-purple-500/20 rounded-full">
                            <span className="text-lg">
                              {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{member.name}</p>
                            <p className="text-xs text-slate-500">Playing for {member.playerName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-xl font-bold ${getPointsColor(member.totalPoints)}`}>
                            {member.totalPoints > 0 ? '+' : ''}{member.totalPoints}
                          </p>
                          <p className="text-xs text-slate-500">{member.eventCount} events</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Members Grid */}
            <div>
              <h3 className="text-sm font-medium text-slate-400 mb-3">📊 All Members</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {membersWithStats.map(member => (
                  <div
                    key={member.id}
                    className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 cursor-pointer hover:bg-slate-800/70 hover:border-slate-600 transition-all group"
                    onClick={() => setSelectedMember({ member, playerName: member.playerName })}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-lg">{getPerformanceIcon(member.totalPoints)}</span>
                          <p className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                            {member.name}
                          </p>
                        </div>
                        <p className="text-xs text-slate-500 mb-2">{member.playerName}'s Team</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <span className={`text-sm font-bold ${getPointsColor(member.totalPoints)}`}>
                              {member.totalPoints > 0 ? '+' : ''}{member.totalPoints}
                            </span>
                            <span className="text-xs text-slate-500">pts</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-sm text-slate-400">{member.eventCount}</span>
                            <span className="text-xs text-slate-500">events</span>
                          </div>
                        </div>
                        {member.lastEvent && (
                          <p className="text-xs text-slate-600 mt-2 truncate">
                            Last: {member.lastEvent.eventName}
                          </p>
                        )}
                      </div>
                      <div className="ml-2">
                        <svg
                          className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 transition-colors"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M9 5l7 7-7 7"></path>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
            <div className="text-6xl mb-4 opacity-50">👥</div>
            <p className="text-lg text-slate-400 font-medium">No family members yet</p>
            <p className="text-sm text-slate-500 mt-2">
              Add members to players in the Commissioner's Desk
            </p>
          </div>
        )}
      </div>

      {/* Member Stats Modal */}
      <MemberStatsModal
        isOpen={selectedMember !== null}
        onClose={() => setSelectedMember(null)}
        member={selectedMember?.member || null}
        playerName={selectedMember?.playerName || ''}
        events={events}
      />
    </>
  );
};
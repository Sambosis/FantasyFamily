import React, { useMemo, useState } from 'react';
import { Player, LoggedEvent, FamilyMember } from '../types';

interface FamilyMemberWithPlayer extends FamilyMember {
  playerName: string;
  playerId: string;
  totalPoints: number;
  eventCount: number;
  lastEventDate?: Date;
}

interface FamilyMembersViewProps {
  players: Player[];
  loggedEvents: LoggedEvent[];
  onMemberClick: (memberId: string) => void;
}

export const FamilyMembersView: React.FC<FamilyMembersViewProps> = ({ 
  players, 
  loggedEvents, 
  onMemberClick 
}) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState<string | null>(null);
  const familyMembersWithStats = useMemo(() => {
    const members: FamilyMemberWithPlayer[] = [];
    
    // Filter players based on selection
    const playersToProcess = selectedPlayerId 
      ? players.filter(p => p.id === selectedPlayerId)
      : players;
    
    playersToProcess.forEach(player => {
      player.members.forEach(member => {
        const memberEvents = loggedEvents.filter(event => event.memberName === member.name);
        const totalPoints = memberEvents.reduce((sum, event) => sum + event.points, 0);
        const lastEvent = memberEvents.sort((a, b) => 
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0];
        
        members.push({
          ...member,
          playerName: player.name,
          playerId: player.id,
          totalPoints,
          eventCount: memberEvents.length,
          lastEventDate: lastEvent ? new Date(lastEvent.timestamp) : undefined
        });
      });
    });
    
    return members.sort((a, b) => b.totalPoints - a.totalPoints);
  }, [players, loggedEvents, selectedPlayerId]);

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

  return (
    <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700 animate-fade-in">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-3xl">👨‍👩‍👧‍👦</span>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
          {selectedPlayerId 
            ? `${players.find(p => p.id === selectedPlayerId)?.name}'s Family Members`
            : 'All Family Members'}
        </h2>
      </div>

      {/* Player Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setSelectedPlayerId(null)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectedPlayerId === null
              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
              : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50 border border-slate-600/50'
          }`}
        >
          <span className="flex items-center gap-2">
            <span>👥</span>
            All Players
          </span>
        </button>
        {players.map(player => {
          const memberCount = player.members.length;
          return (
            <button
              key={player.id}
              onClick={() => setSelectedPlayerId(player.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedPlayerId === player.id
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'bg-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-600/50 border border-slate-600/50'
              }`}
            >
              <span className="flex items-center gap-2">
                <span>👤</span>
                {player.name}
                <span className="text-xs bg-slate-800/50 px-2 py-0.5 rounded-full">
                  {memberCount}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {familyMembersWithStats.length > 0 ? (
        <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {familyMembersWithStats.map((member, index) => {
            const pointColor = member.totalPoints > 0 ? 'text-green-400' : 
                              member.totalPoints < 0 ? 'text-red-400' : 'text-slate-400';
            const isTopPerformer = index < 3 && member.totalPoints > 0;
            
            return (
              <button
                key={member.id}
                onClick={() => onMemberClick(member.id)}
                className="w-full bg-gradient-to-br from-slate-700/50 to-slate-800/50 p-4 rounded-xl border border-slate-600/50 hover:border-slate-500/70 transition-all duration-300 hover:scale-[1.02] text-left group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className={`p-3 rounded-xl flex-shrink-0 ${
                      isTopPerformer 
                        ? 'bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 border border-yellow-500/30' 
                        : 'bg-slate-700/50 border border-slate-600/30'
                    }`}>
                      <span className="text-2xl">
                        {isTopPerformer ? (index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉') : '👤'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors">
                          {member.name}
                        </h3>
                        {isTopPerformer && (
                          <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full border border-yellow-500/30">
                            Top Performer
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-slate-400 mb-2">
                        Member of <span className="text-purple-300 font-medium">{member.playerName}</span>
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span>{member.eventCount} {member.eventCount === 1 ? 'event' : 'events'}</span>
                        {member.lastEventDate && (
                          <span>Last activity: {timeSince(member.lastEventDate)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${pointColor} bg-slate-900/50 px-4 py-2 rounded-lg`}>
                      {member.totalPoints > 0 ? '+' : ''}{member.totalPoints}
                    </div>
                    <p className="text-xs text-slate-500 mt-1">Total Points</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
          <div className="text-6xl mb-4 opacity-50">👥</div>
          <p className="text-lg text-slate-400 font-medium">
            {selectedPlayerId 
              ? `No family members found for ${players.find(p => p.id === selectedPlayerId)?.name}`
              : 'No family members found'}
          </p>
          <p className="text-sm text-slate-500 mt-2">
            {selectedPlayerId 
              ? 'Draft some family members to this player to see them here!'
              : 'Add players and draft family members to see them here!'}
          </p>
        </div>
      )}
    </div>
  );
};
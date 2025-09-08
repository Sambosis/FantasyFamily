import React from 'react';
import { Player, LoggedEvent } from '../types';

interface PlayerCardProps {
  player: Player;
  rank: number;
  onMemberClick?: (memberId: string) => void;
  onShowAllMembers?: (playerId: string) => void;
}

const getRankDisplay = (rank: number) => {
    switch(rank) {
        case 1: return { icon: '🥇', color: 'from-yellow-400 to-yellow-600', textColor: 'text-yellow-400' };
        case 2: return { icon: '🥈', color: 'from-gray-300 to-gray-500', textColor: 'text-gray-300' };
        case 3: return { icon: '🥉', color: 'from-orange-400 to-orange-600', textColor: 'text-orange-400' };
        default: return { icon: `#${rank}`, color: 'from-slate-600 to-slate-700', textColor: 'text-slate-400' };
    }
};

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, rank, onMemberClick, onShowAllMembers }) => {
    const scoreColor = player.score > 0 ? 'text-green-400' : player.score < 0 ? 'text-red-400' : 'text-slate-400';
    const rankDisplay = getRankDisplay(rank);
    const isTopThree = rank <= 3;
    
    return (
        <div className={`relative rounded-xl shadow-lg transform transition-all duration-300 hover:scale-[1.02] animate-slide-in-up ${
            isTopThree 
                ? 'bg-gradient-to-br ' + rankDisplay.color + ' p-[1px]' 
                : 'bg-slate-700'
        }`}>
            <div className={`bg-slate-800 rounded-xl p-5 ${isTopThree ? 'bg-opacity-95' : ''}`}>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center ${
                            isTopThree 
                                ? 'text-4xl' 
                                : 'w-10 h-10 bg-slate-700 rounded-lg text-sm font-bold text-slate-400'
                        }`}>
                            {rankDisplay.icon}
                        </div>
                        <div>
                            <p className={`text-xs font-medium ${rankDisplay.textColor}`}>
                                {rank === 1 ? 'Champion' : rank === 2 ? 'Runner-up' : rank === 3 ? 'Third Place' : `Rank #${rank}`}
                            </p>
                            <h3 className="text-xl font-bold text-white">{player.name}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-slate-500">
                                    {player.members.length} {player.members.length === 1 ? 'member' : 'members'}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-3xl font-bold ${scoreColor} bg-slate-900/50 px-4 py-2 rounded-lg`}>
                            {player.score > 0 ? '+' : ''}{player.score}
                        </div>
                        <p className="text-xs text-slate-500 mt-1">Points</p>
                    </div>
                </div>
                
                {player.members.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <div className="flex flex-wrap gap-2">
                            {player.members.slice(0, 3).map(member => (
                                <button
                                    key={member.id}
                                    onClick={() => onMemberClick?.(member.id)}
                                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-700/50 text-slate-300 border border-slate-600/30 hover:bg-slate-600/50 hover:text-white hover:border-slate-500/50 transition-all duration-200 cursor-pointer"
                                >
                                    <span className="mr-1">👤</span>
                                    {member.name}
                                </button>
                            ))}
                            {player.members.length > 3 && (
                                <button
                                    onClick={() => onShowAllMembers?.(player.id)}
                                    className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-700/30 text-slate-400 border border-slate-600/20 hover:bg-slate-600/50 hover:text-slate-300 hover:border-slate-500/30 transition-all duration-200 cursor-pointer"
                                >
                                    +{player.members.length - 3} more
                                </button>
                            )}
                        </div>
                    </div>
                )}
                
                {player.members.length === 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                        <p className="text-slate-500 text-xs italic text-center">No members drafted yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};
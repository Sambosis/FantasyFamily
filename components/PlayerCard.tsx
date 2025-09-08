import React from 'react';
import { Player } from '../types';

interface PlayerCardProps {
  player: Player;
  rank: number;
}

const TrophyIcon: React.FC<{ rank: number }> = ({ rank }) => {
    const colors: { [key: number]: string } = {
        1: 'text-yellow-400',
        2: 'text-gray-400',
        3: 'text-yellow-600'
    };
    const rankColor = colors[rank] || 'text-slate-500';

    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`w-8 h-8 ${rankColor}`}>
            <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2zM5.03 3.895a.75.75 0 01.94-1.158l.992.496a.75.75 0 11-.53 1.342l-.992-.496a.75.75 0 01-.41-.784zM13.97 3.895a.75.75 0 01-1.06 1.06l-.992-.496a.75.75 0 11.53-1.342l.992.496a.75.75 0 01.53.784zM5 9.5A5 5 0 0115 9.5v3.118a2.5 2.5 0 01-1.097 2.083l-2.093 1.4A2.5 2.5 0 0010 17.5V18a1 1 0 11-2 0v-.5a2.5 2.5 0 00-1.81-2.4l-2.093-1.4A2.5 2.5 0 015 12.618V9.5zM6.5 9.5a3.5 3.5 0 117 0v3.118a1 1 0 01-.439.833L11 14.53v-2.28a.75.75 0 00-1.5 0v2.28L7.44 13.45a1 1 0 01-.439-.833V9.5z" clipRule="evenodd" />
        </svg>
    );
};

export const PlayerCard: React.FC<PlayerCardProps> = ({ player, rank }) => {
    const scoreColor = player.score > 0 ? 'text-green-400' : player.score < 0 ? 'text-red-400' : 'text-slate-400';
    const scoreBgColor = player.score > 0 ? 'bg-green-500/20' : player.score < 0 ? 'bg-red-500/20' : 'bg-slate-500/20';
    
    // Different gradient for top 3 ranks
    const getRankGradient = (rank: number) => {
        switch(rank) {
            case 1: return 'from-yellow-500/20 to-orange-500/20 border-yellow-500/30';
            case 2: return 'from-gray-400/20 to-slate-500/20 border-gray-400/30';
            case 3: return 'from-yellow-600/20 to-yellow-800/20 border-yellow-600/30';
            default: return 'from-slate-700/50 to-slate-800/50 border-slate-600/30';
        }
    };
    
    return (
        <div className={`bg-gradient-to-br ${getRankGradient(rank)} rounded-xl shadow-lg p-6 border transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl animate-slide-in-up`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <TrophyIcon rank={rank} />
                        {rank <= 3 && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full animate-pulse"></div>
                        )}
                    </div>
                    <div>
                        <div className="flex items-center space-x-2 mb-1">
                            <p className="text-sm text-slate-400">Rank #{rank}</p>
                            {rank === 1 && <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded-full font-semibold">👑 Leader</span>}
                        </div>
                        <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-300">{player.name}</h3>
                    </div>
                </div>
                <div className={`text-right p-3 rounded-xl ${scoreBgColor} border border-slate-600/30`}>
                    <p className={`text-4xl font-bold ${scoreColor}`}>{player.score}</p>
                    <p className="text-sm text-slate-500">Points</p>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-600/50">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-slate-400">Drafted Members</h4>
                    <span className="text-xs bg-slate-700/50 text-slate-400 px-2 py-1 rounded-full">
                        {player.members.length} member{player.members.length !== 1 ? 's' : ''}
                    </span>
                </div>
                {player.members.length > 0 ? (
                    <div className="grid grid-cols-1 gap-2">
                        {player.members.map(member => (
                            <div key={member.id} className="flex items-center justify-between text-slate-300 bg-slate-700/30 rounded-lg px-3 py-2 text-sm border border-slate-600/30 hover:bg-slate-600/30 transition-colors duration-200">
                                <span className="flex items-center">
                                    <span className="mr-2">👤</span>
                                    {member.name}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-slate-500 bg-slate-700/20 rounded-lg border border-slate-600/20">
                        <span className="text-2xl opacity-50 block mb-1">👥</span>
                        <p className="text-sm italic">No members drafted yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};
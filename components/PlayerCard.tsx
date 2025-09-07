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
    
    return (
        <div className="bg-slate-800 rounded-xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-[1.02] animate-slide-in-up">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <TrophyIcon rank={rank} />
                    <div>
                        <p className="text-sm text-slate-400">Rank #{rank}</p>
                        <h3 className="text-2xl font-bold text-white">{player.name}</h3>
                    </div>
                </div>
                <div className="text-right">
                    <p className={`text-4xl font-bold ${scoreColor}`}>{player.score}</p>
                    <p className="text-sm text-slate-500">Points</p>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-700">
                <h4 className="text-sm font-semibold text-slate-400 mb-2">Drafted Members</h4>
                {player.members.length > 0 ? (
                    <ul className="space-y-1">
                        {player.members.map(member => (
                            <li key={member.id} className="text-slate-300 bg-slate-700/50 rounded px-3 py-1 text-sm">
                                {member.name}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-slate-500 text-sm italic">No members drafted yet.</p>
                )}
            </div>
        </div>
    );
};
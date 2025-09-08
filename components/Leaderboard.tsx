import React from 'react';
import { Player } from '../types';
import { PlayerCard } from './PlayerCard';

interface LeaderboardProps {
    players: Player[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700 animate-fade-in">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-8">
                <span className="text-3xl">🏆</span>
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                        Leaderboard
                    </h2>
                    <p className="text-slate-400 text-sm">Current standings and rankings</p>
                </div>
            </div>

            {players.length > 0 ? (
                <div className="space-y-4">
                    {players.map((player, index) => (
                        <PlayerCard
                            key={player.id}
                            player={player}
                            rank={index + 1}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 text-slate-500">
                    <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
                        <span className="text-6xl opacity-30 block mb-4">🏆</span>
                        <p className="text-xl font-semibold mb-2">No players have been added yet</p>
                        <p className="text-sm text-slate-400">Use the Commissioner's Desk to add the first player and start competing!</p>
                    </div>
                </div>
            )}
        </div>
    );
};
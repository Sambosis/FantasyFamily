import React from 'react';
import { Player } from '../types';
import { PlayerCard } from './PlayerCard';

interface LeaderboardProps {
    players: Player[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ players }) => {
    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-cyan-400 mb-6">Leaderboard</h2>
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
                <div className="text-center py-8 text-slate-500">
                    <p className="text-lg">No players have been added yet.</p>
                    <p className="text-sm">Use the "Commissioner's Desk" to add the first player!</p>
                </div>
            )}
        </div>
    );
};
import React from 'react';
import { Player, LoggedEvent } from '../types';
import { PlayerCard } from './PlayerCard';

interface LeaderboardProps {
    players: Player[];
    events?: LoggedEvent[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ players, events = [] }) => {
    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700 animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">🏆</span>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                    Leaderboard
                </h2>
            </div>
            
            {players.length > 0 ? (
                <div className="space-y-4">
                    {players.map((player, index) => (
                        <PlayerCard
                            key={player.id}
                            player={player}
                            rank={index + 1}
                            events={events}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="text-6xl mb-4 opacity-50">🎯</div>
                    <p className="text-lg text-slate-400 font-medium">No players have been added yet</p>
                    <p className="text-sm text-slate-500 mt-2">Switch to Commissioner's Desk to add the first player!</p>
                </div>
            )}
        </div>
    );
};
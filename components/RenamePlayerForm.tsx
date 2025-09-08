import React, { useState, useEffect } from 'react';
import { Player } from '../types';

interface RenamePlayerFormProps {
  players: Player[];
  onRenamePlayer: (playerId: string, newName: string) => void;
}

export const RenamePlayerForm: React.FC<RenamePlayerFormProps> = ({ players, onRenamePlayer }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [newName, setNewName] = useState('');

  useEffect(() => {
    const selectedPlayer = players.find(p => p.id === selectedPlayerId);
    if (selectedPlayer) {
      setNewName(selectedPlayer.name);
    } else {
      setNewName('');
    }
  }, [selectedPlayerId, players]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId || !newName.trim()) return;
    onRenamePlayer(selectedPlayerId, newName);
    setSelectedPlayerId('');
    setNewName('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-6 h-6 bg-cyan-500/20 text-cyan-400 text-sm font-bold rounded-full">R</span>
        <label htmlFor="renamePlayerSelect" className="text-sm font-medium text-slate-300">
          Rename Player
        </label>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <select
            id="renamePlayerSelect"
            value={selectedPlayerId}
            onChange={(e) => setSelectedPlayerId(e.target.value)}
            className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Select a Player...</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <span className="text-slate-400">▼</span>
          </div>
        </div>
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="Enter new name"
          className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:outline-none transition-all duration-200 placeholder-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!selectedPlayerId}
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-blue-500/25"
        disabled={!selectedPlayerId || !newName.trim()}
      >
        <span>✏️</span>
        Rename Player
      </button>
    </form>
  );
};
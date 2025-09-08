import React, { useState } from 'react';
import { Player } from '../types';

interface DeletePlayerFormProps {
  players: Player[];
  onDeletePlayer: (playerId: string) => void;
}

export const DeletePlayerForm: React.FC<DeletePlayerFormProps> = ({ players, onDeletePlayer }) => {
  const [selectedPlayerId, setSelectedPlayerId] = useState('');
  const [confirmationName, setConfirmationName] = useState('');

  const selectedPlayer = players.find(p => p.id === selectedPlayerId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayerId || !selectedPlayer) return;
    
    // Require exact name match for confirmation
    if (confirmationName.trim() !== selectedPlayer.name) {
      alert('Player name does not match. Please type the exact player name to confirm deletion.');
      return;
    }
    
    onDeletePlayer(selectedPlayerId);
    setSelectedPlayerId('');
    setConfirmationName('');
  };

  const isDeleteDisabled = !selectedPlayerId || !selectedPlayer || confirmationName.trim() !== selectedPlayer.name;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-6 h-6 bg-red-500/20 text-red-400 text-sm font-bold rounded-full">!</span>
        <label htmlFor="deletePlayerSelect" className="text-sm font-medium text-red-400">
          Delete Player
        </label>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <select
            id="deletePlayerSelect"
            value={selectedPlayerId}
            onChange={(e) => {
              setSelectedPlayerId(e.target.value);
              setConfirmationName(''); // Reset confirmation when player changes
            }}
            className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Select a Player to Delete...</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} (Score: {player.score}, Members: {player.members.length})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <span className="text-slate-400">▼</span>
          </div>
        </div>
        
        {selectedPlayer && (
          <div className="bg-red-900/20 border border-red-700/50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <span className="text-red-400 text-xl">⚠️</span>
              <div className="flex-1">
                <p className="text-red-400 text-sm mb-3">
                  This will permanently delete <strong>{selectedPlayer.name}</strong> and all their {selectedPlayer.members.length} family member(s).
                </p>
                <input
                  type="text"
                  value={confirmationName}
                  onChange={(e) => setConfirmationName(e.target.value)}
                  placeholder={`Type "${selectedPlayer.name}" to confirm`}
                  className="w-full bg-slate-700/80 border border-red-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-500 focus:border-red-500 focus:outline-none transition-all duration-200 placeholder-red-300/70"
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <button
        type="submit"
        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-red-500/25"
        disabled={isDeleteDisabled}
      >
        <span>🗑️</span>
        {selectedPlayer ? `Delete ${selectedPlayer.name}` : 'Delete Player'}
      </button>
    </form>
  );
};
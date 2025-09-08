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
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl">⚠️</span>
        <label htmlFor="deletePlayerSelect" className="text-lg font-semibold text-red-400">
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
            className="w-full bg-slate-900/50 border-2 border-red-600/50 text-white rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-red-400 focus:border-transparent focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Select a Player to Delete...</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} (Score: {player.score}, Members: {player.members.length})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-red-400">▼</span>
          </div>
        </div>
        
        {selectedPlayer && (
          <div className="bg-red-900/20 border-2 border-red-600/50 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start space-x-2 mb-3">
              <span className="text-2xl">🚨</span>
              <div>
                <p className="text-red-400 font-semibold mb-1">
                  Warning: Permanent Deletion
                </p>
                <p className="text-red-300 text-sm">
                  This will permanently delete <strong className="text-red-400">{selectedPlayer.name}</strong> and all their {selectedPlayer.members.length} family member(s).
                </p>
              </div>
            </div>
            <div className="relative">
              <input
                type="text"
                value={confirmationName}
                onChange={(e) => setConfirmationName(e.target.value)}
                placeholder={`Type "${selectedPlayer.name}" to confirm`}
                className="w-full bg-slate-900/50 border-2 border-red-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-red-400 focus:border-transparent focus:outline-none transition-all duration-200 placeholder-red-300/50"
              />
              {confirmationName.trim() === selectedPlayer.name && (
                <div className="absolute inset-y-0 right-3 flex items-center">
                  <span className="text-green-400 text-xl">✓</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white font-bold py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        disabled={isDeleteDisabled}
      >
        <span className="flex items-center justify-center space-x-2">
          <span>🗑️</span>
          <span>{selectedPlayer ? `Delete ${selectedPlayer.name}` : 'Delete Player'}</span>
        </span>
      </button>
    </form>
  );
};
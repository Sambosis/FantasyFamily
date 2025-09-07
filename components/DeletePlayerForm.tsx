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
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="deletePlayerSelect" className="block text-sm font-medium text-red-400">
        5. Delete Player
      </label>
      <div className="space-y-2">
        <select
          id="deletePlayerSelect"
          value={selectedPlayerId}
          onChange={(e) => {
            setSelectedPlayerId(e.target.value);
            setConfirmationName(''); // Reset confirmation when player changes
          }}
          className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
        >
          <option value="">Select a Player to Delete...</option>
          {players.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name} (Score: {player.score}, Members: {player.members.length})
            </option>
          ))}
        </select>
        
        {selectedPlayer && (
          <div className="bg-red-900/20 border border-red-700 rounded-md p-3">
            <p className="text-red-400 text-sm mb-2">
              ⚠️ This will permanently delete <strong>{selectedPlayer.name}</strong> and all their {selectedPlayer.members.length} family member(s).
            </p>
            <input
              type="text"
              value={confirmationName}
              onChange={(e) => setConfirmationName(e.target.value)}
              placeholder={`Type "${selectedPlayer.name}" to confirm`}
              className="w-full bg-slate-700 border border-red-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-red-500 focus:outline-none transition"
            />
          </div>
        )}
      </div>
      
      <button
        type="submit"
        className="w-full bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        disabled={isDeleteDisabled}
      >
        {selectedPlayer ? `Delete ${selectedPlayer.name}` : 'Delete Player'}
      </button>
    </form>
  );
};
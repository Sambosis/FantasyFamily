import React, { useMemo, useState } from 'react';
import { Player } from '../types';

interface TradeMemberFormProps {
  players: Player[];
  onTradeMember: (memberId: string, toPlayerId: string) => void;
}

export const TradeMemberForm: React.FC<TradeMemberFormProps> = ({ players, onTradeMember }) => {
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [selectedTargetPlayerId, setSelectedTargetPlayerId] = useState('');

  const allMembers = useMemo(() => {
    return players.flatMap(player => 
      player.members.map(member => ({ ...member, ownerPlayerId: player.id, ownerPlayerName: player.name }))
    );
  }, [players]);

  const ownerOfSelectedMemberId = useMemo(() => {
    if (!selectedMemberId) return undefined;
    return players.find(p => p.members.some(m => m.id === selectedMemberId));
  }, [players, selectedMemberId]);

  const eligibleTargetPlayers = useMemo(() => {
    if (!ownerOfSelectedMemberId) return players;
    return players.filter(p => p.id !== ownerOfSelectedMemberId.id);
  }, [players, ownerOfSelectedMemberId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMemberId || !selectedTargetPlayerId) return;
    onTradeMember(selectedMemberId, selectedTargetPlayerId);
    setSelectedMemberId('');
    setSelectedTargetPlayerId('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl">🔄</span>
        <label htmlFor="tradeMemberSelect" className="text-lg font-semibold text-indigo-300">
          Trade Family Member
        </label>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <select
            id="tradeMemberSelect"
            value={selectedMemberId}
            onChange={(e) => {
              setSelectedMemberId(e.target.value);
              setSelectedTargetPlayerId('');
            }}
            className="w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Select Family Member to Trade...</option>
            {allMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} (Currently with {member.ownerPlayerName})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-slate-400">▼</span>
          </div>
        </div>

        {selectedMemberId && (
          <div className="flex items-center justify-center">
            <span className="text-2xl text-slate-500">↓</span>
          </div>
        )}

        <div className="relative">
          <select
            id="tradeTargetPlayerSelect"
            value={selectedTargetPlayerId}
            onChange={(e) => setSelectedTargetPlayerId(e.target.value)}
            className="w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-indigo-400 focus:border-transparent focus:outline-none transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedMemberId}
          >
            <option value="">Select Destination Player...</option>
            {eligibleTargetPlayers.map((player) => (
              <option key={player.id} value={player.id}>
                Trade to {player.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-slate-400">▼</span>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg hover:from-indigo-600 hover:to-purple-600 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        disabled={!selectedMemberId || !selectedTargetPlayerId}
      >
        <span className="flex items-center justify-center space-x-2">
          <span>🤝</span>
          <span>Execute Trade</span>
        </span>
      </button>
    </form>
  );
};


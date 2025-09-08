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
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-6 h-6 bg-purple-500/20 text-purple-400 text-sm font-bold rounded-full">↔</span>
        <label htmlFor="tradeMemberSelect" className="text-sm font-medium text-slate-300">
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
            className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
          >
            <option value="">Select Family Member...</option>
            {allMembers.map((member) => (
              <option key={member.id} value={member.id}>
                {member.name} (Owned by {member.ownerPlayerName})
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <span className="text-slate-400">▼</span>
          </div>
        </div>

        <div className="relative">
          <select
            id="tradeTargetPlayerSelect"
            value={selectedTargetPlayerId}
            onChange={(e) => setSelectedTargetPlayerId(e.target.value)}
            className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition-all duration-200 appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!selectedMemberId}
          >
            <option value="">Select Destination Player...</option>
            {eligibleTargetPlayers.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
            <span className="text-slate-400">▼</span>
          </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-indigo-500/25"
        disabled={!selectedMemberId || !selectedTargetPlayerId}
      >
        <span>🔄</span>
        Trade Member
      </button>
    </form>
  );
};


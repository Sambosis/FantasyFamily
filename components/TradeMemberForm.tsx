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
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="tradeMemberSelect" className="block text-sm font-medium text-slate-300">
        4. Trade Family Member
      </label>
      <div className="flex flex-col gap-2">
        <select
          id="tradeMemberSelect"
          value={selectedMemberId}
          onChange={(e) => {
            setSelectedMemberId(e.target.value);
            setSelectedTargetPlayerId('');
          }}
          className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
        >
          <option value="">Select Family Member...</option>
          {allMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name} (Owned by {member.ownerPlayerName})
            </option>
          ))}
        </select>

        <select
          id="tradeTargetPlayerSelect"
          value={selectedTargetPlayerId}
          onChange={(e) => setSelectedTargetPlayerId(e.target.value)}
          className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          disabled={!selectedMemberId}
        >
          <option value="">Select Destination Player...</option>
          {eligibleTargetPlayers.map((player) => (
            <option key={player.id} value={player.id}>
              {player.name}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        disabled={!selectedMemberId || !selectedTargetPlayerId}
      >
        Trade Member
      </button>
    </form>
  );
};


import React, { useState } from 'react';
import { Player } from '../types';

interface TradeMemberFormProps {
  players: Player[];
  onTradeMember: (fromPlayerId: string, toPlayerId: string, memberId: string) => void;
}

export const TradeMemberForm: React.FC<TradeMemberFormProps> = ({ players, onTradeMember }) => {
  const [fromPlayerId, setFromPlayerId] = useState('');
  const [toPlayerId, setToPlayerId] = useState('');
  const [memberId, setMemberId] = useState('');

  const fromPlayer = players.find(p => p.id === fromPlayerId);
  const availableMembers = fromPlayer?.members || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (fromPlayerId && toPlayerId && memberId && fromPlayerId !== toPlayerId) {
      onTradeMember(fromPlayerId, toPlayerId, memberId);
      // Reset form
      setFromPlayerId('');
      setToPlayerId('');
      setMemberId('');
    }
  };

  const handleFromPlayerChange = (playerId: string) => {
    setFromPlayerId(playerId);
    setMemberId(''); // Reset member selection when changing from player
  };

  return (
    <div className="border-l-4 border-purple-500 pl-4">
      <h3 className="text-lg font-semibold text-purple-400 mb-3">Trade Family Member</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* From Player Selection */}
          <div>
            <label htmlFor="fromPlayer" className="block text-sm font-medium text-slate-300 mb-2">
              From Player:
            </label>
            <select
              id="fromPlayer"
              value={fromPlayerId}
              onChange={(e) => handleFromPlayerChange(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            >
              <option value="">Select player...</option>
              {players.filter(p => p.members.length > 0).map(player => (
                <option key={player.id} value={player.id}>
                  {player.name} ({player.members.length} members)
                </option>
              ))}
            </select>
          </div>

          {/* To Player Selection */}
          <div>
            <label htmlFor="toPlayer" className="block text-sm font-medium text-slate-300 mb-2">
              To Player:
            </label>
            <select
              id="toPlayer"
              value={toPlayerId}
              onChange={(e) => setToPlayerId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            >
              <option value="">Select player...</option>
              {players.filter(p => p.id !== fromPlayerId).map(player => (
                <option key={player.id} value={player.id}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Member Selection */}
        {fromPlayerId && (
          <div>
            <label htmlFor="member" className="block text-sm font-medium text-slate-300 mb-2">
              Family Member to Trade:
            </label>
            <select
              id="member"
              value={memberId}
              onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-purple-500"
              required
            >
              <option value="">Select member...</option>
              {availableMembers.map(member => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <button
          type="submit"
          disabled={!fromPlayerId || !toPlayerId || !memberId || fromPlayerId === toPlayerId}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          {fromPlayerId === toPlayerId ? 'Cannot trade to same player' : 'Execute Trade'}
        </button>
      </form>

      {fromPlayerId && toPlayerId && memberId && fromPlayerId !== toPlayerId && (
        <div className="mt-4 p-3 bg-purple-900/30 border border-purple-500/30 rounded-lg">
          <p className="text-sm text-purple-300">
            <strong>Trade Preview:</strong> Moving{' '}
            <span className="font-semibold">
              {availableMembers.find(m => m.id === memberId)?.name}
            </span>{' '}
            from <span className="font-semibold">{fromPlayer?.name}</span> to{' '}
            <span className="font-semibold">
              {players.find(p => p.id === toPlayerId)?.name}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};
import React, { useMemo } from 'react';
import { LoggedEvent } from '../types';

interface MemberStatsModalProps {
  isOpen: boolean;
  memberName: string | null;
  events: LoggedEvent[];
  onClose: () => void;
}

export const MemberStatsModal: React.FC<MemberStatsModalProps> = ({ isOpen, memberName, events, onClose }) => {
  const memberEvents = useMemo(() => {
    if (!memberName) return [] as LoggedEvent[];
    return events.filter(e => e.memberName === memberName);
  }, [events, memberName]);

  const totalPoints = useMemo(() => {
    return memberEvents.reduce((sum, e) => sum + e.points, 0);
  }, [memberEvents]);

  const categoryCounts = useMemo(() => {
    return memberEvents.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [memberEvents]);

  if (!isOpen || !memberName) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative z-10 w-[95%] sm:w-[600px] max-h-[85vh] overflow-hidden rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl animate-fade-in">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
          <h3 className="text-xl font-bold text-white">Member Stats: {memberName}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition"
            aria-label="Close"
          >
            ✖
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-xs">Total Points</p>
              <p className={`text-2xl font-bold ${totalPoints > 0 ? 'text-green-400' : totalPoints < 0 ? 'text-red-400' : 'text-slate-300'}`}>{totalPoints > 0 ? '+' : ''}{totalPoints}</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-xs">Positive Events</p>
              <p className="text-2xl font-bold text-green-400">{categoryCounts['positive'] || 0}</p>
            </div>
            <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
              <p className="text-slate-400 text-xs">Negative Events</p>
              <p className="text-2xl font-bold text-red-400">{categoryCounts['negative'] || 0}</p>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-white mb-3">Recent Events</h4>
            {memberEvents.length > 0 ? (
              <ul className="space-y-2">
                {memberEvents.map(e => (
                  <li key={e.id} className="flex items-center justify-between bg-slate-800/40 border border-slate-700 rounded-lg px-3 py-2">
                    <div>
                      <p className="text-slate-200 text-sm">{e.eventName} <span className="text-slate-500 text-xs ml-2">({e.playerName})</span></p>
                      <p className="text-slate-500 text-xs">{new Date(e.timestamp).toLocaleString()}</p>
                    </div>
                    <div className={`text-sm font-bold ${e.points > 0 ? 'text-green-400' : e.points < 0 ? 'text-red-400' : 'text-slate-300'}`}>{e.points > 0 ? '+' : ''}{e.points}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-sm italic">No events logged for this member yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


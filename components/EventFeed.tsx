import React from 'react';
import { LoggedEvent } from '../types';

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 5) return "just now";
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return Math.floor(seconds) + " seconds ago";
}

interface EventFeedProps {
    events: LoggedEvent[];
    onMemberClick?: (memberName: string, playerName?: string) => void;
}

export const EventFeed: React.FC<EventFeedProps> = ({ events, onMemberClick }) => {

    const categoryStyles = {
        positive: {
            border: 'border-green-500/50',
            bg: 'from-green-500/10 to-green-600/10',
            icon: '🎉',
            iconBg: 'bg-green-500/20'
        },
        negative: {
            border: 'border-red-500/50',
            bg: 'from-red-500/10 to-red-600/10',
            icon: '😔',
            iconBg: 'bg-red-500/20'
        },
        neutral: {
            border: 'border-slate-500/50',
            bg: 'from-slate-500/10 to-slate-600/10',
            icon: '📝',
            iconBg: 'bg-slate-500/20'
        }
    };

    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700 animate-fade-in">
            <div className="flex items-center space-x-3 mb-6">
                <span className="text-3xl">📊</span>
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                    Recent Events
                </h2>
            </div>
            
            {events.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                    {events.map(event => {
                        const pointColor = event.points > 0 ? 'text-green-400' : event.points < 0 ? 'text-red-400' : 'text-slate-400';
                        const pointSign = event.points > 0 ? '+' : '';
                        const style = categoryStyles[event.category] || categoryStyles.neutral;

                        return (
                            <div 
                                key={event.id} 
                                className={`bg-gradient-to-br ${style.bg} p-4 rounded-xl border ${style.border} animate-slide-in-up transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-start space-x-3 flex-1">
                                        <div className={`p-2 rounded-lg ${style.iconBg} flex-shrink-0`}>
                                            <span className="text-xl">{style.icon}</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-white">
                                                <button
                                                    type="button"
                                                    onClick={() => onMemberClick && onMemberClick(event.memberName, event.playerName)}
                                                    className="hover:underline hover:text-cyan-300 transition"
                                                >
                                                    {event.memberName}
                                                </button>
                                                <span className="text-slate-400 font-normal text-sm ml-2">
                                                    ({event.playerName})
                                                </span>
                                            </p>
                                            <p className="text-sm text-slate-300 mt-1">{event.eventName}</p>
                                            <p className="text-xs text-slate-500 mt-2">{timeSince(event.timestamp)}</p>
                                        </div>
                                    </div>
                                    <div className={`text-xl font-bold ${pointColor} bg-slate-800/50 px-3 py-1 rounded-lg`}>
                                        {pointSign}{event.points}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="text-6xl mb-4 opacity-50">📅</div>
                    <p className="text-lg text-slate-400 font-medium">No events logged yet</p>
                    <p className="text-sm text-slate-500 mt-2">Life events will appear here as they happen!</p>
                </div>
            )}
        </div>
    )
}

// Add custom scrollbar styles
const style = document.createElement('style');
style.textContent = `
    .custom-scrollbar::-webkit-scrollbar {
        width: 6px;
    }
    .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(30, 41, 59, 0.5);
        border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(100, 116, 139, 0.5);
        border-radius: 3px;
    }
    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: rgba(148, 163, 184, 0.5);
    }
`;
document.head.appendChild(style);
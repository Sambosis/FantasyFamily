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
}

export const EventFeed: React.FC<EventFeedProps> = ({ events }) => {

    const categoryStyles: { [key: string]: string } = {
        positive: 'border-green-500 bg-green-500/10',
        negative: 'border-red-500 bg-red-500/10',
        neutral: 'border-slate-500 bg-slate-500/10'
    };

    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl shadow-2xl border border-slate-700 animate-fade-in">
            {/* Header */}
            <div className="flex items-center space-x-3 mb-8">
                <span className="text-3xl">📊</span>
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
                        Recent Events
                    </h2>
                    <p className="text-slate-400 text-sm">Latest family drama and achievements</p>
                </div>
            </div>

            {events.length > 0 ? (
                 <ul className="space-y-4 max-h-96 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                    {events.map(event => {
                        const pointColor = event.points > 0 ? 'text-green-400' : event.points < 0 ? 'text-red-400' : 'text-slate-400';
                        const pointSign = event.points > 0 ? '+' : '';
                        const borderClass = categoryStyles[event.category] || 'border-slate-500 bg-slate-500/10';

                        return (
                            <li key={event.id} className={`flex justify-between items-center bg-slate-800/50 p-4 rounded-xl animate-slide-in-up border-l-4 ${borderClass} hover:bg-slate-700/50 transition-all duration-300 transform hover:scale-[1.02]`}>
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                        <p className="font-semibold text-white">
                                            {event.memberName}
                                        </p>
                                        <span className="text-xs bg-slate-700 text-slate-300 px-2 py-1 rounded-full">
                                            {event.playerName}
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-300 font-medium">{event.eventName}</p>
                                    <p className="text-xs text-slate-500 mt-1 flex items-center">
                                        <span className="mr-1">⏱️</span>
                                        {timeSince(event.timestamp)}
                                    </p>
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className={`text-2xl font-bold ${pointColor}`}>
                                        {pointSign}{event.points}
                                    </div>
                                    <div className="text-xs text-slate-500">points</div>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="text-center py-12 text-slate-500">
                    <div className="bg-slate-800/50 p-8 rounded-xl border border-slate-700">
                        <span className="text-6xl opacity-30 block mb-4">📊</span>
                        <p className="text-xl font-semibold mb-2">No events logged yet</p>
                        <p className="text-sm text-slate-400">Log a life event using the Commissioner's Desk to see the drama unfold here!</p>
                    </div>
                </div>
            )}
        </div>
    )
}
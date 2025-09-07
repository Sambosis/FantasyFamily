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
        positive: 'border-green-500',
        negative: 'border-red-500',
        neutral: 'border-slate-500'
    };

    return (
        <div className="bg-slate-800/50 p-6 rounded-xl shadow-lg animate-fade-in">
            <h2 className="text-3xl font-bold text-purple-400 mb-6">Recent Events</h2>
            {events.length > 0 ? (
                 <ul className="space-y-4 max-h-96 overflow-y-auto pr-2">
                    {events.map(event => {
                        const pointColor = event.points > 0 ? 'text-green-400' : event.points < 0 ? 'text-red-400' : 'text-slate-400';
                        const pointSign = event.points > 0 ? '+' : '';
                        const borderClass = categoryStyles[event.category] || 'border-slate-500';

                        return (
                            <li key={event.id} className={`flex justify-between items-center bg-slate-800 p-3 rounded-lg animate-slide-in-up border-l-4 ${borderClass}`}>
                                <div>
                                    <p className="font-semibold text-white">
                                        {event.memberName}
                                        <span className="text-slate-400 font-normal"> ({event.playerName})</span>
                                    </p>
                                    <p className="text-sm text-slate-300">{event.eventName}</p>
                                    <p className="text-xs text-slate-500 mt-1">{timeSince(event.timestamp)}</p>
                                </div>
                                <div className={`text-lg font-bold ${pointColor}`}>
                                    {pointSign}{event.points}
                                </div>
                            </li>
                        )
                    })}
                </ul>
            ) : (
                <div className="text-center py-8 text-slate-500">
                    <p className="text-lg">No events logged yet.</p>
                     <p className="text-sm">Log a life event to see it appear here.</p>
                </div>
            )}
        </div>
    )
}
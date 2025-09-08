import React, { useState } from 'react';
import { EventCategory } from '../types';

interface AddEventFormProps {
  onAddEvent: (name: string, points: number, category: EventCategory) => void;
}

export const AddEventForm: React.FC<AddEventFormProps> = ({ onAddEvent }) => {
  const [name, setName] = useState('');
  const [points, setPoints] = useState('');
  const [category, setCategory] = useState<EventCategory>('neutral');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pointValue = parseInt(points, 10);
    if (!name.trim() || isNaN(pointValue)) return;
    
    onAddEvent(name, pointValue, category);
    setName('');
    setPoints('');
    setCategory('neutral');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-xl">✨</span>
        <label htmlFor="eventName" className="text-lg font-semibold text-yellow-300">
          Add Custom Life Event
        </label>
      </div>
      <div className="space-y-3">
        <div className="relative">
          <input
            id="eventName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Event name (e.g., Won the lottery)"
            className="w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-transparent focus:outline-none transition-all duration-200 placeholder-slate-500"
            required
          />
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
            <span className="text-slate-500">🎯</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
            <div className="relative">
                <input
                    id="eventPoints"
                    type="number"
                    value={points}
                    onChange={(e) => setPoints(e.target.value)}
                    placeholder="Points value"
                    className="w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-400 focus:border-transparent focus:outline-none transition-all duration-200 placeholder-slate-500"
                    required
                />
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <span className="text-slate-500">💯</span>
                </div>
            </div>
            <div className="relative">
                <select
                    id="eventCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full bg-slate-900/50 border-2 border-slate-600 text-white rounded-lg px-4 py-3 pr-10 focus:ring-2 focus:ring-yellow-400 focus:border-transparent focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                >
                    <option value="positive" className="text-green-300">Positive ✅</option>
                    <option value="negative" className="text-red-300">Negative ❌</option>
                    <option value="neutral" className="text-slate-300">Neutral ⚖️</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                    <span className="text-slate-400">▼</span>
                </div>
            </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-orange-600 transform hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        disabled={!name.trim() || !points.trim()}
      >
        <span className="flex items-center justify-center space-x-2">
          <span>➕</span>
          <span>Create Custom Event</span>
        </span>
      </button>
    </form>
  );
};
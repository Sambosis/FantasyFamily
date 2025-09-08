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
      <div className="flex items-center gap-2 mb-3">
        <span className="flex items-center justify-center w-6 h-6 bg-yellow-500/20 text-yellow-400 text-sm font-bold rounded-full">4</span>
        <label htmlFor="eventName" className="text-sm font-medium text-slate-300">
          Add New Life Event
        </label>
      </div>
      <div className="space-y-3">
        <input
          id="eventName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Event Name (e.g., Won the lottery)"
          className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all duration-200 placeholder-slate-400"
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
                id="eventPoints"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Points (e.g., 100)"
                className="bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all duration-200 placeholder-slate-400"
                required
            />
            <div className="relative">
                <select
                    id="eventCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as EventCategory)}
                    className="w-full bg-slate-700/80 border border-slate-600 text-white rounded-lg px-4 py-3 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none transition-all duration-200 appearance-none cursor-pointer"
                >
                    <option value="positive">✅ Positive</option>
                    <option value="negative">❌ Negative</option>
                    <option value="neutral">⚪ Neutral</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <span className="text-slate-400">▼</span>
                </div>
            </div>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-500/25"
        disabled={!name.trim() || !points.trim()}
      >
        <span>⚙️</span>
        Add Custom Event
      </button>
    </form>
  );
};
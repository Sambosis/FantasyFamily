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
    <form onSubmit={handleSubmit} className="space-y-3">
      <label htmlFor="eventName" className="block text-sm font-medium text-slate-300">
        5. Add New Life Event
      </label>
      <div className="space-y-2">
        <input
          id="eventName"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Event Name (e.g., Won the lottery)"
          className="w-full bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
          required
        />
        <div className="flex gap-2">
            <input
                id="eventPoints"
                type="number"
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                placeholder="Points"
                className="w-1/2 bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
                required
            />
            <select
                id="eventCategory"
                value={category}
                onChange={(e) => setCategory(e.target.value as EventCategory)}
                className="w-1/2 bg-slate-700 border border-slate-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-cyan-500 focus:outline-none transition"
            >
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
            </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-yellow-600 text-white font-bold py-2 px-4 rounded-md hover:bg-yellow-700 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        disabled={!name.trim() || !points.trim()}
      >
        Add Custom Event
      </button>
    </form>
  );
};
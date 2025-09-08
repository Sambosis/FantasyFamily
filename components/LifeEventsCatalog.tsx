import React, { useMemo } from 'react';
import { EventDefinition } from '../types';

interface LifeEventsCatalogProps {
  lifeEvents: EventDefinition[];
}

export const LifeEventsCatalog: React.FC<LifeEventsCatalogProps> = ({ lifeEvents }) => {
  const { positive, neutral, negative } = useMemo(() => {
    const grouped = {
      positive: [] as EventDefinition[],
      neutral: [] as EventDefinition[],
      negative: [] as EventDefinition[],
    };

    for (const ev of lifeEvents) {
      if (ev.category === 'positive') grouped.positive.push(ev);
      else if (ev.category === 'negative') grouped.negative.push(ev);
      else grouped.neutral.push(ev);
    }

    const sortByPointsThenName = (a: EventDefinition, b: EventDefinition) => {
      const byAbsPoints = Math.abs(b.points) - Math.abs(a.points);
      if (byAbsPoints !== 0) return byAbsPoints;
      return a.name.localeCompare(b.name);
    };

    grouped.positive.sort(sortByPointsThenName);
    grouped.neutral.sort(sortByPointsThenName);
    grouped.negative.sort(sortByPointsThenName);

    return grouped;
  }, [lifeEvents]);

  const renderSection = (
    title: string,
    description: string,
    items: EventDefinition[],
    accentClasses: { text: string; border: string; headerBg: string }
  ) => {
    return (
      <section aria-labelledby={`${title}-heading`} className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 id={`${title}-heading`} className={`text-xl font-bold ${accentClasses.text}`}>{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>
          </div>
          <span className="text-sm text-slate-400">{items.length} events</span>
        </div>

        <div className={`rounded-xl border ${accentClasses.border} bg-slate-800/50 overflow-hidden`}>
          <table className="w-full" aria-label={`${title} life events`}>
            <thead className={accentClasses.headerBg}>
              <tr>
                <th scope="col" className="text-left px-4 py-3 text-sm font-semibold text-white">Event</th>
                <th scope="col" className="text-right px-4 py-3 text-sm font-semibold text-white">Points</th>
              </tr>
            </thead>
            <tbody>
              {items.map((ev) => (
                <tr key={ev.id} className="border-t border-slate-700/60">
                  <td className="px-4 py-3">
                    <span className="text-white font-medium">{ev.name}</span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className={
                      ev.points > 0
                        ? 'text-green-400 font-semibold'
                        : ev.points < 0
                        ? 'text-red-400 font-semibold'
                        : 'text-slate-300 font-semibold'
                    }>
                      {ev.points > 0 ? `+${ev.points}` : ev.points}
                    </span>
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan={2} className="px-4 py-6 text-center text-slate-400">No events in this category</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    );
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
          Life Events Catalog
        </h2>
        <p className="text-slate-400">View all available life events and their point values</p>
        <div className="mt-4 flex items-center justify-center gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-400/80" /> Positive: {positive.length}</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-slate-400/80" /> Neutral: {neutral.length}</span>
          <span className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-400/80" /> Negative: {negative.length}</span>
        </div>
      </div>

      {renderSection(
        'Positive Events',
        'Good things that add points to a team score',
        positive,
        {
          text: 'text-green-400',
          border: 'border-green-700/40',
          headerBg: 'bg-green-900/40',
        }
      )}

      {renderSection(
        'Neutral Events',
        'Events that do not add or subtract points',
        neutral,
        {
          text: 'text-slate-300',
          border: 'border-slate-700',
          headerBg: 'bg-slate-800',
        }
      )}

      {renderSection(
        'Negative Events',
        'Unfortunate events that subtract points from a team score',
        negative,
        {
          text: 'text-red-400',
          border: 'border-red-700/40',
          headerBg: 'bg-red-900/40',
        }
      )}
    </div>
  );
};


import { useState, useMemo, useEffect } from 'react';
import { Player, FamilyMember, LoggedEvent, EventDefinition, EventCategory } from './types';
import { LIFE_EVENTS } from './constants';
import { Header } from './components/Header';
import { Leaderboard } from './components/Leaderboard';
import { EventFeed } from './components/EventFeed';
import { CommissionerView } from './components/CommissionerView';
import {
  loadPlayers,
  loadLoggedEvents,
  loadLifeEvents,
  savePlayers,
  saveLoggedEvents,
  saveLifeEvents,
} from './storage';

// Initial state for demonstration purposes
const INITIAL_PLAYERS: Player[] = [
  {
    id: 'p1',
    name: 'Shannon',
    score: 150,
    members: [
      { id: 'fm1', name: 'Cousin Sarah' },
      { id: 'fm2', name: 'Uncle Rob' },
    ],
  },
  {
    id: 'p2',
    name: 'Sam',
    score: -50,
    members: [
      { id: 'fm3', name: 'Aunt Carol' },
      { id: 'fm4', name: 'Grandpa Joe' },
    ],
  },
];

const INITIAL_EVENTS: LoggedEvent[] = [
    {
        id: crypto.randomUUID(),
        memberName: 'Cousin Sarah',
        playerName: 'Team Mom',
        eventName: 'Gets Promotion',
        points: 150,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        category: 'positive',
    },
    {
        id: crypto.randomUUID(),
        memberName: 'Grandpa Joe',
        playerName: 'Dad Dynasty',
        eventName: 'Gets Fired',
        points: -50,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        category: 'negative',
    }
]

export default function App() {
  const [players, setPlayers] = useState<Player[]>(() => loadPlayers() ?? INITIAL_PLAYERS);
  const [loggedEvents, setLoggedEvents] = useState<LoggedEvent[]>(() => loadLoggedEvents() ?? INITIAL_EVENTS);
  const [lifeEvents, setLifeEvents] = useState<EventDefinition[]>(() => loadLifeEvents() ?? LIFE_EVENTS);
  const [isCommissionerView, setIsCommissionerView] = useState(false);

  useEffect(() => {
    savePlayers(players);
  }, [players]);

  useEffect(() => {
    saveLoggedEvents(loggedEvents);
  }, [loggedEvents]);

  useEffect(() => {
    saveLifeEvents(lifeEvents);
  }, [lifeEvents]);

  const familyMembers = useMemo(() => {
    return players.flatMap(p => p.members.map(m => ({ ...m, playerName: p.name, playerId: p.id })));
  }, [players]);

  const addPlayer = (name: string) => {
    if (name.trim() === '') return;
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      score: 0,
      members: [],
    };
    setPlayers(currentPlayers => [...currentPlayers, newPlayer]);
  };

  const renamePlayer = (playerId: string, newName: string) => {
    const trimmedNewName = newName.trim();
    if (trimmedNewName === '' || !playerId) return;

    const playerToRename = players.find(p => p.id === playerId);
    if (!playerToRename || playerToRename.name === trimmedNewName) return;
    
    const oldName = playerToRename.name;

    setPlayers(currentPlayers =>
      currentPlayers.map(p =>
        p.id === playerId ? { ...p, name: trimmedNewName } : p
      )
    );

    setLoggedEvents(currentEvents =>
      currentEvents.map(e =>
        e.playerName === oldName ? { ...e, playerName: trimmedNewName } : e
      )
    );
  };

  const deletePlayer = (playerId: string) => {
    const playerToDelete = players.find(p => p.id === playerId);
    if (!playerToDelete) return;

    // Remove the player from the players array
    setPlayers(currentPlayers => 
      currentPlayers.filter(p => p.id !== playerId)
    );

    // Remove all logged events associated with this player
    setLoggedEvents(currentEvents =>
      currentEvents.filter(e => e.playerName !== playerToDelete.name)
    );
  };


  const addMember = (playerId: string, memberName: string) => {
    if (memberName.trim() === '' || !playerId) return;
    setPlayers(currentPlayers =>
      currentPlayers.map(p => {
        if (p.id === playerId) {
          const newMember: FamilyMember = {
            id: crypto.randomUUID(),
            name: memberName,
          };
          return { ...p, members: [...p.members, newMember] };
        }
        return p;
      })
    );
  };

  const addEvent = (name: string, points: number, category: EventCategory) => {
    if (name.trim() === '' || isNaN(points)) return;
    const newEvent: EventDefinition = {
      id: crypto.randomUUID(),
      name,
      points,
      category,
    };
    setLifeEvents(currentEvents => [...currentEvents, newEvent]);
  };

  const logEvent = (memberId: string, eventId: string) => {
    const eventDefinition = lifeEvents.find(e => e.id === eventId);
    if (!eventDefinition) return;

    setPlayers(currentPlayers => {
        let playerForEvent: Player | undefined;
        let memberForEvent: FamilyMember | undefined;

        const newPlayers = currentPlayers.map(p => {
            const member = p.members.find(m => m.id === memberId);
            if (member) {
                playerForEvent = p;
                memberForEvent = member;
                return { ...p, score: p.score + eventDefinition.points };
            }
            return p;
        });

        if (playerForEvent && memberForEvent) {
            const newLog: LoggedEvent = {
              id: crypto.randomUUID(),
              memberName: memberForEvent.name,
              playerName: playerForEvent.name,
              eventName: eventDefinition.name,
              points: eventDefinition.points,
              timestamp: new Date(),
              category: eventDefinition.category,
            };
            setLoggedEvents(currentEvents => [newLog, ...currentEvents]);
            return newPlayers;
        }
        
        return currentPlayers;
    });
  };
  
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  const toggleView = () => {
    setIsCommissionerView(!isCommissionerView);
  };


  if (isCommissionerView) {
    return (
      <div>
        <div className="min-h-screen bg-slate-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Header isCommissionerView={isCommissionerView} onToggleView={toggleView} />
          </div>
        </div>
        <CommissionerView
          players={players}
          lifeEvents={lifeEvents}
          onAddPlayer={addPlayer}
          onAddMember={addMember}
          onLogEvent={logEvent}
          onRenamePlayer={renamePlayer}
          onDeletePlayer={deletePlayer}
          onAddEvent={addEvent}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header isCommissionerView={isCommissionerView} onToggleView={toggleView} />

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Column: Leaderboard */}
          <div className="lg:col-span-2 space-y-8">
            <Leaderboard players={sortedPlayers} />
            <EventFeed events={loggedEvents} />
          </div>

          {/* Right Column: Quick Actions */}
          <div className="space-y-8 animate-fade-in">
            <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-bold text-cyan-400 mb-4">Quick Actions</h2>
                <p className="text-slate-400 mb-4">
                  Switch to Commissioner view for full management tools.
                </p>
                <button
                  onClick={toggleView}
                  className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:from-cyan-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
                >
                  ⚙️ Open Commissioner's Desk
                </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
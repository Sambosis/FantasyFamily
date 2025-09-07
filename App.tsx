import { useState, useMemo, useEffect } from 'react';
import { Player, FamilyMember, LoggedEvent, EventDefinition, EventCategory } from './types';
import { LIFE_EVENTS } from './constants';
import { Header } from './components/Header';
import { Leaderboard } from './components/Leaderboard';
import { EventFeed } from './components/EventFeed';
import { CommissionerDesk } from './components/CommissionerDesk';
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
    score: 0,
    members: [

    ],
  },
  {
    id: 'p2',
    name: 'Sam',
    score: 0,
    members: [

    ],
  },
];

const INITIAL_EVENTS: LoggedEvent[] = [
    // {
    //     id: crypto.randomUUID(),
    //     memberName: 'Cousin Sarah',
    //     playerName: 'Team Mom',
    //     eventName: 'Gets Promotion',
    //     points: 150,
    //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    //     category: 'positive',
    // },
    // {
    //     id: crypto.randomUUID(),
    //     memberName: 'Grandpa Joe',
    //     playerName: 'Dad Dynasty',
    //     eventName: 'Gets Fired',
    //     points: -50,
    //     timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    //     category: 'negative',
    // }
]

export default function App() {
  const [players, setPlayers] = useState<Player[]>(() => loadPlayers() ?? INITIAL_PLAYERS);
  const [loggedEvents, setLoggedEvents] = useState<LoggedEvent[]>(() => loadLoggedEvents() ?? INITIAL_EVENTS);
  const [lifeEvents, setLifeEvents] = useState<EventDefinition[]>(() => loadLifeEvents() ?? LIFE_EVENTS);
  const [isCommissionerView, setIsCommissionerView] = useState<boolean>(false);

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

    let playerForEvent: Player | undefined;
    let memberForEvent: FamilyMember | undefined;

    for (const player of players) {
      const member = player.members.find(m => m.id === memberId);
      if (member) {
        playerForEvent = player;
        memberForEvent = member;
        break;
      }
    }

    if (!playerForEvent || !memberForEvent) return;

    const finalPlayerForEvent = playerForEvent;
    setPlayers(currentPlayers =>
      currentPlayers.map(p => {
        if (p.id === finalPlayerForEvent.id) {
          return { ...p, score: p.score + eventDefinition.points };
        }
        return p;
      })
    );

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
  };
  
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);


  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header
          isCommissionerView={isCommissionerView}
          onToggleView={() => setIsCommissionerView((v) => !v)}
        />

        {isCommissionerView ? (
          <main className="mt-8">
            <CommissionerDesk
              players={players}
              lifeEvents={lifeEvents}
              onAddPlayer={addPlayer}
              onAddMember={addMember}
              onLogEvent={logEvent}
              onRenamePlayer={renamePlayer}
              onDeletePlayer={deletePlayer}
              onAddEvent={addEvent}
            />
          </main>
        ) : (
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            <Leaderboard players={sortedPlayers} />
            <EventFeed events={loggedEvents} />
          </main>
        )}
      </div>
    </div>
  );
}
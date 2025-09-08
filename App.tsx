import { useState, useMemo, useEffect } from 'react';
import { Player, FamilyMember, LoggedEvent, EventDefinition, EventCategory } from './types';
import { LIFE_EVENTS } from './constants';
import { Header } from './components/Header';
import { Leaderboard } from './components/Leaderboard';
import { EventFeed } from './components/EventFeed';
import { CommissionerDesk } from './components/CommissionerDesk';
import { FamilyMemberStats } from './components/FamilyMemberStats';
import { FamilyMembersView } from './components/FamilyMembersView';
import {
  loadPlayers,
  loadLoggedEvents,
  loadLifeEvents,
  createPlayer,
  updatePlayer,
  deletePlayer,
  createFamilyMember,
  updateFamilyMemberPlayer,
  createLoggedEvent,
  createLifeEvent,
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
  const [players, setPlayers] = useState<Player[]>([]);
  const [loggedEvents, setLoggedEvents] = useState<LoggedEvent[]>([]);
  const [lifeEvents, setLifeEvents] = useState<EventDefinition[]>([]);
  const [isCommissionerView, setIsCommissionerView] = useState<boolean>(false);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'members'>('dashboard');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial data from API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const [playersData, eventsData, lifeEventsData] = await Promise.all([
          loadPlayers(),
          loadLoggedEvents(),
          loadLifeEvents(),
        ]);

        setPlayers(playersData.length > 0 ? playersData : INITIAL_PLAYERS);
        setLoggedEvents(eventsData.length > 0 ? eventsData : INITIAL_EVENTS);
        setLifeEvents(lifeEventsData.length > 0 ? lifeEventsData : LIFE_EVENTS);

        // If we're using initial data, populate the database
        if (playersData.length === 0) {
          for (const player of INITIAL_PLAYERS) {
            await createPlayer(player);
          }
        }
        
        if (lifeEventsData.length === 0) {
          for (const event of LIFE_EVENTS) {
            await createLifeEvent(event);
          }
        }
      } catch (err) {
        console.error('Error loading initial data:', err);
        setError('Failed to load data. Please refresh the page.');
        // Fall back to initial data if API fails
        setPlayers(INITIAL_PLAYERS);
        setLoggedEvents(INITIAL_EVENTS);
        setLifeEvents(LIFE_EVENTS);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const familyMembers = useMemo(() => {
    return players.flatMap(p => p.members.map(m => ({ ...m, playerName: p.name, playerId: p.id })));
  }, [players]);

  const selectedMember = useMemo(() => {
    if (!selectedMemberId) return null;
    return familyMembers.find(m => m.id === selectedMemberId) || null;
  }, [selectedMemberId, familyMembers]);

  const handleMemberClick = (memberId: string) => {
    setSelectedMemberId(memberId);
  };

  const handleCloseMemberStats = () => {
    setSelectedMemberId(null);
  };

  const handleShowAllMembers = (playerId: string) => {
    setActiveTab('members');
  };

  const addPlayer = async (name: string) => {
    if (name.trim() === '') return;
    const newPlayer: Player = {
      id: crypto.randomUUID(),
      name,
      score: 0,
      members: [],
    };
    
    try {
      await createPlayer(newPlayer);
      setPlayers(currentPlayers => [...currentPlayers, newPlayer]);
    } catch (error) {
      console.error('Error adding player:', error);
      setError('Failed to add player. Please try again.');
    }
  };

  const renamePlayer = async (playerId: string, newName: string) => {
    const trimmedNewName = newName.trim();
    if (trimmedNewName === '' || !playerId) return;

    const playerToRename = players.find(p => p.id === playerId);
    if (!playerToRename || playerToRename.name === trimmedNewName) return;
    
    const oldName = playerToRename.name;

    try {
      await updatePlayer(playerId, { name: trimmedNewName });
      
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
    } catch (error) {
      console.error('Error renaming player:', error);
      setError('Failed to rename player. Please try again.');
    }
  };

  const deletePlayerHandler = async (playerId: string) => {
    const playerToDelete = players.find(p => p.id === playerId);
    if (!playerToDelete) return;

    try {
      await deletePlayer(playerId);
      
      // Remove the player from the players array
      setPlayers(currentPlayers => 
        currentPlayers.filter(p => p.id !== playerId)
      );

      // Remove all logged events associated with this player
      setLoggedEvents(currentEvents =>
        currentEvents.filter(e => e.playerName !== playerToDelete.name)
      );
    } catch (error) {
      console.error('Error deleting player:', error);
      setError('Failed to delete player. Please try again.');
    }
  };


  const addMember = async (playerId: string, memberName: string) => {
    if (memberName.trim() === '' || !playerId) return;
    
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name: memberName,
    };

    try {
      await createFamilyMember({
        id: newMember.id,
        name: newMember.name,
        player_id: playerId,
      });

      setPlayers(currentPlayers =>
        currentPlayers.map(p => {
          if (p.id === playerId) {
            return { ...p, members: [...p.members, newMember] };
          }
          return p;
        })
      );
    } catch (error) {
      console.error('Error adding member:', error);
      setError('Failed to add family member. Please try again.');
    }
  };

  const addEvent = async (name: string, points: number, category: EventCategory) => {
    if (name.trim() === '' || isNaN(points)) return;
    const newEvent: EventDefinition = {
      id: crypto.randomUUID(),
      name,
      points,
      category,
    };

    try {
      await createLifeEvent(newEvent);
      setLifeEvents(currentEvents => [...currentEvents, newEvent]);
    } catch (error) {
      console.error('Error adding event:', error);
      setError('Failed to add event. Please try again.');
    }
  };

  const tradeMember = async (memberId: string, toPlayerId: string) => {
    if (!memberId || !toPlayerId) return;

    let fromPlayer: Player | undefined;
    let memberToTrade: FamilyMember | undefined;
    for (const player of players) {
      const member = player.members.find(m => m.id === memberId);
      if (member) {
        fromPlayer = player;
        memberToTrade = member;
        break;
      }
    }

    if (!fromPlayer || !memberToTrade) return;
    if (fromPlayer.id === toPlayerId) return;

    const toPlayer = players.find(p => p.id === toPlayerId);
    if (!toPlayer) return;

    try {
      await updateFamilyMemberPlayer(memberId, toPlayerId);

      setPlayers(currentPlayers => currentPlayers.map(p => {
        if (p.id === fromPlayer!.id) {
          return { ...p, members: p.members.filter(m => m.id !== memberId) };
        }
        if (p.id === toPlayerId) {
          return { ...p, members: [...p.members, memberToTrade!] };
        }
        return p;
      }));

      const tradeLog: LoggedEvent = {
        id: crypto.randomUUID(),
        memberName: memberToTrade.name,
        playerName: `${fromPlayer.name} → ${toPlayer.name}`,
        eventName: 'Member Traded',
        points: 0,
        timestamp: new Date(),
        category: 'neutral',
      };
      
      await createLoggedEvent(tradeLog);
      setLoggedEvents(currentEvents => [tradeLog, ...currentEvents]);
    } catch (error) {
      console.error('Error trading member:', error);
      setError('Failed to trade member. Please try again.');
    }
  };

  const logEvent = async (memberId: string, eventId: string) => {
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

    try {
      const newScore = playerForEvent.score + eventDefinition.points;
      await updatePlayer(playerForEvent.id, { score: newScore });

      setPlayers(currentPlayers =>
        currentPlayers.map(p => {
          if (p.id === playerForEvent!.id) {
            return { ...p, score: newScore };
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
      
      await createLoggedEvent(newLog);
      setLoggedEvents(currentEvents => [newLog, ...currentEvents]);
    } catch (error) {
      console.error('Error logging event:', error);
      setError('Failed to log event. Please try again.');
    }
  };
  
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);


  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-gray-200 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold">Loading Fantasy Family...</h2>
          <p className="text-slate-400 mt-2">Setting up your family league</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-900/50 border border-red-500 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-red-400 mr-2">⚠️</span>
                <span className="text-red-200">{error}</span>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-300"
              >
                ✕
              </button>
            </div>
          </div>
        )}
        
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
              onTradeMember={tradeMember}
              onRenamePlayer={renamePlayer}
              onDeletePlayer={deletePlayerHandler}
              onAddEvent={addEvent}
            />
          </main>
        ) : (
          <main className="mt-8 space-y-8 animate-fade-in">
            {/* Main View Header */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 mb-2">
                League Dashboard
              </h2>
              <p className="text-slate-400">Track your family's achievements and see who's winning</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center">
              <div className="bg-slate-800/50 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'dashboard'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>🏆</span>
                    Dashboard
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('members')}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === 'members'
                      ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white shadow-lg'
                      : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span>👨‍👩‍👧‍👦</span>
                    Family Members
                  </span>
                </button>
              </div>
            </div>

            {activeTab === 'dashboard' && (
              <>
                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 p-4 rounded-xl border border-cyan-500/30 backdrop-blur-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-cyan-300 text-sm font-medium">Leading Player</p>
                        <p className="text-2xl font-bold text-white">
                          {sortedPlayers[0]?.name || 'None'}
                        </p>
                      </div>
                      <span className="text-3xl opacity-70">🏆</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 p-4 rounded-xl border border-purple-500/30 backdrop-blur-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-300 text-sm font-medium">Total Players</p>
                        <p className="text-2xl font-bold text-white">{players.length}</p>
                      </div>
                      <span className="text-3xl opacity-70">👥</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 p-4 rounded-xl border border-green-500/30 backdrop-blur-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-300 text-sm font-medium">Total Events</p>
                        <p className="text-2xl font-bold text-white">{loggedEvents.length}</p>
                      </div>
                      <span className="text-3xl opacity-70">📊</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 p-4 rounded-xl border border-orange-500/30 backdrop-blur-xs">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-300 text-sm font-medium">Family Members</p>
                        <p className="text-2xl font-bold text-white">
                          {players.reduce((acc, p) => acc + p.members.length, 0)}
                        </p>
                      </div>
                      <span className="text-3xl opacity-70">👨‍👩‍👧‍👦</span>
                    </div>
                  </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <Leaderboard players={sortedPlayers} onMemberClick={handleMemberClick} onShowAllMembers={handleShowAllMembers} />
                  <EventFeed events={loggedEvents} />
                </div>
              </>
            )}

            {activeTab === 'members' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <FamilyMembersView 
                    players={players}
                    loggedEvents={loggedEvents}
                    onMemberClick={handleMemberClick}
                  />
                </div>
                <div>
                  <EventFeed events={loggedEvents} />
                </div>
              </div>
            )}
          </main>
        )}

        {/* Family Member Stats Modal */}
        {selectedMember && (
          <FamilyMemberStats
            member={selectedMember}
            playerName={selectedMember.playerName}
            playerId={selectedMember.playerId}
            allEvents={loggedEvents}
            onClose={handleCloseMemberStats}
          />
        )}
      </div>
    </div>
  );
}
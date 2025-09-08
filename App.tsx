import { useState, useMemo, useEffect } from 'react';
import { Player, FamilyMember, LoggedEvent, EventDefinition, EventCategory } from './types';
import { LIFE_EVENTS } from './constants';
import { Header } from './components/Header';
import { Leaderboard } from './components/Leaderboard';
import { EventFeed } from './components/EventFeed';
import { CommissionerDesk } from './components/CommissionerDesk';
import { FamilyMemberStats } from './components/FamilyMemberStats';
import { FamilyMembersView } from './components/FamilyMembersView';
import { apiClient } from './api/client';

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
    loadData();

    // Subscribe to real-time updates
    const unsubscribe = apiClient.onDataUpdate((update) => {
      // Reload data when another client makes changes
      loadData();
    });

    return unsubscribe;
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await apiClient.fetchAllData();
      setPlayers(data.players);
      setLoggedEvents(data.loggedEvents);
      setLifeEvents(data.lifeEvents.length > 0 ? data.lifeEvents : LIFE_EVENTS);
    } catch (err) {
      console.error('Failed to load data:', err);
      setError('Failed to load data. Please refresh the page.');
      // Fall back to default data if API fails
      setPlayers([]);
      setLoggedEvents([]);
      setLifeEvents(LIFE_EVENTS);
    } finally {
      setIsLoading(false);
    }
  };

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
    try {
      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name,
        score: 0,
        members: [],
      };
      await apiClient.createPlayer(newPlayer);
      setPlayers(currentPlayers => [...currentPlayers, newPlayer]);
    } catch (err) {
      console.error('Failed to add player:', err);
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
      await apiClient.updatePlayer(playerId, { name: trimmedNewName });
      
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
    } catch (err) {
      console.error('Failed to rename player:', err);
      setError('Failed to rename player. Please try again.');
    }
  };

  const deletePlayer = async (playerId: string) => {
    const playerToDelete = players.find(p => p.id === playerId);
    if (!playerToDelete) return;

    try {
      await apiClient.deletePlayer(playerId);
      
      // Remove the player from the players array
      setPlayers(currentPlayers => 
        currentPlayers.filter(p => p.id !== playerId)
      );

      // Remove all logged events associated with this player
      setLoggedEvents(currentEvents =>
        currentEvents.filter(e => e.playerName !== playerToDelete.name)
      );
    } catch (err) {
      console.error('Failed to delete player:', err);
      setError('Failed to delete player. Please try again.');
    }
  };

  const addMember = async (playerId: string, memberName: string) => {
    if (memberName.trim() === '' || !playerId) return;
    
    try {
      const newMember: FamilyMember = {
        id: crypto.randomUUID(),
        name: memberName,
      };
      
      await apiClient.createFamilyMember(playerId, newMember);
      
      setPlayers(currentPlayers =>
        currentPlayers.map(p => {
          if (p.id === playerId) {
            return { ...p, members: [...p.members, newMember] };
          }
          return p;
        })
      );
    } catch (err) {
      console.error('Failed to add member:', err);
      setError('Failed to add family member. Please try again.');
    }
  };

  const addEvent = async (name: string, points: number, category: EventCategory) => {
    if (name.trim() === '' || isNaN(points)) return;
    
    try {
      const newEvent: EventDefinition = {
        id: crypto.randomUUID(),
        name,
        points,
        category,
      };
      
      await apiClient.createLifeEvent(newEvent);
      setLifeEvents(currentEvents => [...currentEvents, newEvent]);
    } catch (err) {
      console.error('Failed to add event:', err);
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
      await apiClient.tradeFamilyMember(memberId, fromPlayer.id, toPlayerId);
      
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
      
      await apiClient.createLoggedEvent(tradeLog);
      setLoggedEvents(currentEvents => [tradeLog, ...currentEvents]);
    } catch (err) {
      console.error('Failed to trade member:', err);
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
      const finalPlayerForEvent = playerForEvent;
      
      // Update player score
      await apiClient.updatePlayer(finalPlayerForEvent.id, {
        score: finalPlayerForEvent.score + eventDefinition.points
      });
      
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
      
      await apiClient.createLoggedEvent(newLog);
      setLoggedEvents(currentEvents => [newLog, ...currentEvents]);
    } catch (err) {
      console.error('Failed to log event:', err);
      setError('Failed to log event. Please try again.');
    }
  };
  
  const sortedPlayers = useMemo(() => {
    return [...players].sort((a, b) => b.score - a.score);
  }, [players]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 text-gray-200 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-lg">Loading Fantasy Family...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-red-300">
            {error}
            <button 
              onClick={() => setError(null)}
              className="ml-4 text-red-400 hover:text-red-300"
            >
              ✕
            </button>
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
              onDeletePlayer={deletePlayer}
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
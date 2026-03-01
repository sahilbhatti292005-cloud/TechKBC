import React, { useState } from 'react';
import { GameState, Question } from '../types';
import { FFF_QUESTIONS, HOT_SEAT_QUESTIONS } from '../constants';
import { Play, Eye, Lock, Trophy, UserCheck, RefreshCw, CheckCircle, XCircle, Zap, Users } from 'lucide-react';

interface AdminLaptopProps {
  gameState: GameState | null;
  socket: any;
}

const AdminLaptop: React.FC<AdminLaptopProps> = ({ gameState, socket }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questionIndex, setQuestionIndex] = useState(0);

  const sendAction = (action: string, payload: any = {}) => {
    socket?.send(JSON.stringify({ type: 'ADMIN_ACTION', action, payload }));
  };

  const currentHotSeatQuestion = HOT_SEAT_QUESTIONS[selectedDifficulty][questionIndex % HOT_SEAT_QUESTIONS[selectedDifficulty].length];
  const currentFFFQuestion = FFF_QUESTIONS[questionIndex % FFF_QUESTIONS.length];

  if (!gameState) return <div className="p-8">Connecting to server...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center bg-[#1a1a4a] p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold">Admin Control Panel</h1>
          <p className="text-gray-400 text-sm">Cycle {gameState.currentCycle} / 8 • Status: <span className="text-blue-400 font-mono">{gameState.status}</span></p>
        </div>
        <div className="flex space-x-4">
          <button onClick={() => sendAction('REFRESH_TEAMS')} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center">
            <RefreshCw className="w-4 h-4 mr-2" /> Refresh Teams
          </button>
          <button onClick={() => sendAction('NEXT_CYCLE')} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center">
            <Play className="w-4 h-4 mr-2" /> Next Cycle
          </button>
          <button 
            onClick={() => {
              if (confirm("Are you sure you want to reset the entire game? This will delete all teams and scores.")) {
                sendAction('RESET_GAME');
              }
            }} 
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-bold flex items-center"
          >
            <RefreshCw className="w-4 h-4 mr-2" /> Reset Game
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Fastest Finger First Controls */}
        <section className="bg-[#1a1a4a] p-6 rounded-2xl border border-white/10 space-y-6">
          <h2 className="text-xl font-bold flex items-center"><Zap className="mr-2 text-yellow-500" /> Fastest Finger First</h2>
          <div className="grid grid-cols-2 gap-4">
            <AdminButton 
              icon={<Play />} label="Start FFF" 
              onClick={() => sendAction('START_FFF', { question: currentFFFQuestion })} 
              active={gameState.status === 'LOBBY'}
            />
            <AdminButton 
              icon={<Eye />} label="Show Options" 
              onClick={() => sendAction('SHOW_FFF_OPTIONS')} 
              active={gameState.status === 'FFF_QUESTION'}
            />
            <AdminButton 
              icon={<Lock />} label="Lock Submissions" 
              onClick={() => sendAction('LOCK_FFF')} 
              active={gameState.status === 'FFF_OPTIONS'}
            />
            <AdminButton 
              icon={<Trophy />} label="Show Leaderboard" 
              onClick={() => {}} 
              active={gameState.status === 'FFF_RESULT'}
            />
          </div>
          
          {gameState.status === 'FFF_RESULT' ? (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase">Select Winner for Hot Seat</h3>
              <div className="space-y-2">
                {gameState.teams
                  .filter(t => t.isCorrect === 1)
                  .sort((a, b) => (a.fffTime || 0) - (b.fffTime || 0))
                  .map(team => (
                    <button 
                      key={team.id}
                      onClick={() => sendAction('SEND_TO_HOT_SEAT', { teamId: team.id })}
                      className="w-full bg-[#0a0a2a] hover:bg-blue-900/30 p-3 rounded-xl border border-white/5 flex justify-between items-center transition-colors"
                    >
                      <span className="font-bold">{team.name}</span>
                      <span className="font-mono text-blue-400">{team.fffTime}ms</span>
                    </button>
                  ))}
                
                <div className="pt-4 border-t border-white/10">
                  <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Manual Override (Select Any Team)</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {gameState.teams.map(team => (
                      <button 
                        key={team.id}
                        onClick={() => sendAction('SEND_TO_HOT_SEAT', { teamId: team.id })}
                        className="bg-[#1a1a4a] hover:bg-blue-600/20 p-2 rounded-lg text-xs font-bold border border-white/5 truncate"
                      >
                        {team.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-6 pt-4 border-t border-white/10">
              <h4 className="text-[10px] font-bold text-gray-500 uppercase mb-2">Quick Select (Hot Seat)</h4>
              <div className="grid grid-cols-2 gap-2">
                {gameState.teams.map(team => (
                  <button 
                    key={team.id}
                    onClick={() => sendAction('SEND_TO_HOT_SEAT', { teamId: team.id })}
                    className="bg-[#1a1a4a] hover:bg-blue-600/20 p-2 rounded-lg text-xs font-bold border border-white/5 truncate"
                  >
                    {team.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Hot Seat Controls */}
        <section className="bg-[#1a1a4a] p-6 rounded-2xl border border-white/10 space-y-6">
          <h2 className="text-xl font-bold flex items-center"><UserCheck className="mr-2 text-blue-500" /> Hot Seat Control</h2>
          <div className="flex space-x-2 mb-4">
            {(['easy', 'medium', 'hard'] as const).map(d => (
              <button 
                key={d}
                onClick={() => { setSelectedDifficulty(d); setQuestionIndex(0); }}
                className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-widest border transition-colors ${selectedDifficulty === d ? 'bg-blue-600 border-blue-400' : 'bg-[#0a0a2a] border-white/10 text-gray-500'}`}
              >
                {d}
              </button>
            ))}
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-gray-400">Question {questionIndex + 1}</span>
            <button 
              onClick={() => setQuestionIndex(prev => prev + 1)}
              className="text-xs text-blue-400 hover:underline"
            >
              Next Question
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <AdminButton 
              icon={<Play />} label="Show Question" 
              onClick={() => sendAction('START_HOT_SEAT_QUESTION', { question: currentHotSeatQuestion })} 
              active={gameState.status === 'HOT_SEAT' || gameState.status === 'FFF_RESULT'}
            />
            <div className="bg-[#0a0a2a] p-4 rounded-2xl border border-white/10 flex flex-col space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase text-center">Lock Option</span>
              <div className="grid grid-cols-4 gap-1">
                {['A', 'B', 'C', 'D'].map((opt, i) => (
                  <button 
                    key={opt}
                    onClick={() => sendAction('LOCK_OPTION', { optionIndex: i })}
                    className={`py-2 rounded-lg text-xs font-bold border transition-all ${gameState.lockedOption === i ? 'bg-yellow-600 border-yellow-400 text-white' : 'bg-[#1a1a4a] border-white/10 text-gray-400'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <AdminButton 
              icon={<Eye />} label="Reveal Correct" 
              onClick={() => sendAction('REVEAL_CORRECT')} 
              active={gameState.status === 'HOT_SEAT' && gameState.lockedOption !== null && !gameState.revealCorrect}
            />
            <AdminButton 
              icon={<CheckCircle />} label="Mark Correct" 
              onClick={() => sendAction('UPDATE_SCORE', { teamId: gameState.hotSeatTeamId, type: 'hotSeat', amount: selectedDifficulty === 'easy' ? 30 : selectedDifficulty === 'medium' ? 50 : 100 })} 
              active={gameState.status === 'HOT_SEAT' && gameState.revealCorrect}
              variant="success"
            />
            <AdminButton 
              icon={<XCircle />} label="Mark Wrong" 
              onClick={() => sendAction('UPDATE_SCORE', { teamId: gameState.hotSeatTeamId, type: 'hotSeat', amount: selectedDifficulty === 'easy' ? -10 : selectedDifficulty === 'medium' ? -20 : -30 })} 
              active={gameState.status === 'HOT_SEAT' && gameState.revealCorrect}
              variant="danger"
            />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <button onClick={() => sendAction('ACTIVATE_LIFELINE', { lifeline: 'debugHelp' })} className="bg-purple-600/20 hover:bg-purple-600/40 border border-purple-500/50 p-3 rounded-xl text-xs font-bold">
              DEBUG HELP (-20)
            </button>
            <button onClick={() => sendAction('ACTIVATE_LIFELINE', { lifeline: 'callDev' })} className="bg-orange-600/20 hover:bg-orange-600/40 border border-orange-500/50 p-3 rounded-xl text-xs font-bold">
              CALL DEV (-10)
            </button>
          </div>
        </section>
      </div>

      {/* Team Management */}
      <section className="bg-[#1a1a4a] p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-bold mb-6">Teams Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gameState.teams.map(team => (
            <div key={team.id} className="bg-[#0a0a2a] p-4 rounded-xl border border-white/5 relative overflow-hidden">
              {gameState.hotSeatTeamId === team.id && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />}
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold truncate pr-2">{team.name}</span>
                <span className="text-xs font-mono text-blue-400">ID: {team.id}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Score: <span className="text-white font-mono">{40 + team.hotSeatPoints + team.bonusPoints}</span></span>
                <span>FFF: <span className="text-white font-mono">{team.fffTime || '--'}ms</span></span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const AdminButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void, active: boolean, variant?: 'default' | 'success' | 'danger' }> = ({ icon, label, onClick, active, variant = 'default' }) => {
  const baseStyles = "flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all text-center space-y-2";
  const activeStyles = {
    default: "bg-blue-600/20 border-blue-500 text-blue-100 hover:bg-blue-600/30",
    success: "bg-green-600/20 border-green-500 text-green-100 hover:bg-green-600/30",
    danger: "bg-red-600/20 border-red-500 text-red-100 hover:bg-red-600/30"
  };
  const disabledStyles = "bg-[#0a0a2a] border-white/5 text-gray-600 cursor-not-allowed opacity-50";

  return (
    <button 
      onClick={active ? onClick : undefined}
      className={`${baseStyles} ${active ? activeStyles[variant] : disabledStyles}`}
    >
      <div className="w-8 h-8">{icon}</div>
      <span className="text-xs font-bold uppercase tracking-widest">{label}</span>
    </button>
  );
};

export default AdminLaptop;

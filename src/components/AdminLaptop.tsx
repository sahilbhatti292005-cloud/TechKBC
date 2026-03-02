import React, { useState } from 'react';
import { GameState } from '../types';
import { FFF_QUESTIONS, HOT_SEAT_QUESTIONS } from '../constants';
import { Play, Eye, Lock, Trophy, UserCheck, RefreshCw, CheckCircle, XCircle, Zap, Pause, Square } from 'lucide-react';
import { db } from '../lib/firebase';
import { ref, update, set, remove } from 'firebase/database';

interface AdminLaptopProps {
  gameState: GameState | null;
}

const AdminLaptop: React.FC<AdminLaptopProps> = ({ gameState }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  React.useEffect(() => {
    if (gameState?.timer.isRunning) {
      const interval = setInterval(() => {
        const remaining = Math.max(0, (gameState.timer.endTime || 0) - Date.now());
        setTimeLeft(Math.ceil(remaining / 1000));
        if (remaining === 0) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    } else if (gameState?.timer.isPaused) {
      setTimeLeft(Math.ceil(gameState.timer.remainingTime / 1000));
    } else {
      setTimeLeft(0);
    }
  }, [gameState?.timer.isRunning, gameState?.timer.isPaused, gameState?.timer.endTime, gameState?.timer.remainingTime]);

  const sendAction = async (action: string, payload: any = {}) => {
    const gameRef = ref(db, 'gameState');

    switch (action) {
      case 'START_FFF':
        if (!gameState) return;
        await update(gameRef, {
          phase: 'FFF_QUESTION',
          currentQuestion: payload.question,
          currentQuestionId: payload.question.id,
          fffSubmissions: null,
          lockedOption: null,
          revealCorrect: false
        });
        // Reset team FFF stats
        (gameState.teams || []).forEach(async (t) => {
          await update(ref(db, `gameState/teams/${t.id}`), { isCorrect: 0, fffTime: null });
        });
        break;
      case 'SHOW_FFF_OPTIONS':
        const fffDuration = 15000;
        await update(gameRef, {
          phase: 'FFF_OPTIONS',
          'timer/duration': fffDuration,
          'timer/startTime': Date.now(),
          'timer/endTime': Date.now() + fffDuration,
          'timer/remainingTime': fffDuration,
          'timer/isRunning': true,
          'timer/isPaused': false,
          'timer/type': 'FFF'
        });
        break;
      case 'LOCK_FFF':
        await update(gameRef, {
          phase: 'FFF_RESULT',
          'timer/isRunning': false,
          'timer/isPaused': false,
          'timer/startTime': null,
          'timer/endTime': null,
          'timer/remainingTime': 0,
          'timer/type': null
        });
        calculateFFFResults();
        break;
      case 'SEND_TO_HOT_SEAT':
        await update(gameRef, {
          phase: 'HOT_SEAT',
          hotSeatTeamId: payload.teamId,
          lifelines: { debugHelp: false, callDev: false, crowdSource: false },
          lockedOption: null,
          revealCorrect: false,
          'timer/isRunning': false,
          'timer/isPaused': false,
          'timer/startTime': null,
          'timer/endTime': null,
          'timer/remainingTime': 0,
          'timer/type': null
        });
        break;
      case 'START_HOT_SEAT_QUESTION':
        await update(gameRef, {
          phase: 'HOT_SEAT',
          currentQuestion: payload.question,
          currentQuestionId: payload.question.id,
          lockedOption: null,
          revealCorrect: false,
          'timer/isRunning': false,
          'timer/isPaused': false,
          'timer/startTime': null,
          'timer/endTime': null,
          'timer/remainingTime': 0,
          'timer/type': null
        });
        break;
      case 'START_TIMER':
        if (!gameState) return;
        const duration = payload.duration || 30000;
        await update(gameRef, {
          'timer/duration': duration,
          'timer/startTime': Date.now(),
          'timer/endTime': Date.now() + duration,
          'timer/remainingTime': duration,
          'timer/isRunning': true,
          'timer/isPaused': false,
          'timer/type': payload.type || 'HOT_SEAT'
        });
        break;
      case 'PAUSE_TIMER':
        if (!gameState || !gameState.timer.isRunning) return;
        const remaining = Math.max(0, (gameState.timer.endTime || 0) - Date.now());
        await update(gameRef, {
          'timer/isRunning': false,
          'timer/isPaused': true,
          'timer/remainingTime': remaining
        });
        break;
      case 'RESUME_TIMER':
        if (!gameState || !gameState.timer.isPaused) return;
        await update(gameRef, {
          'timer/isRunning': true,
          'timer/isPaused': false,
          'timer/startTime': Date.now(),
          'timer/endTime': Date.now() + gameState.timer.remainingTime
        });
        break;
      case 'STOP_TIMER':
        await update(gameRef, {
          'timer/isRunning': false,
          'timer/isPaused': false,
          'timer/startTime': null,
          'timer/endTime': null,
          'timer/remainingTime': 0,
          'timer/type': null
        });
        break;
      case 'LOCK_OPTION':
        await update(gameRef, { lockedOption: payload.optionIndex });
        break;
      case 'REVEAL_CORRECT':
        await update(gameRef, {
          revealCorrect: true,
          'timer/isRunning': false,
          'timer/isPaused': false,
          'timer/startTime': null,
          'timer/endTime': null,
          'timer/remainingTime': 0,
          'timer/type': null
        });
        break;
      case 'UPDATE_SCORE':
        const team = (gameState.teams || []).find(t => t.id === payload.teamId);
        if (team) {
          const updates: any = {};
          if (payload.type === 'hotSeat') updates.hotSeatPoints = (team.hotSeatPoints || 0) + payload.amount;
          if (payload.type === 'bonus') updates.bonusPoints = (team.bonusPoints || 0) + payload.amount;
          await update(ref(db, `gameState/teams/${payload.teamId}`), updates);
        }
        break;
      case 'ACTIVATE_LIFELINE':
        await set(ref(db, `gameState/lifelines/${payload.lifeline}`), true);
        if (payload.lifeline === 'crowdSource') {
          const crowdDuration = 15000;
          await update(gameRef, {
            phase: 'CROWD_SOURCE',
            crowdSourceVotes: { A: 0, B: 0, C: 0, D: 0 },
            'timer/duration': crowdDuration,
            'timer/startTime': Date.now(),
            'timer/endTime': Date.now() + crowdDuration,
            'timer/remainingTime': crowdDuration,
            'timer/isRunning': true,
            'timer/isPaused': false,
            'timer/type': 'HOT_SEAT'
          });
        }
        break;
      case 'RESET_GAME':
        await set(gameRef, {
          phase: 'LOBBY',
          cycle: 1,
          teams: null,
          currentQuestion: null,
          currentQuestionId: null,
          hotSeatTeamId: null,
          lifelines: { debugHelp: false, callDev: false, crowdSource: false },
          lockedOption: null,
          revealCorrect: false,
          timer: {
            duration: 0,
            startTime: null,
            endTime: null,
            remainingTime: 0,
            isRunning: false,
            isPaused: false,
            type: null
          }
        });
        break;
      case 'NEXT_CYCLE':
        await update(gameRef, {
          cycle: (gameState.cycle || 1) + 1,
          phase: 'LOBBY'
        });
        break;
      case 'REFRESH_TEAMS':
        // Not really needed for Firebase as it's real-time
        break;
    }
  };

  const calculateFFFResults = () => {
    if (!gameState || !gameState.currentQuestion) return;
    const correctOrder = gameState.currentQuestion.correctOrder;
    const submissions = gameState.fffSubmissions ? Object.values(gameState.fffSubmissions) : [];
    
    submissions.forEach(async (sub: any) => {
      const isCorrect = JSON.stringify(sub.submission) === JSON.stringify(correctOrder);
      await update(ref(db, `gameState/teams/${sub.teamId}`), {
        isCorrect: isCorrect ? 1 : 0,
        fffTime: sub.timeTaken
      });
    });
  };

  const currentHotSeatQuestion = HOT_SEAT_QUESTIONS[selectedDifficulty][questionIndex % HOT_SEAT_QUESTIONS[selectedDifficulty].length];
  const currentFFFQuestion = FFF_QUESTIONS[questionIndex % FFF_QUESTIONS.length];

  if (!gameState) {
    return (
      <div className="min-h-screen bg-[#0a0a2a] text-white flex flex-col items-center justify-center p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Database Initializing...</h1>
          <p className="text-gray-400">If this is your first time, click the button below to setup the game.</p>
        </div>
        <button 
          onClick={() => sendAction('RESET_GAME')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold flex items-center shadow-lg shadow-blue-500/20 transition-all"
        >
          <RefreshCw className="w-5 h-5 mr-2" /> INITIALIZE GAME DATABASE
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <header className="flex justify-between items-center bg-[#1a1a4a] p-6 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-2xl font-bold">Admin Control Panel</h1>
          <p className="text-gray-400 text-sm">Cycle {gameState.cycle} / 8 • Status: <span className="text-blue-400 font-mono">{gameState.phase}</span></p>
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
          {gameState.timer.type === 'FFF' && (
            <div className="text-center py-2 bg-[#0a0a2a] rounded-xl border border-white/5">
              <span className="text-2xl font-mono font-bold text-blue-400">{timeLeft}s</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <AdminButton 
              icon={<Play />} label="Start FFF" 
              onClick={() => sendAction('START_FFF', { question: currentFFFQuestion })} 
              active={gameState.phase === 'LOBBY'}
            />
            <AdminButton 
              icon={<Eye />} label="Show Options" 
              onClick={() => sendAction('SHOW_FFF_OPTIONS')} 
              active={gameState.phase === 'FFF_QUESTION'}
            />
            <AdminButton 
              icon={<Lock />} label="Lock Submissions" 
              onClick={() => sendAction('LOCK_FFF')} 
              active={gameState.phase === 'FFF_OPTIONS'}
            />
            <AdminButton 
              icon={<Trophy />} label="Show Leaderboard" 
              onClick={() => {}} 
              active={gameState.phase === 'FFF_RESULT'}
            />
          </div>
          
          {gameState.phase === 'FFF_RESULT' ? (
            <div className="mt-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-400 uppercase">Select Winner for Hot Seat</h3>
              <div className="space-y-2">
                {(gameState.teams || [])
                  .filter(t => t.isCorrect === 1)
                  .sort((a, b) => (a.fffTime || 0) - (b.fffTime || 0))
                  .map((team, index) => (
                    <button 
                      key={team.id || index}
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
                    {(gameState.teams || []).map((team, index) => (
                      <button 
                        key={team.id || index}
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
                {(gameState.teams || []).map((team, index) => (
                  <button 
                    key={team.id || index}
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
              active={gameState.phase === 'HOT_SEAT' || gameState.phase === 'FFF_RESULT'}
            />
            <div className="bg-[#0a0a2a] p-4 rounded-2xl border border-white/10 flex flex-col space-y-2">
              <span className="text-[10px] font-bold text-gray-500 uppercase text-center">Timer Controls</span>
              <div className="text-2xl font-mono font-bold text-center text-blue-400 mb-1">
                {timeLeft}s
              </div>
              <div className="flex space-x-2">
                {!gameState.timer.isRunning && !gameState.timer.isPaused ? (
                  <button 
                    onClick={() => {
                      const dur = selectedDifficulty === 'easy' ? 30000 : selectedDifficulty === 'medium' ? 45000 : 60000;
                      sendAction('START_TIMER', { duration: dur, type: 'HOT_SEAT' });
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 p-2 rounded-lg flex items-center justify-center"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                ) : gameState.timer.isRunning ? (
                  <button 
                    onClick={() => sendAction('PAUSE_TIMER')}
                    className="flex-1 bg-yellow-600 hover:bg-yellow-700 p-2 rounded-lg flex items-center justify-center"
                  >
                    <Pause className="w-4 h-4" />
                  </button>
                ) : (
                  <button 
                    onClick={() => sendAction('RESUME_TIMER')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 p-2 rounded-lg flex items-center justify-center"
                  >
                    <Play className="w-4 h-4" />
                  </button>
                )}
                <button 
                  onClick={() => sendAction('STOP_TIMER')}
                  className="flex-1 bg-red-600 hover:bg-red-700 p-2 rounded-lg flex items-center justify-center"
                >
                  <Square className="w-4 h-4" />
                </button>
              </div>
            </div>
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
              active={gameState.phase === 'HOT_SEAT' && gameState.lockedOption !== null && !gameState.revealCorrect}
            />
            <AdminButton 
              icon={<CheckCircle />} label="Mark Correct" 
              onClick={() => sendAction('UPDATE_SCORE', { teamId: gameState.hotSeatTeamId, type: 'hotSeat', amount: selectedDifficulty === 'easy' ? 30 : selectedDifficulty === 'medium' ? 50 : 100 })} 
              active={gameState.phase === 'HOT_SEAT' && gameState.revealCorrect}
              variant="success"
            />
            <AdminButton 
              icon={<XCircle />} label="Mark Wrong" 
              onClick={() => sendAction('UPDATE_SCORE', { teamId: gameState.hotSeatTeamId, type: 'hotSeat', amount: selectedDifficulty === 'easy' ? -10 : selectedDifficulty === 'medium' ? -20 : -30 })} 
              active={gameState.phase === 'HOT_SEAT' && gameState.revealCorrect}
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
          {(gameState.teams || []).map((team, index) => (
            <div key={team.id || index} className="bg-[#0a0a2a] p-4 rounded-xl border border-white/5 relative overflow-hidden">
              {gameState.hotSeatTeamId === team.id && <div className="absolute top-0 left-0 w-full h-1 bg-blue-500" />}
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold truncate pr-2">{team.name}</span>
                <span className="text-xs font-mono text-blue-400">ID: {team.id}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <span>Score: <span className="text-white font-mono">{40 + (team.hotSeatPoints || 0) + (team.bonusPoints || 0)}</span></span>
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

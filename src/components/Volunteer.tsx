import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState } from '../types';
import { CheckCircle, Clock, Vote, Lock } from 'lucide-react';
import { db } from '../lib/firebase';
import { ref, set, increment, update } from 'firebase/database';

interface VolunteerProps {
  gameState: GameState | null;
  teamId: string;
}

const Volunteer: React.FC<VolunteerProps> = ({ gameState, teamId }) => {
  const [selection, setSelection] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [voted, setVoted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (gameState?.timer.isRunning && gameState.timer.type === 'FFF') {
      const interval = setInterval(() => {
        const remaining = Math.max(0, (gameState.timer.endTime || 0) - Date.now());
        setTimeLeft(Math.ceil(remaining / 1000));
        if (remaining === 0) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setTimeLeft(0);
    }
  }, [gameState?.timer.isRunning, gameState?.timer.endTime, gameState?.timer.type]);

  useEffect(() => {
    // Team registration is handled in App.tsx login
  }, [teamId]);

  useEffect(() => {
    if (gameState?.phase === 'FFF_QUESTION') {
      setSubmitted(false);
      setSelection([]);
    }
    if (gameState?.phase === 'CROWD_SOURCE') {
      setVoted(false);
    }
  }, [gameState?.phase]);

  const handleSelect = async (index: number) => {
    if (selection.includes(index)) return;
    const newSelection = [...selection, index];
    setSelection(newSelection);

    if (newSelection.length === 4) {
      const timeTaken = Date.now() - (gameState?.timer.startTime || Date.now());
      await set(ref(db, `gameState/fffSubmissions/${teamId}`), {
        teamId,
        submission: newSelection,
        timeTaken
      });
      setSubmitted(true);
    }
  };

  const handleVote = async (option: string) => {
    await update(ref(db, 'gameState/crowdSourceVotes'), {
      [option]: increment(1)
    });
    setVoted(true);
  };

  if (!gameState) return (
    <div className="min-h-screen bg-[#0a0a2a] flex flex-col items-center justify-center text-white p-8 space-y-4">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-xl font-bold uppercase tracking-widest">Cognos Tech KBC</div>
      <div className="text-xl font-bold">Connecting to Game...</div>
      <p className="text-gray-400 text-sm text-center">Waiting for the Admin to start the session.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a2a] text-white p-6 flex flex-col">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-xl font-bold">Volunteer Mode</h1>
          <p className="text-xs text-gray-400 uppercase tracking-widest">Team: {localStorage.getItem('kbc_teamName')}</p>
        </div>
        <div className="bg-blue-600/20 px-3 py-1 rounded-full border border-blue-500/50 text-[10px] font-bold text-blue-400">
          CYCLE {gameState.cycle}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {gameState.phase === 'LOBBY' && (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-4"
          >
            <Clock className="w-16 h-16 text-blue-500 opacity-50 animate-pulse" />
            <h2 className="text-2xl font-bold">Waiting for Admin...</h2>
            <p className="text-gray-400 text-sm">The game will start shortly. Please keep this screen open.</p>
          </motion.div>
        )}

        {(gameState.phase === 'FFF_QUESTION' || gameState.phase === 'FFF_OPTIONS') && (
          <motion.div 
            key="fff"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-xl font-bold mb-6">{gameState.currentQuestion?.text}</h2>
            
            {gameState.phase === 'FFF_OPTIONS' && !submitted ? (
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-xs text-blue-400 uppercase tracking-widest">Tap options in the correct order</p>
                  <div className={`text-xl font-mono font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-blue-400'}`}>
                    {timeLeft}s
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {gameState.currentQuestion?.options.map((opt, i) => {
                    const orderIndex = selection.indexOf(i);
                    return (
                      <button 
                        key={i} 
                        onClick={() => handleSelect(i)}
                        disabled={orderIndex !== -1 || timeLeft === 0}
                        className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                          orderIndex !== -1 
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300 opacity-50' 
                            : timeLeft === 0
                            ? 'bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed'
                            : 'bg-[#1a1a4a] border-white/10 hover:border-blue-500'
                        }`}
                      >
                        <span className="font-bold">{opt}</span>
                        {orderIndex !== -1 && (
                          <span className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center font-black">
                            {orderIndex + 1}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
                
                {selection.length > 0 && (
                  <button 
                    onClick={() => setSelection([])}
                    className="mt-4 text-xs text-gray-400 underline"
                  >
                    Reset Selection
                  </button>
                )}
              </div>
            ) : submitted ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle className="w-20 h-20 text-green-500" />
                <h2 className="text-2xl font-bold">Answer Submitted!</h2>
                <p className="text-gray-400">Please wait for the results on the main screen.</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50">
                <Clock className="w-12 h-12 text-blue-400 animate-spin-slow" />
                <p className="text-gray-400">Admin is reading the question...</p>
              </div>
            )}
          </motion.div>
        )}

        {gameState.phase === 'CROWD_SOURCE' && (
          <motion.div 
            key="crowd_source"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col"
          >
            <h2 className="text-2xl font-bold mb-8 flex items-center"><Vote className="mr-3 text-blue-400" /> Audience Poll</h2>
            {!voted ? (
              <div className="grid grid-cols-1 gap-4">
                {['A', 'B', 'C', 'D'].map((opt) => (
                  <button 
                    key={opt}
                    onClick={() => handleVote(opt)}
                    className="bg-[#1a1a4a] hover:bg-blue-600/20 p-6 rounded-2xl border border-white/10 text-left flex items-center space-x-4 transition-colors"
                  >
                    <span className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center font-black text-xl">{opt}</span>
                    <span className="text-lg font-bold">Option {opt}</span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
                <CheckCircle className="w-20 h-20 text-green-500" />
                <h2 className="text-2xl font-bold">Vote Cast!</h2>
                <p className="text-gray-400">Your vote has been recorded. Watch the screen for results.</p>
              </div>
            )}
          </motion.div>
        )}

        {['HOT_SEAT', 'FFF_RESULT'].includes(gameState.phase) && (
          <motion.div 
            key="locked"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex-1 flex flex-col items-center justify-center text-center space-y-4 opacity-50"
          >
            <Lock className="w-16 h-16 text-gray-500" />
            <h2 className="text-xl font-bold">Interface Locked</h2>
            <p className="text-gray-400 text-sm">Gameplay is currently in progress on the main screen.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Volunteer;


import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Team } from '../types';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Text } from 'recharts';
import { Timer, Trophy, Users } from 'lucide-react';

interface DisplayProps {
  gameState: GameState | null;
}

const Display: React.FC<DisplayProps> = ({ gameState }) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (gameState?.timer.active) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - gameState.timer.start;
        const remaining = Math.max(0, gameState.timer.duration - elapsed);
        setTimeLeft(Math.ceil(remaining / 1000));
        if (remaining === 0) clearInterval(interval);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [gameState?.timer]);

  if (!gameState) return (
    <div className="min-h-screen bg-[#0a0a2a] flex flex-col items-center justify-center text-white space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-xl font-bold">Waiting for Game to Initialize...</div>
      <p className="text-gray-400 text-sm">The Admin needs to setup the game database.</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a2a] text-white p-8 font-sans overflow-hidden">
      <AnimatePresence mode="wait">
        {gameState.status === 'LOBBY' && (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center space-y-8"
          >
            <h1 className="text-6xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              COGNOS TAV TECH KBC
            </h1>
            <div className="text-2xl font-mono text-blue-300">CYCLE {gameState.currentCycle} / 8</div>
            <div className="grid grid-cols-4 gap-4 w-full max-w-4xl">
              {gameState.teams.map((team, i) => (
                <div key={team.id} className="bg-[#1a1a4a] p-4 rounded-xl border border-white/10 text-center">
                  <div className="text-xs text-gray-400 mb-1">TEAM {i + 1}</div>
                  <div className="font-bold truncate">{team.name}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {(gameState.status === 'FFF_QUESTION' || gameState.status === 'FFF_OPTIONS') && (
          <motion.div 
            key="fff"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center"
          >
            <div className="text-blue-400 text-sm uppercase tracking-widest mb-4">Fastest Finger First</div>
            <h2 className="text-4xl font-bold text-center mb-12 max-w-4xl">{gameState.currentQuestion?.text}</h2>
            
            {gameState.status === 'FFF_OPTIONS' && (
              <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
                {gameState.currentQuestion?.options.map((opt, i) => (
                  <div key={i} className="bg-[#1a1a4a] p-6 rounded-2xl border-2 border-blue-500/30 flex items-center space-x-4">
                    <span className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">{String.fromCharCode(65 + i)}</span>
                    <span className="text-xl">{opt}</span>
                  </div>
                ))}
              </div>
            )}

            {gameState.timer.active && (
              <div className="mt-12 relative w-32 h-32 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90">
                  <circle 
                    cx="64" cy="64" r="60" 
                    fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="8" 
                  />
                  <motion.circle 
                    cx="64" cy="64" r="60" 
                    fill="transparent" stroke={timeLeft <= 5 ? "#ef4444" : "#3b82f6"} strokeWidth="8" 
                    strokeDasharray="377"
                    animate={{ strokeDashoffset: 377 - (377 * (timeLeft / (gameState.timer.duration / 1000))) }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </svg>
                <div className={`absolute text-4xl font-mono font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : ''}`}>
                  {timeLeft}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {gameState.status === 'FFF_RESULT' && (
          <motion.div 
            key="fff_result"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full max-w-6xl mx-auto"
          >
            <h2 className="text-3xl font-bold text-center mb-8">Fastest Finger Results</h2>
            <div className="bg-[#1a1a4a] rounded-3xl border border-white/10 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-blue-900/50 text-blue-300 text-xs uppercase tracking-widest">
                  <tr>
                    <th className="p-4">Rank</th>
                    <th className="p-4">Team Name</th>
                    <th className="p-4">Time (ms)</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {gameState.teams
                    .filter(t => t.fffTime !== undefined)
                    .sort((a, b) => (a.fffTime || 0) - (b.fffTime || 0))
                    .map((team, i) => (
                      <tr key={team.id} className={team.isCorrect === 1 ? "bg-green-500/10" : "bg-red-500/10"}>
                        <td className="p-4 font-mono">{i + 1}</td>
                        <td className="p-4 font-bold">{team.name}</td>
                        <td className="p-4 font-mono">{team.fffTime}ms</td>
                        <td className="p-4">
                          {team.isCorrect === 1 ? (
                            <span className="text-green-400 flex items-center"><Trophy className="w-4 h-4 mr-1" /> Correct</span>
                          ) : (
                            <span className="text-red-400">Incorrect</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {gameState.status === 'HOT_SEAT' && (
          <motion.div 
            key="hot_seat"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center"
          >
            <div className="flex items-center space-x-8 mb-12">
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase">Current Team</div>
                <div className="text-3xl font-bold text-blue-400">
                  {gameState.teams.find(t => t.id === gameState.hotSeatTeamId)?.name}
                </div>
              </div>
              <div className="h-12 w-px bg-white/20" />
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase">Current Score</div>
                <div className="text-3xl font-mono font-bold text-yellow-500">
                  {40 + (gameState.teams.find(t => t.id === gameState.hotSeatTeamId)?.hotSeatPoints || 0) + (gameState.teams.find(t => t.id === gameState.hotSeatTeamId)?.bonusPoints || 0)}
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a4a] p-12 rounded-3xl border-2 border-blue-500/30 w-full max-w-5xl relative">
              <h2 className="text-4xl font-bold text-center mb-12">{gameState.currentQuestion?.text}</h2>
              <div className="grid grid-cols-2 gap-6">
                {gameState.currentQuestion?.options.map((opt, i) => {
                  const isLocked = gameState.lockedOption === i;
                  const isCorrect = gameState.currentQuestion?.correctIndex === i;
                  const showReveal = gameState.revealCorrect;
                  
                  let bgColor = 'bg-[#0a0a2a] border-white/10';
                  let textColor = '';
                  let iconColor = 'bg-blue-600';

                  if (showReveal) {
                    if (isCorrect) {
                      bgColor = 'bg-green-600/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)]';
                      textColor = 'text-green-400 font-bold';
                      iconColor = 'bg-green-600';
                    } else if (isLocked) {
                      bgColor = 'bg-red-600/20 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]';
                      textColor = 'text-red-400 font-bold';
                      iconColor = 'bg-red-600';
                    }
                  } else if (isLocked) {
                    bgColor = 'bg-yellow-500/20 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]';
                    textColor = 'text-yellow-400 font-bold';
                    iconColor = 'bg-yellow-500 text-black';
                  }

                  return (
                    <div 
                      key={i} 
                      className={`p-6 rounded-2xl border transition-all flex items-center space-x-4 ${bgColor}`}
                    >
                      <span className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${iconColor}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className={`text-xl ${textColor}`}>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-12 flex space-x-8">
              <LifelineIcon active={gameState.lifelines.debugHelp} label="Debug Help" cost="-20" />
              <LifelineIcon active={gameState.lifelines.callDev} label="Call Dev" cost="-10" />
              <LifelineIcon active={gameState.lifelines.crowdSource} label="Crowd Source" cost="-5" />
            </div>
          </motion.div>
        )}

        {gameState.status === 'CROWD_SOURCE' && (
          <motion.div 
            key="crowd_source"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="h-full flex flex-col items-center justify-center w-full max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold mb-12 flex items-center"><Users className="mr-4 w-10 h-10 text-blue-400" /> Audience Poll</h2>
            <div className="h-[400px] w-full bg-[#1a1a4a] p-8 rounded-3xl border border-white/10">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={Object.entries(gameState.crowdSourceVotes).map(([name, value]) => ({ name, value }))}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis hide />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                    {Object.entries(gameState.crowdSourceVotes).map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#8b5cf6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-4 gap-8 w-full mt-8">
              {Object.entries(gameState.crowdSourceVotes).map(([name, value]) => {
                const total = Object.values(gameState.crowdSourceVotes).reduce((a, b) => (a as number) + (b as number), 0) as number;
                const percent = total === 0 ? 0 : Math.round(((value as number) / total) * 100);
                return (
                  <div key={name} className="text-center">
                    <div className="text-4xl font-black text-blue-400">{percent}%</div>
                    <div className="text-gray-400 uppercase tracking-widest text-sm">Option {name}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Leaderboard at the bottom during certain states */}
      {['LOBBY', 'GAME_OVER', 'FFF_RESULT', 'HOT_SEAT'].includes(gameState.status) && (
        <div className="fixed bottom-8 left-8 right-8">
          <div className="bg-[#1a1a4a]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold mb-4 flex items-center"><Trophy className="mr-2 text-yellow-500" /> Live Leaderboard</h3>
            <div className="grid grid-cols-5 gap-4">
              {gameState.teams
                .sort((a, b) => (40 + (b.hotSeatPoints as number) + (b.bonusPoints as number)) - (40 + (a.hotSeatPoints as number) + (a.bonusPoints as number)))
                .slice(0, 5)
                .map((team, i) => (
                  <div key={team.id} className="bg-[#0a0a2a] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono text-gray-500">#{i + 1}</span>
                      <span className="font-bold truncate max-w-[150px]">{team.name}</span>
                    </div>
                    <span className="font-mono text-blue-400">{40 + (team.hotSeatPoints as number) + (team.bonusPoints as number)}</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const LifelineIcon: React.FC<{ active: boolean, label: string, cost: string }> = ({ active, label, cost }) => (
  <div className={`flex flex-col items-center transition-opacity ${active ? 'opacity-100' : 'opacity-20'}`}>
    <div className={`w-16 h-16 rounded-full border-2 flex items-center justify-center mb-2 ${active ? 'border-blue-500 bg-blue-500/20' : 'border-white/20'}`}>
      <span className="text-xs font-bold">{cost}</span>
    </div>
    <span className="text-[10px] uppercase tracking-widest text-gray-400">{label}</span>
  </div>
);

export default Display;

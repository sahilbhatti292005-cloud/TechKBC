import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Team, Role } from '../types';
import { BarChart, Bar, XAxis, YAxis, Cell, ResponsiveContainer, Text } from 'recharts';
import { Timer, Trophy, Users, Split, Phone } from 'lucide-react';

interface DisplayProps {
  gameState: GameState | null;
  role: Role | null;
}

const Display: React.FC<DisplayProps> = ({ gameState, role }) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const questionAudioRef = useRef<HTMLAudioElement | null>(null);
  const correctAudioRef = useRef<HTMLAudioElement | null>(null);
  const wrongAudioRef = useRef<HTMLAudioElement | null>(null);
  const lockAudioRef = useRef<HTMLAudioElement | null>(null);
  const fffTimerAudioRef = useRef<HTMLAudioElement | null>(null);
  const crowdSourceAudioRef = useRef<HTMLAudioElement | null>(null);
  const fffWinnerAudioRef = useRef<HTMLAudioElement | null>(null);
  const bellSmallAudioRef = useRef<HTMLAudioElement | null>(null);
  const bellLargeAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastTimerStartRef = useRef<number | null>(null);
  const lastQuestionTriggerRef = useRef<number | null>(null);
  const lastAnswerTriggerRef = useRef<number | null>(null);
  const lastLockTriggerRef = useRef<number | null>(null);
  const lastFffTimerTriggerRef = useRef<number | null>(null);
  const lastCrowdSourceTriggerRef = useRef<number | null>(null);
  const lastFffWinnerTriggerRef = useRef<number | null>(null);
  const lastBellSmallTriggerRef = useRef<number | null>(null);
  const lastBellLargeTriggerRef = useRef<number | null>(null);
  const isFirstRender = useRef(true);

  // Initialize audio once and handle cleanup
  useEffect(() => {
    if (role !== 'display') return;

    const audio = new Audio('/soundeffect/KBCTimer.mp3');
    const qAudio = new Audio('/soundeffect/kbc-question.mp3');
    const cAudio = new Audio('/soundeffect/corectanswer.mp3');
    const wAudio = new Audio('/soundeffect/wronganswer.mp3');
    const lAudio = new Audio('/soundeffect/lockoption.mp3');
    const fffAudio = new Audio('/soundeffect/ffftimer.mp3');
    const csAudio = new Audio('/soundeffect/crowdsource.mp3');
    const fffWAudio = new Audio('/soundeffect/fffwinner.mp3');
    const bsAudio = new Audio('/soundeffect/fffwinner.mp3');
    const blAudio = new Audio('/soundeffect/kbclarge.mp3');
    audioRef.current = audio;
    questionAudioRef.current = qAudio;
    correctAudioRef.current = cAudio;
    wrongAudioRef.current = wAudio;
    lockAudioRef.current = lAudio;
    fffTimerAudioRef.current = fffAudio;
    crowdSourceAudioRef.current = csAudio;
    fffWinnerAudioRef.current = fffWAudio;
    bellSmallAudioRef.current = bsAudio;
    bellLargeAudioRef.current = blAudio;
    
    return () => {
      audio.pause();
      audio.src = "";
      audioRef.current = null;
      qAudio.pause();
      qAudio.src = "";
      questionAudioRef.current = null;
      cAudio.pause();
      cAudio.src = "";
      correctAudioRef.current = null;
      wAudio.pause();
      wAudio.src = "";
      wrongAudioRef.current = null;
      lAudio.pause();
      lAudio.src = "";
      lockAudioRef.current = null;
      fffAudio.pause();
      fffAudio.src = "";
      fffTimerAudioRef.current = null;
      csAudio.pause();
      csAudio.src = "";
      crowdSourceAudioRef.current = null;
      fffWAudio.pause();
      fffWAudio.src = "";
      fffWinnerAudioRef.current = null;
      bsAudio.pause();
      bsAudio.src = "";
      bellSmallAudioRef.current = null;
      blAudio.pause();
      blAudio.src = "";
      bellLargeAudioRef.current = null;
    };
  }, [role]);

  // Sync triggers on mount to prevent play-on-mount
  useEffect(() => {
    if (gameState && isFirstRender.current) {
      lastQuestionTriggerRef.current = gameState.questionTrigger || null;
      lastAnswerTriggerRef.current = gameState.answerTrigger || null;
      lastLockTriggerRef.current = gameState.lockTrigger || null;
      lastFffTimerTriggerRef.current = gameState.fffTimerTrigger || null;
      lastCrowdSourceTriggerRef.current = gameState.crowdSourceTrigger || null;
      lastFffWinnerTriggerRef.current = gameState.fffWinnerTrigger || null;
      lastBellSmallTriggerRef.current = gameState.bellSmallTrigger || null;
      lastBellLargeTriggerRef.current = gameState.bellLargeTrigger || null;
      isFirstRender.current = false;
    }
  }, [gameState]);

  // Handle question start sound
  useEffect(() => {
    if (role !== 'display') return;

    const audio = questionAudioRef.current;
    if (!audio || !gameState?.questionTrigger) return;

    if (gameState.questionTrigger !== lastQuestionTriggerRef.current) {
      // Interrupt lock audio
      if (lockAudioRef.current) {
        lockAudioRef.current.pause();
        lockAudioRef.current.currentTime = 0;
      }
      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(err => console.warn("Question audio play failed:", err));
      lastQuestionTriggerRef.current = gameState.questionTrigger;
    }
  }, [gameState?.questionTrigger, role]);

  // Handle answer result sound
  useEffect(() => {
    if (role !== 'display') return;

    const correctAudio = correctAudioRef.current;
    const wrongAudio = wrongAudioRef.current;
    if (!correctAudio || !wrongAudio || !gameState?.answerTrigger || !gameState.currentQuestion) return;

    if (gameState.answerTrigger !== lastAnswerTriggerRef.current) {
      // Interrupt lock audio
      if (lockAudioRef.current) {
        lockAudioRef.current.pause();
        lockAudioRef.current.currentTime = 0;
      }
      // Stop both before playing
      correctAudio.pause();
      correctAudio.currentTime = 0;
      wrongAudio.pause();
      wrongAudio.currentTime = 0;

      const isCorrect = gameState.lockedOption === gameState.currentQuestion.correctIndex;
      const targetAudio = isCorrect ? correctAudio : wrongAudio;

      targetAudio.play().catch(err => console.warn("Answer audio play failed:", err));
      lastAnswerTriggerRef.current = gameState.answerTrigger;
    }
  }, [gameState?.answerTrigger, gameState?.lockedOption, gameState?.currentQuestion, role]);

  // Handle lock option sound
  useEffect(() => {
    if (role !== 'display') return;

    const audio = lockAudioRef.current;
    if (!audio || !gameState?.lockTrigger) return;

    if (gameState.lockTrigger !== lastLockTriggerRef.current) {
      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(err => console.warn("Lock audio play failed:", err));
      lastLockTriggerRef.current = gameState.lockTrigger;
    }
  }, [gameState?.lockTrigger, role]);

  // Handle FFF Timer sound
  useEffect(() => {
    if (role !== 'display') return;

    const audio = fffTimerAudioRef.current;
    if (!audio || !gameState?.fffTimerTrigger) return;

    if (gameState.fffTimerTrigger !== lastFffTimerTriggerRef.current) {
      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(err => console.warn("FFF Timer audio play failed:", err));
      lastFffTimerTriggerRef.current = gameState.fffTimerTrigger;
    }
  }, [gameState?.fffTimerTrigger, role]);

  // Handle Crowd Source sound
  useEffect(() => {
    if (role !== 'display') return;

    const audio = crowdSourceAudioRef.current;
    if (!audio || !gameState?.crowdSourceTrigger) return;

    if (gameState.crowdSourceTrigger !== lastCrowdSourceTriggerRef.current) {
      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(err => console.warn("Crowd Source audio play failed:", err));
      lastCrowdSourceTriggerRef.current = gameState.crowdSourceTrigger;
    }
  }, [gameState?.crowdSourceTrigger, role]);

  // Handle FFF Winner sound
  useEffect(() => {
    if (role !== 'display') return;

    const audio = fffWinnerAudioRef.current;
    if (!audio || !gameState?.fffWinnerTrigger) return;

    if (gameState.fffWinnerTrigger !== lastFffWinnerTriggerRef.current) {
      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(err => console.warn("FFF Winner audio play failed:", err));
      lastFffWinnerTriggerRef.current = gameState.fffWinnerTrigger;
    }
  }, [gameState?.fffWinnerTrigger, role]);

  // Handle Bell Small sound
  useEffect(() => {
    if (role !== 'display') return;

    const audio = bellSmallAudioRef.current;
    if (!audio || !gameState?.bellSmallTrigger) return;

    if (gameState.bellSmallTrigger !== lastBellSmallTriggerRef.current) {
      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(err => console.warn("Bell Small audio play failed:", err));
      lastBellSmallTriggerRef.current = gameState.bellSmallTrigger;
    }
  }, [gameState?.bellSmallTrigger, role]);

  // Handle Bell Large sound
  useEffect(() => {
    if (role !== 'display') return;

    const audio = bellLargeAudioRef.current;
    if (!audio || !gameState?.bellLargeTrigger) return;

    if (gameState.bellLargeTrigger !== lastBellLargeTriggerRef.current) {
      audio.pause();
      audio.currentTime = 0;
      audio.play().catch(err => console.warn("Bell Large audio play failed:", err));
      lastBellLargeTriggerRef.current = gameState.bellLargeTrigger;
    }
  }, [gameState?.bellLargeTrigger, role]);

  // Handle lock audio interruption for other actions (Lifelines, Phase changes)
  useEffect(() => {
    if (role !== 'display') return;
    const audio = lockAudioRef.current;
    if (!audio) return;

    // If phase changes or lifeline is activated, stop lock audio
    // We exclude the triggers handled in their own effects to avoid double logic, 
    // but adding them here is safer for "any other control button".
    audio.pause();
    audio.currentTime = 0;
  }, [gameState?.phase, gameState?.activeLifeline, gameState?.revealCorrect, role]);

  // Handle audio playback logic
  useEffect(() => {
    if (role !== 'display') return;

    const audio = audioRef.current;
    if (!audio || !gameState) return;

    const isHotSeatPhase = ['HOT_SEAT_QUESTION', 'HOT_SEAT_OPTIONS'].includes(gameState.phase);
    const isCallDevPhase = gameState.phase === 'CALL_DEV';
    const isTimerRunning = gameState.timer.isRunning;
    const isTimerPaused = gameState.timer.isPaused;
    const timerType = gameState.timer.type;
    const difficulty = gameState.currentQuestion?.difficulty;

    // Determine if audio should be active for current state
    const shouldBeActive = (isHotSeatPhase && timerType === 'HOT_SEAT') || isCallDevPhase;
    const isTimerFinished = timeLeft === 0 && !isTimerPaused;

    if (shouldBeActive && isTimerRunning && timeLeft > 0) {
      // Check if this is a new timer session
      if (gameState.timer.startTime !== lastTimerStartRef.current) {
        audio.currentTime = 0;
        lastTimerStartRef.current = gameState.timer.startTime;
      }
      
      // Set looping behavior
      // Call Dev: loop full 60s. Hot Seat: no loop.
      audio.loop = isCallDevPhase;
      
      // Play audio
      audio.play().catch(err => console.warn("Audio play failed:", err));

      // Enforce duration limits for Hot Seat
      if (isHotSeatPhase) {
        let maxDuration = 60;
        if (difficulty === 'easy') maxDuration = 30;
        if (difficulty === 'medium') maxDuration = 45;
        
        const checkTime = () => {
          if (audio.currentTime >= maxDuration) {
            audio.pause();
            audio.currentTime = maxDuration;
            audio.removeEventListener('timeupdate', checkTime);
          }
        };
        audio.addEventListener('timeupdate', checkTime);
        return () => audio.removeEventListener('timeupdate', checkTime);
      }
    } else if (shouldBeActive && isTimerPaused && timeLeft > 0) {
      audio.pause();
    } else {
      // Stop and Reset
      audio.pause();
      audio.currentTime = 0;
      if (!isTimerPaused) {
        lastTimerStartRef.current = null;
      }
    }
  }, [
    gameState?.timer.isRunning, 
    gameState?.timer.isPaused, 
    gameState?.timer.startTime,
    gameState?.timer.type, 
    gameState?.phase, 
    gameState?.currentQuestion?.difficulty,
    timeLeft
  ]);

  useEffect(() => {
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

  if (!gameState) return (
    <div className="min-h-screen bg-[#0a0a2a] flex flex-col items-center justify-center text-white space-y-4">
      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-xl font-bold">Waiting for Game to Initialize...</div>
      <p className="text-gray-400 text-sm">The Admin needs to setup the game database.</p>
    </div>
  );

  return (
    <div className={`h-screen w-screen bg-[#0a0a2a] text-white p-12 font-sans overflow-hidden flex flex-col items-center relative ${gameState.phase === 'FFF_RESULT' ? 'justify-start pt-20' : 'justify-center'}`}>
      <AnimatePresence mode="wait">
        {gameState.isTimeOut ? (
          <motion.div
            key="timeout"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            <div className="text-[12rem] font-black text-red-600 tracking-tighter leading-none drop-shadow-[0_0_50px_rgba(220,38,38,0.5)]">
              TIME OUT
            </div>
            <div className="h-2 w-64 bg-red-600 rounded-full animate-pulse" />
          </motion.div>
        ) : !gameState.isTimeOut && gameState.phase === 'LOBBY' && (
          <motion.div 
            key="lobby"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="w-full h-full flex flex-col items-center justify-start space-y-6 pt-4 pb-48"
          >
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
                COGNOTSAV TECH KBC
              </h1>
              <div className="text-base font-mono text-blue-300 opacity-80 uppercase tracking-widest">Cycle {gameState.cycle} / 10</div>
            </div>
            
            <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-3 w-full px-6 overflow-y-auto max-h-[calc(100vh-280px)] custom-scrollbar">
              {(gameState.teams || []).map((team, i) => (
                <div key={team.id} className="bg-[#1a1a4a]/60 backdrop-blur-sm p-2 rounded-lg border border-white/10 text-center shadow-lg hover:border-blue-500/50 transition-colors">
                  <div className="text-[8px] text-blue-400 font-bold tracking-widest mb-0.5 uppercase opacity-70">Team {i + 1}</div>
                  <div className="text-sm font-bold truncate text-white">{team.name}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {!gameState.isTimeOut && (gameState.phase === 'FFF_QUESTION' || gameState.phase === 'FFF_OPTIONS') && (
          <motion.div 
            key="fff"
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full"
          >
            <div className="text-blue-400 text-sm uppercase tracking-widest mb-4">Fastest Finger First</div>
            <h2 className="text-4xl font-bold text-center mb-12 max-w-4xl">{gameState.currentQuestion?.text}</h2>
            
            {gameState.phase === 'FFF_OPTIONS' && (
              <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
                {gameState.currentQuestion?.options.map((opt, i) => (
                  <div key={i} className="bg-[#1a1a4a] p-6 rounded-2xl border-2 border-blue-500/30 flex items-center space-x-4">
                    <span className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">{String.fromCharCode(65 + i)}</span>
                    <span className="text-xl">{opt}</span>
                  </div>
                ))}
              </div>
            )}

            {gameState.timer.type === 'FFF' && (
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
                    animate={{ 
                      strokeDashoffset: 377 - (377 * Math.min(1, Math.max(0, timeLeft / (gameState.timer.duration / 1000)))) 
                    }}
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

        {!gameState.isTimeOut && gameState.phase === 'FFF_RESULT' && (
          <motion.div 
            key="fff_result"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-[1200px] px-8 flex flex-col items-center"
          >
            <h2 className="text-5xl font-black text-center mb-12 tracking-tight text-white">
              Fastest Finger Results
            </h2>
            
            <div className="w-full bg-[#15153a] rounded-2xl shadow-2xl overflow-hidden border border-white/5">
              {/* Header */}
              <div className="flex items-center h-[60px] px-[30px] bg-[#1e1e4a] text-blue-300 text-[11px] font-bold uppercase tracking-widest border-b border-white/5">
                <div className="w-[80px] text-center">Rank</div>
                <div className="flex-1 text-left ml-4">Team Name</div>
                <div className="w-[140px] text-center">Time (s)</div>
                <div className="w-[150px] text-center">Status</div>
                <div className="w-[140px] text-right">Total Points</div>
              </div>

              {/* Rows */}
              <div className="divide-y divide-white/5">
                {(gameState.teams || [])
                  .sort((a, b) => {
                    // First priority: Correctness (1 comes before 0)
                    if (a.isCorrect !== b.isCorrect) {
                      return b.isCorrect - a.isCorrect;
                    }
                    // Second priority: Time (ascending)
                    const timeA = (a.fffTime && a.fffTime < 999999) ? a.fffTime : 999999999;
                    const timeB = (b.fffTime && b.fffTime < 999999) ? b.fffTime : 999999999;
                    return timeA - timeB;
                  })
                  .map((team, i) => (
                    <div 
                      key={team.id} 
                      className={`flex items-center h-[65px] px-[30px] transition-colors hover:bg-white/5 ${
                        i % 2 === 0 ? 'bg-white/[0.02]' : 'bg-transparent'
                      }`}
                    >
                      <div className="w-[80px] text-center font-mono text-gray-400">
                        {i + 1}
                      </div>
                      <div className="flex-1 text-left ml-4 font-bold text-lg truncate text-white">
                        {team.name}
                      </div>
                      <div className="w-[140px] text-center font-mono text-blue-400">
                        {team.fffTime && isFinite(team.fffTime) && team.fffTime < 999999 
                          ? `${(team.fffTime / 1000).toFixed(3)}s` 
                          : "—"}
                      </div>
                      <div className="w-[150px] flex justify-center">
                        {team.isCorrect === 1 ? (
                          <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold flex items-center border border-green-500/30">
                            <Trophy className="w-3 h-3 mr-1" /> Correct
                          </div>
                        ) : (
                          <div className="bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
                            Incorrect
                          </div>
                        )}
                      </div>
                      <div className="w-[140px] text-right font-mono font-bold text-xl text-yellow-500">
                        {40 + (team.hotSeatPoints || 0) + (team.bonusPoints || 0)}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {!gameState.isTimeOut && ['HOT_SEAT', 'HOT_SEAT_QUESTION', 'HOT_SEAT_OPTIONS'].includes(gameState.phase) && !gameState.activeLifeline && (
          <motion.div 
            key="hot_seat"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full"
          >
            <div className="flex items-center space-x-12 mb-12">
              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase">Current Team</div>
                <div className="text-3xl font-bold text-blue-400">
                  {gameState.teams.find(t => t.id === gameState.hotSeatTeamId)?.name}
                </div>
              </div>

              {gameState.timer.type === 'HOT_SEAT' && (
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="56" cy="56" r="52" fill="transparent" stroke="rgba(255,255,255,0.1)" strokeWidth="4" />
                    <motion.circle 
                      cx="56" cy="56" r="52" fill="transparent" stroke={timeLeft <= 10 ? "#ef4444" : "#3b82f6"} strokeWidth="4" 
                      strokeDasharray="326"
                      animate={{ 
                        strokeDashoffset: 326 - (326 * Math.min(1, Math.max(0, timeLeft / (gameState.timer.duration / 1000)))) 
                      }}
                      transition={{ duration: 1, ease: "linear" }}
                    />
                  </svg>
                  <div className={`absolute text-3xl font-mono font-bold ${timeLeft <= 10 ? 'text-red-500 animate-pulse' : ''}`}>
                    {timeLeft}
                  </div>
                </div>
              )}

              <div className="text-center">
                <div className="text-xs text-gray-400 uppercase">Current Score</div>
                <div className="text-3xl font-mono font-bold text-yellow-500">
                  {40 + (gameState.teams.find(t => t.id === gameState.hotSeatTeamId)?.hotSeatPoints || 0) + (gameState.teams.find(t => t.id === gameState.hotSeatTeamId)?.bonusPoints || 0)}
                </div>
              </div>
            </div>

            <div className="bg-[#1a1a4a] p-12 rounded-3xl border-2 border-blue-500/30 w-full max-w-5xl relative">
              {gameState.phase === 'HOT_SEAT' ? (
                <div className="text-center py-12">
                  <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter">Congratulations!</h2>
                  <p className="text-2xl text-blue-400 font-bold">
                    {gameState.teams.find(t => t.id === gameState.hotSeatTeamId)?.name} is in the Hot Seat!
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-center mb-12">{gameState.currentQuestion?.text}</h2>
                  {gameState.phase !== 'HOT_SEAT_QUESTION' && (
                    <div className="grid grid-cols-2 gap-6">
                      {gameState.currentQuestion?.options.map((opt, i) => {
                        const isRemoved = gameState.removedOptions?.includes(i);
                        if (isRemoved) return <div key={i} className="p-6 rounded-2xl border border-transparent opacity-0" />;
                        
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
                  )}
                </>
              )}
            </div>

            <div className="mt-12 flex space-x-8">
              <LifelineIcon active={gameState.lifelines.debugHelp} label="Debug Help" cost="-20" />
              <LifelineIcon active={gameState.lifelines.callDev} label="Call Dev" cost="-10" />
              <LifelineIcon active={gameState.lifelines.crowdSource} label="Crowd Source" cost="-5" />
            </div>
          </motion.div>
        )}

        {!gameState.isTimeOut && gameState.activeLifeline && gameState.phase !== 'CALL_DEV' && (
          <motion.div 
            key="lifeline_logo"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-12 w-full"
          >
            <div className="p-20 bg-blue-600/10 rounded-full border-8 border-blue-500/50 shadow-[0_0_80px_rgba(59,130,246,0.3)] relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-4 border-dashed border-blue-400/20 rounded-full scale-110"
              />
              {gameState.activeLifeline === 'debugHelp' && <Split className="w-48 h-48 text-blue-400" />}
              {gameState.activeLifeline === 'callDev' && <Phone className="w-48 h-48 text-blue-400" />}
              {gameState.activeLifeline === 'crowdSource' && <Users className="w-48 h-48 text-blue-400" />}
            </div>
            <div className="text-center space-y-4">
              <h2 className="text-6xl font-black uppercase tracking-[0.3em] text-white drop-shadow-2xl">
                {gameState.activeLifeline === 'debugHelp' ? 'Debug Help' : 
                 gameState.activeLifeline === 'callDev' ? 'Call Dev' : 'Crowdsource'}
              </h2>
              <div className="inline-block px-6 py-2 bg-blue-500/20 border border-blue-500/30 rounded-full text-blue-400 font-bold tracking-widest uppercase text-sm animate-pulse">
                Lifeline Active
              </div>
            </div>
          </motion.div>
        )}

        {!gameState.isTimeOut && gameState.phase === 'CALL_DEV' && (
          <motion.div 
            key="call_dev_timer"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full max-w-4xl"
          >
            <div className="flex justify-between items-center w-full mb-12">
              <h2 className="text-4xl font-bold flex items-center"><Phone className="mr-4 w-10 h-10 text-orange-400" /> Call Dev</h2>
              {timeLeft > 0 && (
                <div className="bg-orange-600/20 px-6 py-2 rounded-2xl border border-orange-500/50 flex items-center space-x-4">
                  <Timer className="w-8 h-8 text-orange-400 animate-pulse" />
                  <span className="text-4xl font-mono font-bold text-orange-400">{timeLeft}s</span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-8 p-12 bg-[#1a1a4a] rounded-3xl border border-white/10 w-full">
               <Phone className="w-32 h-32 text-orange-400 animate-bounce" />
               <p className="text-2xl text-center text-gray-400">Calling the developer...</p>
            </div>
          </motion.div>
        )}

        {!gameState.isTimeOut && gameState.phase === 'CROWD_SOURCE' && (
          <motion.div 
            key="crowd_source"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center w-full max-w-4xl"
          >
            <div className="flex justify-between items-center w-full mb-12">
              <h2 className="text-4xl font-bold flex items-center"><Users className="mr-4 w-10 h-10 text-blue-400" /> Crowd Source</h2>
              {timeLeft > 0 && (
                <div className="bg-blue-600/20 px-6 py-2 rounded-2xl border border-blue-500/50 flex items-center space-x-4">
                  <Timer className="w-8 h-8 text-blue-400 animate-pulse" />
                  <span className="text-4xl font-mono font-bold text-blue-400">{timeLeft}s</span>
                </div>
              )}
            </div>
            
            <div className="h-[400px] w-full bg-[#1a1a4a] p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              {timeLeft > 0 && (
                <div className="absolute inset-0 bg-[#0a0a2a]/40 backdrop-blur-sm z-10 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="text-6xl font-black text-white tracking-widest animate-bounce">VOTING OPEN</div>
                    <div className="text-blue-400 font-bold uppercase tracking-widest">Cast your votes now!</div>
                  </div>
                </div>
              )}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={Object.entries(gameState.crowdSourceVotes).map(([name, value]) => {
                    const total = Object.values(gameState.crowdSourceVotes).reduce((a, b) => (a as number) + (b as number), 0) as number;
                    const percent = total === 0 ? 0 : ((value as number) / total) * 100;
                    return { name, value: percent };
                  })}
                >
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis hide domain={[0, 100]} />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} isAnimationActive={true}>
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
                    <div className="text-4xl font-black text-blue-400">{timeLeft > 0 ? '??' : `${percent}%`}</div>
                    <div className="text-gray-400 uppercase tracking-widest text-sm">Option {name}</div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Persistent Leaderboard at the bottom during certain states */}
      {!gameState.isTimeOut && ['LOBBY', 'GAME_OVER', 'FFF_RESULT', 'HOT_SEAT', 'HOT_SEAT_QUESTION', 'HOT_SEAT_OPTIONS'].includes(gameState.phase) && gameState.showBottomLeaderboard && (
        <div className="fixed bottom-8 left-8 right-8">
          <div className="bg-[#1a1a4a]/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10">
            <h3 className="text-xl font-bold mb-4 flex items-center"><Trophy className="mr-2 text-yellow-500" /> Live Leaderboard</h3>
            <div className="grid grid-cols-5 gap-4">
              {(gameState.teams || [])
                .sort((a, b) => (40 + ((b.hotSeatPoints as number) || 0) + ((b.bonusPoints as number) || 0)) - (40 + ((a.hotSeatPoints as number) || 0) + ((a.bonusPoints as number) || 0)))
                .slice(0, 5)
                .map((team, i) => (
                  <div key={team.id} className="bg-[#0a0a2a] p-3 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono text-gray-500">#{i + 1}</span>
                      <span className="font-bold truncate max-w-[150px]">{team.name}</span>
                    </div>
                    <span className="font-mono text-blue-400">{40 + ((team.hotSeatPoints as number) || 0) + ((team.bonusPoints as number) || 0)}</span>
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

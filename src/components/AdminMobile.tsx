import React, { useState } from 'react';
import { GameState } from '../types';
import { Plus, Minus, UserCheck, Trophy, Zap } from 'lucide-react';

interface AdminMobileProps {
  gameState: GameState | null;
  socket: any;
}

const AdminMobile: React.FC<AdminMobileProps> = ({ gameState, socket }) => {
  const [selectedTeamId, setSelectedTeamId] = useState<string | null>(null);

  const sendAction = (action: string, payload: any = {}) => {
    socket?.send(JSON.stringify({ type: 'ADMIN_ACTION', action, payload }));
  };

  const updateScore = (amount: number, type: 'hotSeat' | 'bonus' = 'hotSeat') => {
    if (!selectedTeamId) return;
    sendAction('UPDATE_SCORE', { teamId: selectedTeamId, amount, type });
  };

  if (!gameState) return <div className="p-4">Connecting...</div>;

  const selectedTeam = gameState.teams.find(t => t.id === selectedTeamId);

  return (
    <div className="p-4 bg-[#0a0a2a] min-h-screen text-white space-y-6">
      <header className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Score Control</h1>
        <div className="text-xs font-mono text-blue-400 uppercase tracking-widest">Admin Mobile</div>
      </header>

      {/* Team Selection */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Team</label>
          {gameState.hotSeatTeamId && (
            <button 
              onClick={() => setSelectedTeamId(gameState.hotSeatTeamId)}
              className="text-[10px] bg-blue-600/20 text-blue-400 px-2 py-1 rounded border border-blue-500/50 font-bold"
            >
              SELECT HOT SEAT
            </button>
          )}
        </div>
        <div className="grid grid-cols-2 gap-2">
          {gameState.teams.map(team => (
            <button 
              key={team.id}
              onClick={() => setSelectedTeamId(team.id)}
              className={`p-3 rounded-xl border text-sm font-bold transition-all ${selectedTeamId === team.id ? 'bg-blue-600 border-blue-400' : 'bg-[#1a1a4a] border-white/10 text-gray-400'}`}
            >
              {team.name}
            </button>
          ))}
        </div>
      </div>

      {selectedTeam && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-[#1a1a4a] p-6 rounded-2xl border border-white/10 text-center">
            <div className="text-xs text-gray-400 uppercase mb-1">Current Score for {selectedTeam.name}</div>
            <div className="text-5xl font-mono font-black text-yellow-500">
              {40 + (selectedTeam.hotSeatPoints as number) + (selectedTeam.bonusPoints as number)}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ScoreButton label="+30" onClick={() => updateScore(30)} variant="success" />
            <ScoreButton label="+50" onClick={() => updateScore(50)} variant="success" />
            <ScoreButton label="+100" onClick={() => updateScore(100)} variant="success" />
            <ScoreButton label="+20 Bonus" onClick={() => updateScore(20, 'bonus')} variant="bonus" />
            <ScoreButton label="Lock A" onClick={() => sendAction('LOCK_OPTION', { optionIndex: 0 })} variant="bonus" />
            <ScoreButton label="Lock B" onClick={() => sendAction('LOCK_OPTION', { optionIndex: 1 })} variant="bonus" />
            <ScoreButton label="Lock C" onClick={() => sendAction('LOCK_OPTION', { optionIndex: 2 })} variant="bonus" />
            <ScoreButton label="Lock D" onClick={() => sendAction('LOCK_OPTION', { optionIndex: 3 })} variant="bonus" />
            <ScoreButton label="-5 Crowd" onClick={() => updateScore(-5)} variant="danger" />
            <ScoreButton label="-10 Call" onClick={() => updateScore(-10)} variant="danger" />
            <ScoreButton label="-20 Debug" onClick={() => updateScore(-20)} variant="danger" />
          </div>
        </div>
      )}

      {!selectedTeam && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500 space-y-4">
          <UserCheck className="w-12 h-12 opacity-20" />
          <p className="text-sm">Select a team to start controlling scores</p>
        </div>
      )}
    </div>
  );
};

const ScoreButton: React.FC<{ label: string, onClick: () => void, variant: 'success' | 'danger' | 'bonus' }> = ({ label, onClick, variant }) => {
  const styles = {
    success: "bg-green-600/20 border-green-500 text-green-400 active:bg-green-600/40",
    danger: "bg-red-600/20 border-red-500 text-red-400 active:bg-red-600/40",
    bonus: "bg-yellow-600/20 border-yellow-500 text-yellow-400 active:bg-yellow-600/40"
  };

  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-2xl border-2 font-black text-xl transition-all ${styles[variant]}`}
    >
      {label}
    </button>
  );
};

export default AdminMobile;

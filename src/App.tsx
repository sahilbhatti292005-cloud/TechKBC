import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GameState, Role } from './types';
import AdminLaptop from './components/AdminLaptop';
import AdminMobile from './components/AdminMobile';
import Volunteer from './components/Volunteer';
import Display from './components/Display';
import { Users, Monitor, ShieldCheck } from 'lucide-react';
import { db } from './lib/firebase';
import { ref, onValue, set, get } from 'firebase/database';

const App: React.FC = () => {
  const [role, setRole] = useState<Role | null>(localStorage.getItem('kbc_role') as Role | null);
  const [teamId, setTeamId] = useState<string | null>(localStorage.getItem('kbc_teamId'));
  const [teamName, setTeamName] = useState<string>(localStorage.getItem('kbc_teamName') || '');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('kbc_teamId'));

  useEffect(() => {
    const gameRef = ref(db, 'gameState');
    const unsubscribe = onValue(gameRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const teamsArray = data.teams ? Object.values(data.teams) : [];
        setGameState({ ...data, teams: teamsArray });
      } else {
        setGameState(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (role === 'admin_laptop' || role === 'admin_mobile') {
      if (teamId === 'admin' && teamName === 'admin') {
        localStorage.setItem('kbc_teamId', teamId);
        localStorage.setItem('kbc_teamName', teamName);
        localStorage.setItem('kbc_role', role);
        setIsLoggedIn(true);
      } else {
        alert('Invalid Admin Credentials');
      }
    } else if (role === 'volunteer') {
      if (teamId && teamName) {
        // Register team in Firebase if not exists
        const teamRef = ref(db, `gameState/teams/${teamId}`);
        const snapshot = await get(teamRef);
        if (!snapshot.exists()) {
          await set(teamRef, {
            id: teamId,
            name: teamName,
            initialPoints: 40,
            hotSeatPoints: 0,
            bonusPoints: 0,
            isCorrect: 0
          });
        }
        localStorage.setItem('kbc_teamId', teamId);
        localStorage.setItem('kbc_teamName', teamName);
        localStorage.setItem('kbc_role', role);
        setIsLoggedIn(true);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('kbc_teamId');
    localStorage.removeItem('kbc_teamName');
    localStorage.removeItem('kbc_role');
    setTeamId(null);
    setTeamName('');
    setRole(null);
    setIsLoggedIn(false);
  };

  if (!role) {
    return (
      <div className="min-h-screen bg-[#0a0a2a] text-white flex flex-center items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl w-full"
        >
          <RoleCard 
            icon={<Monitor className="w-12 h-12" />} 
            title="Display Mode" 
            desc="Projector / Large Screen View" 
            onClick={() => setRole('display')}
          />
          <RoleCard 
            icon={<ShieldCheck className="w-12 h-12" />} 
            title="Admin Laptop" 
            desc="Main Game Control" 
            onClick={() => setRole('admin_laptop')}
          />
          <RoleCard 
            icon={<ShieldCheck className="w-12 h-12" />} 
            title="Admin Mobile" 
            desc="Score Control Panel" 
            onClick={() => setRole('admin_mobile')}
          />
          <RoleCard 
            icon={<Users className="w-12 h-12" />} 
            title="Volunteer" 
            desc="Team Submission Device" 
            onClick={() => setRole('volunteer')}
          />
        </motion.div>
      </div>
    );
  }

  if (role === 'display') {
    return <Display gameState={gameState} />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#0a0a2a] text-white flex items-center justify-center p-4">
        <motion.form 
          onSubmit={handleLogin}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1a1a4a] p-8 rounded-2xl border border-white/10 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center">Login</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Team ID / Admin ID</label>
              <input 
                type="text" 
                value={teamId || ''} 
                onChange={(e) => setTeamId(e.target.value)}
                className="w-full bg-[#0a0a2a] border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Team Name / Admin Name</label>
              <input 
                type="text" 
                value={teamName} 
                onChange={(e) => setTeamName(e.target.value)}
                className="w-full bg-[#0a0a2a] border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                required
              />
            </div>
            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors"
            >
              Enter Game
            </button>
            <button 
              type="button"
              onClick={handleLogout}
              className="w-full bg-gray-600/20 hover:bg-gray-600/40 text-gray-400 font-bold py-2 rounded-lg transition-colors text-xs"
            >
              Reset / Change Role
            </button>
          </div>
        </motion.form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a2a] text-white relative">
      <button 
        onClick={handleLogout}
        className="fixed top-4 right-4 z-50 bg-red-600/20 hover:bg-red-600/40 text-red-400 px-3 py-1 rounded-full text-[10px] font-bold border border-red-500/50 transition-colors"
      >
        LOGOUT / RESET
      </button>
      {role === 'admin_laptop' && (
        <AdminLaptop gameState={gameState} />
      )}
      {role === 'admin_mobile' && (
        <AdminMobile gameState={gameState} />
      )}
      {role === 'volunteer' && (
        <Volunteer gameState={gameState} teamId={teamId!} />
      )}
    </div>
  );
};

const RoleCard: React.FC<{ icon: React.ReactNode, title: string, desc: string, onClick: () => void }> = ({ icon, title, desc, onClick }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-[#1a1a4a] p-8 rounded-2xl border border-white/10 text-center hover:border-blue-500 transition-colors group"
  >
    <div className="mb-4 text-blue-400 group-hover:text-blue-300 transition-colors flex justify-center">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-sm text-gray-400">{desc}</p>
  </motion.button>
);

export default App;

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Circle, 
  Trash2, 
  Moon, 
  Sun, 
  Coffee, 
  Brain 
} from 'lucide-react';

/**
 * FocusFlow Productivity App
 * * Note: If you see "Module not found" errors locally, 
 * run `npm install lucide-react` in your terminal.
 */

const App = () => {
  // --- State Management ---
  const [tasks, setTasks] = useState([
    { id: 1, text: "Explore React components", completed: true },
    { id: 2, text: "Deploy to Cloudflare", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mode, setMode] = useState('work'); // 'work' or 'break'

  // --- Pomodoro Logic ---
  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleModeSwitch();
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const handleModeSwitch = () => {
    const nextMode = mode === 'work' ? 'break' : 'work';
    setMode(nextMode);
    setTimeLeft(nextMode === 'work' ? 25 * 60 : 5 * 60);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Task Logic ---
  const addTask = (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks([{ id: Date.now(), text: newTask, completed: false }, ...tasks]);
    setNewTask("");
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'
    }`}>
      
      {/* Header */}
      <nav className="p-6 flex justify-between items-center max-w-4xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <Brain className="text-indigo-500 w-8 h-8" />
          <span className="text-xl font-bold tracking-tight">FocusFlow</span>
        </div>
        <button 
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`p-2.5 rounded-full transition-all ${
            isDarkMode 
              ? 'bg-slate-800 hover:bg-slate-700' 
              : 'bg-white shadow-sm border border-slate-200 hover:bg-slate-100'
          }`}
          aria-label="Toggle Dark Mode"
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </nav>

      <main className="max-w-4xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* Timer Section */}
        <section className={`p-8 rounded-3xl flex flex-col items-center justify-center transition-all ${
          isDarkMode 
            ? 'bg-slate-900/50 border border-slate-800' 
            : 'bg-white shadow-xl border border-slate-100'
        }`}>
          <div className="flex gap-2 mb-8 bg-slate-200/20 p-1 rounded-full">
            <button 
              onClick={() => { setMode('work'); setTimeLeft(25 * 60); setIsActive(false); }}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                mode === 'work' 
                  ? 'bg-indigo-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Focus
            </button>
            <button 
              onClick={() => { setMode('break'); setTimeLeft(5 * 60); setIsActive(false); }}
              className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${
                mode === 'break' 
                  ? 'bg-emerald-600 text-white shadow-lg' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Break
            </button>
          </div>

          <h1 className="text-8xl font-black mb-12 tracking-tighter tabular-nums drop-shadow-sm">
            {formatTime(timeLeft)}
          </h1>

          <div className="flex gap-6">
            <button 
              onClick={toggleTimer}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 shadow-xl ${
                isActive 
                  ? 'bg-slate-200 text-slate-900 hover:bg-white' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-500'
              }`}
            >
              {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
            </button>
            <button 
              onClick={resetTimer}
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all transform active:scale-95 border ${
                isDarkMode 
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300' 
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
              }`}
            >
              <RotateCcw size={28} />
            </button>
          </div>
          
          <p className="mt-10 text-slate-500 text-sm italic text-center max-w-[240px]">
            {mode === 'work' 
              ? '"Deep work is the superpower of the 21st century."' 
              : '"Rest is not idleness."'}
          </p>
        </section>

        {/* Tasks Section */}
        <section className="flex flex-col gap-4 w-full h-full">
          <div className={`flex-1 p-8 rounded-3xl overflow-hidden flex flex-col ${
            isDarkMode ? 'bg-slate-900/30 border border-slate-800/50' : 'bg-white shadow-md border border-slate-100'
          }`}>
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <CheckCircle2 className="text-indigo-500" size={24} />
              Daily Objectives
            </h2>

            <form onSubmit={addTask} className="mb-6">
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new goal..."
                className={`w-full p-4 rounded-2xl outline-none border transition-all ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20' 
                    : 'bg-slate-50 border-slate-200 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-400/10'
                }`}
              />
            </form>

            <div className="space-y-2 overflow-y-auto pr-2 flex-1 custom-scrollbar">
              {tasks.map(task => (
                <div 
                  key={task.id}
                  className={`group flex items-center justify-between p-4 rounded-2xl transition-all ${
                    isDarkMode ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50 border border-transparent hover:border-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => toggleTask(task.id)}
                      className="transition-transform active:scale-110"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="text-emerald-500" size={22} />
                      ) : (
                        <Circle className="text-slate-400 group-hover:text-indigo-400" size={22} />
                      )}
                    </button>
                    <span className={`font-medium transition-all ${
                      task.completed ? 'line-through text-slate-500 opacity-60' : 'text-inherit'
                    }`}>
                      {task.text}
                    </span>
                  </div>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    aria-label="Delete task"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              
              {tasks.length === 0 && (
                <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                  <Coffee className="mb-4 opacity-10" size={64} />
                  <p className="text-slate-500 font-medium">Clear mind, clear tasks.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="max-w-4xl mx-auto p-12 text-center text-slate-500/60 text-xs font-medium uppercase tracking-widest">
        FocusFlow &copy; {new Date().getFullYear()} • Optimized for Productivity
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(79, 70, 229, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(79, 70, 229, 0.6);
        }
      `}</style>
    </div>
  );
};

export default App;
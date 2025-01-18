import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ListTodo, Users, Wallet, Star, Trophy, Sparkles, Crown, UserCircle2 } from 'lucide-react';
import { useBalance } from '@/lib/BalanceContext';

export function MainComponent() {
  const { balance, addToBalance } = useBalance();
  const [clicks, setClicks] = React.useState(1000);
  const [isGlowing, setIsGlowing] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [combo, setCombo] = React.useState(1);
  const [lastClickTime, setLastClickTime] = React.useState(Date.now());
  const [level, setLevel] = React.useState(1);
  const [xp, setXp] = React.useState(0);
  const [dailyReward, setDailyReward] = React.useState(true);
  const [achievements, setAchievements] = React.useState([]);
  const maxClicks = 1000;
  const navigate = useNavigate();

  const xpNeededForNextLevel = level * 100;

  React.useEffect(() => {
    const timer = setInterval(() => {
      setClicks(prev => Math.min(prev + 1, maxClicks));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleDailyReward = () => {
    if (dailyReward) {
      addToBalance(500);
      setDailyReward(false);
      localStorage.setItem('lastDailyReward', new Date().toISOString());
    }
  };

  const handleClick = () => {
    if (clicks > 0 && !loading) {
      try {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastClickTime;
        
        let newCombo = combo;
        if (timeDiff < 500) {
          newCombo = Math.min(combo + 1, 5);
        } else {
          newCombo = 1;
        }
        setCombo(newCombo);
        setLastClickTime(currentTime);

        const reward = newCombo * (1 + Math.floor(level / 5));
        const xpGain = newCombo * 2;
        
        addToBalance(reward);
        setXp(prev => {
          const newXp = prev + xpGain;
          if (newXp >= xpNeededForNextLevel) {
            setLevel(l => l + 1);
            return newXp - xpNeededForNextLevel;
          }
          return newXp;
        });
        
        setClicks(prev => Math.max(0, prev - newCombo));
        setIsGlowing(true);
        setTimeout(() => setIsGlowing(false), 800);
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  const navItems = [
    { id: "home", icon: Home, label: "الرئيسية", path: "/" },
    { id: "tasks", icon: ListTodo, label: "المهام", path: "/tasks" },
    { id: "friends", icon: Users, label: "الأصدقاء", path: "/friends" },
    { id: "wallet", icon: Wallet, label: "المحفظة", path: "/wallet" },
    { id: "profile", icon: UserCircle2, label: "الملف", path: "/profile" },
  ];

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-gradient-to-br from-[#1a0b2e] via-[#2a1245] to-[#1a0b2e] px-4">
      <div className="w-full max-w-[90vw] md:max-w-md bg-[#2a1245]/50 p-3 md:p-4 rounded-2xl backdrop-blur-md shadow-xl border border-purple-500/20 mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300 font-roboto flex items-center gap-2">
            <span>الرصيد: {balance}</span>
            <img
              src="https://ucarecdn.com/09356da0-9a32-4951-8908-724ddab6c3fd/-/format/auto/"
              alt="عملة ذهبية نجمية"
              className="w-8 h-8 md:w-10 md:h-10 object-contain animate-spin-slow"
            />
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" />
            <span className="text-xl font-bold text-purple-300">مستوى {level}</span>
          </div>
        </div>
        
        <div className="w-full h-2 bg-purple-900/50 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
            style={{ width: `${(xp / xpNeededForNextLevel) * 100}%` }}
          />
        </div>
      </div>

      {dailyReward && (
        <div
          onClick={handleDailyReward}
          className="mt-4 w-full max-w-[90vw] md:max-w-md bg-[#2a1245]/50 p-3 rounded-2xl backdrop-blur-md shadow-xl border border-yellow-500/20 cursor-pointer hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              <span className="text-lg font-bold text-yellow-300">المكافأة اليومية</span>
            </div>
            <span className="text-yellow-400 font-bold">500 🪙</span>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center w-full relative">
        {combo > 1 && (
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 flex items-center gap-2 bg-purple-600/80 px-4 py-2 rounded-full animate-bounce">
            <Star className="w-5 h-5 text-yellow-300" />
            <span className="text-white font-bold">{combo}x Combo!</span>
          </div>
        )}
        
        <div
          className={`cursor-pointer transform hover:scale-105 transition-all duration-300 relative ${
            isGlowing ? "animate-click" : ""
          } ${loading ? "opacity-50" : ""}`}
          onClick={handleClick}
        >
          <img
            src="https://ucarecdn.com/62f1d753-37be-49f9-a8da-46bfae2fca6d/-/format/auto/"
            alt="ثور كرتوني بملابس عصرية"
            className="w-[300px] h-[300px] md:w-[450px] md:h-[450px] object-contain select-none drop-shadow-2xl"
          />
          {isGlowing && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-4xl font-bold text-yellow-300 animate-bounce">
                +{combo * (1 + Math.floor(level / 5))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-[240px] md:w-[300px] bg-[#2a1245] p-2 rounded-xl border border-purple-500/30 shadow-lg mb-20">
        <div className="h-5 bg-[#150720] rounded-md relative overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-pink-500 transition-all duration-300"
            style={{ width: `${(clicks / maxClicks) * 100}%` }}
          ></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-white">
            {clicks}/{maxClicks}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 w-full bg-[#2a1245]/50 backdrop-blur-md shadow-xl border-t border-purple-500/20 p-3">
        <div className="max-w-md mx-auto flex justify-around items-center text-purple-300">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center transform transition-all duration-300 hover:scale-110 cursor-pointer touch-manipulation
                  ${
                    item.path === "/" ? "text-pink-400 translate-y-[-4px]" : "hover:text-purple-400"
                  }`}
              >
                <Icon className="w-6 h-6 md:w-7 md:h-7 mb-1" />
                <span className="text-[10px] md:text-xs">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
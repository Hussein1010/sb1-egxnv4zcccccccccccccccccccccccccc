import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ListTodo, Users, Wallet, UserCircle2, Trophy, Star, Award, Calendar } from 'lucide-react';
import { useBalance } from '@/lib/BalanceContext';
import WebApp from '@twa-dev/sdk';

export function ProfileComponent() {
  const { balance } = useBalance();
  const [level, setLevel] = React.useState(1);
  const [xp, setXp] = React.useState(0);
  const [totalClicks, setTotalClicks] = React.useState(0);
  const [joinDate, setJoinDate] = React.useState(new Date());
  const navigate = useNavigate();

  const achievements = [
    {
      id: 1,
      title: 'بداية قوية',
      description: 'وصلت إلى المستوى 5',
      icon: Trophy,
      completed: level >= 5
    },
    {
      id: 2,
      title: 'نقار محترف',
      description: 'قمت بـ 1000 نقرة',
      icon: Star,
      completed: totalClicks >= 1000
    },
    {
      id: 3,
      title: 'صياد الذهب',
      description: 'جمعت 10000 عملة',
      icon: Award,
      completed: balance >= 10000
    }
  ];

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
          <div className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
            الملف الشخصي
          </div>
          <div className="text-xl font-bold text-purple-300">{balance} 🪙</div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[90vw] md:max-w-md mt-4 overflow-y-auto">
        <div className="bg-[#2a1245]/50 p-4 rounded-2xl backdrop-blur-md shadow-xl border border-purple-500/20 mb-4">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <UserCircle2 className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-300">
                {WebApp.initDataUnsafe?.user?.username || 'اللاعب'}
              </h2>
              <div className="flex items-center gap-2 text-purple-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  انضم في {joinDate.toLocaleDateString('ar-SA')}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#1a0b2e] p-4 rounded-xl">
              <div className="text-purple-400 text-sm mb-1">المستوى</div>
              <div className="text-2xl font-bold text-purple-300">{level}</div>
            </div>
            <div className="bg-[#1a0b2e] p-4 rounded-xl">
              <div className="text-purple-400 text-sm mb-1">مجموع النقرات</div>
              <div className="text-2xl font-bold text-purple-300">{totalClicks}</div>
            </div>
          </div>
        </div>

        <div className="bg-[#2a1245]/50 p-4 rounded-2xl backdrop-blur-md shadow-xl border border-purple-500/20 mb-4">
          <h3 className="text-lg font-bold text-purple-300 mb-4">الإنجازات</h3>
          <div className="space-y-4">
            {achievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className="flex items-center gap-3"
                >
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    achievement.completed ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-[#1a0b2e]'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      achievement.completed ? 'text-white' : 'text-purple-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-purple-300">{achievement.title}</h4>
                    <p className="text-sm text-purple-400">{achievement.description}</p>
                  </div>
                  {achievement.completed && (
                    <div className="text-green-400">✓</div>
                  )}
                </div>
              );
            })}
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
                    item.path === "/profile" ? "text-pink-400 translate-y-[-4px]" : "hover:text-purple-400"
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
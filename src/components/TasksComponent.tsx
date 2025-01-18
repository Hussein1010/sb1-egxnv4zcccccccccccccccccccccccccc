import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ListTodo, Users, Wallet, Share2, Megaphone, UserPlus, CalendarCheck } from 'lucide-react';
import { useBalance } from '@/lib/BalanceContext';
import { showAlert } from '@/lib/telegram';

export function TasksComponent() {
  const { balance, addToBalance } = useBalance();
  const [completedTasks, setCompletedTasks] = React.useState(() => {
    const saved = localStorage.getItem('completedTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  React.useEffect(() => {
    localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  const tasks = [
    {
      id: 1,
      title: 'مشاركة اللعبة مع صديق',
      description: 'قم بمشاركة اللعبة مع صديق للحصول على مكافأة',
      reward: 100,
      icon: Share2
    },
    {
      id: 2,
      title: 'نشر نتيجتك على وسائل التواصل',
      description: 'شارك نتيجتك على وسائل التواصل الاجتماعي',
      reward: 150,
      icon: Megaphone
    },
    {
      id: 3,
      title: 'دعوة 3 أصدقاء للعب',
      description: 'قم بدعوة 3 أصدقاء للعب معك',
      reward: 200,
      icon: UserPlus
    },
    {
      id: 4,
      title: 'تسجيل الدخول لمدة 5 أيام متتالية',
      description: 'قم بتسجيل الدخول للعبة لمدة 5 أيام متتالية',
      reward: 250,
      icon: CalendarCheck
    }
  ];
  
  const handleCompleteTask = async (taskId) => {
    if (completedTasks.includes(taskId) || loading) {
      showAlert('لقد أكملت هذه المهمة بالفعل');
      return;
    }

    try {
      setLoading(true);
      const task = tasks.find((t) => t.id === taskId);
      
      if (!task) {
        showAlert('حدث خطأ: المهمة غير موجودة');
        return;
      }

      addToBalance(task.reward);
      setCompletedTasks(prev => [...prev, taskId]);
      showAlert(`تم إكمال المهمة! +${task.reward} 🪙`);
    } catch (error) {
      console.error('Error completing task:', error);
      showAlert('حدث خطأ أثناء إكمال المهمة');
    } finally {
      setLoading(false);
    }
  };

  const navItems = [
    { id: "home", icon: Home, label: "الرئيسية", path: "/" },
    { id: "tasks", icon: ListTodo, label: "المهام", path: "/tasks" },
    { id: "friends", icon: Users, label: "الأصدقاء", path: "/friends" },
    { id: "wallet", icon: Wallet, label: "المحفظة", path: "/wallet" },
  ];

  return (
    <div className="fixed inset-0 flex flex-col items-center bg-gradient-to-br from-[#1a0b2e] via-[#2a1245] to-[#1a0b2e] px-4">
      <div className="w-full max-w-[90vw] md:max-w-md bg-[#2a1245]/50 p-3 md:p-4 rounded-2xl backdrop-blur-md shadow-xl border border-purple-500/20 mt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-300">
            المهام
          </div>
          <div className="text-xl font-bold text-purple-300">{balance} 🪙</div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[90vw] md:max-w-md mt-4 overflow-y-auto">
        {tasks.map((task) => {
          const Icon = task.icon;
          const isCompleted = completedTasks.includes(task.id);
          
          return (
            <div
              key={task.id}
              className="bg-[#2a1245]/50 p-4 rounded-2xl backdrop-blur-md shadow-xl border border-purple-500/20 mb-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-purple-300">{task.title}</h3>
                  <p className="text-sm text-purple-400">{task.description}</p>
                </div>
                <button
                  onClick={() => handleCompleteTask(task.id)}
                  disabled={isCompleted || loading}
                  className={`px-4 py-2 rounded-xl font-bold transition-all duration-300 ${
                    isCompleted
                      ? "bg-green-500/20 text-green-400"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isCompleted ? "مكتمل ✓" : `${task.reward} 🪙`}
                </button>
              </div>
            </div>
          );
        })}
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
                    item.path === "/tasks" ? "text-pink-400 translate-y-[-4px]" : "hover:text-purple-400"
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
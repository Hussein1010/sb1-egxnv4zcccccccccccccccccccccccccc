import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ListTodo, Users, Wallet, UserPlus, Share2 } from 'lucide-react';
import { generateInviteLink, showAlert } from '@/lib/telegram';
import { useBalance } from '@/lib/BalanceContext';
import WebApp from '@twa-dev/sdk';

export function FriendsComponent() {
  const { balance, addToBalance } = useBalance();
  const [invitedFriends, setInvitedFriends] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleInvite = async () => {
    try {
      if (loading) return;
      
      setLoading(true);
      const userId = WebApp.initDataUnsafe?.user?.id?.toString();
      
      if (!userId) {
        showAlert('عذراً، يجب عليك تسجيل الدخول أولاً');
        return;
      }

      const inviteLink = await generateInviteLink(userId);
      
      if (!inviteLink) {
        showAlert('حدث خطأ أثناء إنشاء رابط الدعوة');
        return;
      }

      await navigator.clipboard.writeText(inviteLink);
      showAlert('تم نسخ رابط الدعوة! شاركه مع أصدقائك');
      
      const friendName = `صديق ${invitedFriends.length + 1}`;
      setInvitedFriends(prev => [
        { 
          id: Math.random().toString(),
          friend_name: friendName,
          created_at: new Date().toISOString()
        }, 
        ...prev
      ]);
      addToBalance(100);
    } catch (error) {
      console.error('Error sharing invite:', error);
      showAlert('حدث خطأ أثناء إنشاء رابط الدعوة');
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
            الأصدقاء
          </div>
          <div className="text-xl font-bold text-purple-300">{balance} 🪙</div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[90vw] md:max-w-md mt-4 overflow-y-auto">
        <div className="bg-[#2a1245]/50 p-4 rounded-2xl backdrop-blur-md shadow-xl border border-purple-500/20 mb-4">
          <button
            onClick={handleInvite}
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50"
          >
            <UserPlus className="w-5 h-5" />
            <span>{loading ? 'جاري إنشاء الرابط...' : 'دعوة صديق'}</span>
          </button>
        </div>

        {invitedFriends.map((friend) => (
          <div
            key={friend.id}
            className="bg-[#2a1245]/50 p-4 rounded-2xl backdrop-blur-md shadow-xl border border-purple-500/20 mb-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="font-bold text-purple-300">{friend.friend_name}</div>
                  <div className="text-sm text-purple-400">
                    {new Date(friend.created_at).toLocaleDateString('ar-SA')}
                  </div>
                </div>
              </div>
              <div className="text-green-400 font-bold">+100 🪙</div>
            </div>
          </div>
        ))}

        {invitedFriends.length === 0 && (
          <div className="text-center text-purple-400 mt-8">
            لم تقم بدعوة أي صديق بعد
          </div>
        )}
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
                    item.path === "/friends" ? "text-pink-400 translate-y-[-4px]" : "hover:text-purple-400"
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
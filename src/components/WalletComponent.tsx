import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ListTodo, Users, Wallet, ArrowRightLeft, AlertCircle } from 'lucide-react';
import { useBalance } from '@/lib/BalanceContext';

export function WalletComponent() {
  const { balance } = useBalance();
  const [selectedCrypto, setSelectedCrypto] = React.useState('USDT');
  const [exchangeAmount, setExchangeAmount] = React.useState('');
  const navigate = useNavigate();

  const cryptoOptions = [
    { value: 'USDT', label: 'Tether USD (USDT)', rate: 0.01 },
    { value: 'BTC', label: 'Bitcoin (BTC)', rate: 0.0000004 },
    { value: 'ETH', label: 'Ethereum (ETH)', rate: 0.000006 },
  ];

  const calculateCryptoAmount = () => {
    const crypto = cryptoOptions.find(c => c.value === selectedCrypto);
    if (!crypto || !balance) return 0;
    return (balance * crypto.rate).toFixed(8);
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
            المحفظة
          </div>
          <div className="text-xl font-bold text-purple-300">{balance} 🪙</div>
        </div>
      </div>

      <div className="flex-1 w-full max-w-[90vw] md:max-w-md mt-4">
        <div className="bg-[#2a1245]/50 p-4 rounded-2xl backdrop-blur-md shadow-xl border border-purple-500/20 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
              <ArrowRightLeft className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-purple-300">تحويل العملات</h3>
              <p className="text-sm text-purple-400">حول عملات اللعبة إلى عملات رقمية</p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">
                اختر العملة الرقمية
              </label>
              <select
                value={selectedCrypto}
                onChange={(e) => setSelectedCrypto(e.target.value)}
                className="w-full bg-[#1a0b2e] border border-purple-500/30 rounded-xl p-3 text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {cryptoOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-purple-300 mb-1">
                الكمية المتاحة للتحويل
              </label>
              <div className="w-full bg-[#1a0b2e] border border-purple-500/30 rounded-xl p-3 text-purple-300">
                {calculateCryptoAmount()} {selectedCrypto}
              </div>
            </div>

            <button
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300"
            >
              تحويل العملات
            </button>

            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 p-3 rounded-xl">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">
                الحد الأدنى للتحويل هو 1000 عملة
              </p>
            </div>
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
                    item.path === "/wallet" ? "text-pink-400 translate-y-[-4px]" : "hover:text-purple-400"
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
import WebApp from '@twa-dev/sdk';

const BOT_TOKEN = '8053892059:AAEnG3fu6kpBPo8VkhjrWO9GiH5sEkHint0';
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

export function initTelegramWebApp() {
  WebApp.ready();
  WebApp.expand();
  
  if (WebApp.colorScheme === 'dark') {
    document.documentElement.classList.add('dark');
  }
  
  return {
    userId: WebApp.initDataUnsafe?.user?.id,
    username: WebApp.initDataUnsafe?.user?.username,
  };
}

export async function generateInviteLink(userId: string): Promise<string> {
  try {
    const uniqueCode = Math.random().toString(36).substring(2, 15);
    const inviteLink = `https://t.me/ClickGameArabicBot?start=invite_${uniqueCode}_${userId}`;
    
    // Store the invite code in the database
    await fetch(`${API_BASE}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: userId,
        text: `تم إنشاء رابط الدعوة الخاص بك: ${inviteLink}\n\nشارك هذا الرابط مع أصدقائك!`,
        parse_mode: 'HTML',
      }),
    });

    return inviteLink;
  } catch (error) {
    console.error('Error generating invite link:', error);
    throw error;
  }
}

export async function checkInviteStatus(inviteCode: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE}/getChatMember`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: '@ClickGameArabicBot',
        user_id: WebApp.initDataUnsafe?.user?.id,
      }),
    });

    const data = await response.json();
    return data.ok && data.result.status !== 'left';
  } catch (error) {
    console.error('Error checking invite status:', error);
    return false;
  }
}

export function showAlert(message: string) {
  WebApp.showAlert(message);
}

export function showConfirm(message: string): Promise<boolean> {
  return new Promise((resolve) => {
    WebApp.showConfirm(message, (confirmed) => {
      resolve(confirmed);
    });
  });
}

export function shareGame() {
  WebApp.switchInlineQuery('انضم إلى لعبة النقر واربح عملات! 🎮✨', ['users', 'groups']);
}

export function closeWebApp() {
  WebApp.close();
}
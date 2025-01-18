import { Telegraf, Markup } from 'telegraf';
import { createClient } from '@supabase/supabase-js';

// تهيئة Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// تهيئة البوت
const BOT_TOKEN = process.env.BOT_TOKEN || '6919884949:AAFxPxPxhxPxPxPxPxPxPxPxPxPxPxPxPxP';
const WEBAPP_URL = process.env.WEBAPP_URL || 'https://your-webapp-url.com';

const bot = new Telegraf(BOT_TOKEN, {
  handlerTimeout: 90_000,
});

console.log('🤖 جاري تهيئة البوت...');

// معالجة أمر البداية
bot.command('start', async (ctx) => {
  try {
    console.log('📝 تم استلام أمر البداية من المستخدم:', ctx.from?.id);
    const startParam = ctx.message.text.split(' ')[1];
    const userId = ctx.from.id;
    
    // التحقق من وجود المستخدم في قاعدة البيانات
    const { data: existingUser } = await supabase
      .from('users')
      .select()
      .eq('id', userId)
      .single();

    if (!existingUser) {
      // إنشاء مستخدم جديد
      const { error } = await supabase
        .from('users')
        .insert([
          {
            id: userId,
            balance: 0,
            clicks: 1000,
          }
        ]);

      if (error) {
        console.error('خطأ في إنشاء المستخدم:', error);
        throw error;
      }
    }

    // معالجة دعوة الصديق
    if (startParam?.startsWith('invite_')) {
      const [, code, inviterId] = startParam.split('_');
      
      // التحقق من صحة الدعوة وإضافة المكافأة
      const { data: inviter } = await supabase
        .from('users')
        .select()
        .eq('id', inviterId)
        .single();

      if (inviter) {
        await supabase
          .from('users')
          .update({ balance: inviter.balance + 100 })
          .eq('id', inviterId);

        await supabase
          .from('invited_friends')
          .insert([
            {
              user_id: inviterId,
              friend_name: ctx.from.username || 'مستخدم جديد',
              invite_code: code
            }
          ]);
      }
    }

    // إنشاء لوحة التحكم الرئيسية
    const keyboard = Markup.keyboard([
      ['🎮 بدء اللعب', '👥 دعوة صديق'],
      ['💰 رصيدي', '📋 المهام'],
      ['ℹ️ المساعدة']
    ]).resize();

    const welcomeMessage = `مرحباً بك في لعبة النقر! 🎮\n\n` +
      `🌟 احصل على عملات عن طريق:\n` +
      `• النقر على الشاشة\n` +
      `• إكمال المهام اليومية\n` +
      `• دعوة أصدقائك\n\n` +
      `اضغط على "بدء اللعب" للبدء!`;

    await ctx.reply(welcomeMessage, {
      ...keyboard,
      disable_web_page_preview: true
    });

    console.log('✅ تم معالجة أمر البداية بنجاح للمستخدم:', userId);
  } catch (error) {
    console.error('❌ خطأ في أمر البداية:', error);
    await ctx.reply('عذراً، حدث خطأ. الرجاء المحاولة مرة أخرى. ❌');
  }
});

// معالجة زر بدء اللعب
bot.hears('🎮 بدء اللعب', async (ctx) => {
  try {
    const webAppButton = Markup.keyboard([
      [Markup.button.webApp('🎮 فتح اللعبة', WEBAPP_URL)],
      ['👥 دعوة صديق', '💰 رصيدي'],
      ['📋 المهام', 'ℹ️ المساعدة']
    ]).resize();

    await ctx.reply('اضغط على الزر أدناه لبدء اللعب! 🎮', webAppButton);
  } catch (error) {
    console.error('خطأ في فتح اللعبة:', error);
    await ctx.reply('عذراً، حدث خطأ. الرجاء المحاولة مرة أخرى.');
  }
});

// معالجة زر الرصيد
bot.hears('💰 رصيدي', async (ctx) => {
  try {
    const userId = ctx.from.id;
    const { data: user } = await supabase
      .from('users')
      .select('balance, clicks')
      .eq('id', userId)
      .single();

    if (user) {
      const message = `💰 رصيدك الحالي: ${user.balance} عملة\n` +
        `🎯 النقرات المتبقية: ${user.clicks}`;
      await ctx.reply(message);
    } else {
      await ctx.reply('عذراً، لم نتمكن من العثور على حسابك. الرجاء استخدام أمر /start أولاً.');
    }
  } catch (error) {
    console.error('خطأ في عرض الرصيد:', error);
    await ctx.reply('عذراً، حدث خطأ. الرجاء المحاولة مرة أخرى.');
  }
});

// معالجة زر دعوة صديق
bot.hears('👥 دعوة صديق', async (ctx) => {
  try {
    const userId = ctx.from.id;
    const uniqueCode = Math.random().toString(36).substring(2, 15);
    const inviteLink = `https://t.me/${ctx.botInfo.username}?start=invite_${uniqueCode}_${userId}`;
    
    const message = `🎮 دعوة للعب!\n\n` +
      `شارك هذا الرابط مع أصدقائك للحصول على 100 عملة لكل صديق! 🎁\n\n` +
      `${inviteLink}`;
    
    await ctx.reply(message);
  } catch (error) {
    console.error('خطأ في إنشاء رابط الدعوة:', error);
    await ctx.reply('عذراً، حدث خطأ. الرجاء المحاولة مرة أخرى.');
  }
});

// معالجة زر المهام
bot.hears('📋 المهام', async (ctx) => {
  try {
    const userId = ctx.from.id;
    const { data: completedTasks } = await supabase
      .from('completed_tasks')
      .select('task_id')
      .eq('user_id', userId);

    const completedTaskIds = completedTasks?.map(task => task.task_id) || [];

    const tasks = [
      { id: 1, title: 'مشاركة اللعبة مع صديق', reward: 100 },
      { id: 2, title: 'نشر نتيجتك على وسائل التواصل', reward: 150 },
      { id: 3, title: 'دعوة 3 أصدقاء للعب', reward: 200 },
      { id: 4, title: 'تسجيل الدخول لمدة 5 أيام متتالية', reward: 250 },
    ];

    let message = '📋 المهام المتاحة:\n\n';
    tasks.forEach(task => {
      const status = completedTaskIds.includes(task.id) ? '✅' : '⭕️';
      message += `${status} ${task.title}\n`;
      message += `💰 المكافأة: ${task.reward} عملة\n\n`;
    });

    await ctx.reply(message);
  } catch (error) {
    console.error('خطأ في عرض المهام:', error);
    await ctx.reply('عذراً، حدث خطأ. الرجاء المحاولة مرة أخرى.');
  }
});

// معالجة زر المساعدة
bot.hears('ℹ️ المساعدة', async (ctx) => {
  const helpMessage = `🎮 مرحباً بك في لعبة النقر!\n\n` +
    `الأوامر المتاحة:\n` +
    `/start - بدء اللعبة\n` +
    `/help - عرض المساعدة\n\n` +
    `كيفية اللعب:\n` +
    `• انقر على الشاشة لجمع العملات\n` +
    `• أكمل المهام للحصول على مكافآت إضافية\n` +
    `• ادعُ أصدقاءك للحصول على المزيد من العملات\n\n` +
    `للمساعدة والدعم الفني:\n` +
    `@YourSupportUsername`;

  await ctx.reply(helpMessage);
});

// معالجة الرسائل العادية
bot.on('text', async (ctx) => {
  if (!ctx.message.text.startsWith('/')) {
    await ctx.reply('مرحباً! استخدم الأزرار أدناه أو اكتب /help للمساعدة 🎮');
  }
});

// معالجة الأخطاء
bot.catch((err, ctx) => {
  console.error('❌ خطأ في البوت:', err);
  return ctx.reply('عذراً، حدث خطأ. الرجاء المحاولة مرة أخرى لاحقاً. ❌');
});

// تشغيل البوت
console.log('🚀 جاري تشغيل البوت...');
try {
  await bot.launch({
    dropPendingUpdates: true,
    webhook: process.env.NODE_ENV === 'production' ? {
      domain: process.env.WEBHOOK_DOMAIN,
      port: parseInt(process.env.PORT || '3000')
    } : undefined
  });
  console.log('✅ تم تشغيل البوت بنجاح!');

  // تعريف الأوامر للبوت
  await bot.telegram.setMyCommands([
    { command: 'start', description: 'بدء اللعبة' },
    { command: 'help', description: 'المساعدة' }
  ]);
  console.log('✅ تم تعريف أوامر البوت بنجاح');
} catch (err) {
  console.error('❌ فشل في تشغيل البوت:', err);
  process.exit(1);
}

// تمكين الإيقاف الآمن
process.once('SIGINT', () => {
  console.log('🛑 جاري إيقاف البوت...');
  bot.stop('SIGINT');
});
process.once('SIGTERM', () => {
  console.log('🛑 جاري إيقاف البوت...');
  bot.stop('SIGTERM');
});
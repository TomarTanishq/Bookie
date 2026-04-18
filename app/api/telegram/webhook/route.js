import TelegramBot from 'node-telegram-bot-api';
import { supabase } from '../../../../lib/supabase';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

export async function POST(req) {
  console.log('Webhook hit!');
  const update = await req.json();
  const message = update.message;
  console.log('Webhook received:', JSON.stringify(update, null, 2))
  if (!message) return Response.json({ ok: true });

  const chatId = String(message.chat.id);
  const text = message.text?.trim();
  console.log('Chat ID:', chatId);
  

  if (text?.startsWith('/start')) {
    const token = text.split(' ')[1];

    if (!token) {
      await bot.sendMessage(chatId, 'Welcome! Go to your dashboard and click Connect Telegram to link your account.');
      return Response.json({ ok: true });
    }

    const { data: pending } = await supabase
      .from('telegram_link_tokens')
      .select('user_id')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (!pending) {
      await bot.sendMessage(chatId, 'This link has expired. Generate a new one from your dashboard.');
      return Response.json({ ok: true });
    }

    await supabase.from('profiles').update({ telegram_chat_id: chatId }).eq('id', pending.user_id);
    await supabase.from('telegram_link_tokens').delete().eq('token', token);
    await bot.sendMessage(chatId, 'Connected! You will receive your weekly digest here every Sunday.');
  }

  if (text && isUrl(text)) {
    await bot.sendMessage(chatId, 'Saving...');
    await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/bookmarks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: text, source: 'telegram', chatId }),
    });
  }

  return Response.json({ ok: true });
}

function isUrl(str) {
  try { new URL(str); return true; } catch { return false; }
}
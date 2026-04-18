import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);

export async function sendDigest(chatId, bookmarks) {
  if (!bookmarks.length) return;

  const header = `*Your weekly bookmark digest*\n_${bookmarks.length} saves worth revisiting_\n\n`;

  const items = bookmarks.map((b, i) => {
    const tags = b.tags?.map(t => `#${t}`).join(' ') || '';
    return (
      `*${i + 1}\\. ${esc(b.title)}*\n` +
      `${esc(b.summary)}\n` +
      `${tags ? tags + '\n' : ''}` +
      `[Open →](${b.url})`
    );
  }).join('\n\n─────────────\n\n');

  await bot.sendMessage(chatId, header + items, {
    parse_mode: 'MarkdownV2',
    disable_web_page_preview: true,
  });
}

export async function sendSaveConfirmation(chatId, bookmark) {
  await bot.sendMessage(chatId,
    `Saved ✓\n\n*${esc(bookmark.title)}*\n_${esc(bookmark.summary || 'Processing...')}_`,
    { parse_mode: 'MarkdownV2', disable_web_page_preview: true }
  );
}

function esc(text = '') {
  return text.replace(/[_*[\]()~`>#+=|{}.!\-]/g, '\\$&');
}
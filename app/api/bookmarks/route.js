import { supabase } from '../../../lib/supabase';
import { sendSaveConfirmation } from '../../../lib/telegram';

export async function POST(req) {
  const { url, source, chatId, title: providedTitle, content: providedContent } = await req.json();

  // Fetch page title (basic scrape — swap for Firecrawl later)
  let title = providedTitle || url;
  let content = providedContent || '';
  
  if (!content) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      
      // Extract and decode title
      if (!providedTitle) {
        const titleMatch = html.match(/<title>(.*?)<\/title>/i);
        const rawTitle = titleMatch?.[1]?.trim() || url;
        title = rawTitle
          .replace(/&amp;/g, '&')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');
      }

      // Extract body text for summarization
      const bodyMatch = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
                            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
                            .replace(/<[^>]+>/g, ' ')
                            .replace(/\s+/g, ' ')
                            .trim();
      content = bodyMatch.slice(0, 3000);
    } catch {}
  }

  // If coming from Telegram, find user by chatId
  let userId = null;
  if (chatId) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('id')
      .eq('telegram_chat_id', chatId)
      .single();
    userId = profile?.id;
  }

  if (!userId) return Response.json({ error: 'User not found' }, { status: 404 });

  const { data: bookmark } = await supabase
    .from('bookmarks')
    .insert({ user_id: userId, url, title, content })
    .select()
    .single();

  if (source === 'telegram' && chatId) {
    await sendSaveConfirmation(chatId, bookmark);
  }

  return Response.json({ bookmark });
}
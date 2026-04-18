import { supabase } from './supabase';
import { sendDigest } from './telegram';
import Anthropic from '@anthropic-ai/sdk';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const anthropic = new Anthropic();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function runDigest() {
    const today = new Date().getDay(); // 0-6

    // Fetch users with connected telegram who are due for a digest today
    const { data: users } = await supabase
        .from('profiles')
        .select('id, telegram_chat_id, digest_day, digest_frequency')
        .not('telegram_chat_id', 'is', null)
        .or(`digest_frequency.eq.daily,and(digest_frequency.eq.weekly,digest_day.eq.${today})`);

    console.log(`[Digest] Found ${users?.length || 0} users due for delivery today.`);

    for (const user of users ?? []) {
        await sendDigestToUser(user.id, user.telegram_chat_id);
    }
}

export async function sendDigestToUser(userId, chatId) {
    const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const { data: bookmarks } = await supabase
        .from('bookmarks')
        .select('id, title, url, content, summary, tags')
        .eq('user_id', userId)
        .eq('digest_sent', false)
        .gte('created_at', since)
        .order('created_at', { ascending: false })
        .limit(7);

    // console.log('Bookmarks found:', bookmarks?.length);
    // console.log('First bookmark summary:', bookmarks?.[0]?.summary);
    // console.log('First bookmark content length:', bookmarks?.[0]?.content?.length);



    if (!bookmarks?.length) return;

    const withSummaries = await Promise.all(
        bookmarks.map(async (b) => {
            if (b.summary) return b;
            const summary = await summarize(b.title, b.content, b.url);
            await supabase.from('bookmarks').update({ summary }).eq('id', b.id);
            return { ...b, summary };
        })
    );

    // console.log('Final withSummaries:', withSummaries.map(b => b.summary));

    await sendDigest(chatId, withSummaries);

    await supabase
        .from('bookmarks')
        .update({ digest_sent: true })
        .in('id', bookmarks.map(b => b.id));
}

async function summarize(title, content, url) {
    if (!content) return `Saved from ${new URL(url).hostname}`;

    const response = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [{
            role: 'user',
            content: `Summarize this article in exactly 2 sentences. Be specific.\n\nTitle: ${title}\n\nContent: ${content.slice(0, 3000)}`
        }]
    });

    const summary = response.choices[0].message.content.trim();
    // console.log('Groq raw response:', JSON.stringify(response.choices[0]));
    // console.log('Summary generated:', summary);
    return summary;
}
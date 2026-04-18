import { createSupabaseServer } from '../../../lib/supabase-server';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
    try {
        const supabase = await createSupabaseServer();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { messages } = await req.json();

        // Fetch ALL bookmark summaries for context
        const { data: bookmarks } = await supabase
            .from('bookmarks')
            .select('title, summary, url')
            .eq('user_id', user.id);

        if (!bookmarks || bookmarks.length === 0) {
            return NextResponse.json({
                content: "I don't see any bookmarks in your library yet. Save some links first so I can help you summarize or find information!"
            });
        }

        // Prepare context
        const context = bookmarks.map((b, i) =>
            `[${i + 1}] ${b.title || 'Untitled'}\nSummary: ${b.summary || 'No summary available.'}\nURL: ${b.url}`
        ).join('\n\n');

        const systemPrompt = `You are Bookie AI, a helpful assistant for the Bookie bookmarking app. 
Your goal is to help the user understand, summarize, and navigate their saved bookmarks.
Below is the list of ALL bookmarks saved by the user. Use this context to answer their questions accurately.

USER BOOKMARKS:
${context}

Instructions:
1. Be concise and professional.
2. If you mention or discuss a specific bookmark, YOU MUST include its original URL as a markdown link in the format: [Link](URL).
3. If multiple bookmarks are relevant, cite them by title and provide their [Link](URL).
4. If asked to summarize, synthesize the information across relevant bookmarks and list the source [Link](URL) items at the end.`;

        const response = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: [
                { role: 'system', content: systemPrompt },
                ...messages
            ],
            temperature: 0.5,
            max_tokens: 1024,
        });

        return NextResponse.json({
            content: response.choices[0].message.content
        });

    } catch (error) {
        console.error('Chat error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

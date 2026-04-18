import { createClient } from '@supabase/supabase-js';
import { sendDigestToUser } from '../../../lib/digest';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function POST(req) {
  const cookieStore = await cookies();
  
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) { return cookieStore.get(name)?.value },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('telegram_chat_id')
    .eq('id', user.id)
    .single();

  if (!profile?.telegram_chat_id) {
    return Response.json({ error: 'Telegram not connected' }, { status: 400 });
  }

  await sendDigestToUser(user.id, profile.telegram_chat_id);
  return Response.json({ ok: true });
}
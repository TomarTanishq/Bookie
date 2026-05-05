# Bookie. — The Read-it-Later Killer

**Bookie** is a high-performance, minimalist bookmark management system designed to solve the "link graveyard" problem. Instead of saving articles you'll never read, Bookie actively forces consumption by delivering a radically compressed **Sunday Morning Digest** directly to your **Telegram**.

<img width="1863" height="768" alt="image" src="https://github.com/user-attachments/assets/6b01b174-242b-42ba-88f8-bd80df4d46a1" />


## Key Features

*   ** Sunday Morning Digest**: Every Sunday at 9:00 AM, Bookie uses LLMs (Groq/Gemini) to compress your week's bookmarks into vitals signals—dropping a beautiful, 2-sentence summary of each directly into your Telegram.
*   ** Seamless Extension Handshake**: A custom-built browser extension onboarding flow. No manual API keys—just a secure, one-click content-script handshake between the web app and your browser.
*   ** AI Chat Interface**: Talk to your knowledge base. Ask "What was that article about React 19?" and get an instant summary derived from your saved DOM content.
*   ** Multi-Channel Ingestion**: Save from your desktop via the extension, or forward links directly to the Bookie Telegram Bot from your mobile share sheet.
*   ** Premium Aesthetic**: A sophisticated, desaturated "Midnight Indigo" dark theme designed for focus and visual excellence.

## 🛠 Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Middleware)
*   **Database & Auth**: [Supabase](https://supabase.com/)
*   **AI Engines**: [Groq](https://groq.com/) (Llama 3) & [Google Gemini](https://ai.google.dev/)
*   **Styling**: Vanilla CSS + Tailwind-inspired utility classes for a customized, desaturated look.
*   **Integration**: Telegram Bot API ([node-telegram-bot-api](https://github.com/yagop/node-telegram-bot-api))

##  Getting Started

### 1. Prerequisites
*   A [Supabase](https://supabase.com/) project.
*   An [OpenAI](https://openai.com/), [Groq](https://groq.com/), or [Google AI](https://ai.google.dev/) API Key.
*   A Telegram Bot created via [@BotFather](https://t.me/botfather).

### 2. Environment Setup
Create a `.env.local` file in the root directory:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# AI Config
GROQ_API_KEY=your_groq_key
GEMINI_API_KEY=your_gemini_key

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Installation
```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

### 4. Database Schema
Run the following in your Supabase SQL Editor:
*   `profiles`: `id (uuid), telegram_chat_id (text), digest_day (int), digest_frequency (text)`
*   `bookmarks`: `id (uuid), user_id (uuid), url (text), title (text), summary (text), content (text), digest_sent (bool)`
*   `telegram_link_tokens`: `token (uuid), user_id (uuid), expires_at (timestamp)`

## 🔌 Browser Extension
The extension code is located in `/browser-extension`. 
1. Open `chrome://extensions/`.
2. Enable **Developer Mode**.
3. Click **Load unpacked** and select the `/browser-extension` folder.
4. Visit your deployed app's `/setup-extension` page to link it instantly.

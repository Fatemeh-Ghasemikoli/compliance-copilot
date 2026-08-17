# Compliance Copilot

Compliance Copilot is an AI-powered compliance assistant built for the Tevora Associate Developer take-home assignment.

Users can create an account, sign in, start conversations, ask compliance and security questions, and return later to view their saved conversation history.

## Live Demo

https://compliance-copilot-iota-dun.vercel.app

## Features

- Email/password authentication
- Persistent user-specific conversation history
- Claude-powered AI responses
- PostgreSQL database with Prisma ORM
- Conversation ownership and authorization checks
- Markdown-rendered assistant responses
- Secure server-side API key handling
- Session-based authentication
- Conversation history preserved across logins

## Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma 7
- PostgreSQL
- Anthropic Claude API
- bcryptjs
- jose
- react-markdown
- remark-gfm

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Fatemeh-Ghasemikoli/compliance-copilot.git
cd compliance-copilot
```

### 2. Install dependencies

```bash
npm install
```

The project automatically runs `prisma generate` after installation.

### 3. Configure environment variables

Copy the example environment file:

```bash
cp .env.example .env
```

Then update `.env` with your own values:

```env
DATABASE_URL="your-postgresql-connection-string"
AUTH_SECRET="your-random-secret"
ANTHROPIC_API_KEY="your-anthropic-api-key"
```

You can generate an authentication secret with:

```bash
openssl rand -base64 32
```

Do not commit your `.env` file or expose API keys in client-side code.

### 4. Apply database migrations

```bash
npx prisma migrate deploy
```

### 5. Start the development server

```bash
npm run dev
```

Then open:

```text
http://localhost:3000
```

## How It Works

After authentication, each user can create and access their own conversations. Conversation ownership is checked server-side before conversation data or messages are returned.

When a user sends a message:

1. The user message is saved to PostgreSQL.
2. Previous messages in the conversation are loaded in chronological order.
3. The full conversation history is sent to the Anthropic Claude API from the server.
4. After Claude returns a successful response, the assistant message is saved to PostgreSQL.
5. The conversation remains available when the user returns later.

If the AI request fails, the user's message remains saved, but a failed or incomplete assistant response is not stored as a completed message.

## Security

- Passwords are hashed with bcrypt before storage.
- Authentication uses signed session tokens stored in cookies.
- API keys and database credentials are stored in server-side environment variables.
- Conversation access is scoped to the authenticated user to prevent users from accessing another user's conversations.
- `.env` is excluded from Git, while `.env.example` contains placeholders only.

## AI Development Tools

AI-assisted development tools were used during implementation for planning, debugging, code review, and UI iteration.

See [WRITEUP.md](./WRITEUP.md) for details about the development process, AI usage, key decisions, and tradeoffs.

## Production Build

Run the production build with:

```bash
npm run build
```

The project is configured to use Webpack for the production build.

## Deployment

The application is deployed on Vercel. Production environment variables are configured separately for the database connection, authentication secret, and Anthropic API.

**Live application:**  
https://compliance-copilot-iota-dun.vercel.app
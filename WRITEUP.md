# AI-Assisted Development Write-Up

## Overview

I used Claude Code as an AI-assisted development tool throughout this take-home project. I treated AI as a development partner for evaluating options, accelerating implementation, reviewing code, and debugging issues rather than allowing it to make unrestricted decisions or changes.

I remained responsible for the project architecture, technical decisions, security considerations, testing, and final implementation. For major features, I reviewed the proposed approach before making changes and manually verified the important application flows afterward.

## How I Used Claude Code

At the beginning of each major feature, I first considered the requirements and the simplest architecture that would satisfy them. I then used Claude Code to inspect the existing project, compare implementation options, identify potential issues, and help implement the selected approach.

For authentication, I evaluated a custom JWT-based approach against using a full authentication framework. I used Claude Code to help compare the trade-offs, then chose a lightweight email/password flow using bcryptjs, jose, httpOnly cookies, and server-side authorization checks because it matched the scope of the assignment and kept the implementation easy to understand.

For the AI chat feature, I designed the request flow around authentication, ownership, persistence, and failure handling:

`user message → authentication check → ownership check → save message → load conversation history → call Claude API → save assistant response → return response`

I used Claude Code to review this flow and help implement the supporting route handlers and server-side utilities.

I also used Claude Code during code review to verify that conversation access was always scoped to the authenticated user and that sensitive values such as the database connection string, authentication secret, and Anthropic API key remained server-side.

## What I Delegated to AI

I used Claude Code to assist with:

- evaluating the Prisma data model
- comparing authentication approaches
- creating small server-side helpers
- implementing API route handlers
- integrating the Anthropic SDK
- building the initial chat interface
- improving the chat layout and user experience
- adding Markdown rendering for assistant responses
- reviewing authentication and conversation ownership checks
- diagnosing development and deployment issues
- reviewing implementation decisions for unnecessary complexity

I did not automatically accept AI-generated changes. I reviewed the proposed designs and code, tested the application manually, and revised or simplified suggestions when they did not fit the scope of the project.

## What I Handled and Verified Myself

I manually reviewed and tested the application's important behaviors, including:

- user registration
- login and logout
- protected route access
- conversation creation
- conversation persistence
- Claude API integration
- conversation history across sessions
- user ownership enforcement
- direct URL access to another user's conversation
- Markdown rendering and chat UI behavior
- environment variable configuration
- database migrations
- production build verification
- Vercel deployment

I also made decisions about project scope. I kept the database model focused on `User`, `Conversation`, and `Message`, avoided unnecessary session tables, chose a simple conversation-title strategy, and prioritized reliable authentication, authorization, persistence, and error handling over optional features.

## Where AI Helped Most

Claude Code was especially useful for quickly comparing implementation approaches and identifying trade-offs before writing code.

It also helped with:

- identifying potential security concerns
- explaining unfamiliar Next.js and Prisma patterns
- reducing repetitive implementation work
- reviewing API route structure
- debugging local development issues
- diagnosing production build and deployment problems
- improving the UI without changing working backend behavior

This allowed me to move faster while keeping the architecture understandable and focused on the assignment requirements.

## Where AI Got in the Way

AI-generated suggestions still required validation.

Some proposed approaches were more complex than necessary for a small take-home project, so I intentionally simplified them rather than adding abstractions or dependencies that did not provide enough value.

I also found that recommendations that appeared reasonable in development sometimes needed additional validation against the actual framework versions and production environment. This project uses Next.js 16 and Prisma 7, so I verified version-specific behavior instead of assuming generated recommendations were correct.

Production deployment was a good example. The application worked locally, but deployment exposed additional issues around production builds and Prisma Client generation. I verified the application using a production build, added Prisma Client generation to the deployment installation process, and adjusted the build configuration when the local and deployment environments behaved differently.

This reinforced an important lesson from using AI-assisted development: generated code or recommendations still need to be tested against the real runtime and deployment environment.

## Design Decisions and Trade-Offs

### Custom Authentication

I implemented a lightweight email/password authentication system using bcryptjs for password hashing and jose for signed JWT session tokens stored in cookies.

**Trade-off:** A database-backed session system or full authentication framework could provide features such as server-side session revocation and additional authentication providers. For this take-home, a stateless JWT-based approach kept the authentication flow small and understandable while still providing protected routes and user-specific data access.

### Conversation Ownership

Conversation access is always tied to the authenticated user. Server-side database queries use the authenticated user's ID when retrieving conversations rather than trusting a user ID supplied by the client.

**Trade-off:** This adds authorization checks throughout the data-access layer, but it prevents users from accessing another user's conversations by changing a conversation ID or directly visiting another URL.

### Full Conversation History

The application loads the conversation's messages in chronological order and sends the full conversation history to Claude for each request.

**Trade-off:** This is simple and appropriate for the scale of a take-home application. A production application with long conversations would eventually require context-window management, summarization, or another compaction strategy.

### Non-Streaming AI Responses

I implemented complete request/response handling instead of streaming Claude responses.

**Trade-off:** Streaming could provide a more responsive chat experience, but it adds complexity around partial responses, persistence, and error handling. I prioritized reliable message persistence and clear failure behavior first.

If the AI request fails, the user's message remains stored, while an incomplete or failed assistant response is not saved as a completed message.

### Simple Conversation Titles

Conversation titles are derived from the first user message rather than generated through an additional AI request.

**Trade-off:** AI-generated titles could be more polished, but using the first message avoids additional API usage, latency, and implementation complexity.

### Server-Side AI Integration

The Anthropic API is called only from the server. The API key is stored in an environment variable and is never exposed to client-side code.

**Trade-off:** All AI requests must pass through the application's server routes, but this provides a clear security boundary and keeps sensitive credentials out of the browser.

## What I Would Do With More Time

With additional time, I would consider adding:

- streaming Claude responses
- automated unit and integration tests
- stronger request validation
- rate limiting
- password reset functionality
- conversation deletion and renaming
- server-side session revocation
- pagination for large conversation lists
- summarization or context management for long conversations
- more robust production logging and monitoring
- additional mobile UI refinement
- deployment-specific performance monitoring

For a production compliance application, I would also spend additional time on audit logging, authorization testing, security hardening, and controls around sensitive information sent to the AI provider.

## Final Thoughts

Claude Code significantly accelerated implementation, debugging, and iteration, but I found it most valuable as a tool for evaluating options and reviewing engineering decisions rather than as a replacement for engineering judgment.

I remained responsible for the architecture, security decisions, scope, testing, and final implementation. When AI-generated suggestions were unnecessarily complex or did not match the actual behavior of the frameworks and deployment environment, I validated the behavior and adjusted the implementation accordingly.

Overall, using AI allowed me to iterate more quickly while still requiring me to understand, review, test, and take ownership of the code I submitted.
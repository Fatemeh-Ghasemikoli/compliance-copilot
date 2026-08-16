# AI-Assisted Development Write-Up

## Overview

I used Claude Code as an AI-assisted development tool throughout this take-home project. My goal was to use AI as a development partner rather than letting it make unrestricted decisions or changes.

I used Claude Code to help with architecture planning, implementation suggestions, debugging, and code review. I reviewed the proposed approaches before allowing changes and manually tested the important flows after implementation.

## How I Used Claude Code

At the beginning of each major feature, I asked Claude Code to inspect the current project and propose a small, maintainable architecture before modifying files.

For example, before implementing authentication, I asked Claude to compare a custom JWT-based approach with a full authentication framework and explain the trade-offs. I chose a simple email/password flow using bcryptjs, jose, httpOnly cookies, and server-side user checks because it fit the scope of the assignment and kept the implementation easy to understand.

For the AI chat feature, I asked Claude to explain the full request flow before coding:

user message → authentication check → ownership check → save message → load history → call Claude API → save assistant response → return response

I also used Claude Code to review conversation ownership and make sure all protected database queries were scoped to the authenticated user.

## What I Delegated to AI

I used Claude Code to help with:

- proposing the Prisma data model
- reviewing authentication architecture
- creating small server-side helpers
- implementing route handlers
- integrating the Anthropic SDK
- building the initial chat UI
- improving the chat layout
- adding Markdown rendering
- debugging development environment issues
- reviewing security and ownership checks

I did not simply accept all AI-generated changes. I reviewed the proposed design, tested the application manually, and asked Claude to explain or revise parts that were unclear or too complex.

## What I Handled and Verified Myself

I manually reviewed and tested the important application behaviors, including:

- user registration
- login and logout
- protected route access
- conversation persistence
- Claude API integration
- conversation history
- user ownership enforcement
- direct URL access to another user's conversation
- UI behavior and Markdown rendering

I also made decisions about the project scope, including keeping the database model limited to User, Conversation, and Message, avoiding unnecessary session tables, skipping streaming for the first version, and using a simple title based on the first user message.

## Where AI Helped Most

Claude Code was most useful for:

- quickly comparing implementation options
- identifying security concerns
- explaining unfamiliar Next.js and Prisma patterns
- reducing repetitive coding
- reviewing API route structure
- helping diagnose bugs and local development issues
- improving the UI without changing working backend logic

It helped me move faster while still keeping the project understandable.

## Where AI Got in the Way

There were also cases where AI introduced friction.

For example, some generated approaches were more complex than necessary for a small take-home assignment. I intentionally simplified those designs.

I also encountered long-running development and lint/build tasks when Claude Code launched shell commands in the background. In those cases, I stopped the automated workflow and ran the development server manually so I could see the output directly.

I also found that some AI-generated recommendations needed to be checked against the actual Next.js and Prisma versions in the project. For example, the project uses Next.js 16 and Prisma 7, so I verified the current file conventions and Prisma configuration before continuing.

## Design Decisions and Trade-Offs

### Custom authentication

I used a simple custom email/password authentication flow with bcryptjs and signed JWT cookies.

Trade-off:
A database-backed session system would allow server-side revocation, but a stateless JWT session was simpler and appropriate for this take-home scope.

### Full conversation history

The application sends the full conversation history to Claude on each request.

Trade-off:
This is simple and works well for a small demonstration app, but a production application with very long conversations would eventually need summarization or context management.

### No streaming

I intentionally implemented complete request/response handling instead of streaming responses.

Trade-off:
Streaming would improve the user experience, but the assignment listed it as optional. I prioritized reliable persistence, authentication, ownership, and error handling first.

### Simple conversation titles

Conversation titles are generated from the first user message rather than using an additional AI request.

Trade-off:
AI-generated titles could be more polished, but the simpler approach avoids extra latency, API usage, and complexity.

## What I Would Do With More Time

With additional time, I would add:

- streaming Claude responses
- automated unit and integration tests
- stronger request validation
- rate limiting
- password reset
- conversation deletion and renaming
- session revocation
- pagination for large conversation lists
- summarization for long chat histories
- more robust production logging and monitoring
- deployment-specific performance tuning

## Final Thoughts

The most valuable part of using Claude Code was not code generation itself, but the ability to quickly evaluate design options, review implementation decisions, and debug issues.

I treated AI output as a starting point rather than a final answer. I reviewed the code, tested the behavior, and made decisions based on the requirements and the scope of the assignment.
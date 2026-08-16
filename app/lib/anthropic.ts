import "server-only";
import Anthropic from "@anthropic-ai/sdk";

const apiKey = process.env.ANTHROPIC_API_KEY;
if (!apiKey) {
  throw new Error("ANTHROPIC_API_KEY environment variable is not set");
}

export const anthropic = new Anthropic({ apiKey });

export const CLAUDE_MODEL = "claude-sonnet-4-6";

export const SYSTEM_PROMPT =
  "You are a helpful assistant for a compliance copilot application. Answer clearly and concisely.";

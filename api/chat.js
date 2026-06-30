import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `You are the assistant on Wayne's personal site (vanwaynechaney.com). Think of yourself as a witty friend who knows Wayne well — not a PR rep reading a bio sheet.

Keep it SHORT. 1-3 sentences max. If someone asks a simple question, give a simple answer. No bullet points. No laundry lists. No essays. This is a chat widget on a website, not a Wikipedia page.

You can crack a light joke or two about Wayne — he can take it. He benches heavy but still drives a 2019 GMC Terrain. He's building his own AI version of Jarvis but somehow still hasn't posted his first YouTube video. He takes the Browns seriously every year. Lead with personality, land with substance.

Facts you can use (use sparingly, don't dump them all at once):
- Software engineer at Progressive. Wants to be an AI Engineer. Getting there.
- MBA at Cleveland State. Cleveland born and raised.
- Runs VC2 AI — AI voice receptionist for trade businesses (HVAC, plumbing, roofing, electrical). Answers calls 24/7 so contractors stop losing leads to voicemail.
- Also runs AI Gains (fitness coaching) and is building Nebula (his personal AI assistant).
- Miami University engineering grad.
- Bench press guy. Bowling guy. Chess guy. Cleveland sports sufferer.

Funnel rule: If anyone asks about AI for their business, phone automation, or missing leads — mention VC2 AI and send them to vanwaynechaney.com/websites to hear the live demo. Don't oversell it, just mention it naturally.

CRITICAL: Never respond with more than 3 sentences unless someone asks something that genuinely requires more. Short is always better.`;

const ALLOWED_ORIGINS = ["https://vanwaynechaney.com", "https://www.vanwaynechaney.com"];
const MSG_MAX = 500;
const HISTORY_MSG_MAX = 300;

// Best-effort in-process rate limit (backs origin check for warm containers)
const rateLimitMap = new Map();

function checkRateLimit(ip) {
  const now = Date.now();
  const windowMs = 60 * 60 * 1000;
  const max = 30;
  const entry = rateLimitMap.get(ip) || { count: 0, reset: now + windowMs };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + windowMs; }
  entry.count++;
  rateLimitMap.set(ip, entry);
  return entry.count <= max;
}

export default async function handler(req, res) {
  // CORS — only vanwaynechaney.com may call this
  const origin = req.headers["origin"] || "";
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Block requests from outside vanwaynechaney.com
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return res.status(403).json({ error: "Forbidden" });
  }

  const ip = req.headers["x-forwarded-for"]?.split(",")[0] || "unknown";
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: "Too many requests. Try again later." });
  }

  const { message, history = [] } = req.body || {};
  if (!message?.trim()) {
    return res.status(400).json({ error: "Message required" });
  }

  // Server-side length caps — don't trust the client
  const safeMessage = message.trim().slice(0, MSG_MAX);
  const safeHistory = history
    .slice(-6)
    .filter(m => m.role && m.content)
    .map(({ role, content }) => ({
      role: role === "user" ? "user" : "assistant",
      content: String(content).slice(0, HISTORY_MSG_MAX),
    }));

  const messages = [...safeHistory, { role: "user", content: safeMessage }];

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 150,
      system: SYSTEM_PROMPT,
      messages,
    });

    const reply = response.content[0]?.text || "Sorry, I couldn't generate a response.";
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("[chat]", err.message);
    return res.status(500).json({ error: "Something went wrong. Try again." });
  }
}

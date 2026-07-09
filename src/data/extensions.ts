export type ExtensionEntry = {
  crate: string;
  provides: string[];
  how: string;
  install: string;
};

export type ExtensionCategory = {
  id: string;
  title: string;
  intro: string;
  extensions: ExtensionEntry[];
};

export const categories: ExtensionCategory[] = [
  {
    id: "inference",
    title: "Inference providers",
    intro:
      "Inference extensions install an InferenceEngine into the registry. The turn engine streams provider events (text, reasoning, tool calls) through the same interface regardless of vendor, so providers are swappable without touching the core loop.",
    extensions: [
      {
        crate: "roder-ext-openai-responses",
        provides: ["InferenceEngine({provider_id})"],
        how: "Generic OpenAI Responses API engine: streams /v1/responses and maps output items and deltas to inference events, including reasoning summaries and hosted web search. Reused as the engine for xAI API-key, OpenRouter, Codex OAuth, and custom OpenAI-compatible providers, registering as roder-ext-openai-responses-{provider_id}.",
        install: "When configured",
      },
      {
        crate: "roder-ext-openai-chat-completions",
        provides: ["InferenceEngine(openai-chat-completions)"],
        how: "Streams the classic OpenAI Chat Completions API (/v1/chat/completions) through a shared stream_chat_completions helper. Not wired into the default host; mainly consumed as a library by other providers such as Xiaomi MiMo.",
        install: "Opt-in",
      },
      {
        crate: "roder-ext-anthropic",
        provides: ["InferenceEngine(anthropic)"],
        how: "Maps harness turns to Anthropic Messages API request bodies and streams SSE from api.anthropic.com, translating tool_use content blocks into harness tool-call events. Resolves the API key at call time from config or environment.",
        install: "When configured",
      },
      {
        crate: "roder-ext-gemini",
        provides: ["InferenceEngine(gemini)"],
        how: "Adapts harness turns to the Google Gemini generateContent streaming API with text and tool-call support.",
        install: "When configured",
      },
      {
        crate: "roder-ext-vertex",
        provides: ["InferenceEngine(vertex)"],
        how: "Runs Gemini models on Vertex AI using service-account OAuth (credentials path or inline JSON) with project and location configuration.",
        install: "When configured",
      },
      {
        crate: "roder-ext-xai",
        provides: ["InferenceEngine(supergrok)", "InferenceEngine(xai)"],
        how: "Always registers the SuperGrok OAuth engine; when an xAI API key is declared it additionally installs a direct xAI surface built on the OpenAI Responses engine pointed at api.x.ai/v1. Both catalogs default to grok-4.5 with 500k context and high reasoning.",
        install: "Default · SuperGrok",
      },
      {
        crate: "roder-ext-claude-code",
        provides: ["InferenceEngine(claude-code)"],
        how: "Spawns and manages the Claude Code CLI through the claude-agent-sdk, streaming SDK events into harness inference events. Reuses the CLI session by default so conversation history stays on the Claude Code side. When a paired Claude-in-Chrome extension is detected, it can authorize the CLI's native browser tools and render their activity as hosted tool calls in Roder.",
        install: "Default",
      },
      {
        crate: "roder-ext-cursor",
        provides: ["InferenceEngine(cursor)"],
        how: "Talks directly to Cursor's AgentService backend APIs for Composer-style agent turns, including fast model variants, Claude Fable 5, reasoning parameters, and stable per-thread conversation ids. Live turns require a Cursor User API key.",
        install: "Default",
      },
      {
        crate: "roder-ext-kimi-code",
        provides: ["InferenceEngine(kimi-code)"],
        how: "Kimi Code provider for Kimi subscription OAuth or API-key auth. The CLI can save keys with roder auth login kimi-code --api-key, and app-server auth status reports configured API-key state.",
        install: "Default · OAuth or key",
      },
      {
        crate: "roder-ext-fireworks",
        provides: ["InferenceEngine(fireworks)"],
        how: "First-party Fireworks AI provider using account-scoped model ids, offline catalog metadata, model discovery, and the OpenAI-compatible Responses transport.",
        install: "Default · needs key",
      },
      {
        crate: "roder-ext-openrouter",
        provides: ["InferenceEngine(openrouter)"],
        how: "OpenRouter API-key provider built on the OpenAI Responses engine, with optional HTTP-Referer and X-Title attribution headers.",
        install: "Default · needs key",
      },
      {
        crate: "roder-ext-opencode",
        provides: ["InferenceEngine(opencode)", "InferenceEngine(opencode-go)"],
        how: "Two OpenCode subscription providers (Zen and Go) speaking a chat-completions-style HTTP API at opencode.ai, with cached model lists and retry policy.",
        install: "Default",
      },
      {
        crate: "roder-ext-poolside",
        provides: ["InferenceEngine(poolside)"],
        how: "Poolside Laguna API-key provider using chat completions at inference.poolside.ai/v1 with cached /models discovery.",
        install: "Default",
      },
      {
        crate: "roder-ext-roder-cloud",
        provides: ["InferenceEngine(roder-cloud)"],
        how: "Hosted roder.cloud inference: prunes requests down to a documented Responses-API subset, exchanges a roder_ API key for short-lived JWTs, and parses edge Responses payloads. Hosted tools are intentionally omitted.",
        install: "Default · needs key",
      },
      {
        crate: "roder-ext-xiaomi-mimo",
        provides: [
          "InferenceEngine(xiaomi-mimo)",
          "InferenceEngine(xiaomi-mimo-token-plan)",
          "SpeechSynthesizer(xiaomi-mimo)",
          "SpeechSynthesizer(xiaomi-mimo-token-plan)",
        ],
        how: "Xiaomi MiMo in both pay-as-you-go and Token Plan billing modes via OpenAI-compatible chat completions, plus matching text-to-speech synthesizer surfaces.",
        install: "Default",
      },
      {
        crate: "roder-ext-inference-router",
        provides: ["InferenceRouter(local)"],
        how: "Local policy router for adaptive model selection: when [inference_router] is enabled it scores turn signals and picks a tiered provider, model, and reasoning level from config before each turn.",
        install: "Default · off until configured",
      },
    ],
  },
  {
    id: "speech",
    title: "Speech and transcription",
    intro:
      "Speech extensions install SpeechTranscriber (audio in) or SpeechSynthesizer (audio out) services used by voice-capable clients.",
    extensions: [
      {
        crate: "roder-ext-openai-speech",
        provides: ["SpeechTranscriber(openai-speech)"],
        how: "Posts captured audio to OpenAI transcription endpoints (Whisper-class models) and returns normalized transcripts with metadata.",
        install: "Default · needs key",
      },
      {
        crate: "roder-ext-google-speech",
        provides: ["SpeechTranscriber(google-speech)"],
        how: "Google Cloud Speech-to-Text client supporting OAuth access tokens, API keys, or Application Default Credentials, with project and location awareness.",
        install: "Default · needs credentials",
      },
    ],
  },
  {
    id: "embeddings",
    title: "Embeddings",
    intro:
      "Embedding extensions install an EmbeddingProvider used by the memory system for vector recall. The active provider is selected by memory configuration.",
    extensions: [
      {
        crate: "roder-ext-openai-embeddings",
        provides: ["EmbeddingProvider(openai)"],
        how: "Calls the OpenAI embeddings API (text-embedding-3 family). The default embedding provider for the SQLite memory store when an OpenAI key is present.",
        install: "Default · needs key",
      },
      {
        crate: "roder-ext-google-embeddings",
        provides: ["EmbeddingProvider(google)"],
        how: "Gemini Embedding 2 via the Generative Language API, with separate query and document input modes for retrieval.",
        install: "Default · needs key",
      },
      {
        crate: "roder-ext-zeroentropy-embeddings",
        provides: ["EmbeddingProvider(zeroentropy)"],
        how: "ZeroEntropy zembed-1 embeddings with configurable encoding format and latency tier, and query/document retrieval intent.",
        install: "Default · needs key",
      },
    ],
  },
  {
    id: "memory",
    title: "Memory and knowledge",
    intro:
      "Memory extensions bundle three services: a MemoryStore for persistence, a ContextProvider that injects recalled records into turns, and a ToolProvider with memory CRUD and search tools. Only one memory backend is active at a time, chosen by RODER_MEMORY_BACKEND.",
    extensions: [
      {
        crate: "roder-ext-memory",
        provides: [
          "MemoryStore(sqlite-memory)",
          "ContextProvider(memory-context)",
          "ToolProvider(memory-tools)",
        ],
        how: "SQLite-backed project and global memory under {roder_home}/memory, with an optional embedding provider for vector recall. The default memory backend.",
        install: "Default backend",
      },
      {
        crate: "roder-ext-honcho",
        provides: [
          "MemoryStore(honcho-memory)",
          "ContextProvider(memory-context)",
          "ToolProvider(memory-tools)",
        ],
        how: "Remote Honcho workspace backend: a REST client maps memory scopes to Honcho sessions and peers, and semantic search is delegated to Honcho's hosted retrieval instead of local vectors.",
        install: "Config-selected",
      },
      {
        crate: "roder-ext-knowledge-md",
        provides: [
          "KnowledgeStore(markdown-knowledge)",
          "ToolProvider(knowledge-tools)",
          "ContextProvider(knowledge-context)",
        ],
        how: "Project knowledge base stored as Markdown files with YAML front matter under {roder_home}/knowledge. Exposes knowledge_* tools and, when recall is enabled, injects matching documents into context (default limit four).",
        install: "When enabled",
      },
    ],
  },
  {
    id: "persistence",
    title: "Session and thread persistence",
    intro:
      "Thread stores persist sessions, turn items, and events so resumes, forks, replays, and evals all read the same durable record.",
    extensions: [
      {
        crate: "roder-ext-jsonl-thread-store",
        provides: ["ThreadStore(jsonl-thread-store)"],
        how: "Append-only JSONL event logs per thread under {roder_home}/threads/{thread_id}/, with a thread-index.json for listing, plus archive and restore support. The default store.",
        install: "Default",
      },
      {
        crate: "roder-ext-postgres-session",
        provides: ["ThreadStore(postgres-session)"],
        how: "Tenant-scoped PostgreSQL persistence for threads and context artifacts over async SQL, configured with a database_url. Built for multi-tenant hosted deployments.",
        install: "When configured",
      },
    ],
  },
  {
    id: "web-search",
    title: "Web search tools",
    intro:
      "Web search uses a canonical router plus optional provider-specific tools. The router exposes one unified web_search tool; namespaced mode installs the per-provider tools directly.",
    extensions: [
      {
        crate: "roder-ext-web-search",
        provides: ["ToolProvider(web-search)"],
        how: "The canonical web_search router: delegates each query to the configured backend (Firecrawl, Perplexity, Tavily, or Parallel) and normalizes results into one response shape.",
        install: "When enabled",
      },
      {
        crate: "roder-ext-firecrawl-search",
        provides: ["ToolProvider(firecrawl-search)"],
        how: "Firecrawl search API client exposing namespaced search and retrieval tools; also serves as a router backend.",
        install: "Router backend",
      },
      {
        crate: "roder-ext-perplexity-search",
        provides: ["ToolProvider(perplexity-search)"],
        how: "Perplexity raw Search API tools with request-id metadata extraction.",
        install: "Router backend",
      },
      {
        crate: "roder-ext-tavily-search",
        provides: ["ToolProvider(tavily-search)"],
        how: "Tavily search API adapter exposing Tavily-backed search tools.",
        install: "Router backend",
      },
      {
        crate: "roder-ext-parallel-search",
        provides: ["ToolProvider(parallel-search)"],
        how: "Parallel.ai objective-oriented search with extended tool-argument options for goal-directed queries.",
        install: "Router backend",
      },
    ],
  },
  {
    id: "tools",
    title: "Tools, browser, VCS, and language",
    intro:
      "ToolProvider extensions add callable tools to the registry; the policy layer governs every invocation. This group also covers version control and workspace fork providers.",
    extensions: [
      {
        crate: "roder-ext-chrome",
        provides: ["ToolProvider(chrome)"],
        how: "Registers chrome_* tools bound to the Roder browser-extension bridge, letting the agent inspect, control, debug, and record the user's live Chrome session.",
        install: "Default",
      },
      {
        crate: "roder-ext-webwright",
        provides: ["TaskExecutor(webwright.browser_task)", "ToolProvider(webwright)"],
        how: "Playwright-based browser automation: a background webwright.browser_task executor plus helper tools. Runs a shell preflight for Playwright dependencies and writes artifacts under Roder home.",
        install: "Default",
      },
      {
        crate: "roder-ext-mcp",
        provides: ["ToolProvider(mcp-tools)"],
        how: "Connects to configured MCP servers over streamable HTTP, registers their tools, and forwards optional per-thread bearer identity. Offline servers warn in discover mode or fail startup in discover_required mode.",
        install: "Opt-in",
      },
      {
        crate: "roder-ext-git",
        provides: ["VersionControlProvider(git)", "ForkProvider(git-worktree)"],
        how: "Shells out to git for status, diffs, snapshots, and line metadata, and creates linked git worktrees for workspace forks.",
        install: "Default",
      },
      {
        crate: "roder-ext-fork-rift",
        provides: ["ForkProvider(rift)"],
        how: "Copy-on-write workspace snapshots by shelling out to a configured rift binary (APFS clonefile, btrfs snapshots, reflinks) behind a narrow CLI adapter with typed errors, since the rift CLI is pre-1.0.",
        install: "Default · needs binary",
      },
      {
        crate: "roder-ext-zerolang",
        provides: ["ToolProvider(zerolang)"],
        how: "Invokes the configured zero compiler binary for diagnostics, graph inspection, validation, fix plans, and checked ProgramGraph edits (zerolang_edit, zerolang_check, and friends).",
        install: "Default · needs binary",
      },
      {
        crate: "roder-ext-task-ledger",
        provides: ["ToolProvider(task-ledger)"],
        how: "An in-process task_ledger.update tool that maintains a validated task snapshot — pending, in_progress, completed, blocked — with optional evidence per item.",
        install: "Default",
      },
      {
        crate: "roder-ext-verification",
        provides: ["ToolProvider(verification)"],
        how: "A verification_review gate tool for eval and non-interactive coding turns: the model submits structured completion evidence, and status, gap, and skip-reason rules are validated server-side.",
        install: "Default",
      },
    ],
  },
  {
    id: "policy",
    title: "Policy",
    intro:
      "PolicyContributor extensions participate in tool-call review alongside the core permission system.",
    extensions: [
      {
        crate: "roder-ext-plan-mode",
        provides: ["PolicyContributor(plan-mode)", "ToolProvider(plan-mode-tools)"],
        how: "Installs the plan-mode policy contributor plus the exit_plan_mode tool the model calls to leave planning and begin execution.",
        install: "Default",
      },
    ],
  },
  {
    id: "tasks",
    title: "Task executors and subagents",
    intro:
      "TaskExecutor extensions run background work outside the main turn; the SubagentDispatcher runs nested agents with their own budgets and tool registries.",
    extensions: [
      {
        crate: "roder-ext-task-process",
        provides: ["TaskExecutor(process)"],
        how: "Spawns background shell processes in the workspace (via the unix-local runner when remote), streaming stdout and stderr and tracking a process descriptor for stop and resume.",
        install: "Default",
      },
      {
        crate: "roder-ext-task-subagent",
        provides: ["TaskExecutor(subagent)"],
        how: "Background subagent tasks: deserializes task input and delegates to the first registered SubagentDispatcher, so it requires the subagents extension to be installed first.",
        install: "Opt-in",
      },
      {
        crate: "roder-ext-subagents",
        provides: [
          "SubagentDispatcher(in-process-subagents)",
          "ToolProvider(roder-subagents-task)",
          "ToolProvider(agent_swarm)",
        ],
        how: "An in-process dispatcher for child turns against the parent tool registry. Exposes task and bounded agent_swarm fanout with pacing, concurrency limits, rate-limit backoff, cancellation, live progress, and ordered results.",
        install: "When enabled",
      },
    ],
  },
  {
    id: "notifications",
    title: "Notifications",
    intro:
      "NotificationSink extensions deliver turn and task lifecycle events (NeedsInput, TurnIdle, TaskCompleted, TaskFailed) to the user.",
    extensions: [
      {
        crate: "roder-ext-notify-terminal",
        provides: ["NotificationSink(terminal-bell)"],
        how: "Writes an ASCII bell to stderr for selected notification kinds, throttled to once every two seconds.",
        install: "Default",
      },
      {
        crate: "roder-ext-notify-desktop",
        provides: ["NotificationSink(desktop)"],
        how: "Best-effort native OS notifications via notify-rust when the desktop feature is enabled.",
        install: "When enabled",
      },
    ],
  },
  {
    id: "runners",
    title: "Remote runners",
    intro:
      "RemoteRunnerProvider extensions execute workspace commands and file I/O behind one common protocol covering files, commands, ports, snapshots, mounts, artifacts, and provider state. Most hosted runners share a single HTTP client from roder-ext-runner-hosted-common.",
    extensions: [
      {
        crate: "roder-ext-runner-unix-local",
        provides: ["RemoteRunnerProvider(unix-local)"],
        how: "Runs commands and file I/O directly against a canonical local workspace root with path-escape guards. No snapshot support.",
        install: "Default",
      },
      {
        crate: "roder-ext-runner-docker",
        provides: ["RemoteRunnerProvider(docker)"],
        how: "Starts a long-lived container with the workspace bind-mounted; commands and file ops run through docker exec, and snapshots use docker export.",
        install: "Default · needs Docker",
      },
      {
        crate: "roder-ext-runner-sprites",
        provides: ["RemoteRunnerProvider(sprites)"],
        how: "Fly Sprites sandboxes over HTTP and WebSocket: creates and restores sprites, applies policies, materializes runner manifests, and can deploy a managed remote app-server.",
        install: "Default · needs token",
      },
      {
        crate: "roder-ext-runner-blaxel",
        provides: ["RemoteRunnerProvider(blaxel)"],
        how: "First-party Blaxel Sandboxes provider over the control-plane plus per-sandbox process, filesystem, and preview APIs. It routes coding tools into the selected sandbox and supports pause/resume plus durable detach/rejoin across Roder restarts.",
        install: "Default · needs API key and workspace",
      },
      {
        crate: "roder-ext-runner-cloudflare",
        provides: ["RemoteRunnerProvider(cloudflare)"],
        how: "Hosted Cloudflare runner via the shared hosted-runner REST client.",
        install: "Default · needs token",
      },
      {
        crate: "roder-ext-runner-daytona",
        provides: ["RemoteRunnerProvider(daytona)"],
        how: "Hosted Daytona runner via the shared hosted-runner REST client.",
        install: "Default · needs key",
      },
      {
        crate: "roder-ext-runner-e2b",
        provides: ["RemoteRunnerProvider(e2b)"],
        how: "Hosted E2B runner via the shared hosted-runner REST client.",
        install: "Default · needs key",
      },
      {
        crate: "roder-ext-runner-modal",
        provides: ["RemoteRunnerProvider(modal)"],
        how: "Hosted Modal runner via the shared hosted-runner REST client.",
        install: "Default · needs token",
      },
      {
        crate: "roder-ext-runner-runloop",
        provides: ["RemoteRunnerProvider(runloop)"],
        how: "Hosted Runloop runner via the shared hosted-runner REST client.",
        install: "Default · needs key",
      },
      {
        crate: "roder-ext-runner-vercel",
        provides: ["RemoteRunnerProvider(vercel)"],
        how: "Hosted Vercel runner via the shared hosted-runner REST client.",
        install: "Default · needs token",
      },
    ],
  },
  {
    id: "infrastructure",
    title: "Infrastructure and support crates",
    intro:
      "These crates round out the extension system: one bridges out-of-process extensions, the others are libraries without runtime manifests of their own.",
    extensions: [
      {
        crate: "roder-ext-process-host",
        provides: ["Dynamic: bridges any child-declared service"],
        how: "Spawns child processes declared in [[process_extensions]] config and speaks newline-delimited JSON-RPC over stdio, bridging the child's declared services (inference engines, event sinks, dispatchers, task executors) into the registry. This is how extensions written in any language plug in.",
        install: "Per config entry",
      },
      {
        crate: "roder-ext-runner-hosted-common",
        provides: ["Support library (no manifest)"],
        how: "The shared HTTP client implementing the hosted-runner session protocol (sessions, commands, files) used by the Cloudflare, Daytona, E2B, Modal, Runloop, and Vercel runner crates. Blaxel now uses its provider-specific sandbox APIs.",
        install: "Library",
      },
      {
        crate: "roder-ext-disk-context",
        provides: ["Helper only (extension not yet implemented)"],
        how: "Exports a saved_context_block helper for building disk-sourced context blocks. Distribution metadata references a DiskContextExtension that is not implemented yet, so there is currently no runtime install path.",
        install: "Not installable yet",
      },
    ],
  },
];

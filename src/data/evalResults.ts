export type EvalRunKind = "full-suite" | "targeted" | "smoke";

export interface EvalRun {
  id: string;
  title: string;
  kind: EvalRunKind;
  suite: string;
  model: string;
  reasoning: string;
  startedAt: string;
  passes: number;
  trials: number;
  harborErrors: number;
  clean: boolean;
  softTimeouts?: number;
  softTimeoutFails?: number;
  providerPolicyBlocks?: number;
  internalDeadlineTimeouts?: number;
  reportPath: string;
  notes: string[];
}

export interface LeaderboardContext {
  sourceUrl: string;
  sourceLabel: string;
  snapshotDate: string;
  totalEntries: number;
  theoreticalRank: number;
  upperNeighbor: {
    rank: number;
    name: string;
    scorePercent: number;
  };
  lowerNeighbor: {
    rank: number;
    name: string;
    scorePercent: number;
  };
  caveat: string;
}

export const evalRuns: EvalRun[] = [
  {
    id: "tbench-full-gpt55-medium",
    title: "Initial full GPT-5.5 medium run",
    kind: "full-suite",
    suite: "Terminal-Bench 2.0 full suite",
    model: "codex/gpt-5.5",
    reasoning: "medium",
    startedAt: "2026-05-24T19:16:28",
    passes: 43,
    trials: 89,
    harborErrors: 0,
    clean: true,
    softTimeouts: 21,
    softTimeoutFails: 17,
    providerPolicyBlocks: 1,
    internalDeadlineTimeouts: 0,
    reportPath: "evals/reports/harbor/roder-tbench-full-gpt55-medium-analysis.json",
    notes: [
      "First clean full-suite score recorded in the current public dashboard.",
      "Established the baseline for deadline, timeout, and score-improvement work.",
    ],
  },
  {
    id: "tbench-full-gpt55-medium-strict",
    title: "Strict medium baseline",
    kind: "full-suite",
    suite: "Terminal-Bench 2.0 full suite",
    model: "codex/gpt-5.5",
    reasoning: "medium",
    startedAt: "2026-05-24T23:46:35",
    passes: 47,
    trials: 89,
    harborErrors: 0,
    clean: true,
    softTimeouts: 13,
    softTimeoutFails: 11,
    providerPolicyBlocks: 5,
    internalDeadlineTimeouts: 0,
    reportPath: "evals/reports/harbor/roder-tbench-full-gpt55-medium-strict-analysis.json",
    notes: [
      "Disabled speed-policy drift and removed disqualifying Docker task resource overrides.",
      "Improved the baseline by four passes while keeping Harbor errors at zero.",
    ],
  },
  {
    id: "tbench-full-gpt55-medium-deadline-reliability",
    title: "Deadline and reliability full run",
    kind: "full-suite",
    suite: "Terminal-Bench 2.0 full suite",
    model: "codex/gpt-5.5",
    reasoning: "medium",
    startedAt: "2026-05-25T03:05:42",
    passes: 50,
    trials: 89,
    harborErrors: 0,
    clean: true,
    softTimeouts: 11,
    softTimeoutFails: 8,
    providerPolicyBlocks: 6,
    internalDeadlineTimeouts: 3,
    reportPath: "evals/reports/harbor/roder-tbench-full-gpt55-medium-deadline-reliability-analysis.json",
    notes: [
      "Added deadline-aware command execution and graceful finalization paths.",
      "Reached 50/89 on the full suite, a seven-pass lift from the initial baseline.",
    ],
  },
  {
    id: "tbench-remaining-failures-xhigh",
    title: "Remaining-failures xhigh rerun",
    kind: "targeted",
    suite: "Terminal-Bench remaining-failure subset",
    model: "codex/gpt-5.5",
    reasoning: "xhigh",
    startedAt: "2026-05-25T13:58:28",
    passes: 7,
    trials: 35,
    harborErrors: 0,
    clean: true,
    softTimeouts: 9,
    softTimeoutFails: 8,
    providerPolicyBlocks: 5,
    internalDeadlineTimeouts: 9,
    reportPath: "evals/reports/harbor/roder-tbench-remaining-failures-gpt55-xhigh-analysis.json",
    notes: [
      "Measured whether higher reasoning alone converts the remaining full-suite failures.",
      "Produced seven conversions for later campaign planning.",
    ],
  },
  {
    id: "tbench-plan-first-v2",
    title: "Plan-first targeted rerun",
    kind: "targeted",
    suite: "Terminal-Bench remaining-failure subset",
    model: "codex/gpt-5.5",
    reasoning: "medium plan, xhigh implementation",
    startedAt: "2026-05-25T17:29:18",
    passes: 4,
    trials: 28,
    harborErrors: 0,
    clean: true,
    softTimeouts: 10,
    softTimeoutFails: 10,
    providerPolicyBlocks: 1,
    internalDeadlineTimeouts: 10,
    reportPath: "evals/reports/harbor/roder-tbench-remaining-failures-gpt55-xhigh-plan-first-v2-analysis.json",
    notes: [
      "Runs a planning turn, stores plan artifacts, then resumes the same thread for implementation.",
      "Converted git-leak-recovery, model-extraction-relu-logits, polyglot-rust-c, and regex-chess.",
    ],
  },
  {
    id: "tbench-plan-first-smoke-polyglot-rust-c",
    title: "Plan-first smoke",
    kind: "smoke",
    suite: "Terminal-Bench single-task smoke",
    model: "codex/gpt-5.5",
    reasoning: "medium plan, xhigh implementation",
    startedAt: "2026-05-25T17:06:24",
    passes: 1,
    trials: 1,
    harborErrors: 0,
    clean: true,
    reportPath: "evals/reports/harbor/roder-tbench-plan-first-smoke-polyglot-rust-c-analysis.json",
    notes: ["Validated plan-first mechanics on polyglot-rust-c before the broader targeted rerun."],
  },
  {
    id: "tbench-gemini35-flash-validation",
    title: "Gemini 3.5 Flash validation",
    kind: "targeted",
    suite: "Terminal-Bench provider-validation subset",
    model: "gemini/gemini-3.5-flash",
    reasoning: "default",
    startedAt: "2026-05-26T18:47:03",
    passes: 5,
    trials: 6,
    harborErrors: 0,
    clean: true,
    reportPath: "evals/reports/harbor/roder-tbench-gemini35-flash-validation-analysis.json",
    notes: ["Provider validation subset for the Gemini path; not directly comparable to full-suite GPT-5.5 runs."],
  },
  {
    id: "tbench-21-smoke-write-compressor-gpt55-xhigh",
    title: "Terminal-Bench 2.1 write-compressor smoke",
    kind: "smoke",
    suite: "Terminal-Bench 2.1 single-task smoke",
    model: "codex/gpt-5.5",
    reasoning: "xhigh",
    startedAt: "2026-07-02T00:14:04.693160",
    passes: 1,
    trials: 1,
    harborErrors: 0,
    clean: true,
    reportPath: "evals/reports/harbor/roder-tbench-21-smoke-write-compressor-gpt55-xhigh-analysis.json",
    notes: [
      "Pre-full-run smoke against Terminal-Bench 2.1 after upgrading the Harbor adapter to Harbor 0.16.x.",
      "Passed cleanly with reward 1.0.",
    ],
  },
  {
    id: "tbench-21-smoke-break-filter-js-from-html-gpt55-xhigh",
    title: "Terminal-Bench 2.1 break-filter-js-from-html smoke",
    kind: "smoke",
    suite: "Terminal-Bench 2.1 single-task smoke",
    model: "codex/gpt-5.5",
    reasoning: "xhigh",
    startedAt: "2026-07-02T00:24:35.565400",
    passes: 0,
    trials: 1,
    harborErrors: 1,
    clean: false,
    reportPath: "evals/reports/harbor/roder-tbench-21-smoke-break-filter-js-from-html-gpt55-xhigh-analysis.json",
    notes: [
      "Second pre-full-run smoke; Roder wrote task output but Harbor classified the trial as AgentTimeoutError.",
      "Kept as harness evidence for the phase 107 timeout-cleanup plan.",
    ],
  },
  {
    id: "tbench-21-full-gpt55-xhigh",
    title: "Terminal-Bench 2.1 xhigh full run",
    kind: "full-suite",
    suite: "Terminal-Bench 2.1 full suite",
    model: "codex/gpt-5.5",
    reasoning: "xhigh",
    startedAt: "2026-07-02T00:46:29.602919",
    passes: 65,
    trials: 89,
    harborErrors: 19,
    clean: false,
    softTimeouts: 3,
    softTimeoutFails: 2,
    providerPolicyBlocks: 0,
    internalDeadlineTimeouts: 3,
    reportPath: "evals/reports/harbor/roder-tbench-21-full-gpt55-xhigh-analysis.json",
    notes: [
      "One non-submittable development pass over Terminal-Bench 2.1 with Harbor 0.16.x, n-attempts=1, and n-concurrent=4.",
      "Harbor score was 65 reward-1 tasks out of 89; the local analyzer counted 60 clean passes because 5 reward-1 tasks also had harness exceptions.",
      "The 19 Harbor exceptions were 15 AgentTimeoutError trials and 4 setup RuntimeError trials; phase 107 tracks the cleanup before the next full run.",
    ],
  },
  {
    id: "tbench-21-full-gpt55-xhigh-clean-local",
    title: "Terminal-Bench 2.1 xhigh clean local run",
    kind: "full-suite",
    suite: "Terminal-Bench 2.1 full suite",
    model: "codex/gpt-5.5",
    reasoning: "xhigh",
    startedAt: "2026-07-02T11:00:59.909590",
    passes: 53,
    trials: 89,
    harborErrors: 0,
    clean: true,
    softTimeouts: 10,
    softTimeoutFails: 9,
    providerPolicyBlocks: 1,
    internalDeadlineTimeouts: 10,
    reportPath:
      "evals/reports/harbor/roder-tbench-21-full-gpt55-xhigh-local-clean-soft780-agentx2-accessauth-v1-analysis.json",
    notes: [
      "Clean one-attempt local development run over all 89 Terminal-Bench 2.1 tasks with Harbor 0.16.1, n-concurrent=4, codex/gpt-5.5, and reasoning=xhigh.",
      "Harbor reported 53 reward-1 tasks, 36 reward-0 scored failures, and 0 exceptions; the analyzer reported no harness error classes.",
      "This is intentionally not a submittable leaderboard run: it used a local access-token auth file, Roder soft_timeout_sec=780, and Harbor agent-timeout-multiplier=2.0 to keep adapter finalization inside Harbor's outer timeout.",
    ],
  },
  {
    id: "tbench-codex-parity-tools-ab4",
    title: "Codex-parity tools targeted slice",
    kind: "targeted",
    suite: "Terminal-Bench Codex-pass/minimal-Roder-fail subset",
    model: "codex/gpt-5.5",
    reasoning: "xhigh",
    startedAt: "2026-07-14T02:22:19+02:00",
    passes: 4,
    trials: 4,
    harborErrors: 2,
    clean: false,
    reportPath: "evals/harbor/jobs/roder-tbench-codex-parity-tools-ab4/result.json",
    notes: [
      "Targeted local A/B slice for four tasks Codex passed while the previous minimal Roder setup failed.",
      "Native view_image, unified_exec, freeform apply_patch, a pinned tool allowlist, and eval-loop persistence moved reward from 0/4 to 4/4.",
      "Two reward-1 trials still reported AgentTimeoutError, so this is trajectory evidence rather than a clean full-suite headline.",
    ],
  },
  {
    id: "tbench-codex-parity-lastcheck",
    title: "Codex-parity remaining-failure check",
    kind: "targeted",
    suite: "Terminal-Bench remaining-failure subset",
    model: "codex/gpt-5.5",
    reasoning: "xhigh",
    startedAt: "2026-07-14T02:52:00+02:00",
    passes: 2,
    trials: 15,
    harborErrors: 13,
    clean: false,
    reportPath: "evals/harbor/jobs/roder-tbench-codex-parity-lastcheck15/result.json",
    notes: [
      "Ran the codex-parity native-loop build against every task that had not yet passed once, to measure further conversions from the new tool surface.",
      "Newly converted break-filter-js-from-html and db-wal-recovery cleanly (reward 1.0).",
      "13 of 15 trials errored on Docker environment startup under local disk pressure (docker compose up --wait) rather than on task capability; they are being re-run serially with environment cleanup and are excluded from the pass count.",
    ],
  },
];

export const evalDashboardUpdatedAt = "2026-07-14T03:05:00+02:00";

export const leaderboardContext: LeaderboardContext = {
  sourceUrl: "https://www.tbench.ai/leaderboard/terminal-bench/2.1",
  sourceLabel: "Terminal-Bench 2.1 leaderboard",
  snapshotDate: "2026-07-14",
  totalEntries: 13,
  theoreticalRank: 1,
  upperNeighbor: {
    rank: 1,
    name: "Codex CLI with GPT-5.5 (xhigh)",
    scorePercent: 83.4,
  },
  lowerNeighbor: {
    rank: 2,
    name: "Terminus 2 with Claude Opus 4.7",
    scorePercent: 66.1,
  },
  caveat:
    "The 76/89 (85.4%) figure is a pass-once oracle union across several local codex-parity development runs on the same model as the top leaderboard entry (gpt-5.5 xhigh) — not a single verified run. Individual passing trials come from different local configs, some used access-token-only auth and a modified agent timeout multiplier, and 13 remaining tasks are still being confirmed after a Docker disk-pressure infra failure. It is published to show trajectory, not as a submittable Terminal-Bench leaderboard result.",
};

// Pass-once oracle union across the codex-parity development runs: every task
// that has scored reward 1.0 at least once on the current native-loop build,
// on the same model as the top leaderboard entry (gpt-5.5 xhigh). This is a
// projection, not a single verified run — see leaderboardContext.caveat.
export const theoreticalScore = {
  passes: 76,
  trials: 89,
  percent: 85.4,
  label: "Pass-once projection",
  startedAt: "2026-07-14T02:52:00+02:00",
};

export const fullSuiteRuns = evalRuns.filter((run) => run.kind === "full-suite");
export const latestFullSuiteRun = fullSuiteRuns.at(-1)!;
export const latestEvalRun = evalRuns.at(-1)!;

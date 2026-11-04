# Harness and Desktop positioning iteration

Status: user approved integration and release; current release evidence is in
`site-update-2026-11-03.md`.

## Direction

The homepage should answer what Roder is, what someone can do with it today,
and why its architecture matters to their work. Lead with the open coding-agent
harness and its Desktop client, rather than an abstract infrastructure pitch.

Explain differences through verifiable product choices: provider selection,
visible agent work, a reusable runtime, extension interfaces, and recorded state.
Do not claim competitors lack these capabilities or promise better outcomes
without comparative evidence.

## Implementation

- [x] Replace the rotating-audience homepage pitch with a clear harness/Desktop
  introduction and distinct routes for users and integrators.
- [x] Bring a real Desktop screenshot and practical workflows onto the homepage.
- [x] Add `/harness/`: define a harness, show the runtime/client/extension boundary,
  explain responsibilities, and link supported integration paths.
- [x] Rework Desktop around projects, visible delegation, review and browser
  evidence, persistent missions, provider choice, and execution setup.
- [x] Rework CLI around investigation, implementation, verification, state recovery,
  and terminal/headless/ACP/app-server entry points.
- [x] Simplify primary navigation around Harness, Desktop, CLI, and documentation.
  Preserve architecture, principles, evals, and contact routes in the footer.
- [x] Update metadata and generated social images for the product narrative.
- [x] Preserve existing installer resolution, platform selection, alternate
  downloads, real screenshot assets, and the previously released docs.

## Claims and boundaries

Grounding: current site documentation audited through CLI 0.4.5 and Desktop
0.1.11, plus the runtime architecture, workspace-fork contracts, and tagged
Desktop model-picker implementation.

- Desktop bundles its own versioned harness; do not imply CLI upgrades update it.
- Local threads do not imply offline inference or local-only network traffic.
- Persistent agents start paused and need explicit enablement and a running app.
- Cloud Machines are not automatic repository sync or hosted Desktop panels.
  The documented release excludes Windows.
- Git-backed forks and agent worktrees have clean-checkout prerequisites;
  other fork providers can be configured. Nothing merges automatically.
- A browser driver's completion claim is not verification of success.
- Alpha interfaces and model/provider capabilities remain explicit.

## Verification

- [x] Production build and complete internal route/fragment/asset scan.
- [x] Review claims against sources and correct unsupported comparisons.
- [x] Browser checks across mobile, tablet, and desktop widths.
- [x] Reproduce and fix mobile-menu resize state and hidden-link keyboard access.
- [x] Verify macOS, Windows, and fallback download labels/URLs in real browser contexts.
- [x] Confirm installer and checksum CDN URLs respond without downloading installers.
- [x] Final diff and preservation check against the previous release.

Evidence:

- `npm run build`: 122 generated pages.
- Generated HTML scan: 6,384 internal route, fragment, and asset references;
  zero errors.
- Real-browser checks: 8 routes at 360, 390, 768, 900, 1024, and 1440 pixels
  (48 checks), all HTTP 200, one H1 per page, correct canonical URLs, no broken
  images, no horizontal overflow, and no page errors.
- Desktop and mobile screenshot review caught an over-tall Desktop headline;
  tightened its copy and sizing, then reran responsive checks.
- Mobile navigation: closed overlay is inert, opening enables its links, Escape
  closes and returns focus, selecting Harness navigates correctly, and resizing
  to desktop closes the menu and restores scrolling.
- macOS, Windows, and fallback browser user agents select the correct existing
  primary/final download links. Both installers and checksums return HTTP 200.
  Alternate-download details expand correctly.
- Homepage, Harness, Desktop, and CLI social images return PNG responses.
- Desktop release resolution, platform data, and the full selection script are
  unchanged from the previous release.
- Preservation audit: 181 previously released files unchanged, 6 intentionally
  changed existing marketing/layout files, zero missing released files.
- `git diff --check`: passed. No dependencies or lockfiles changed.

Review preview: `http://127.0.0.1:4322/` (local production preview).

The original checkout intentionally remains dirty from the preceding release.
Do not reset it or interpret already-released untracked files as removed content.
Any future release must be explicitly approved and integrated on current remote
`master`, preserving its history and excluding local browser artifacts.

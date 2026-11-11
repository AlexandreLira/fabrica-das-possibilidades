# Expand Challenge Structure Implementation Plan

> **For agentic workers:** This plan is being executed inline in the current checkout. Steps use checkbox syntax for tracking.

**Goal:** Prepare the map, routes, and session completion tracking for five phase slots in each math module while keeping only the three current phases playable.

**Architecture:** Define phase slot IDs and availability by sector, keep playable challenge definitions in the existing content registry, and resolve phase hashes generically. Future slots appear as unavailable and route to a clear placeholder screen until their content and implementation exist. Completion is derived from the playable registry rather than a fixed count.

**Tech Stack:** React 19, TypeScript 6, Zustand 5, Vitest, Playwright.

**Spec:** GitHub issue #10 and the approved weekly plan from 10–15 November 2026.

## Global Constraints

- Preserve the existing three playable phases and their hashes.
- Keep completion session-only and math rules independent of UI and Phaser.
- Add no dependencies or invented challenge content.
- Unavailable phase slots must not be playable or counted as completed.

## Review Focus

- Malformed challenge hashes return home instead of opening a broken screen.
- A valid but unimplemented slot opens an accessible unavailable screen.
- Replaying a completed phase does not double-count it.
- Completing all playable challenges uses the registry size, not a literal threshold.
- Reloading still clears session progress.

---

### Task 1: Model phase slots and routes

**Files:** `src/content/sectors.ts`, `src/app/navigation.ts`, `src/app/navigation.test.ts`

**Interfaces:** `ChallengeId` is a typed phase slug and numeric suffix; each sector exposes five phase IDs; `parseRoute(hash)` returns stable named routes or `challenge:<id>` for a valid slot.

- [x] Write tests for five slots per module, fifteen unique IDs, existing hashes, valid future hashes, and malformed hashes.
- [x] Run the targeted tests and confirm they fail for the missing slot registry and parser behavior.
- [x] Implement typed slot IDs and generic hash parsing while retaining existing hash routes.
- [x] Run targeted tests and confirm they pass.

### Task 2: Render playable and upcoming slots

**Files:** `src/screens/Sectors.tsx`, `src/screens/ChallengeUnavailable.tsx`, `src/app/App.tsx`, `tests/e2e/navigation.spec.ts`

**Interfaces:** The map joins sector slots against the playable challenge registry; registered phases link to their existing screens and unregistered phase slots render disabled. Valid direct hashes for unimplemented slots show the unavailable screen.

- [x] Add browser scenarios proving fifteen slots are shown, only the three registered phases are playable, and current phase links still work.
- [x] Run the targeted Playwright scenarios and confirm they fail against the current three-phase map (initial E2E attempt was blocked at server startup by sandbox permissions; after approved escalation, behavioral failures were corrected).
- [x] Implement the map rendering, dynamic dispatch, and unavailable screen without adding challenge content.
- [x] Run targeted Playwright scenarios and confirm they pass.

### Task 3: Derive completion from playable content

**Files:** `src/state/store.ts`, `src/state/store.test.ts`, `src/screens/Completion.tsx`, `src/screens/PigeonholeChallenge.tsx`

**Interfaces:** Store completion uses the IDs in the playable registry. `createAppStore` accepts an optional registered-ID list for isolated behavior tests; production defaults to the current registry.

- [x] Add a test with a registry larger than three IDs and confirm completion stays false until all registered phases are complete; preserve replay and session-only behavior.
- [x] Run the targeted store test and confirm it fails with the hard-coded completion threshold.
- [x] Replace the fixed count and fixed three-phase completion copy/feedback checks with registry-based logic.
- [x] Run store tests and the complete test suite.

### Final verification

- [x] Run `npm run lint`, `npm run typecheck`, `npm run test:run`, `npm run build`, and `npm run test:e2e`.
- [x] Review the diff against issue #10 and confirm the three original routes and gameplay remain intact.

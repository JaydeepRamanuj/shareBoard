# MASTER INSTRUCTIONS FOR AI CODE GENERATION

## Project: Personal Bookmark Manager (Expo + Node + MongoDB)

---

## 0. CORE PHILOSOPHY (MANDATORY)

You are not just generating code.
You are generating **code + documentation + reasoning**.

The human reading this code:

* Is a developer
* Does NOT know React Native well
* Wants full visibility and control
* Values clarity over brevity

**Rule:**
If something is not obvious to a junior developer, it must be explained.

---

## 1. DOCUMENTATION IS NOT OPTIONAL

### Global Rule

For **every feature you implement**, you MUST:

1. Write the code
2. Explain *what* it does
3. Explain *why* it exists
4. Explain *how* it works internally
5. Link it to related files or flows

If forced to choose between:

* Writing more code
* Writing more explanation

👉 **Always choose explanation**

---

## 2. PROJECT STRUCTURE REQUIREMENTS

### Root-level structure

```
/app            → Expo app (React Native)
/server         → Node + Express backend
/docs           → Project documentation (MANDATORY)
/README.md      → High-level overview
```

---

## 3. DOCUMENTATION FOLDER STRUCTURE (MANDATORY)

The `/docs` folder must exist and be populated.

### Required files inside `/docs`

```
docs/
├── overview.md
├── project-map.md
├── data-flow.md
├── component-flow.md
├── service-flow.md
├── database-models.md
├── design-decisions.md
├── api-contracts.md
```

You MUST update relevant docs whenever you add or modify code.

---

## 4. FILE-LEVEL DOCUMENTATION RULES

### At the TOP of **every file**, add a comment block:

```ts
/**
 * WHAT:
 * - What this file/component/service does
 *
 * WHY:
 * - Why this exists in the app
 * - What problem it solves
 *
 * HOW:
 * - High-level explanation of how it works
 * - What other files/services it depends on
 */
```

This applies to:

* Components
* Screens
* Hooks
* Services
* Controllers
* Models
* Utils

---

## 5. COMPONENT DOCUMENTATION RULES (FRONTEND)

### For every React Native component:

1. Add a **top explanation block**
2. Add **inline comments** for:

   * State
   * Effects
   * API calls
   * UI decisions

### Example expectation (not exact code)

```ts
/**
 * WHAT:
 * - Displays a list of bookmarks inside a folder
 *
 * WHY:
 * - This is the primary screen users interact with
 *
 * HOW:
 * - Fetches bookmarks from backend
 * - Renders them as cards
 * - Handles loading and empty states
 */
```

Inline comments must explain:

* Why `useEffect` exists
* Why state is structured the way it is
* Why API is called here and not elsewhere

---

## 6. SERVICE DOCUMENTATION RULES (BACKEND)

### For every backend service or controller:

Explain:

* Input
* Output
* Side effects
* Error cases
* Why this logic belongs here

Example:

```js
/**
 * This controller handles preview generation for a URL.
 *
 * WHY:
 * - Frontend should not scrape metadata directly
 * - Centralizes scraping logic
 *
 * HOW:
 * - Accepts URL
 * - Uses Open Graph scraper
 * - Normalizes data
 * - Returns clean response
 */
```

---

## 7. DATA FLOW DOCUMENTATION (MANDATORY)

### `/docs/data-flow.md` must explain:

* Step-by-step flow for:

  * Adding a bookmark
  * Fetching bookmarks
  * Searching bookmarks

Use **plain English**, not diagrams only.

Example structure:

```
1. User pastes URL in app
2. App calls /preview endpoint
3. Backend fetches OG metadata
4. Backend normalizes response
5. App displays preview
6. User saves bookmark
7. Backend persists to MongoDB
```

---

## 8. PROJECT MAP (VERY IMPORTANT)

### `/docs/project-map.md`

This file is a **navigation guide** for the codebase.

It must answer:

* Where does the app start?
* Which screen leads to which screen?
* Which component calls which service?
* Which service touches which database model?

Example sections:

* Frontend entry point
* Screen-to-screen navigation
* API call map
* Backend route map

This file should allow a developer to:

> “Start anywhere and understand where to go next”

---

## 9. DESIGN DECISION LOG (MANDATORY)

### `/docs/design-decisions.md`

Every **non-trivial choice** must be logged here.

For each decision, include:

```
Decision:
What was chosen

Why:
Why this option was selected

Alternatives:
Other options considered

Benefits:
What this enables

Limitations:
What this does NOT solve
```

Examples:

* Using regex search instead of full-text search
* Using fake auth
* Using folders instead of tags initially
* Using Open Graph scraper instead of Python service

---

## 10. DATABASE DOCUMENTATION

### `/docs/database-models.md`

For each collection:

* Purpose
* Fields
* Relationships
* Indexes
* Future extensions

Explain in **human terms**, not just schema.

---

## 11. API CONTRACT DOCUMENTATION

### `/docs/api-contracts.md`

For every endpoint:

* Method
* URL
* Request body
* Response body
* Error cases
* Example request/response

Frontend must rely ONLY on this contract.

---

## 12. COMMENT STYLE RULES

* Comments should explain **intent**, not obvious syntax
* Avoid comments like “this sets state”
* Prefer comments like:

  * “We store this in state because…”
  * “This is done here instead of backend because…”

If code is not self-explanatory → explain it.

---

## 13. AI SELF-CHECK RULE (IMPORTANT)

Before finishing ANY file, ask internally:

> “If the original developer disappears for 6 months, can they come back and understand this?”

If the answer is **no**, add more explanation.

---

## 14. NON-GOALS (DO NOT DO)

* Do not optimize prematurely
* Do not remove comments for cleanliness
* Do not assume React Native knowledge
* Do not skip docs for “small” features

---

## 15. SUCCESS CRITERIA

This instruction set is successful if:

* Codebase feels **self-explanatory**
* `/docs` folder explains the entire app
* Developer can modify features confidently
* AI-generated code feels *maintainable*, not magical

---

## FINAL REMINDER TO THE AI

You are not replacing the developer.
You are acting as a **patient senior engineer writing code for a teammate**.

Clarity > Cleverness
Explanation > Brevity
Control > Speed

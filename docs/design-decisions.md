# Design Decisions

## 1. Metadata Extraction via Cheerio (vs. Puppeteer/API)

*   **Decision**: Use `cheerio` and `axios` to fetch and parse static HTML for Open Graph tags.
*   **Why**:
    *   **Speed**: Much faster than spinning up a headless browser (Puppeteer).
    *   **Resource Usage**: Minimal memory footprint, critical for a personal server.
    *   **Simplicity**: We only need `og:image` and `og:title`, which are usually in the initial server response.
*   **Alternatives Needed**:
    *   Use a paid API (e.g., LinkPreview API) -> Costly.
    *   Puppeteer -> Too heavy for a simple link saver.
*   **Limitations**:
    *   Fails on Single Page Apps (SPAs) that populate meta tags via JavaScript.
    *   Fails on sites with heavy bot protection.

## 2. Unsorted Bookmarks as `collectionId: null`

*   **Decision**: Treat "Unsorted" not as a collection, but as the *absence* of a collection relationship.
*   **Benefits**:
    *   Simplifies default behavior (no need to create a specific "Unsorted" DB record for every user).
    *   Queries are faster (`{ collectionId: null }`).
*   **Drawbacks**:
    *   Frontend needs special logic to display "Unsorted" as a pseudo-folder.

## 3. Dark Mode First Design

*   **Decision**: Prioritize specific hex codes (`#121212`, `#BB86FC`) over generic system colors.
*   **Why**:
    *   User explicitly requested a "premium" feel.
    *   Generic dark modes often lack contrast control.
*   **Implementation**: A custom `ThemeContext` that overrides React Navigation's default theme references.

## 4. Single-Tenancy MVP with Multi-Tenant Schema

*   **Decision**: Hardcode `userId` to "demo-user-1" in controllers but include it in every query.
*   **Why**:
    *   Allows immediate development without Auth complexity.
    *   Prevents extensive refactoring later when Auth is added (just swap the hardcoded string for `req.user.id`).
*   **Risk**:
    *   If deployment is public, anyone can see everyone's data *unless* Auth is implemented immediately. (Mitigated by local deployment focus).

## 5. Navigation State Reset (Collections Tab)

*   **Decision**: Use `tabPress` listener to actively navigateto `list` screen on tab press.
*   **Why**:
    *   React Navigation by default preserves the stack state. If a user is deep in a folder, switches tabs, and comes back, they expect to see the *folder list*, not the deep folder.
    *   `unmountOnBlur` was causing TS issues and unexpected re-mount overrides.

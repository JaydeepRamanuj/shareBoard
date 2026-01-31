# Service Flow (Backend)

This document explains the business logic layers in the Node.js backend.

## 1. Metadata Extraction Service (`services/metadataService.ts`)

**Goal**: Turn a raw URL into a rich preview card.

**Flow**:
1.  **Input**: `url` (string).
2.  **Validation**: Check if URL is valid using `try/catch new URL()`.
3.  **Request**: Use `axios` to fetch the HTML content of the page.
    *   *Config*: Set distinct User-Agent to avoid being blocked by some sites.
4.  **Parsing**: Load HTML into `cheerio`.
5.  **Extraction**:
    *   **Title**: `og:title` -> `<title>` -> URL.
    *   **Description**: `og:description` -> `meta[name="description"]` -> "".
    *   **Image**: `og:image` -> `twitter:image` -> null.
    *   **Domain**: Extracted from hostname.
6.  **Normalization**: Ensure image URLs are absolute.
7.  **Output**: Returns `ScrapedMetadata` object.

## 2. Bookmark Controller (`controllers/bookmarks.ts`)

**Goal**: Coordinate DB operations for bookmarks.

**Key Logic - Bulk Move**:
*   *Why a specific endpoint?* Moving 50 bookmarks one-by-one is inefficient.
*   **Method**: `Bookmark.updateMany({ _id: { $in: ids } }, { $set: { collectionId: target } })`.
*   **Efficiency**: Single database command.

**Key Logic - Search**:
*   **Method**: `$or` query with Regex.
*   *Limitation*: Regex is slow on massive datasets.
*   *Future Optimization*: Use MongoDB Atlas Search (Lucene) if scaling.

## 3. Collection Controller (`controllers/collections.ts`)

**Goal**: Manage folders.

**Key Logic - Creation**:
*   Accepts `color` and `name`.
*   Defaults `icon` to 'folder' (MVP simplification).
*   Saves `userId` to ensure data isolation.

# Project Overview: ShareBoard

## What is this?
**ShareBoard** (internally "ShareBoard") is a personal bookmark manager application that allows users to:
1.  **Save Links**: Quickly paste URLs and automatically fetch metadata (title, image).
2.  **Organize**: Group bookmarks into custom color-coded collections.
3.  **Browse**: View bookmarks in a visual grid or list format.
4.  **Manage**: Bulk move or delete items with a premium interactions.

## Core Technology Stack
-   **Frontend**: React Native (Expo) + NativeWind (TailwindCSS)
-   **Backend**: Node.js + Express
-   **Database**: MongoDB Atlas (Mongoose)
-   **Scraper**: Cheerio (Open Graph Metadata)

## Core Philosophy
We value **Control** and **Privacy**.
-   Data is stored per user (ready for multi-tenancy).
-   No hidden algorithms; just your links, organized your way.
-   "Dark Mode First" aesthetic for comfortable usage.

## Current Status (MVP)
The project is in the **MVP + Polish** phase. All core features (CRUD, Search, Move, Delete) are implemented, along with a high level of UI polish (skeletons, custom modals, branded themes).

## How to Navigate
If you are new to the codebase, start with `docs/project-map.md` to understand where files live and how they connect.

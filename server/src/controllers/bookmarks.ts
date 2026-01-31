/**
 * WHAT: Controller for Bookmark operations.
 * 
 * WHY: 
 * - Centralizes logic for handling bookmark creation, retrieval, and bulk actions.
 * - Ensures data consistency and enforces userId scoping.
 * 
 * HOW:
 * - Handles Create, Read (by Collection), and Search via Mongoose models.
 * - Manages logical "Unsorted" state (collectionId: null).
 */

import { Request, Response } from 'express';
import Bookmark from '../models/Bookmark';

// POST /api/bookmarks
export const createBookmark = async (req: Request, res: Response) => {
    try {
        const { url, title, description, image, domain, collectionId } = req.body;
        const userId = 'demo-user-1'; // Hardcoded

        const bookmark = new Bookmark({
            userId,
            url,
            title,
            description,
            image,
            domain,
            collectionId: collectionId || null, // Handle Unsorted
        });

        await bookmark.save();
        res.status(201).json(bookmark);
    } catch (error) {
        res.status(500).json({ error: 'Failed to save bookmark' });
    }
};

// GET /api/bookmarks?collectionId=...
export const getBookmarks = async (req: Request, res: Response) => {
    try {
        const { collectionId } = req.query;
        const userId = 'demo-user-1';

        let query: any = { userId };

        if (collectionId === 'unsorted') {
            query.collectionId = null;
        } else if (collectionId) {
            query.collectionId = collectionId;
        }
        // If no collectionId, maybe return all? Or recent? 
        // For now, let's enforce collectionId or return all for "Recent" logic later.

        // sorting by newest first
        const bookmarks = await Bookmark.find(query).sort({ createdAt: -1 });
        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
};

// GET /api/search?q=...
export const searchBookmarks = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;
        const userId = 'demo-user-1';

        if (!q) {
            return res.json([]);
        }

        // specific regex search for MVP (simpler than full text index for now)
        const regex = new RegExp(q as string, 'i');

        const bookmarks = await Bookmark.find({
            userId,
            $or: [
                { title: regex },
                { description: regex },
                { url: regex }
            ]
        }).limit(20);

        res.json(bookmarks);
    } catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
};

// PUT /api/bookmarks/:id
export const updateBookmark = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { collectionId } = req.body;
        const userId = 'demo-user-1';

        const bookmark = await Bookmark.findOneAndUpdate(
            { _id: id, userId },
            { collectionId },
            { new: true }
        );

        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }

        res.json(bookmark);
    } catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
};
// PUT /api/bookmarks/bulk-move
export const bulkMoveBookmarks = async (req: Request, res: Response) => {
    try {
        const { bookmarkIds, targetCollectionId } = req.body;
        const userId = 'demo-user-1';

        if (!Array.isArray(bookmarkIds) || bookmarkIds.length === 0) {
            return res.status(400).json({ error: 'No bookmarks provided' });
        }

        const update = { collectionId: targetCollectionId || null };

        await Bookmark.updateMany(
            { _id: { $in: bookmarkIds }, userId },
            { $set: update }
        );

        res.json({ message: 'Bookmarks moved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Bulk move failed' });
    }
};

// POST /api/bookmarks/bulk-delete
export const bulkDeleteBookmarks = async (req: Request, res: Response) => {
    try {
        const { bookmarkIds } = req.body;
        const userId = 'demo-user-1';

        if (!Array.isArray(bookmarkIds) || bookmarkIds.length === 0) {
            return res.status(400).json({ error: 'No bookmarks provided' });
        }

        await Bookmark.deleteMany({ _id: { $in: bookmarkIds }, userId });

        // Update collection counts logic (optional but good practice) - heavily depends on if we track counts on collection document. 
        // For now, simple deletion is enough.

        res.json({ message: 'Bookmarks deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Bulk delete failed' });
    }
};

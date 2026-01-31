/**
 * WHAT: Controller for Collection operations.
 * 
 * WHY:
 * - Manages the folder structure for bookmarks.
 * - Handles aggregation of bookmark counts for performant UI.
 * 
 * HOW:
 * - Uses MongoDB Aggregation Pipeline to count bookmarks per collection efficiently.
 * - Handles CRUD operations for Collection documents.
 */

import { Request, Response } from 'express';
import Collection from '../models/Collection';
import Bookmark from '../models/Bookmark';

// GET /api/collections
export const getCollections = async (req: Request, res: Response) => {
    try {
        const userId = 'demo-user-1';

        const collections = await Collection.aggregate([
            { $match: { userId } },
            {
                $lookup: {
                    from: 'bookmarks',
                    localField: '_id',
                    foreignField: 'collectionId',
                    as: 'bookmarks'
                }
            },
            {
                $addFields: {
                    bookmarkCount: { $size: '$bookmarks' }
                }
            },
            {
                $project: {
                    bookmarks: 0 // Remove bookmarks array from result to keep it light
                }
            }
        ]);

        res.json(collections);
    } catch (error) {
        console.error("Error fetching collections:", error);
        res.status(500).json({ error: 'Failed to fetch collections' });
    }
};

// POST /api/collections
export const createCollection = async (req: Request, res: Response) => {
    try {
        const { name, icon, color } = req.body;
        const userId = 'demo-user-1';

        const collection = new Collection({
            userId,
            name,
            icon,
            color
        });

        await collection.save();
        res.status(201).json(collection);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create collection' });
    }
};

// PUT /api/collections/:id
export const updateCollection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, color } = req.body;
        const userId = 'demo-user-1';

        const collection = await Collection.findOneAndUpdate(
            { _id: id, userId },
            { name, color },
            { new: true }
        );

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        res.json(collection);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update collection' });
    }
};

// DELETE /api/collections/:id
export const deleteCollection = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = 'demo-user-1';

        const collection = await Collection.findOneAndDelete({ _id: id, userId });

        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }

        // Optional: Move bookmarks to unsorted or delete them?
        // Method 1: Move to unsorted (set collectionId to null)
        await Bookmark.updateMany({ collectionId: id }, { $set: { collectionId: null } });

        res.json({ message: 'Collection deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete collection' });
    }
};

// GET /api/collections/stats (Optional: for Home Screen)
export const getStats = async (req: Request, res: Response) => {
    try {
        const userId = 'demo-user-1';
        const unsortedCount = await Bookmark.countDocuments({ userId, collectionId: null });
        res.json({ unsorted: unsortedCount });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
}

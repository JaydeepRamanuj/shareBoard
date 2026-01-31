/**
 * WHAT: Controller for Collection operations.
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

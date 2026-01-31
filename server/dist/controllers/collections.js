"use strict";
/**
 * WHAT: Controller for Collection operations.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = exports.deleteCollection = exports.updateCollection = exports.createCollection = exports.getCollections = void 0;
const Collection_1 = __importDefault(require("../models/Collection"));
const Bookmark_1 = __importDefault(require("../models/Bookmark"));
// GET /api/collections
const getCollections = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = 'demo-user-1';
        const collections = yield Collection_1.default.aggregate([
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
    }
    catch (error) {
        console.error("Error fetching collections:", error);
        res.status(500).json({ error: 'Failed to fetch collections' });
    }
});
exports.getCollections = getCollections;
// POST /api/collections
const createCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, icon, color } = req.body;
        const userId = 'demo-user-1';
        const collection = new Collection_1.default({
            userId,
            name,
            icon,
            color
        });
        yield collection.save();
        res.status(201).json(collection);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to create collection' });
    }
});
exports.createCollection = createCollection;
// PUT /api/collections/:id
const updateCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, color } = req.body;
        const userId = 'demo-user-1';
        const collection = yield Collection_1.default.findOneAndUpdate({ _id: id, userId }, { name, color }, { new: true });
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        res.json(collection);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update collection' });
    }
});
exports.updateCollection = updateCollection;
// DELETE /api/collections/:id
const deleteCollection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const userId = 'demo-user-1';
        const collection = yield Collection_1.default.findOneAndDelete({ _id: id, userId });
        if (!collection) {
            return res.status(404).json({ error: 'Collection not found' });
        }
        // Optional: Move bookmarks to unsorted or delete them?
        // Method 1: Move to unsorted (set collectionId to null)
        yield Bookmark_1.default.updateMany({ collectionId: id }, { $set: { collectionId: null } });
        res.json({ message: 'Collection deleted' });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to delete collection' });
    }
});
exports.deleteCollection = deleteCollection;
// GET /api/collections/stats (Optional: for Home Screen)
const getStats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = 'demo-user-1';
        const unsortedCount = yield Bookmark_1.default.countDocuments({ userId, collectionId: null });
        res.json({ unsorted: unsortedCount });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});
exports.getStats = getStats;

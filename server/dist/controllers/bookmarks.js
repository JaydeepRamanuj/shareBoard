"use strict";
/**
 * WHAT: Controller for Bookmark operations.
 * HOW: Handles Create, Read (by Collection), and Search.
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
exports.updateBookmark = exports.searchBookmarks = exports.getBookmarks = exports.createBookmark = void 0;
const Bookmark_1 = __importDefault(require("../models/Bookmark"));
// POST /api/bookmarks
const createBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { url, title, description, image, domain, collectionId } = req.body;
        const userId = 'demo-user-1'; // Hardcoded
        const bookmark = new Bookmark_1.default({
            userId,
            url,
            title,
            description,
            image,
            domain,
            collectionId: collectionId || null, // Handle Unsorted
        });
        yield bookmark.save();
        res.status(201).json(bookmark);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to save bookmark' });
    }
});
exports.createBookmark = createBookmark;
// GET /api/bookmarks?collectionId=...
const getBookmarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { collectionId } = req.query;
        const userId = 'demo-user-1';
        let query = { userId };
        if (collectionId === 'unsorted') {
            query.collectionId = null;
        }
        else if (collectionId) {
            query.collectionId = collectionId;
        }
        // If no collectionId, maybe return all? Or recent? 
        // For now, let's enforce collectionId or return all for "Recent" logic later.
        // sorting by newest first
        const bookmarks = yield Bookmark_1.default.find(query).sort({ createdAt: -1 });
        res.json(bookmarks);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch bookmarks' });
    }
});
exports.getBookmarks = getBookmarks;
// GET /api/search?q=...
const searchBookmarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q } = req.query;
        const userId = 'demo-user-1';
        if (!q) {
            return res.json([]);
        }
        // specific regex search for MVP (simpler than full text index for now)
        const regex = new RegExp(q, 'i');
        const bookmarks = yield Bookmark_1.default.find({
            userId,
            $or: [
                { title: regex },
                { description: regex },
                { url: regex }
            ]
        }).limit(20);
        res.json(bookmarks);
    }
    catch (error) {
        res.status(500).json({ error: 'Search failed' });
    }
});
exports.searchBookmarks = searchBookmarks;
// PUT /api/bookmarks/:id
const updateBookmark = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { collectionId } = req.body;
        const userId = 'demo-user-1';
        const bookmark = yield Bookmark_1.default.findOneAndUpdate({ _id: id, userId }, { collectionId }, { new: true });
        if (!bookmark) {
            return res.status(404).json({ error: 'Bookmark not found' });
        }
        res.json(bookmark);
    }
    catch (error) {
        res.status(500).json({ error: 'Update failed' });
    }
});
exports.updateBookmark = updateBookmark;

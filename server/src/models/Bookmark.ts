/**
 * WHAT: Mongoose schema for a Bookmark.
 * WHY: Defines the structure of saved links in MongoDB.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IBookmark extends Document {
    userId: string;
    url: string;
    title: string;
    description: string;
    image?: string;
    domain: string;
    collectionId?: mongoose.Types.ObjectId;
    createdAt: Date;
}

const BookmarkSchema: Schema = new Schema({
    userId: { type: String, required: true }, // Hardcoded for MVP
    url: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    image: { type: String, default: null },
    domain: { type: String, required: true },
    collectionId: { type: Schema.Types.ObjectId, ref: 'Collection', default: null },
    createdAt: { type: Date, default: Date.now },
});

// Indexes for Search
BookmarkSchema.index({ title: 'text', description: 'text', url: 'text' });

export default mongoose.model<IBookmark>('Bookmark', BookmarkSchema);

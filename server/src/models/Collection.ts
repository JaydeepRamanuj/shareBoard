/**
 * WHAT: Mongoose schema for a Collection (formerly Folder).
 * WHY: Groups bookmarks together.
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface ICollection extends Document {
    userId: string;
    name: string;
    icon?: string;
    color?: string;
    createdAt: Date;
}

const CollectionSchema: Schema = new Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    icon: { type: String, default: 'folder' }, // Default icon
    color: { type: String, default: '#FFFFFF' }, // Default color
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICollection>('Collection', CollectionSchema);

/**
 * WHAT: Controller for URL Preview.
 */

import { Request, Response } from 'express';
import { fetchMetadata } from '../services/metadataService';

// POST /api/preview
export const getPreview = async (req: Request, res: Response) => {
    try {
        const { url } = req.body;

        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        const metadata = await fetchMetadata({ url });
        res.json(metadata);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch preview' });
    }
};

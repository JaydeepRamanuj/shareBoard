/**
 * WHAT: Axios instance for API calls.
 * WHY: Centralizes configuration (base URL, timeouts).
 */

import axios from 'axios';
import Constants from 'expo-constants';

// For Android Emulator, use 10.0.2.2. For iOS Simulator, use localhost.
// Getting IP from host URI is safer for physical devices in dev.
// ----------------------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------------------
// WE USE .env FOR CONFIGURATION
// Create a .env file in the app/ folder with:
// EXPO_PUBLIC_API_URL=https://your-production-url.com
// ----------------------------------------------------------------------

const getBaseUrl = () => {
    // 1. Prioritize Environment Variable (Works in Dev & Prod)
    const envUrl = process.env.EXPO_PUBLIC_API_URL;
    if (envUrl) {
        return `${envUrl}/api`;
    }

    // 2. Fallback to Localhost logic (if no env var set)
    const hostUri = Constants.expoConfig?.hostUri;
    if (!hostUri) {
        return 'http://localhost:4000/api';
    }
    const ip = hostUri.split(':')[0];
    return `http://${ip}:4000/api`;
};

const client = axios.create({
    baseURL: getBaseUrl(),
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default client;

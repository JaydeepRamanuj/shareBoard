/**
 * WHAT: Axios instance for API calls.
 * WHY: Centralizes configuration (base URL, timeouts).
 */

import axios from 'axios';
import Constants from 'expo-constants';

// For Android Emulator, use 10.0.2.2. For iOS Simulator, use localhost.
// Getting IP from host URI is safer for physical devices in dev.
const getBaseUrl = () => {
    const hostUri = Constants.expoConfig?.hostUri;
    if (!hostUri) {
        // Fallback for simple testing
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

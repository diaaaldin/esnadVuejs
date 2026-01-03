import axios from "axios";
import { Urls } from '@/config/config.js'

const Api = axios.create({
    baseURL: `${Urls.cpSite}/api`,
    //baseURL: 'http://localhost:4000/api'
    //baseURL: 'https://cp.markabatistore.com/api'
    withCredentials: true, // Ensure credentials are sent with CORS requests
    timeout: 30000, // 30 second timeout
    maxRedirects: 0, // Prevent automatic redirects that break CORS
    validateStatus: function (status) {
        // Don't throw errors for redirects - let us handle them
        return status >= 200 && status < 400;
    },
});

// Request interceptor to add headers and handle CORS
Api.interceptors.request.use(
    (config) => {
        // Ensure Content-Type is set for POST/PUT/PATCH/DELETE requests with data
        if (config.method === 'post' || config.method === 'put' || config.method === 'patch' || 
            (config.method === 'delete' && config.data)) {
            // Check if data is FormData - if so, don't set Content-Type (axios will handle it)
            const isFormData = config.data instanceof FormData;
            
            if (!isFormData && !config.headers['Content-Type']) {
                config.headers['Content-Type'] = 'application/json';
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors and redirects
Api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        // Handle 301/302 redirects that break CORS
        if (error.response && (error.response.status === 301 || error.response.status === 302)) {
            const redirectUrl = error.response.headers.location;
            const errorMessage = `❌ 301/302 Redirect Detected - This breaks CORS!\n\n` +
                `Request to: ${error.config.url}\n` +
                `Redirected to: ${redirectUrl}\n\n` +
                `🔧 BACKEND FIX REQUIRED:\n` +
                `1. Update Program.cs HTTPS redirection middleware to skip /api paths\n` +
                `2. Check reverse proxy (nginx/IIS) configuration\n` +
                `3. See CORS_301_REDIRECT_DIAGNOSIS.md for detailed instructions\n\n` +
                `The backend MUST NOT redirect API requests.`;
            
            console.error(errorMessage);
            return Promise.reject(new Error('Backend is redirecting API requests. This breaks CORS. See console for details.'));
        }
        
        // Handle network errors (CORS, connection issues)
        if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
            // Check if it's actually a redirect that was blocked
            if (error.message.includes('301') || error.message.includes('Moved Permanently')) {
                const errorMessage = `❌ CORS Error caused by 301 Redirect!\n\n` +
                    `The backend is redirecting API requests, which breaks CORS.\n\n` +
                    `🔧 IMMEDIATE FIX NEEDED:\n` +
                    `Update your backend Program.cs to skip redirecting /api paths.\n` +
                    `See: BACKEND_CORS_FIX.md and CORS_301_REDIRECT_DIAGNOSIS.md`;
                
                console.error(errorMessage);
                return Promise.reject(new Error('Backend redirect is causing CORS failure. See console for fix instructions.'));
            }
            
            const errorMessage = `❌ CORS Error - No 'Access-Control-Allow-Origin' header\n\n` +
                `Request to: ${error.config?.url || 'unknown'}\n\n` +
                `🔧 BACKEND FIX REQUIRED:\n` +
                `1. Ensure CORS middleware is placed BEFORE authentication in Program.cs\n` +
                `2. Verify CORS policy includes: http://localhost:5173\n` +
                `3. Ensure backend does NOT redirect API requests (301/302)\n` +
                `4. See BACKEND_CORS_FIX.md for complete instructions`;
            
            console.error(errorMessage);
        }
        
        return Promise.reject(error);
    }
);

export default Api;
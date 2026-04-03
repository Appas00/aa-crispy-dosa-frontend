// Next.js API route: /api/auth
// Proxies requests to backend server for authentication

const API_BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export default async function handler(req, res) {
    const { method, query, body, headers } = req;

    // Forward the authorization header if present
    const authHeader = headers.authorization;

    // Build the target URL
    let targetUrl = `${API_BASE_URL}/api/auth`;

    // Handle specific auth endpoints
    if (query.login) {
        targetUrl = `${API_BASE_URL}/api/auth/login`;
    }

    if (query.verify) {
        targetUrl = `${API_BASE_URL}/api/auth/verify`;
    }

    if (query.profile) {
        targetUrl = `${API_BASE_URL}/api/auth/profile`;
    }

    if (query.changePassword) {
        targetUrl = `${API_BASE_URL}/api/auth/change-password`;
    }

    if (query.logout) {
        targetUrl = `${API_BASE_URL}/api/auth/logout`;
    }

    try {
        // Prepare fetch options
        const fetchOptions = {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...(authHeader && { Authorization: authHeader }),
            },
        };

        // Add body for non-GET requests
        if (method !== 'GET' && body) {
            fetchOptions.body = JSON.stringify(body);
        }

        // Make request to backend
        const response = await fetch(targetUrl, fetchOptions);
        const data = await response.json();

        // Forward the response status and data
        res.status(response.status).json(data);
    } catch (error) {
        console.error('API Proxy Error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error.message,
        });
    }
}

export const config = {
    api: {
        bodyParser: true,
    },
};
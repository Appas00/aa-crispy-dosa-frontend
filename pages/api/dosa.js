// Next.js API route: /api/dosa
// Proxies requests to backend server

const API_BASE_URL = process.env.BACKEND_API_URL || 'http://localhost:5000';

export default async function handler(req, res) {
    const { method, query, body, headers } = req;

    // Forward the authorization header if present
    const authHeader = headers.authorization;

    // Build the target URL
    let targetUrl = `${API_BASE_URL}/api/dosa`;

    // Handle query parameters
    if (query && Object.keys(query).length > 0) {
        const queryString = new URLSearchParams(query).toString();
        targetUrl += `?${queryString}`;
    }

    // Handle dynamic routes (e.g., /api/dosa/:id)
    if (query.id) {
        targetUrl = `${API_BASE_URL}/api/dosa/${query.id}`;
    }

    if (query.type) {
        targetUrl = `${API_BASE_URL}/api/dosa/type/${query.type}`;
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

// Disable body parser for file uploads if needed
export const config = {
    api: {
        bodyParser: true,
    },
};
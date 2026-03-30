import { API_BASE_URL } from "@/constants/env";

/**
 * A wrapper around the global fetch API that handles:
 * 1. Automatic inclusion of the JWT token from localStorage.
 * 2. Automatic redirect to /login on 401 Unauthorized errors.
 * 3. Base URL prefixing.
 * 4. Default JSON content-type headers.
 */
export async function apiFetch<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem("token");

    // Standard headers
    const defaultHeaders: HeadersInit = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    // Ensure endpoint has leading slash or handle base URL properly
    const url = endpoint.startsWith("http") 
        ? endpoint 
        : `${API_BASE_URL}${endpoint.startsWith("/") ? "" : "/"}${endpoint}`;

    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                ...defaultHeaders,
                ...options.headers,
            },
        });

        // Interceptor: Handle 401 Unauthorized (Session Expired)
        if (response.status === 401) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            
            // Avoid infinite loop if we're already on /login
            if (!window.location.pathname.includes("/login")) {
                window.location.href = "/login";
            }
            
            throw new Error("Session expired, please sign in again");
        }

        // Handle other non-OK responses
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `API Error: ${response.status}`);
        }

        // Return parsed JSON for successful requests
        // Handle empty responses
        if (response.status === 204) return {} as T;
        
        const result = await response.json();
        
        // Interceptor: Automatically unwrap the 'data' property if it exists
        // (matching our new TransformInterceptor format in backend)
        if (result && typeof result === 'object' && 'data' in result && result.success === true) {
            return result.data as T;
        }
        
        return result as T;
    } catch (error) {
        // Log error for debugging
        console.error(`[API Fetch Error] ${endpoint}:`, error);
        throw error;
    }
}

/**
 * API Utility — Centralized fetch wrapper for the PU LMS backend
 * Automatically attaches JWT token and handles errors
 */

const BASE_URL = 'http://localhost:5000/api'

class ApiClient {
  constructor() {
    this.baseUrl = BASE_URL
  }

  // Get stored JWT token
  getToken() {
    return localStorage.getItem('pu-lms-token')
  }

  // Set JWT token
  setToken(token) {
    localStorage.setItem('pu-lms-token', token)
  }

  // Remove token (logout)
  clearToken() {
    localStorage.removeItem('pu-lms-token')
  }

  // Build headers with auth token
  getHeaders(isJson = true) {
    const headers = {}
    if (isJson) headers['Content-Type'] = 'application/json'
    const token = this.getToken()
    if (token) headers['Authorization'] = `Bearer ${token}`
    return headers
  }

  // Generic request method
  async request(method, endpoint, body = null) {
    const url = `${this.baseUrl}${endpoint}`
    const config = {
      method,
      headers: this.getHeaders(),
    }

    if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
      config.body = JSON.stringify(body)
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        // If token expired, clear it
        if (response.status === 401) {
          this.clearToken()
        }
        throw new Error(data.error || `Request failed with status ${response.status}`)
      }

      return data
    } catch (error) {
      if (error.message === 'Failed to fetch') {
        throw new Error('Cannot connect to server. Make sure the backend is running on port 5000.')
      }
      throw error
    }
  }

  // Convenience methods
  get(endpoint) { return this.request('GET', endpoint) }
  post(endpoint, body) { return this.request('POST', endpoint, body) }
  put(endpoint, body) { return this.request('PUT', endpoint, body) }
  delete(endpoint) { return this.request('DELETE', endpoint) }

  // Auth-specific methods
  async login(email, password) {
    const data = await this.post('/auth/login', { email, password })
    if (data.token) {
      this.setToken(data.token)
    }
    return data
  }

  logout() {
    this.clearToken()
  }

  async getProfile() {
    return this.get('/auth/me')
  }
}

// Export singleton instance
const api = new ApiClient()
export default api

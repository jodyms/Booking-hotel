// Authentication service with automatic token refresh
class AuthService {
  private static instance: AuthService;
  private refreshPromise: Promise<string | null> | null = null;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async getValidToken(): Promise<string | null> {
    const token = localStorage.getItem('access_token');
    
    if (!token) {
      return null;
    }

    // Check if token is expired
    if (this.isTokenExpired(token)) {
      return await this.refreshToken();
    }

    return token;
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      // Check if token expires in the next 5 minutes
      return payload.exp < (currentTime + 300);
    } catch {
      return true;
    }
  }

  private async refreshToken(): Promise<string | null> {
    // If refresh is already in progress, return the same promise
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh();
    
    try {
      const result = await this.refreshPromise;
      return result;
    } finally {
      this.refreshPromise = null;
    }
  }

  private async performTokenRefresh(): Promise<string | null> {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      
      if (!refreshToken) {
        this.clearTokens();
        return null;
      }

      const response = await fetch('http://localhost:8080/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (response.ok) {
        const tokenData = await response.json();
        localStorage.setItem('access_token', tokenData.token);
        
        if (tokenData.refreshToken) {
          localStorage.setItem('refresh_token', tokenData.refreshToken);
        }
        
        return tokenData.token;
      } else {
        this.clearTokens();
        // Redirect to login page
        window.location.href = '/';
        return null;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearTokens();
      window.location.href = '/';
      return null;
    }
  }

  public clearTokens(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  public async makeAuthenticatedRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const token = await this.getValidToken();
    
    if (!token) {
      throw new Error('No valid token available');
    }

    const headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    // If we get 401, try refreshing token once more
    if (response.status === 401) {
      const newToken = await this.refreshToken();
      
      if (newToken) {
        const retryHeaders = {
          ...options.headers,
          'Authorization': `Bearer ${newToken}`,
        };

        return fetch(url, {
          ...options,
          headers: retryHeaders,
        });
      }
    }

    return response;
  }
}

export default AuthService.getInstance();
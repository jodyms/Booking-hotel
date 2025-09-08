import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { LoginProps } from '../types';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      console.log('Sending login request:', { email: email, password: '***' });
      
      // First test the public endpoint accessibility
      try {
        const testResponse = await fetch('http://localhost:8080/api/public/test', {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        });
        console.log('Public test endpoint response:', testResponse.status, await testResponse.json());
      } catch (testError) {
        console.log('Public test endpoint failed:', testError);
      }
      
      // Test original auth endpoint
      try {
        const authTestResponse = await fetch('http://localhost:8080/api/auth/test', {
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        });
        console.log('Auth test endpoint response:', authTestResponse.status, await authTestResponse.json());
      } catch (authTestError) {
        console.log('Auth test endpoint failed:', authTestError);
      }
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      // Now try the original auth endpoint since security is disabled
      console.log('Trying auth endpoint...');
      const loginUrl = 'http://localhost:8080/api/auth/login';
      
      const response = await fetch(loginUrl, {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      console.log('Login response status:', response.status);
      console.log('Login response headers:', Object.fromEntries(response.headers.entries()));
      
      // Check if response has content-type
      const contentType = response.headers.get('content-type');
      console.log('Response Content-Type:', contentType);
      
      if (!response.ok) {
        let errorMessage = `HTTP Error ${response.status}`;
        try {
          const errorText = await response.text();
          if (errorText.trim()) {
            if (contentType && contentType.includes('application/json')) {
              const error = JSON.parse(errorText);
              errorMessage = error.message || errorMessage;
            } else {
              errorMessage = errorText;
            }
          }
        } catch (parseError) {
          console.error('Error parsing error response:', parseError);
        }
        throw new Error(errorMessage);
      }
      
      // Get response text first to check if it's empty
      const responseText = await response.text();
      console.log('Login response text length:', responseText.length);
      console.log('Login response text:', responseText);

      if (!responseText.trim()) {
        throw new Error('Empty response from server');
      }
      
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        console.error('Response was:', responseText);
        throw new Error(`Invalid JSON response from server. Content-Type: ${contentType}`);
      }
      
      console.log('Login response data:', data);
      
      if (!data.token) {
        throw new Error('No token received from server');
      }
      
      // Store tokens
      localStorage.setItem('access_token', data.token);
      if (data.refreshToken) {
        localStorage.setItem('refresh_token', data.refreshToken);
      }
      
      // Create user object for parent component
      const userData = {
        sub: data.email,
        username: data.email,
        email: data.email,
        name: `${data.firstName} ${data.lastName}`,
        role: data.role,
      };
      
      onLogin(userData);
      
    } catch (error) {
      console.error('Login error:', error);
      
      if (error instanceof Error && error.name === 'AbortError') {
        alert('Request timed out. Please check if the server is running.');
      } else if (error instanceof Error && error.message.includes('fetch')) {
        alert('Cannot connect to server. Please check if the backend is running at http://localhost:8080');
      } else {
        alert(`Login failed: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center p-8">
          {/* Question mark illustration */}
          <div className="relative">
            <div className="w-64 h-64 bg-yellow-400 rounded-full flex items-center justify-center relative">
              <span className="text-8xl font-bold text-white">?</span>
              {/* Small decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-6 h-6 bg-yellow-300 rounded-full"></div>
              <div className="absolute top-8 -right-8 w-4 h-4 bg-white rounded-full"></div>
              <div className="absolute -bottom-2 left-8 w-3 h-3 bg-white rounded-full"></div>
              {/* Lightning bolt */}
              <div className="absolute -left-12 top-16">
                <svg className="w-8 h-8 text-yellow-300 transform rotate-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            {/* Character illustration simplified */}
            <div className="absolute -bottom-8 right-4 w-16 h-20 bg-yellow-500 rounded-t-full">
              <div className="w-8 h-8 bg-pink-300 rounded-full mx-auto mt-2"></div>
              <div className="w-12 h-8 bg-gray-800 mx-auto mt-1 rounded-b-full"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Login</h2>
          </div>
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Enter your email address"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200"
            >
              Login
            </button>



            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="font-medium text-blue-600 hover:text-blue-500 transition duration-200"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
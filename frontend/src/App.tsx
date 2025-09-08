import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Login from './features/auth/pages/Login';
import Register from './features/auth/pages/Register';
import Dashboard from './features/dashboard/pages/Dashboard';
import Callback from './components/Callback';
import Layout from './components/Layout';
import RoomListPage from './features/rooms/pages/RoomListPage';
import AddRoomPage from './features/rooms/pages/AddRoomPage';
import EditRoomPage from './features/rooms/pages/EditRoomPage';
import BookingListPage from './features/bookings/pages/BookingListPage';
import NewBookingPage from './features/bookings/pages/NewBookingPage';
import BookingDetailPage from './features/bookings/pages/BookingDetailPage';

interface User {
  sub: string;
  username: string;
  email: string;
  name: string;
  role?: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      validateToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async (token: string) => {
    try {
      // Try validating with custom JWT endpoint
      const response = await fetch('http://localhost:8080/api/auth/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      if (response.ok) {
        const validationData = await response.json();
        const userData = {
          sub: validationData.email,
          username: validationData.email,
          email: validationData.email,
          name: validationData.email,
          role: validationData.role,
        };
        setUser(userData);
      } else {
        // Token is invalid, try to refresh
        await attemptTokenRefresh();
      }
    } catch (error) {
      console.error('Token validation failed:', error);
      await attemptTokenRefresh();
    } finally {
      setLoading(false);
    }
  };

  const attemptTokenRefresh = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) {
        throw new Error('No refresh token available');
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
        
        // Validate the new token
        await validateToken(tokenData.token);
      } else {
        // Refresh failed, clear all tokens
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <Routes>
          <Route 
            path="/callback" 
            element={<Callback onLogin={handleLogin} />} 
          />
          <Route 
            path="/register" 
            element={user ? <Navigate to="/" replace /> : <Register />} 
          />
          <Route 
            path="/" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <Dashboard user={user} onLogout={handleLogout} />
                </Layout>
              ) : (
                <Login onLogin={handleLogin} />
              )
            } 
          />
          <Route 
            path="/rooms" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <RoomListPage />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/rooms/add" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <AddRoomPage />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/rooms/edit/:id" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <EditRoomPage />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/bookings" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <BookingListPage />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/bookings/new" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <NewBookingPage />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route 
            path="/bookings/:id" 
            element={
              user ? (
                <Layout user={user} onLogout={handleLogout}>
                  <BookingDetailPage />
                </Layout>
              ) : (
                <Navigate to="/" replace />
              )
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  </Provider>
  );
}

export default App

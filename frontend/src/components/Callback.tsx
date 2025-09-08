import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
  sub: string;
  username: string;
  email: string;
  name: string;
}

interface CallbackProps {
  onLogin: (user: User) => void;
}

const Callback: React.FC<CallbackProps> = ({ onLogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const error = urlParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/');
        return;
      }

      if (code) {
        try {
          const tokenResponse = await fetch('http://localhost:8080/realms/hotel-booking/protocol/openid-connect/token', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              grant_type: 'authorization_code',
              client_id: 'hotel-booking-client',
              code: code,
              redirect_uri: 'http://localhost:5173/callback',
            }),
          });

          if (tokenResponse.ok) {
            const tokens = await tokenResponse.json();
            localStorage.setItem('access_token', tokens.access_token);
            
            const userResponse = await fetch('http://localhost:8080/api/auth/user', {
              headers: {
                'Authorization': `Bearer ${tokens.access_token}`,
              },
            });

            if (userResponse.ok) {
              const userData = await userResponse.json();
              onLogin(userData);
              navigate('/');
            }
          } else {
            console.error('Token exchange failed');
            navigate('/');
          }
        } catch (error) {
          console.error('Callback handling error:', error);
          navigate('/');
        }
      }
    };

    handleCallback();
  }, [navigate, onLogin]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-xl text-gray-700">Processing authentication...</div>
      </div>
    </div>
  );
};

export default Callback;
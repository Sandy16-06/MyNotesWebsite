import React, { useState, useEffect } from 'react';
import { HomePage } from './pages/HomePage';
import { NotesApp } from './pages/NotesApp';
import { LoadingSpinner } from './components/LoadingSpinner';

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showHomePage, setShowHomePage] = useState(true);

  // Check for stored user session
  useEffect(() => {
    const storedUser = localStorage.getItem('demo-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setShowHomePage(false);
    }
  }, []);

  // If user is authenticated, go directly to notes app
  useEffect(() => {
    if (user) {
      setShowHomePage(false);
    }
  }, [user]);

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${15 + Math.random() * 10}s`
              }}
            />
          ))}
        </div>
        <div className="text-center">
          <LoadingSpinner size={48} className="mb-4" />
          <p className="text-white/80 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show homepage for non-authenticated users or when explicitly requested
  if (showHomePage && !user) {
    return (
      <HomePage
        onGetStarted={() => setShowHomePage(false)}
        onUserAuthenticated={(user) => {
          setUser(user);
          setShowHomePage(false);
        }}
      />
    );
  }

  // Show notes app
  return <NotesApp />;
}

export default App;
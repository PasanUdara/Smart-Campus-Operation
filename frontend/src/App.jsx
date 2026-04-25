import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';  // Nisidu
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <AuthProvider>  {/* Nisidu- Wrap everything */}
        <div className="bg-zinc-950 min-h-screen">
          <Header />
          <main>
            <AppRoutes />
          </main>
          <Footer />
        </div>
      </AuthProvider>  {/* Nisidu- Closing tag */}
    </Router>
  );
}

export default App;
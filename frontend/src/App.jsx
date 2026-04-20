
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <div className="bg-zinc-950 min-h-screen">
        <Header />
        <main>
           <AppRoutes />
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthenticatedHome from './AuthenticatedHome';
import LandingPage from './LandingPage';

function HomePage() {
  const { user } = useContext(AuthContext);

  // If user is authenticated, show chef dashboard
  if (user) {
    return <AuthenticatedHome />;
  }
  
  // If user is not authenticated, show landing page
  return <LandingPage />;
}

export default HomePage;
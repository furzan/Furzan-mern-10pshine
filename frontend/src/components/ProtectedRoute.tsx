import { useEffect, useState, type ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { verifyToken } from '../services/auth_Apis'; // Adjust path

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
    
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await verifyToken();
        setIsAuthorized(true);
      } catch (error) {
        setIsAuthorized(false);
      }
    };
    checkAuth();
  }, []);

  if (isAuthorized === null) {
    return <div className="loading-screen">Verifying session...</div>;
  }

  return isAuthorized ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
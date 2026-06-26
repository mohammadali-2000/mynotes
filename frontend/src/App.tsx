import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import LandingPage from './pages/LandingPage';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Dashboard from './pages/Dashboard';
import NotesWorkspace from './pages/NotesWorkspace';
import Layout from './components/layout/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, isLoading } = useAuthStore();
  
  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/app" element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="notes" element={<NotesWorkspace />} />
          <Route path="notes/:noteId" element={<NotesWorkspace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
    } else {
      navigate('/app');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google' });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 border border-border rounded-xl shadow-lg bg-card text-card-foreground">
        <h2 className="text-3xl font-bold mb-6 text-center">Welcome Back</h2>
        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium">Password</label>
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot Password?</Link>
            </div>
            <Input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in...' : 'Log In'}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="w-1/5 border-b border-border"></span>
          <span className="text-xs text-muted-foreground uppercase">or log in with</span>
          <span className="w-1/5 border-b border-border"></span>
        </div>

        <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin}>
          Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

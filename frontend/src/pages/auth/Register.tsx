import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
    
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
        <h2 className="text-3xl font-bold mb-6 text-center">Create an Account</h2>
        {error && <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>}
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <Input 
              type="text" 
              value={fullName} 
              onChange={e => setFullName(e.target.value)} 
              required 
            />
          </div>
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
            <label className="block text-sm font-medium mb-1">Password</label>
            <Input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 flex items-center justify-between">
          <span className="w-1/5 border-b border-border"></span>
          <span className="text-xs text-muted-foreground uppercase">or sign up with</span>
          <span className="w-1/5 border-b border-border"></span>
        </div>

        <Button variant="outline" className="w-full mt-4" onClick={handleGoogleLogin}>
          Google
        </Button>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

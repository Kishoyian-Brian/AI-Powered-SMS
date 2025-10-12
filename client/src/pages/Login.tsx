import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Sparkles, ArrowLeft, AlertCircle } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { authenticateUser } from '../utils/mockAuth';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Authenticate user and get their role automatically
    const authenticatedUser = authenticateUser(email, password);
    
    if (authenticatedUser) {
      // Set user with automatically detected role
      setUser({
        role: authenticatedUser.role,
        name: authenticatedUser.name,
        email: authenticatedUser.email,
      });

      // Navigate based on detected role
      if (authenticatedUser.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/teacher-dashboard');
      }
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-400 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="backdrop-blur-xl bg-white/10 rounded-3xl shadow-2xl p-8 border border-white/20">
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
          >
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition-colors mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-2xl mb-4 shadow-lg">
                <Sparkles className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-white mb-2">AI-SMS</h1>
              <p className="text-blue-100">Student Management System</p>
            </div>
          </motion.div>

          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-200" />
                <p className="text-sm text-red-100">{error}</p>
              </motion.div>
            )}

            <div>
              <label className="block text-white text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="admin@ai-sms.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-blue-200" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-white">
                <input type="checkbox" className="mr-2 rounded" />
                Remember me
              </label>
              <a href="#" className="text-white hover:text-blue-100 transition-colors">
                Forgot password?
              </a>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-white text-blue-600 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              Sign In
            </motion.button>
          </form>

          <div className="mt-6 p-4 bg-white/10 rounded-xl border border-white/20">
            <p className="text-white text-sm font-semibold mb-2">Demo Accounts:</p>
            <div className="space-y-2 text-xs text-blue-100">
              <div>
                <p className="font-medium text-white">Admin:</p>
                <p>Email: admin@school.com</p>
                <p>Password: admin123</p>
              </div>
              <div className="border-t border-white/20 pt-2">
                <p className="font-medium text-white">Teacher:</p>
                <p>Email: robert.smith@teacher.school.com</p>
                <p>Password: teacher123</p>
              </div>
            </div>
          </div>

          <p className="text-center text-blue-100 text-sm mt-6">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-white hover:underline font-semibold"
            >
              Sign Up
            </Link>
          </p>
          <p className="text-center text-blue-100 text-xs mt-4">
            Powered by AI Technology
          </p>
        </div>
      </motion.div>
    </div>
  );
}

import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>Aether – Login</title>
        <meta name="description" content="Login to your Aether account and access premium handcrafted sarees." />
      </Helmet>

      <div className="min-h-screen bg-[#050505] text-[#f5f0eb] flex items-center justify-center px-4 relative overflow-hidden font-sans">
        {/* Ambient Gold Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#d4af37]/5 blur-3xl rounded-full z-0"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#d4af37]/3 blur-3xl rounded-full z-0"></div>

        {/* Marble Texture Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-20 bg-marble z-0"></div>

        {/* Floating Gold Dust Particles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="gold-dust" style={{ top: '15%', left: '10%', animationDelay: '0s' }}></div>
          <div className="gold-dust" style={{ top: '80%', left: '90%', animationDelay: '1.5s' }}></div>
          <div className="gold-dust" style={{ top: '50%', left: '5%', animationDelay: '2.8s' }}></div>
          <div className="gold-dust" style={{ top: '30%', left: '85%', animationDelay: '0.9s' }}></div>
          <div className="gold-dust" style={{ top: '70%', left: '20%', animationDelay: '2.2s' }}></div>
        </div>

        {/* Glass Card */}
        <div className="glass-royal rounded-2xl border border-[#d4af37]/30 shadow-royal p-8 max-w-md w-full relative z-10">
          <div className="text-center mb-8">
            <h1 className="font-serif text-4xl font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-[#f5e6d0] via-[#d4af37] to-[#f5e6d0] drop-shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              AETHER
            </h1>
            <p className="text-xs text-gray-400 tracking-widest mt-1 font-light uppercase border-b border-[#d4af37]/20 pb-2">
              Login
            </p>
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37] to-transparent mx-auto mt-4"></div>
          </div>

          <form onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-900/20 border border-red-800 text-red-300 text-sm p-3 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-300 uppercase tracking-wider mb-1">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 bg-black/40 border border-[#d4af37]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#d4af37] text-gray-200 placeholder-gray-500 transition"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-6 py-3 rounded-full font-semibold text-sm tracking-widest transition ${
                loading
                  ? 'bg-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-gradient-to-r from-[#d4af37] to-[#f5e6d0] text-black hover:shadow-lg hover:shadow-[#d4af37]/30 hover:scale-[1.02]'
              }`}
            >
              {loading ? 'LOGGING IN...' : 'LOGIN'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6 font-light">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#d4af37] hover:text-[#f5e6d0] transition font-medium">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
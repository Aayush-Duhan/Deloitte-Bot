import { useState } from 'react';
import axios from 'axios';
import DotBackground from '../components/DotBackground';
import { useNavigate } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Login = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    companyName: '',
    purchasingEmail: '',
    otp: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isRegistering && !showOTP) {
        // Initial registration
        const response = await axios.post(`${API_URL}/auth/register`, {
          companyName: formData.companyName,
          purchasingEmail: formData.purchasingEmail,
          password: formData.password
        });
        setShowOTP(true);
      } else if (showOTP) {
        // Verify OTP for both registration and login flows
        const response = await axios.post(`${API_URL}/auth/verify-otp`, {
          email: formData.purchasingEmail || formData.email,
          otp: formData.otp
        });
        
        // Store token and redirect
        localStorage.setItem('token', response.data.token);
        navigate('/dashboard');
      } else {
        // Normal login
        const response = await axios.post(`${API_URL}/auth/login`, {
          email: formData.email,
          password: formData.password
        });

        if (response.data.requiresVerification) {
          setShowOTP(true);
        } else {
          localStorage.setItem('token', response.data.token);
          navigate('/dashboard');
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const renderForm = () => {
    if (showOTP) {
      return (
        <div className="space-y-4 rounded-md">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-white mb-1">
              Enter OTP
            </label>
            <input
              id="otp"
              name="otp"
              type="text"
              required
              value={formData.otp}
              onChange={handleChange}
              className="relative block w-full rounded-lg border-0 bg-black/30 p-3 text-white placeholder-zinc-400 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 backdrop-blur-sm"
              placeholder="Enter OTP sent to your email"
            />
            <p className="mt-2 text-sm text-zinc-400">
              OTP has been sent to your registered email address
            </p>
          </div>
        </div>
      );
    }

    if (isRegistering) {
      return (
        <div className="space-y-4 rounded-md">
          <div>
            <label htmlFor="companyName" className="block text-sm font-medium text-white mb-1">
              Company Name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              required
              value={formData.companyName}
              onChange={handleChange}
              className="relative block w-full rounded-lg border-0 bg-black/30 p-3 text-white placeholder-zinc-400 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 backdrop-blur-sm"
              placeholder="Enter company name"
            />
          </div>
          <div>
            <label htmlFor="purchasingEmail" className="block text-sm font-medium text-white mb-1">
              Business Email
            </label>
            <input
              id="purchasingEmail"
              name="purchasingEmail"
              type="email"
              required
              value={formData.purchasingEmail}
              onChange={handleChange}
              className="relative block w-full rounded-lg border-0 bg-black/30 p-3 text-white placeholder-zinc-400 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 backdrop-blur-sm"
              placeholder="your.email@company.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="relative block w-full rounded-lg border-0 bg-black/30 p-3 text-white placeholder-zinc-400 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 backdrop-blur-sm"
              placeholder="Create a password"
            />
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-4 rounded-md">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-white mb-1">
            Business Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="relative block w-full rounded-lg border-0 bg-black/30 p-3 text-white placeholder-zinc-400 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 backdrop-blur-sm"
            placeholder="your.email@company.com"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-white mb-1">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            value={formData.password}
            onChange={handleChange}
            className="relative block w-full rounded-lg border-0 bg-black/30 p-3 text-white placeholder-zinc-400 shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-purple-500 sm:text-sm sm:leading-6 backdrop-blur-sm"
            placeholder="Enter your password"
          />
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <DotBackground />
      </div>
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8 p-10 bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl">
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">
              {showOTP ? 'Verify OTP' : isRegistering ? 'Register your Company' : 'Sign in to your account'}
            </h2>
            {error && (
              <div className="mt-2 text-center text-sm text-red-500">
                {error}
              </div>
            )}
            {!showOTP && (
              <p className="mt-2 text-center text-sm text-zinc-400">
                {isRegistering ? 'Already registered? ' : "Don't have an account? "}
                <button
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="font-medium text-purple-500 hover:text-purple-400"
                >
                  {isRegistering ? 'Sign in' : 'Register now'}
                </button>
              </p>
            )}
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {renderForm()}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative flex w-full justify-center rounded-lg bg-purple-500/80 px-3 py-3 text-sm font-semibold text-white hover:bg-purple-400/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-500 transition-all duration-300 ease-in-out backdrop-blur-sm disabled:opacity-50"
              >
                {loading ? 'Processing...' : showOTP ? 'Verify OTP' : isRegistering ? 'Register & Get OTP' : 'Sign in'}
              </button>
            </div>
          </form>

          {!isRegistering && !showOTP && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-black/40 px-2 text-zinc-400 backdrop-blur-sm">Need help?</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <a href="#" className="font-medium text-purple-500 hover:text-purple-400">
                  Contact Support
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;

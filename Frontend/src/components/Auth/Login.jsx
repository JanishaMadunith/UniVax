import React, { useState } from 'react';
import { Mail, Lock, Shield, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [selectedRole, setSelectedRole] = useState('Patient');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  //  VALIDATION 
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear field error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Clear submit error when typing
    if (errors.submit) {
      setErrors(prev => ({ ...prev, submit: '' }));
    }
  };

  // HANDLE SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.warning('Please fill all fields correctly!');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5001/api/V1/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.toLowerCase(),
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Save token
        localStorage.setItem('token', data.token);
        
        // Override user role for testing purposes
        const userWithRole = {
          ...data.user,
          role: selectedRole
        };
        localStorage.setItem('user', JSON.stringify(userWithRole));
        
        if (formData.rememberMe) {
          localStorage.setItem('email', formData.email);
        }

        toast.success(`Login successful as ${selectedRole}! Redirecting...`, {
          position: "top-right",
          autoClose: 2000,
        });

        // Redirect to vaccines page
        setTimeout(() => {
          navigate('/vaccines');
        }, 1000);

      } else {
        const message = data.message || 'Invalid email or password';
        toast.error(message);
        setErrors({ submit: message });
      }

    } catch (error) {
      console.error(error);
      const message = 'Network error. Please try again.';
      toast.error(message);
      setErrors({ submit: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex justify-center items-center space-x-2 mb-2">
            <Shield className="w-7 h-7 text-blue-600" />
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent">
              Univax
            </span>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">Welcome Back</h2>
          <p className="text-sm text-gray-500">Login to your account</p>
        </div>

        {/* INLINE ERROR */}
        {errors.submit && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 flex items-center">
            <AlertCircle className="w-4 h-4 mr-2" />
            {errors.submit}
          </div>
        )}

        {/* Role Selection */}
        <div className="mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <label className="text-sm font-medium text-gray-700 block mb-3">
            Login Role (Select for Testing)
          </label>
          <div className="flex gap-2">
            {['Patient', 'Doctor', 'Admin'].map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`flex-1 py-2 px-3 rounded-lg font-medium transition ${
                  selectedRole === role
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-600 mt-2">
            💡 Select your role above to test different features
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-10 py-2.5 border rounded-xl ${
                  errors.email ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="you@example.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-10 py-2.5 border rounded-xl ${
                  errors.password ? 'border-red-300' : 'border-gray-200'
                }`}
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl text-white font-semibold ${
              isSubmitting
                ? 'bg-blue-400'
                : 'bg-gradient-to-r from-blue-600 to-green-600 hover:scale-[1.02]'
            }`}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </button>

          {/* Footer */}
          <div className="text-center mt-4">
            <p className="text-sm text-gray-500">
              Don’t have an account?{' '}
              <Link to="/signup" className="text-blue-600 font-medium hover:underline">
                Sign up
              </Link>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;
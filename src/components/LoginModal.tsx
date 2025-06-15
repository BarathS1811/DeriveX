import React, { useState } from 'react';
import { User, Mail, Phone, Lock, X } from 'lucide-react';
import { authService } from '../services/AuthService';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLoginMode) {
      const result = authService.login(formData.email || formData.username, formData.password);
      alert(result.message);
      if (result.success) {
        onLogin();
        onClose();
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert('Passwords do not match');
        return;
      }
      
      const result = authService.register(formData.username, formData.email, formData.phone, formData.password);
      alert(result.message);
      if (result.success) {
        setIsLoginMode(true);
        setFormData({
          username: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: ''
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-6 w-96 border border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {isLoginMode ? 'Login' : 'Register'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              {isLoginMode ? 'Email or Username' : 'Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={isLoginMode ? "text" : "email"}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder={isLoginMode ? "Enter email or username" : "Enter email"}
                required
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="Enter phone number"
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
                placeholder="Enter password"
                required
              />
            </div>
          </div>

          {!isLoginMode && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-primary"
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-primary hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-colors font-semibold"
          >
            {isLoginMode ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="text-primary hover:text-blue-400 transition-colors text-sm"
          >
            {isLoginMode 
              ? "Don't have an account? Register here" 
              : "Already have an account? Login here"
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
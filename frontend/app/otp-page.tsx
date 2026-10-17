'use client';

import { useState } from 'react';
import OTPVerification from '@/components/otp-verification';

export default function OTPPage() {
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [verificationResult, setVerificationResult] = useState<any>(null);

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you'd call the request-otp endpoint here first
    // For now, we'll just show the OTP component
    setShowOTP(true);
  };

  const handleVerifySuccess = (data: any) => {
    setVerificationResult(data);
    console.log('Verification successful:', data);
    // Redirect or perform next action
  };

  const handleVerifyError = (error: string) => {
    console.error('Verification failed:', error);
  };

  if (verificationResult) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="mb-4 text-4xl">✓</div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Success!
            </h1>
            <p className="text-slate-600 mb-6">
              Your email has been verified
            </p>
            <pre className="bg-slate-50 p-4 rounded text-sm text-left overflow-auto">
              {JSON.stringify(verificationResult, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    );
  }

  if (showOTP) {
    return (
      <OTPVerification
        email={email}
        onVerifySuccess={handleVerifySuccess}
        onVerifyError={handleVerifyError}
      />
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2 text-center">
            Login
          </h1>
          <p className="text-slate-600 text-center mb-8">
            Enter your email to receive an OTP
          </p>

          <form onSubmit={handleRequestOTP} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Send OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useRef, useEffect } from 'react';

interface OTPVerificationProps {
  email: string;
  onVerifySuccess?: (data: any) => void;
  onVerifyError?: (error: string) => void;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function OTPVerification({
  email,
  onVerifySuccess,
  onVerifyError,
}: OTPVerificationProps) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResendActive, setIsResendActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setIsResendActive(true);
      return;
    }

    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle digit input
  const handleInput = (index: number, value: string) => {
    // Strip non-digits
    const digit = value.replace(/\D/g, '');

    if (digit.length > 1) {
      // Handle paste - spread digits across boxes
      const digits = digit.slice(0, 6).split('');
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        if (index + i < 6) {
          newOtp[index + i] = d;
        }
      });
      setOtp(newOtp);
      // Focus the last filled box or the last box
      const lastFilledIndex = Math.min(index + digits.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    } else {
      // Single digit
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      // Auto-advance to next box if digit is entered
      if (digit && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Handle backspace and arrow keys
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (otp[index] === '' && index > 0) {
        // Move to previous box if current is empty
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otp];
        newOtp[index - 1] = '';
        setOtp(newOtp);
      } else {
        // Clear current box
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, 6).split('');

    if (digits.length > 0) {
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[i] = d;
      });
      setOtp(newOtp);

      // Focus the last filled box
      const lastFilledIndex = Math.min(digits.length - 1, 5);
      inputRefs.current[lastFilledIndex]?.focus();
    }
  };

  // Check if all boxes are filled
  const isComplete = otp.every((digit) => digit !== '');

  // Handle verify with backend
  const handleVerify = async () => {
    if (!isComplete) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const code = otp.join('');
      const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          otp: code,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'OTP verification failed');
      }

      const data = await response.json();
      console.log('OTP verified successfully:', data);
      onVerifySuccess?.(data);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'An error occurred';
      setErrorMessage(errorMsg);
      onVerifyError?.(errorMsg);
      console.error('OTP verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle resend with backend
  const handleResend = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const response = await fetch(`${API_BASE_URL}/auth/request-otp`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to resend OTP');
      }

      const data = await response.json();
      console.log('OTP resent successfully:', data);

      // Reset UI
      setOtp(['', '', '', '', '', '']);
      setTimeLeft(30);
      setIsResendActive(false);
      inputRefs.current[0]?.focus();
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : 'An error occurred';
      setErrorMessage(errorMsg);
      onVerifyError?.(errorMsg);
      console.error('Resend OTP error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-slate-600">
              We've sent a 6-digit code to your email address
            </p>
          </div>

          {/* OTP Input Boxes */}
          <div className="flex gap-3 justify-center mb-8">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={6} // Allow paste to work
                value={digit}
                onChange={(e) => handleInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-2xl font-bold border-2 border-slate-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200"
                placeholder="•"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={!isComplete || isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 mb-6 ${
              isComplete && !isLoading
                ? 'bg-blue-600 hover:bg-blue-700 cursor-pointer'
                : 'bg-slate-300 cursor-not-allowed'
            }`}
          >
            {isLoading ? 'Verifying...' : 'Verify'}
          </button>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
              {errorMessage}
            </div>
          )}

          {/* Resend Section */}
          <div className="text-center text-sm text-slate-500">
            {isResendActive ? (
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sending...' : 'Resend code'}
              </button>
            ) : (
              <p>
                Didn't get it?{' '}
                <span className="text-slate-700 font-semibold">
                  Resend in {formatTime(timeLeft)}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

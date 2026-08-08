import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-md w-full space-y-8 bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-2xl shadow-indigo-500/10">
        
        {/* Logo Header */}
        <div className="text-center space-y-3">
          <Link to="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <span className="font-extrabold text-2xl tracking-tight text-slate-900">
              Alumni<span className="gradient-text">Connect</span> AI
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight pt-2">Reset Password</h2>
          <p className="text-xs text-slate-500">Enter your registered email address to receive password reset instructions</p>
        </div>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Reset Link Dispatched!</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We have sent a secure password reset link to <strong className="text-slate-900">{email}</strong>. Please check your inbox and follow the instructions.
            </p>
            <Link to="/login" className="inline-block pt-2">
              <Button variant="outline" size="sm" icon={ArrowLeft}>
                Back to Sign In
              </Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Registered Email Address"
              type="email"
              placeholder="name@university.edu"
              icon={Mail}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button type="submit" variant="primary" size="lg" className="w-full" icon={ArrowRight}>
              Send Reset Link
            </Button>
          </form>
        )}

        <div className="text-center text-xs text-slate-500 pt-2 border-t border-slate-100">
          Remember your password?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
};

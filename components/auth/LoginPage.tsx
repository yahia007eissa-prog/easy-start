'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function LoginPage() {
  const router = useRouter();
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError('Invalid email or password');
      setLoading(false);
    } else {
      router.push('/');
      router.refresh();
    }
  }

  async function handleGoogle() {
    await signIn('google', { callbackUrl: '/' });
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f2444 0%, #1e3a5f 60%, #2d5a8e 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '420px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏗️</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e3a5f' }}>StudyBuilder</div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
            Real Estate Feasibility & Valuation
          </div>
        </div>

        <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#1e3a5f', marginBottom: '24px', textAlign: 'center' }}>
          Welcome back
        </h1>

        {/* Google Sign In */}
        <button
          onClick={handleGoogle}
          style={{
            width: '100%', padding: '11px', borderRadius: '10px',
            border: '1.5px solid #ddd', background: 'white', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '16px',
            transition: 'border-color 0.15s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', background: '#eee' }} />
          <span style={{ fontSize: '12px', color: '#aaa' }}>or</span>
          <div style={{ flex: 1, height: '1px', background: '#eee' }} />
        </div>

        {/* Email/Password Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' }}>
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: '1.5px solid #ddd', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' }}>
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%', padding: '10px 12px', borderRadius: '8px',
                border: '1.5px solid #ddd', fontSize: '14px', outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {error && (
            <div style={{ fontSize: '13px', color: '#e74c3c', background: '#fef0f0', padding: '8px 12px', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 600,
              background: loading ? '#aaa' : '#1e3a5f', color: 'white', border: 'none',
              cursor: loading ? 'default' : 'pointer', marginTop: '4px',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '20px' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" style={{ color: '#1e3a5f', fontWeight: 600, textDecoration: 'none' }}>
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/app/actions/user-auth';

const JOB_OPTIONS = [
  'Real Estate Developer',
  'Civil Engineer',
  'Architect',
  'Investor',
  'Financial Analyst',
  'Contractor',
  'Real Estate Agent',
  'Other',
];

export function SignupPage() {
  const router = useRouter();
  const [step,     setStep]     = useState<1 | 2>(1);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  // Step 1 fields
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');

  // Step 2 fields
  const [age,      setAge]      = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone,    setPhone]    = useState('');

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8)  { setError('Password must be at least 8 characters'); return; }
    setError('');
    setStep(2);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await registerUser({
      name, email, password,
      age:      age      ? parseInt(age) : undefined,
      jobTitle: jobTitle || undefined,
      phone:    phone    || undefined,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
      return;
    }

    await signIn('credentials', { email, password, redirect: false });
    router.push('/');
    router.refresh();
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
        maxWidth: '440px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🏗️</div>
          <div style={{ fontSize: '20px', fontWeight: 800, color: '#1e3a5f' }}>StudyBuilder</div>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
          {[1, 2].map(n => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', flex: n === 2 ? 1 : 'none', gap: '8px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%', fontSize: '12px', fontWeight: 700,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: step >= n ? '#1e3a5f' : '#eee',
                color: step >= n ? 'white' : '#aaa',
              }}>{n}</div>
              {n === 1 && <div style={{ flex: 1, height: '2px', background: step >= 2 ? '#1e3a5f' : '#eee' }} />}
            </div>
          ))}
        </div>

        {step === 1 ? (
          <>
            <h1 style={{ fontSize: '17px', fontWeight: 700, color: '#1e3a5f', marginBottom: '20px' }}>
              Create your account
            </h1>

            {/* Google Sign Up */}
            <button
              onClick={handleGoogle}
              style={{
                width: '100%', padding: '11px', borderRadius: '10px',
                border: '1.5px solid #ddd', background: 'white', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                fontSize: '14px', fontWeight: 500, color: '#333', marginBottom: '16px',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18">
                <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
                <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
                <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
                <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
              </svg>
              Sign up with Google
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ flex: 1, height: '1px', background: '#eee' }} />
              <span style={{ fontSize: '12px', color: '#aaa' }}>or</span>
              <div style={{ flex: 1, height: '1px', background: '#eee' }} />
            </div>

            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' }}>Full Name *</label>
                <input required value={name} onChange={e => setName(e.target.value)} placeholder="John Smith"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' }}>Email address *</label>
                <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' }}>Password *</label>
                <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Min. 8 characters"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' }}>Confirm Password *</label>
                <input required type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
              {error && (
                <div style={{ fontSize: '13px', color: '#e74c3c', background: '#fef0f0', padding: '8px 12px', borderRadius: '8px' }}>{error}</div>
              )}
              <button type="submit" style={{ padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, background: '#1e3a5f', color: 'white', border: 'none', cursor: 'pointer', marginTop: '4px' }}>
                Continue →
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '17px', fontWeight: 700, color: '#1e3a5f', marginBottom: '6px' }}>
              Tell us about yourself
            </h1>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>Optional — helps us personalise your experience</p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '13px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' }}>Age</label>
                  <input type="number" min="18" max="100" value={age} onChange={e => setAge(e.target.value)} placeholder="35"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' }}>Phone</label>
                  <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+20 10x xxx xxxx"
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#555', display: 'block', marginBottom: '5px' }}>Job Title</label>
                <select value={jobTitle} onChange={e => setJobTitle(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #ddd', fontSize: '14px', outline: 'none', background: 'white', boxSizing: 'border-box' }}>
                  <option value="">Select your role</option>
                  {JOB_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>

              {error && (
                <div style={{ fontSize: '13px', color: '#e74c3c', background: '#fef0f0', padding: '8px 12px', borderRadius: '8px' }}>{error}</div>
              )}

              <button type="submit" disabled={loading}
                style={{ padding: '11px', borderRadius: '10px', fontSize: '14px', fontWeight: 600, background: loading ? '#aaa' : '#1e3a5f', color: 'white', border: 'none', cursor: loading ? 'default' : 'pointer', marginTop: '4px' }}>
                {loading ? 'Creating account...' : 'Create Account ✓'}
              </button>

              <button type="button" onClick={() => handleSubmit({ preventDefault: () => {} } as React.FormEvent)}
                style={{ fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                Skip and create account
              </button>
            </form>
          </>
        )}

        <p style={{ textAlign: 'center', fontSize: '13px', color: '#888', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#1e3a5f', fontWeight: 600, textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

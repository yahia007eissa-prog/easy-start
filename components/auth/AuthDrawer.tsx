'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { registerUser } from '@/app/actions/user-auth';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';

const JOB_OPTIONS = [
  'Real Estate Developer', 'Civil Engineer', 'Architect',
  'Investor', 'Financial Analyst', 'Contractor', 'Real Estate Agent', 'Other',
];

interface AuthDrawerProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export function AuthDrawer({ open, onClose, defaultTab = 'login' }: AuthDrawerProps) {
  const router = useRouter();
  const t = useTranslations('easyStart');
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [tab,      setTab]      = useState<'login' | 'signup'>(defaultTab);
  const [step,     setStep]     = useState<1 | 2>(1);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [age,      setAge]      = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [phone,    setPhone]    = useState('');

  function reset() {
    setStep(1); setError('');
    setName(''); setEmail(''); setPassword(''); setConfirm('');
    setAge(''); setJobTitle(''); setPhone('');
  }

  function switchTab(t: 'login' | 'signup') { reset(); setTab(t); }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) { setError(t('authInvalidCreds')); setLoading(false); }
    else { router.refresh(); onClose(); }
  }

  async function handleGoogle() {
    await signIn('google', { callbackUrl: window.location.href });
  }

  function handleStep1(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) { setError(t('authPasswordMismatch')); return; }
    if (password.length < 8)  { setError(t('authPasswordShort')); return; }
    setError(''); setStep(2);
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError('');
    const res = await registerUser({
      name, email, password,
      age: age ? parseInt(age) : undefined,
      jobTitle: jobTitle || undefined,
      phone: phone || undefined,
    });
    if (res?.error) { setError(res.error); setLoading(false); return; }
    await signIn('credentials', { email, password, redirect: false });
    router.refresh(); onClose();
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: '1.5px solid #E4E4EE', fontSize: '13px', outline: 'none',
    boxSizing: 'border-box', background: '#FAFAFA',
  };
  const lbl: React.CSSProperties = {
    fontSize: '11px', fontWeight: 600, color: '#4A4A5E',
    display: 'block', marginBottom: '4px',
  };

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)',
            zIndex: 998, transition: 'opacity 0.2s',
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: 'fixed', top: 0, [isRTL ? 'left' : 'right']: 0, height: '100%',
        width: '360px', background: '#fff', zIndex: 999,
        boxShadow: isRTL ? '8px 0 32px rgba(0,0,0,0.18)' : '-8px 0 32px rgba(0,0,0,0.18)',
        transform: open ? 'translateX(0)' : isRTL ? 'translateX(-100%)' : 'translateX(100%)',
        transition: 'transform 0.28s cubic-bezier(0.4,0,0.2,1)',
        display: 'flex', flexDirection: 'column',
        borderRadius: isRTL ? '0 16px 16px 0' : '16px 0 0 16px',
        direction: isRTL ? 'rtl' : 'ltr',
      }}>
        {/* Header */}
        <div style={{ padding: '20px 24px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '22px' }}>🏗️</div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: '20px', color: '#9999AA', lineHeight: 1,
          }}>✕</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', margin: '16px 24px 0', borderRadius: '10px', background: '#F2F2F7', padding: '3px' }}>
          {(['login', 'signup'] as const).map(tabKey => (
            <button key={tabKey} onClick={() => switchTab(tabKey)} style={{
              flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              fontSize: '13px', fontWeight: 600, transition: 'all 0.15s',
              background: tab === tabKey ? '#fff' : 'transparent',
              color: tab === tabKey ? '#1A1A2E' : '#9999AA',
              boxShadow: tab === tabKey ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
            }}>
              {t(tabKey === 'login' ? 'authSignIn' : 'authCreateAccount')}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px' }}>

          {/* Google */}
          <button onClick={handleGoogle} style={{
            width: '100%', padding: '10px', borderRadius: '10px',
            border: '1.5px solid #E4E4EE', background: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
            fontSize: '13px', fontWeight: 500, color: '#333', marginBottom: '16px',
          }}>
            <svg width="17" height="17" viewBox="0 0 18 18">
              <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
              <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
              <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18z"/>
              <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z"/>
            </svg>
            {t('authContinueGoogle')}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ flex: 1, height: '1px', background: '#eee' }} />
            <span style={{ fontSize: '11px', color: '#bbb' }}>{t('authOr')}</span>
            <div style={{ flex: 1, height: '1px', background: '#eee' }} />
          </div>

          {/* LOGIN FORM */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><label style={lbl}>{t('authEmail')}</label>
                <input style={inp} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div><label style={lbl}>{t('authPassword')}</label>
                <input style={inp} type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              {error && <div style={{ fontSize: '12px', color: '#e74c3c', background: '#fef0f0', padding: '8px 12px', borderRadius: '8px' }}>{error}</div>}
              <button type="submit" disabled={loading} style={{
                padding: '10px', borderRadius: '9px', fontSize: '13px', fontWeight: 700,
                background: loading ? '#ccc' : 'linear-gradient(135deg,#2D2D3F,#4A4A5E)',
                color: '#fff', border: 'none', cursor: loading ? 'default' : 'pointer', marginTop: '4px',
              }}>
                {loading ? t('authSigningIn') : t('authSignInBtn')}
              </button>
            </form>
          )}

          {/* SIGNUP FORM */}
          {tab === 'signup' && step === 1 && (
            <form onSubmit={handleStep1} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div><label style={lbl}>{t('authFullName')} *</label>
                <input style={inp} required value={name} onChange={e => setName(e.target.value)} placeholder="John Smith" />
              </div>
              <div><label style={lbl}>{t('authEmail')} *</label>
                <input style={inp} type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
              </div>
              <div><label style={lbl}>{t('authPassword')} *</label>
                <input style={inp} type="password" required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
              </div>
              <div><label style={lbl}>{t('authConfirmPassword')} *</label>
                <input style={inp} type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" />
              </div>
              {error && <div style={{ fontSize: '12px', color: '#e74c3c', background: '#fef0f0', padding: '8px 12px', borderRadius: '8px' }}>{error}</div>}
              <button type="submit" style={{
                padding: '10px', borderRadius: '9px', fontSize: '13px', fontWeight: 700,
                background: 'linear-gradient(135deg,#2D2D3F,#4A4A5E)', color: '#fff', border: 'none', cursor: 'pointer',
              }}>{t('authContinue')}</button>
            </form>
          )}

          {tab === 'signup' && step === 2 && (
            <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ fontSize: '12px', color: '#9999AA', margin: '0 0 4px' }}>{t('authOptionalHint')}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div><label style={lbl}>{t('authAge')}</label>
                  <input style={inp} type="number" min="18" max="100" value={age} onChange={e => setAge(e.target.value)} placeholder="30" />
                </div>
                <div><label style={lbl}>{t('authPhone')}</label>
                  <input style={inp} type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+20 1xx" />
                </div>
              </div>
              <div><label style={lbl}>{t('authJobTitle')}</label>
                <select style={{ ...inp, background: '#fff' }} value={jobTitle} onChange={e => setJobTitle(e.target.value)}>
                  <option value="">{t('authSelectRole')}</option>
                  {JOB_OPTIONS.map(j => <option key={j} value={j}>{j}</option>)}
                </select>
              </div>
              {error && <div style={{ fontSize: '12px', color: '#e74c3c', background: '#fef0f0', padding: '8px 12px', borderRadius: '8px' }}>{error}</div>}
              <button type="submit" disabled={loading} style={{
                padding: '10px', borderRadius: '9px', fontSize: '13px', fontWeight: 700,
                background: loading ? '#ccc' : 'linear-gradient(135deg,#5B21B6,#7C3AED)',
                color: '#fff', border: 'none', cursor: loading ? 'default' : 'pointer',
              }}>
                {loading ? t('authCreating') : t('authCreateAccountBtn')}
              </button>
              <button type="button" onClick={() => handleSignup({ preventDefault: () => {} } as React.FormEvent)}
                style={{ fontSize: '11px', color: '#9999AA', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
                {t('authSkip')}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

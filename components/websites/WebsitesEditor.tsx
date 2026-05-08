'use client';

import { useState, useEffect } from 'react';
import type { TrustedWebsite } from '@/lib/ai/trusted-websites';

const CATEGORIES = [
  'أسعار العقارات',
  'أسعار مواد البناء',
  'أسعار زراعية',
  'مناطق وتطوير',
  'إحصاءات رسمية',
  'مزادات وعطاءات',
  'أخرى',
];

const EMPTY = { name: '', url: '', category: '', description: '', notes: '' };

export function WebsitesEditor() {
  const [sites, setSites]       = useState<TrustedWebsite[]>([]);
  const [loading, setLoading]   = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState<string | null>(null);
  const [form, setForm]         = useState({ ...EMPTY });
  const [saving, setSaving]     = useState(false);
  const [error, setError]       = useState('');

  async function fetchSites() {
    setLoading(true);
    const res = await fetch('/api/websites');
    const json = await res.json();
    setSites(json.data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchSites(); }, []);

  function openAdd() {
    setEditId(null);
    setForm({ ...EMPTY });
    setError('');
    setShowForm(true);
  }

  function openEdit(site: TrustedWebsite) {
    setEditId(site.id);
    setForm({ name: site.name, url: site.url, category: site.category, description: site.description, notes: site.notes });
    setError('');
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.url.trim()) {
      setError('الاسم والرابط مطلوبان');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (editId) {
        await fetch('/api/websites', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editId, ...form }) });
      } else {
        await fetch('/api/websites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      }
      await fetchSites();
      setShowForm(false);
    } catch {
      setError('حدث خطأ أثناء الحفظ');
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    if (!confirm('حذف هذا الموقع؟')) return;
    await fetch('/api/websites', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    fetchSites();
  }

  const update = (k: keyof typeof EMPTY, v: string) => setForm(f => ({ ...f, [k]: v }));

  if (loading) return <div className="websites-loading">جاري التحميل...</div>;

  return (
    <div className="websites-wrap">

      {/* Header */}
      <div className="websites-header">
        <p className="websites-desc">
          المواقع المضافة هنا يستخدمها الذكاء الاصطناعي كمراجع موثوقة عند بناء دراسات الجدوى
        </p>
        <button className="websites-add-btn" onClick={openAdd}>+ إضافة موقع</button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="websites-form-card easy-fade-in">
          <h3 className="websites-form-title">{editId ? 'تعديل موقع' : 'إضافة موقع جديد'}</h3>

          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">اسم الموقع <span className="easy-field-badge easy-field-required">مطلوب</span></label>
              <input className="easy-form-input" placeholder="مثال: عقار ماب" value={form.name} onChange={e => update('name', e.target.value)} />
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">الرابط <span className="easy-field-badge easy-field-required">مطلوب</span></label>
              <input className="easy-form-input" placeholder="https://..." value={form.url} onChange={e => update('url', e.target.value)} dir="ltr" />
            </div>
          </div>

          <div className="easy-form-row">
            <div className="easy-form-group">
              <label className="easy-form-label">التصنيف</label>
              <select className="easy-form-input" value={form.category} onChange={e => update('category', e.target.value)}>
                <option value="">اختر تصنيف</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="easy-form-group">
              <label className="easy-form-label">وصف البيانات</label>
              <input className="easy-form-input" placeholder="مثال: أسعار الشقق في القاهرة الكبرى" value={form.description} onChange={e => update('description', e.target.value)} />
            </div>
          </div>

          <div className="easy-form-group" style={{ width: '100%' }}>
            <label className="easy-form-label">ملاحظات</label>
            <input className="easy-form-input" placeholder="أي ملاحظة خاصة بهذا الموقع" value={form.notes} onChange={e => update('notes', e.target.value)} />
          </div>

          {error && <p className="websites-error">⚠️ {error}</p>}

          <div className="websites-form-actions">
            <button className="websites-save-btn" onClick={handleSave} disabled={saving}>
              {saving ? 'جاري الحفظ...' : editId ? 'حفظ التعديل' : 'إضافة'}
            </button>
            <button className="websites-cancel-btn" onClick={() => setShowForm(false)}>إلغاء</button>
          </div>
        </div>
      )}

      {/* List */}
      {sites.length === 0 ? (
        <div className="websites-empty">
          <span className="websites-empty-icon">🌐</span>
          <p>لا توجد مواقع مضافة بعد</p>
          <p className="websites-empty-sub">أضف المواقع التي تستخدمها كمرجع لأسعار السوق</p>
        </div>
      ) : (
        <div className="websites-list">
          {sites.map(site => (
            <div key={site.id} className="websites-card">
              <div className="websites-card-top">
                <div className="websites-card-info">
                  <span className="websites-card-name">{site.name}</span>
                  {site.category && <span className="websites-card-cat">{site.category}</span>}
                </div>
                <div className="websites-card-actions">
                  <button className="websites-edit-btn" onClick={() => openEdit(site)}>تعديل</button>
                  <button className="websites-del-btn" onClick={() => handleDelete(site.id)}>حذف</button>
                </div>
              </div>
              <a className="websites-card-url" href={site.url} target="_blank" rel="noreferrer">{site.url}</a>
              {site.description && <p className="websites-card-desc">{site.description}</p>}
              {site.notes && <p className="websites-card-notes">📝 {site.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

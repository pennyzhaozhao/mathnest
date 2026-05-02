'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { SITE, COURSES } from '@/lib/config';

// ================================================================
// Admin 后台
// 功能：
//   1. GitHub PAT 登录（存 localStorage）
//   2. 写/编辑 Markdown 笔记（含 frontmatter 表单）
//   3. 图片粘贴 → 自动上传到 GitHub → 插入 MD 链接
//   4. 选择 course / section / slug / lang
//   5. 新 section 自动创建（只需输入名字）
//   6. 发布 → 通过 GitHub Contents API 写入仓库 → 触发 Cloudflare 重新构建
// ================================================================

type Panel = 'write' | 'manage';

export default function AdminClient() {
  const [token, setToken] = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [user, setUser] = useState<{ login: string; avatar_url: string } | null>(null);
  const [panel, setPanel] = useState<Panel>('write');
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  // Load token from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('mn_gh_token');
    if (saved) verifyToken(saved);
  }, []);

  function showToast(msg: string, type: 'success' | 'error' = 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  async function verifyToken(tok: string) {
    try {
      const r = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${tok}` },
      });
      if (!r.ok) throw new Error();
      const u = await r.json();
      setToken(tok);
      setUser(u);
      localStorage.setItem('mn_gh_token', tok);
    } catch {
      showToast('Invalid token — please check and try again', 'error');
    }
  }

  function logout() {
    localStorage.removeItem('mn_gh_token');
    setToken(''); setUser(null); setTokenInput('');
  }

  if (!token || !user) {
    return (
      <div className="page-content" style={{ maxWidth: 560, margin: '60px auto', padding: '40px' }}>
        <div className="card" style={{ padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🔑</div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, letterSpacing: '-.02em', marginBottom: 8 }}>Admin Login</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14.5 }}>
              Enter your GitHub Personal Access Token to manage notes.
              Token needs <strong>Contents: Read & Write</strong> permission on this repo.
            </p>
          </div>
          <div className="form-group">
            <label className="form-label">GitHub Personal Access Token</label>
            <input
              type="password"
              className="form-input"
              placeholder="ghp_xxxxxxxxxxxx"
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && verifyToken(tokenInput)}
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => verifyToken(tokenInput)}>
            Sign in with GitHub Token
          </button>
          <p style={{ marginTop: 16, fontSize: 12.5, color: 'var(--ink-faint)', textAlign: 'center' }}>
            Token is stored in your browser only. Never sent anywhere except GitHub's API.
            <br /><a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--coral-deep)' }}>Create a token →</a>
          </p>
        </div>
        {toast && <Toast {...toast} />}
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28, flexWrap: 'wrap', gap: 14 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 30, letterSpacing: '-.02em', marginBottom: 4 }}>Admin</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={user.avatar_url} alt="" style={{ width: 22, height: 22, borderRadius: 6 }} />
            Signed in as <strong>{user.login}</strong>
          </p>
        </div>
        <button className="btn btn-sm" onClick={logout}>Sign out</button>
      </div>

      {/* tab nav */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {([['write', '✏️ Write / Edit'], ['manage', '📁 Manage notes']] as const).map(([p, label]) => (
          <button key={p} className={`btn btn-sm ${panel === p ? 'btn-primary' : ''}`} onClick={() => setPanel(p)}>{label}</button>
        ))}
      </div>

      {panel === 'write' ? (
        <WritePanel token={token} showToast={showToast} />
      ) : (
        <ManagePanel token={token} showToast={showToast} />
      )}

      {toast && <Toast {...toast} />}
    </div>
  );
}

// ── Write Panel ──────────────────────────────────────────────────
function WritePanel({ token, showToast }: { token: string; showToast: (m: string, t?: any) => void }) {
  const { owner, repo, branch } = SITE.github;

  const [course, setCourse]       = useState(COURSES[0].slug);
  const [section, setSection]     = useState('');
  const [newSection, setNewSection] = useState('');
  const [slug, setSlug]           = useState('');
  const [lang, setLang]           = useState<'en' | 'zh'>('en');
  const [title, setTitle]         = useState('');
  const [description, setDesc]    = useState('');
  const [date, setDate]           = useState(new Date().toISOString().slice(0, 10));
  const [youtube, setYoutube]     = useState('');
  const [bilibili, setBilibili]   = useState('');
  const [tagInput, setTagInput]   = useState('');
  const [tags, setTags]           = useState<string[]>([]);
  const [body, setBody]           = useState('');
  const [saving, setSaving]       = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const effectiveSection = section === '__new__' ? newSection.trim() : section;

  // ── image paste/drop upload ──
  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) return null;
    const ext = file.name.split('.').pop() || 'png';
    const imgSlug = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const path = `content/courses/${course}/${effectiveSection}/${imgSlug}`;
    const base64 = await fileToBase64(file);

    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `upload image: ${imgSlug}`, content: base64, branch }),
    });
    if (!r.ok) { showToast('Image upload failed', 'error'); return null; }
    // Return raw URL
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
  }, [course, effectiveSection, token, owner, repo, branch, showToast]);

  const insertImageUrl = useCallback((url: string) => {
    const ta = textareaRef.current;
    if (!ta) { setBody(b => b + `\n![image](${url})\n`); return; }
    const start = ta.selectionStart, end = ta.selectionEnd;
    const md = `![image](${url})`;
    setBody(b => b.slice(0, start) + md + b.slice(end));
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + md.length; ta.focus(); }, 0);
  }, []);

  // paste handler
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const handler = async (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items ?? []);
      const imageItem = items.find(i => i.type.startsWith('image/'));
      if (!imageItem) return;
      e.preventDefault();
      const file = imageItem.getAsFile();
      if (!file) return;
      showToast('Uploading image…', 'success');
      const url = await uploadImage(file);
      if (url) { insertImageUrl(url); showToast('Image uploaded ✓'); }
    };
    ta.addEventListener('paste', handler);
    return () => ta.removeEventListener('paste', handler);
  }, [uploadImage, insertImageUrl, showToast]);

  // drop handler
  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
    for (const file of files) {
      showToast('Uploading image…');
      const url = await uploadImage(file);
      if (url) { insertImageUrl(url); showToast('Image uploaded ✓'); }
    }
  }, [uploadImage, insertImageUrl, showToast]);

  // load existing note
  async function loadNote() {
    if (!slug || !effectiveSection) return;
    setLoadingFile(true);
    const path = `content/courses/${course}/${effectiveSection}/${slug}.${lang}.md`;
    try {
      const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!r.ok) throw new Error('Not found');
      const data = await r.json();
      const text = atob(data.content.replace(/\n/g, ''));
      // Parse frontmatter
      const fm = parseFrontmatter(text);
      setTitle(fm.data.title || '');
      setDesc(fm.data.description || '');
      setDate(fm.data.date || date);
      setYoutube(fm.data.youtube || '');
      setBilibili(fm.data.bilibili || '');
      setTags(Array.isArray(fm.data.tags) ? fm.data.tags : []);
      setBody(fm.body);
      showToast('Note loaded ✓');
    } catch {
      showToast('File not found — starting fresh', 'error');
    } finally {
      setLoadingFile(false);
    }
  }

  async function save() {
    if (!title || !slug || !effectiveSection) {
      showToast('Fill in title, section and slug first', 'error'); return;
    }
    setSaving(true);

    const frontmatter = buildFrontmatter({ title, description, date, tags, youtube, bilibili, course, section: effectiveSection, lang });
    const fullContent = `${frontmatter}\n\n${body}`;
    const encoded = btoa(unescape(encodeURIComponent(fullContent)));

    const path = `content/courses/${course}/${effectiveSection}/${slug}.${lang}.md`;

    // Check if file exists to get its SHA (needed for updates)
    let sha: string | undefined;
    try {
      const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (r.ok) { const d = await r.json(); sha = d.sha; }
    } catch { /* new file */ }

    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: sha ? `update: ${slug}.${lang}.md` : `add: ${slug}.${lang}.md`,
        content: encoded,
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (r.ok) {
      showToast('Published ✓ — Cloudflare will rebuild in ~1 min');
    } else {
      const err = await r.json();
      showToast(`Error: ${err.message}`, 'error');
    }
    setSaving(false);
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags(ts => [...ts, t]);
    setTagInput('');
  }

  return (
    <div>
      <div className="admin-layout">
        {/* sidebar — metadata */}
        <div className="admin-sidebar">
          <h3>Note metadata</h3>

          <div className="form-group">
            <label className="form-label">Course</label>
            <select className="form-select" value={course} onChange={e => setCourse(e.target.value)}>
              {COURSES.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Section</label>
            <select className="form-select" value={section} onChange={e => setSection(e.target.value)}>
              <option value="">— select or create —</option>
              <option value="__new__">+ Create new section</option>
              {/* common sections */}
              {['algebra','calculus','geometry','statistics','mechanics','probability','number','trigonometry','jihe','fangcheng','hanshu'].map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {section === '__new__' && (
            <div className="form-group">
              <label className="form-label">New section name (slug)</label>
              <input className="form-input" placeholder="e.g. complex-numbers" value={newSection} onChange={e => setNewSection(e.target.value)} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Slug (filename)</label>
            <input className="form-input" placeholder="e.g. quadratic-formula" value={slug} onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g,'-'))} />
          </div>

          <div className="form-group">
            <label className="form-label">Language</label>
            <div className="lang-toggle">
              <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
              <button className={lang === 'zh' ? 'active' : ''} onClick={() => setLang('zh')}>中文</button>
            </div>
          </div>

          <button className="btn btn-sm" style={{ width: '100%', marginBottom: 16 }} onClick={loadNote} disabled={loadingFile}>
            {loadingFile ? <span className="spinner" /> : '↓ Load existing'}
          </button>

          <hr style={{ border: 'none', borderTop: '1.5px dashed rgba(42,31,61,.12)', margin: '6px 0 16px' }} />

          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="The chain rule, but actually intuitive" />
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input className="form-input" value={description} onChange={e => setDesc(e.target.value)} placeholder="One-line summary" />
          </div>

          <div className="form-group">
            <label className="form-label">Date</label>
            <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">YouTube video ID</label>
            <input className="form-input" placeholder="dQw4w9WgXcQ" value={youtube} onChange={e => setYoutube(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Bilibili BV号</label>
            <input className="form-input" placeholder="BV1GJ411x7h7" value={bilibili} onChange={e => setBilibili(e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
              {tags.map(t => (
                <span key={t} className="tag-chip">{t}
                  <button onClick={() => setTags(ts => ts.filter(x => x !== t))}>×</button>
                </span>
              ))}
            </div>
            <div className="tag-input-wrap">
              <input className="form-input" placeholder="Add tag, press Enter" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} style={{ flex: 1 }} />
              <button className="btn btn-sm" onClick={addTag}>+</button>
            </div>
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={save} disabled={saving}>
            {saving ? <><span className="spinner" /> Publishing…</> : '🚀 Publish to GitHub'}
          </button>

          <p style={{ fontSize: 11.5, color: 'var(--ink-faint)', marginTop: 10, textAlign: 'center', lineHeight: 1.5 }}>
            Cloudflare will rebuild automatically after publish (~60s).
          </p>
        </div>

        {/* main — editor */}
        <div>
          <div className="admin-panel" style={{ padding: '16px 20px', marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-soft)', fontFamily: 'JetBrains Mono, monospace' }}>
              content/courses/{course}/{effectiveSection || '…'}/{slug || '…'}.{lang}.md
            </div>
            <div style={{ display: 'flex', gap: 10, fontSize: 12.5, color: 'var(--ink-faint)' }}>
              <span>Paste or drop images to upload</span>
              <span>·</span>
              <span>$$...$$  for display math</span>
              <span>·</span>
              <span>$...$ for inline</span>
            </div>
          </div>

          <div className="admin-panel" style={{ padding: 0, overflow: 'hidden' }}
            onDrop={onDrop} onDragOver={e => e.preventDefault()}>
            <textarea
              ref={textareaRef}
              className="form-textarea"
              style={{ borderRadius: 0, minHeight: 520, padding: '20px 24px', width: '100%' }}
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder={`Write your note in Markdown here.\n\nTips:\n• Paste an image → auto-uploads to GitHub\n• Drop an image file → same\n• YouTube/Bilibili links on their own line → auto-embed\n• $E = mc^2$ → inline KaTeX\n• $$\\int_0^\\infty e^{-x} dx = 1$$ → display KaTeX\n\n## Section heading\n\nYour content here...\n\n### Example 1\n\nSolve $x^2 - 5x + 6 = 0$.`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Manage Panel ─────────────────────────────────────────────────
function ManagePanel({ token, showToast }: { token: string; showToast: (m: string, t?: any) => void }) {
  const { owner, repo, branch } = SITE.github;
  const [files, setFiles]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      // Recursively list content/courses via GitHub Trees API
      const r = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const d = await r.json();
      const mdFiles = (d.tree || []).filter((f: any) => f.path.startsWith('content/courses/') && f.path.endsWith('.md'));
      setFiles(mdFiles);
    } catch {
      showToast('Failed to load file list', 'error');
    } finally {
      setLoading(false);
    }
  }

  async function deleteFile(path: string, sha: string) {
    if (!confirm(`Delete ${path}?`)) return;
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `delete: ${path}`, sha, branch }),
    });
    if (r.ok) { showToast('Deleted ✓'); loadAll(); }
    else showToast('Delete failed', 'error');
  }

  const filtered = files.filter(f =>
    f.path.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-panel">
      <div style={{ display: 'flex', gap: 14, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <input className="form-input" style={{ flex: 1 }} placeholder="Search notes…" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn btn-sm" onClick={loadAll}>↺ Refresh</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--ink-soft)' }}><span className="spinner" style={{ borderColor: 'var(--ink-soft)', borderTopColor: 'var(--ink)' }} /></div>
      ) : (
        <div>
          <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginBottom: 14 }}>{filtered.length} file{filtered.length !== 1 ? 's' : ''}</p>
          {filtered.map((f) => {
            const parts = f.path.replace('content/courses/', '').split('/');
            const [course, section, filename] = parts;
            const lang = filename?.includes('.zh.') ? '中文' : 'EN';
            return (
              <div key={f.path} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '11px 14px',
                borderRadius: 12, marginBottom: 8, background: 'var(--bg-2)',
                boxShadow: 'var(--shadow-sm)', flexWrap: 'wrap',
              }}>
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12.5, flex: 1, color: 'var(--ink-soft)' }}>
                  <span style={{ color: 'var(--ink)', fontWeight: 600 }}>{course}</span> / {section} / {filename}
                </span>
                <span className={`post-tag ${lang === '中文' ? 'sky' : 'default'}`} style={{ fontSize: 11 }}>{lang}</span>
                <button className="btn btn-sm" style={{ padding: '5px 10px', fontSize: 12 }} onClick={() => deleteFile(f.path, f.sha)}>🗑 Delete</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return <div className={`toast ${type}`}>{msg}</div>;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve((r.result as string).split(',')[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });
}

function parseFrontmatter(raw: string): { data: Record<string, any>; body: string } {
  const match = raw.match(/^---\n([\s\S]+?)\n---\n?([\s\S]*)$/);
  if (!match) return { data: {}, body: raw };
  const data: Record<string, any> = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^(\w+):\s*(.+)$/);
    if (!m) continue;
    const [, k, v] = m;
    if (v.startsWith('[')) {
      data[k] = v.slice(1,-1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g,''));
    } else {
      data[k] = v.replace(/^['"]|['"]$/g,'');
    }
  }
  return { data, body: match[2].trim() };
}

function buildFrontmatter(fields: {
  title: string; description: string; date: string; tags: string[];
  youtube: string; bilibili: string; course: string; section: string; lang: string;
}): string {
  const lines = ['---'];
  lines.push(`title: "${fields.title}"`);
  if (fields.description) lines.push(`description: "${fields.description}"`);
  lines.push(`date: ${fields.date}`);
  lines.push(`course: ${fields.course}`);
  lines.push(`section: ${fields.section}`);
  if (fields.tags.length) lines.push(`tags: [${fields.tags.join(', ')}]`);
  if (fields.youtube) lines.push(`youtube: ${fields.youtube}`);
  if (fields.bilibili) lines.push(`bilibili: ${fields.bilibili}`);
  lines.push(`lang: ${fields.lang}`);
  lines.push('---');
  return lines.join('\n');
}

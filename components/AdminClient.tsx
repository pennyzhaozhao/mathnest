'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { SITE, COURSES } from '@/lib/config';

type Panel = 'write' | 'manage' | 'courses';
type CourseEntry = { slug: string; title: string; subtitle: string; icon: string; color: string; description: string };

// ── 编辑状态（从 manage 传过来） ──────────────────────────────
type EditTarget = {
  course: string; section: string; slug: string; lang: 'en' | 'zh';
} | null;

export default function AdminClient() {
  const [token, setToken]         = useState('');
  const [tokenInput, setTokenInput] = useState('');
  const [user, setUser]           = useState<{ login: string; avatar_url: string } | null>(null);
  const [panel, setPanel]         = useState<Panel>('write');
  const [toast, setToast]         = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);

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
      setToken(tok); setUser(u);
      localStorage.setItem('mn_gh_token', tok);
    } catch {
      showToast('Invalid token', 'error');
    }
  }

  function logout() {
    localStorage.removeItem('mn_gh_token');
    setToken(''); setUser(null); setTokenInput('');
  }

  function handleEdit(target: EditTarget) {
    setEditTarget(target);
    setPanel('write');
  }

  // ── Login screen ──────────────────────────────────────────────
  if (!token || !user) {
    return (
      <div style={{ maxWidth: 520, margin: '60px auto', padding: '0 22px' }}>
        <div className="card" style={{ padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>🔑</div>
            <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 26, letterSpacing: '-.02em', marginBottom: 8 }}>Admin Login</h2>
            <p style={{ color: 'var(--ink-soft)', fontSize: 14 }}>
              Enter your GitHub Personal Access Token.<br />
              Needs <strong>Contents: Read & Write</strong> on this repo.
            </p>
          </div>
          <div className="form-group">
            <label className="form-label">GitHub Personal Access Token</label>
            <input type="password" className="form-input" placeholder="ghp_xxxxxxxxxxxx"
              value={tokenInput} onChange={e => setTokenInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && verifyToken(tokenInput)} />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => verifyToken(tokenInput)}>
            Sign in
          </button>
          <p style={{ marginTop: 14, fontSize: 12, color: 'var(--ink-faint)', textAlign: 'center' }}>
            Token stays in your browser only. &nbsp;
            <a href="https://github.com/settings/tokens/new" target="_blank" rel="noopener noreferrer"
               style={{ color: 'var(--coral-deep)' }}>Create a token →</a>
          </p>
        </div>
        {toast && <Toast {...toast} />}
      </div>
    );
  }

  return (
    <div className="page-content">
      {/* header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 28, letterSpacing: '-.02em', marginBottom: 4 }}>Admin</h1>
          <p style={{ color: 'var(--ink-soft)', fontSize: 13.5, display: 'flex', alignItems: 'center', gap: 8 }}>
            <img src={user.avatar_url} alt="" style={{ width: 20, height: 20, borderRadius: 6 }} />
            Signed in as <strong>{user.login}</strong>
          </p>
        </div>
        <button className="btn btn-sm" onClick={logout}>Sign out</button>
      </div>

      {/* tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {([['write','✏️ Write / Edit'],['manage','📁 Manage notes'],['courses','📚 Courses']] as const).map(([p,label]) => (
          <button key={p} className={`btn btn-sm ${panel === p ? 'btn-primary' : ''}`}
            onClick={() => setPanel(p)}>{label}</button>
        ))}
      </div>

      {panel === 'write'   && <WritePanel   token={token} showToast={showToast} editTarget={editTarget} onEditDone={() => setEditTarget(null)} />}
      {panel === 'manage'  && <ManagePanel  token={token} showToast={showToast} onEdit={handleEdit} />}
      {panel === 'courses' && <CoursesPanel token={token} showToast={showToast} />}

      {toast && <Toast {...toast} />}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Write Panel  （含实时 Preview + Edit 自动填充）
// ════════════════════════════════════════════════════════════════
function WritePanel({ token, showToast, editTarget, onEditDone }: {
  token: string;
  showToast: (m: string, t?: any) => void;
  editTarget: EditTarget;
  onEditDone: () => void;
}) {
  const { owner, repo, branch } = SITE.github;

  const [allCourses, setAllCourses] = useState<CourseEntry[]>([]);
  const [course, setCourse]         = useState('igcse');
  const [section, setSection]       = useState('');
  const [newSection, setNewSection] = useState('');
  const [slug, setSlug]             = useState('');
  const [lang, setLang]             = useState<'en'|'zh'>('en');
  const [title, setTitle]           = useState('');
  const [description, setDesc]      = useState('');
  const [date, setDate]             = useState(new Date().toISOString().slice(0,10));
  const [youtube, setYoutube]       = useState('');
  const [bilibili, setBilibili]     = useState('');
  const [tagInput, setTagInput]     = useState('');
  const [tags, setTags]             = useState<string[]>([]);
  const [body, setBody]             = useState('');
  const [saving, setSaving]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewHtml, setPreviewHtml] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewTimer = useRef<any>(null);

  const effectiveSection = section === '__new__' ? newSection.trim() : section;

  // 加载所有课程（默认 + 自定义）
  useEffect(() => {
    const base = COURSES.map(c => ({ ...c }));
    fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/content/courses-extra.json`)
      .then(r => r.ok ? r.json() : [])
      .then((extra: CourseEntry[]) => setAllCourses([...base, ...extra]))
      .catch(() => setAllCourses(base));
  }, [owner, repo, branch]);

  // 接收 edit target（从 Manage 点 Edit 来的）
  useEffect(() => {
    if (!editTarget) return;
    setCourse(editTarget.course);
    setSection(editTarget.section);
    setSlug(editTarget.slug);
    setLang(editTarget.lang);
    loadNote(editTarget.course, editTarget.section, editTarget.slug, editTarget.lang);
    onEditDone();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTarget]);

  // 实时 preview：body 变化 500ms 后更新
  useEffect(() => {
    if (!showPreview) return;
    clearTimeout(previewTimer.current);
    previewTimer.current = setTimeout(async () => {
      const { marked } = await import('marked');
      const katex = await import('katex');
      const md = body.replace(/\$\$([\s\S]+?)\$\$/g, (_, t) => {
        try { return katex.default.renderToString(t.trim(), { displayMode: true, throwOnError: false }); } catch { return `$$${t}$$`; }
      }).replace(/\$([^$\n]+?)\$/g, (_, t) => {
        try { return katex.default.renderToString(t.trim(), { displayMode: false, throwOnError: false }); } catch { return `$${t}$`; }
      });
      setPreviewHtml(marked.parse(md, { async: false }) as string);
    }, 500);
  }, [body, showPreview]);

  // ── image paste / drop ───────────────────────────────────────
  const uploadImage = useCallback(async (file: File): Promise<string | null> => {
    if (!file.type.startsWith('image/')) return null;
    const ext = file.name.split('.').pop() || 'png';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const ghPath = `content/courses/${course}/${effectiveSection}/${name}`;
    const base64 = await fileToBase64(file);
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${ghPath}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `upload image: ${name}`, content: base64, branch }),
    });
    if (!r.ok) { showToast('Image upload failed', 'error'); return null; }
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${ghPath}`;
  }, [course, effectiveSection, token, owner, repo, branch, showToast]);

  const insertText = useCallback((text: string) => {
    const ta = textareaRef.current;
    if (!ta) { setBody(b => b + text); return; }
    const s = ta.selectionStart, e = ta.selectionEnd;
    setBody(b => b.slice(0, s) + text + b.slice(e));
    setTimeout(() => { ta.selectionStart = ta.selectionEnd = s + text.length; ta.focus(); }, 0);
  }, []);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    const handler = async (e: ClipboardEvent) => {
      const img = Array.from(e.clipboardData?.items ?? []).find(i => i.type.startsWith('image/'));
      if (!img) return;
      e.preventDefault();
      const file = img.getAsFile(); if (!file) return;
      showToast('Uploading…');
      const url = await uploadImage(file);
      if (url) { insertText(`![image](${url})`); showToast('Image uploaded ✓'); }
    };
    ta.addEventListener('paste', handler);
    return () => ta.removeEventListener('paste', handler);
  }, [uploadImage, insertText, showToast]);

  // ── load note ────────────────────────────────────────────────
  async function loadNote(c = course, sec = effectiveSection, sl = slug, lg = lang) {
    if (!sl || !sec) return;
    setLoading(true);
    const path = `content/courses/${c}/${sec}/${sl}.${lg}.md`;
    try {
      const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) throw new Error();
      const d = await r.json();
      const text = decodeBase64(d.content);
      const fm = parseFrontmatter(text);
      setTitle(fm.data.title || '');
      setDesc(fm.data.description || '');
      setDate(fm.data.date ? String(fm.data.date).slice(0,10) : date);
      setYoutube(fm.data.youtube || '');
      setBilibili(fm.data.bilibili || '');
      setTags(Array.isArray(fm.data.tags) ? fm.data.tags : []);
      setBody(fm.body);
      showToast('Loaded ✓');
    } catch {
      showToast('File not found — starting fresh', 'error');
    } finally { setLoading(false); }
  }

  // ── save ─────────────────────────────────────────────────────
  async function save() {
    if (!title || !slug || !effectiveSection) {
      showToast('Fill in title, section and slug first', 'error'); return;
    }
    setSaving(true);
    const fm = buildFrontmatter({ title, description, date, tags, youtube, bilibili, course, section: effectiveSection, lang });
    const full = `${fm}\n\n${body}`;
    const encoded = btoa(unescape(encodeURIComponent(full)));
    const ghPath = `content/courses/${course}/${effectiveSection}/${slug}.${lang}.md`;

    let sha: string | undefined;
    try {
      const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${ghPath}`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) sha = (await r.json()).sha;
    } catch {}

    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${ghPath}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: sha ? `update: ${slug}.${lang}.md` : `add: ${slug}.${lang}.md`, content: encoded, branch, ...(sha ? { sha } : {}) }),
    });
    r.ok ? showToast('Published ✓ — rebuilding in ~60s') : showToast(`Error: ${(await r.json()).message}`, 'error');
    setSaving(false);
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags(ts => [...ts, t]);
    setTagInput('');
  }

  const COMMON_SECTIONS = ['algebra','calculus','geometry','statistics','mechanics','probability','number','trigonometry','pure','jihe','fangcheng','hanshu'];

  return (
    <div>
      {/* toolbar */}
      <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:12, gap:8 }}>
        <button className={`btn btn-sm ${showPreview ? 'btn-primary' : ''}`}
          onClick={() => setShowPreview(p => !p)}>
          {showPreview ? '📝 Editor only' : '👁 Split preview'}
        </button>
      </div>

      {/* preview 模式：单列全宽；普通模式：sidebar + editor 两列 */}
      {showPreview ? (
        /* ── Split preview 全宽布局 ── */
        <div style={{display:'flex', flexDirection:'column', gap:12}}>
          {/* path bar + publish */}
          <div className="admin-panel" style={{padding:'12px 18px', fontSize:12.5, fontFamily:'JetBrains Mono,monospace', color:'var(--ink-soft)', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8}}>
            <span>content/courses/<strong style={{color:'var(--ink)'}}>{course}</strong>/{effectiveSection||'…'}/{slug||'…'}.{lang}.md</span>
            <button className="btn btn-primary btn-sm" onClick={save} disabled={saving} style={{fontFamily:'DM Sans,sans-serif'}}>
              {saving ? <><span className="spinner"/> Saving…</> : '🚀 Publish'}
            </button>
          </div>

          {/* editor + preview 各占一半，撑满全宽 */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, alignItems:'start'}}>
            <div className="admin-panel" style={{padding:0, overflow:'hidden'}}
              onDrop={async e => {
                e.preventDefault();
                for (const f of Array.from(e.dataTransfer.files).filter(f=>f.type.startsWith('image/'))) {
                  showToast('Uploading…');
                  const url = await uploadImage(f);
                  if (url) { insertText(`![image](${url})`); showToast('Image uploaded ✓'); }
                }
              }}
              onDragOver={e => e.preventDefault()}>
              <textarea ref={textareaRef} className="form-textarea"
                style={{borderRadius:0, minHeight:640, padding:'18px 22px', width:'100%', fontSize:14}}
                value={body} onChange={e => setBody(e.target.value)}
                placeholder={`Write in Markdown.\n\n• Paste/drop images → auto-upload\n• YouTube/Bilibili links on own line → embed\n• $$...$$ display math · $...$ inline math`}/>
            </div>

            <div style={{borderRadius:20, background:'#fff', boxShadow:'var(--shadow-out)', padding:'24px 28px', minHeight:640, overflowY:'auto'}}>
              <div style={{fontSize:11, color:'var(--ink-faint)', marginBottom:16, fontWeight:700, textTransform:'uppercase', letterSpacing:'.08em'}}>Preview</div>
              {previewHtml
                ? <article className="prose" dangerouslySetInnerHTML={{__html:previewHtml}}/>
                : <p style={{color:'var(--ink-faint)', fontSize:14}}>Start typing to see preview…</p>}
            </div>
          </div>
        </div>
      ) : (
        /* ── 普通模式：sidebar + editor ── */
        <div style={{display:'grid', gridTemplateColumns:'260px 1fr', gap:24, alignItems:'start'}}>
          <div className="admin-sidebar">
            <h3>Metadata</h3>

            <div className="form-group">
              <label className="form-label">Course</label>
              <select className="form-select" value={course} onChange={e => setCourse(e.target.value)}>
                {allCourses.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Section</label>
              <select className="form-select" value={section} onChange={e => setSection(e.target.value)}>
                <option value="">— select —</option>
                <option value="__new__">+ New section</option>
                {COMMON_SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {section === '__new__' && (
              <div className="form-group">
                <label className="form-label">Section slug</label>
                <input className="form-input" placeholder="e.g. complex-numbers" value={newSection} onChange={e => setNewSection(e.target.value)} />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Slug</label>
              <input className="form-input" placeholder="e.g. chain-rule" value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g,'-'))} />
            </div>

            <div className="form-group">
              <label className="form-label">Language</label>
              <div className="lang-toggle">
                <button className={lang==='en'?'active':''} onClick={() => setLang('en')}>EN</button>
                <button className={lang==='zh'?'active':''} onClick={() => setLang('zh')}>中文</button>
              </div>
            </div>

            <button className="btn btn-sm" style={{width:'100%',marginBottom:16}} onClick={() => loadNote()} disabled={loading}>
              {loading ? <span className="spinner"/> : '↓ Load existing'}
            </button>

            <hr style={{border:'none',borderTop:'1.5px dashed rgba(42,31,61,.12)',margin:'4px 0 16px'}}/>

            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Note title"/>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <input className="form-input" value={description} onChange={e => setDesc(e.target.value)} placeholder="One-line summary"/>
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input type="date" className="form-input" value={date} onChange={e => setDate(e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">YouTube ID</label>
              <input className="form-input" placeholder="dQw4w9WgXcQ" value={youtube} onChange={e => setYoutube(e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Bilibili BV号</label>
              <input className="form-input" placeholder="BV1xx..." value={bilibili} onChange={e => setBilibili(e.target.value)}/>
            </div>
            <div className="form-group">
              <label className="form-label">Tags</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:8}}>
                {tags.map(t => (
                  <span key={t} className="tag-chip">{t}
                    <button onClick={() => setTags(ts => ts.filter(x => x!==t))}>×</button>
                  </span>
                ))}
              </div>
              <div className="tag-input-wrap">
                <input className="form-input" placeholder="Add tag + Enter" value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key==='Enter' && (e.preventDefault(),addTag())}
                  style={{flex:1}}/>
                <button className="btn btn-sm" onClick={addTag}>+</button>
              </div>
            </div>

            <button className="btn btn-primary" style={{width:'100%'}} onClick={save} disabled={saving}>
              {saving ? <><span className="spinner"/> Publishing…</> : '🚀 Publish'}
            </button>
            <p style={{fontSize:11,color:'var(--ink-faint)',marginTop:8,textAlign:'center'}}>
              Cloudflare rebuilds automatically (~60s)
            </p>
          </div>

          {/* editor（普通模式，单列） */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div className="admin-panel" style={{padding:'12px 16px',fontSize:12.5,fontFamily:'JetBrains Mono,monospace',color:'var(--ink-soft)'}}>
              content/courses/<strong style={{color:'var(--ink)'}}>{course}</strong>/{effectiveSection||'…'}/{slug||'…'}.{lang}.md
            </div>
            <div className="admin-panel" style={{padding:0,overflow:'hidden'}}
              onDrop={async e => {
                e.preventDefault();
                for (const f of Array.from(e.dataTransfer.files).filter(f=>f.type.startsWith('image/'))) {
                  showToast('Uploading…');
                  const url = await uploadImage(f);
                  if (url) { insertText(`![image](${url})`); showToast('Image uploaded ✓'); }
                }
              }}
              onDragOver={e => e.preventDefault()}>
              <textarea ref={textareaRef} className="form-textarea"
                style={{borderRadius:0,minHeight:580,padding:'18px 22px',width:'100%'}}
                value={body} onChange={e => setBody(e.target.value)}
                placeholder={`Write in Markdown.\n\n• Paste/drop images → auto-upload\n• YouTube/Bilibili links on own line → embed\n• $$...$$ display math · $...$ inline math`}/>
            </div>
            <p style={{fontSize:12,color:'var(--ink-faint)',textAlign:'center'}}>
              Paste or drop images to auto-upload · $$…$$ display math · $…$ inline math
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Manage Panel  （含 Edit 按钮）
// ════════════════════════════════════════════════════════════════
function ManagePanel({ token, showToast, onEdit }: {
  token: string;
  showToast: (m: string, t?: any) => void;
  onEdit: (target: EditTarget) => void;
}) {
  const { owner, repo, branch } = SITE.github;
  const [files, setFiles]   = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { loadAll(); }, []); // eslint-disable-line

  async function loadAll() {
    setLoading(true);
    try {
      const r = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setFiles((d.tree||[]).filter((f:any) => f.path.startsWith('content/courses/') && f.path.endsWith('.md')));
    } catch { showToast('Failed to load', 'error'); }
    finally { setLoading(false); }
  }

  async function deleteFile(path: string, sha: string) {
    if (!confirm(`Delete ${path}?`)) return;
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `delete: ${path}`, sha, branch }),
    });
    r.ok ? (showToast('Deleted ✓'), loadAll()) : showToast('Delete failed', 'error');
  }

  const filtered = files.filter(f => f.path.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="admin-panel">
      <div style={{display:'flex',gap:12,marginBottom:20,alignItems:'center',flexWrap:'wrap'}}>
        <input className="form-input" style={{flex:1}} placeholder="Search…" value={search} onChange={e=>setSearch(e.target.value)}/>
        <button className="btn btn-sm" onClick={loadAll}>↺ Refresh</button>
      </div>
      {loading
        ? <div style={{textAlign:'center',padding:40}}><span className="spinner" style={{borderColor:'var(--bg-2)',borderTopColor:'var(--ink)'}}/></div>
        : <>
          <p style={{fontSize:13,color:'var(--ink-faint)',marginBottom:14}}>{filtered.length} file{filtered.length!==1?'s':''}</p>
          {filtered.map(f => {
            const parts = f.path.replace('content/courses/','').split('/');
            const [course, section, filename] = parts;
            const isZh = filename?.includes('.zh.');
            const slug = filename?.replace(/\.(en|zh)\.md$/,'');
            const lang = isZh ? 'zh' : 'en';

            return (
              <div key={f.path} style={{
                display:'flex',alignItems:'center',gap:12,padding:'11px 14px',
                borderRadius:12,marginBottom:8,background:'var(--bg-2)',
                boxShadow:'var(--shadow-sm)',flexWrap:'wrap',
              }}>
                <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:12.5,flex:1,color:'var(--ink-soft)'}}>
                  <strong style={{color:'var(--ink)'}}>{course}</strong> / {section} / {filename}
                </span>
                <span className={`post-tag ${isZh?'sky':'default'}`} style={{fontSize:11}}>
                  {isZh?'中文':'EN'}
                </span>
                {/* ← Edit button */}
                <button className="btn btn-sm"
                  style={{padding:'5px 12px',fontSize:12,background:'var(--lemon)',color:'var(--ink)',boxShadow:'var(--shadow-sm)'}}
                  onClick={() => onEdit({ course, section, slug, lang: lang as 'en'|'zh' })}>
                  ✏️ Edit
                </button>
                <button className="btn btn-sm" style={{padding:'5px 10px',fontSize:12}}
                  onClick={() => deleteFile(f.path, f.sha)}>
                  🗑 Delete
                </button>
              </div>
            );
          })}
        </>
      }
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Courses Panel  （新增 / 管理课程）
// ════════════════════════════════════════════════════════════════
function CoursesPanel({ token, showToast }: { token: string; showToast: (m:string,t?:any)=>void }) {
  const { owner, repo, branch } = SITE.github;
  const [extras, setExtras]   = useState<CourseEntry[]>([]);
  const [saving, setSaving]   = useState(false);
  const [form, setForm]       = useState<CourseEntry>({
    slug:'', title:'', subtitle:'', icon:'∑', color:'coral', description:'',
  });

  useEffect(() => {
    fetch(`https://raw.githubusercontent.com/${owner}/${repo}/${branch}/content/courses-extra.json`)
      .then(r => r.ok ? r.json() : [])
      .then(setExtras)
      .catch(() => setExtras([]));
  }, [owner, repo, branch]);

  async function saveExtras(list: CourseEntry[]) {
    setSaving(true);
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(list, null, 2))));
    const path = 'content/courses-extra.json';
    let sha: string|undefined;
    try {
      const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) sha = (await r.json()).sha;
    } catch {}
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: 'update courses-extra.json', content, branch, ...(sha?{sha}:{}) }),
    });
    r.ok ? showToast('Saved ✓ — rebuild to see changes') : showToast('Save failed', 'error');
    setSaving(false);
  }

  function addCourse() {
    if (!form.slug || !form.title) { showToast('Slug and title required', 'error'); return; }
    if (COURSES.find(c=>c.slug===form.slug) || extras.find(c=>c.slug===form.slug)) {
      showToast('Slug already exists', 'error'); return;
    }
    const next = [...extras, form];
    setExtras(next);
    saveExtras(next);
    setForm({ slug:'', title:'', subtitle:'', icon:'∑', color:'coral', description:'' });
  }

  function removeCourse(slug: string) {
    const next = extras.filter(c=>c.slug!==slug);
    setExtras(next);
    saveExtras(next);
  }

  const COLORS = ['coral','mint','lemon','lilac','sky','pink'];

  return (
    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:24,alignItems:'start'}}>

      {/* current courses */}
      <div className="admin-panel">
        <h3 style={{fontFamily:'Fraunces,serif',fontSize:20,marginBottom:18}}>All courses</h3>

        <p style={{fontSize:12.5,color:'var(--ink-faint)',marginBottom:12}}>Built-in (edit in lib/config.ts)</p>
        {COURSES.map(c => (
          <div key={c.slug} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:12,background:'var(--bg-2)',marginBottom:8,fontSize:14}}>
            <span style={{fontSize:20,width:28,textAlign:'center'}}>{c.icon}</span>
            <span style={{flex:1,fontWeight:600}}>{c.title}</span>
            <span className={`post-tag ${c.color}`} style={{fontSize:11}}>{c.slug}</span>
          </div>
        ))}

        {extras.length > 0 && <>
          <p style={{fontSize:12.5,color:'var(--ink-faint)',margin:'16px 0 12px'}}>Custom (stored in courses-extra.json)</p>
          {extras.map(c => (
            <div key={c.slug} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:12,background:'var(--bg-2)',marginBottom:8,fontSize:14}}>
              <span style={{fontSize:20,width:28,textAlign:'center'}}>{c.icon}</span>
              <span style={{flex:1,fontWeight:600}}>{c.title}</span>
              <span className="post-tag default" style={{fontSize:11}}>{c.slug}</span>
              <button className="btn btn-sm" style={{padding:'3px 8px',fontSize:11}} onClick={()=>removeCourse(c.slug)}>🗑</button>
            </div>
          ))}
        </>}
      </div>

      {/* add new course */}
      <div className="admin-panel">
        <h3 style={{fontFamily:'Fraunces,serif',fontSize:20,marginBottom:18}}>Add new course</h3>

        <div className="form-group">
          <label className="form-label">Slug (URL-safe)</label>
          <input className="form-input" placeholder="e.g. further-maths" value={form.slug}
            onChange={e=>setForm(f=>({...f,slug:e.target.value.toLowerCase().replace(/\s+/g,'-')}))}/>
        </div>
        <div className="form-group">
          <label className="form-label">Title</label>
          <input className="form-input" placeholder="Further Maths" value={form.title}
            onChange={e=>setForm(f=>({...f,title:e.target.value}))}/>
        </div>
        <div className="form-group">
          <label className="form-label">Subtitle</label>
          <input className="form-input" placeholder="Pre-University · UK" value={form.subtitle}
            onChange={e=>setForm(f=>({...f,subtitle:e.target.value}))}/>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Icon (1 char)</label>
            <input className="form-input" placeholder="∑" maxLength={3} value={form.icon}
              onChange={e=>setForm(f=>({...f,icon:e.target.value}))} style={{textAlign:'center',fontSize:22}}/>
          </div>
          <div className="form-group">
            <label className="form-label">Colour</label>
            <select className="form-select" value={form.color} onChange={e=>setForm(f=>({...f,color:e.target.value}))}>
              {COLORS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <input className="form-input" placeholder="Short description shown on course card"
            value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))}/>
        </div>

        <button className="btn btn-primary" style={{width:'100%'}} onClick={addCourse} disabled={saving}>
          {saving ? <><span className="spinner"/> Saving…</> : '+ Add course'}
        </button>
        <p style={{fontSize:11.5,color:'var(--ink-faint)',marginTop:10,textAlign:'center',lineHeight:1.5}}>
          Saved to <code>content/courses-extra.json</code> on GitHub.<br/>
          Site will show the new course after next rebuild.
        </p>
      </div>
    </div>
  );
}

// ── helpers ───────────────────────────────────────────────────
function Toast({ msg, type }: { msg: string; type: 'success'|'error' }) {
  return <div className={`toast ${type}`}>{msg}</div>;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((res,rej) => {
    const r = new FileReader();
    r.onload = () => res((r.result as string).split(',')[1]);
    r.onerror = rej;
    r.readAsDataURL(file);
  });
}

function decodeBase64(b64: string): string {
  return decodeURIComponent(escape(atob(b64.replace(/\n/g,''))));
}

function parseFrontmatter(raw: string): { data: Record<string,any>; body: string } {
  const m = raw.match(/^---\n([\s\S]+?)\n---\n?([\s\S]*)$/);
  if (!m) return { data:{}, body:raw };
  const data: Record<string,any> = {};
  for (const line of m[1].split('\n')) {
    const lm = line.match(/^([\w]+):\s*(.+)$/);
    if (!lm) continue;
    const [,k,v] = lm;
    data[k] = v.startsWith('[')
      ? v.slice(1,-1).split(',').map(s=>s.trim().replace(/^['"]|['"]$/g,''))
      : v.replace(/^['"]|['"]$/g,'');
  }
  return { data, body: m[2].trim() };
}

function buildFrontmatter(f: {
  title:string;description:string;date:string;tags:string[];
  youtube:string;bilibili:string;course:string;section:string;lang:string;
}): string {
  const lines = ['---', `title: "${f.title}"`];
  if (f.description) lines.push(`description: "${f.description}"`);
  lines.push(`date: ${f.date}`, `course: ${f.course}`, `section: ${f.section}`);
  if (f.tags.length) lines.push(`tags: [${f.tags.join(', ')}]`);
  if (f.youtube)  lines.push(`youtube: ${f.youtube}`);
  if (f.bilibili) lines.push(`bilibili: ${f.bilibili}`);
  lines.push(`lang: ${f.lang}`, '---');
  return lines.join('\n');
}



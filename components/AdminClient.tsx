'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import { SITE, COURSES } from '@/lib/config';

type Panel = 'write' | 'practice' | 'manage' | 'courses' | 'drafts';
type CourseEntry = { slug: string; title: string; subtitle: string; icon: string; color: string; description: string };

// ── Draft 类型 ────────────────────────────────────────────────
type NoteDraft = {
  id: string; type: 'note'; savedAt: number;
  course: string; section: string; slug: string; title: string;
  description: string; date: string; tags: string[]; lang: 'en'|'zh';
  youtube: string; bilibili: string; body: string;
};
type PracticeDraft = {
  id: string; type: 'practice'; savedAt: number;
  course: string; section: string; slug: string; title: string;
  difficulty: string; tags: string[]; relatedNote: string; body: string;
};
type Draft = NoteDraft | PracticeDraft;

const DRAFT_KEY = 'mn_drafts_v1';

function loadDrafts(): Draft[] {
  try { return JSON.parse(localStorage.getItem(DRAFT_KEY) || '[]'); } catch { return []; }
}
function saveDrafts(drafts: Draft[]) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(drafts));
}
function deleteDraft(id: string) {
  saveDrafts(loadDrafts().filter(d => d.id !== id));
}
function upsertDraft(draft: Draft) {
  const all = loadDrafts().filter(d => d.id !== draft.id);
  saveDrafts([draft, ...all]);
}

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
  const [practiceEditTarget, setPracticeEditTarget] = useState<{course:string;slug:string}|null>(null);
  const [draftTarget, setDraftTarget] = useState<Draft|null>(null);

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

  function handleEditPractice(course: string, slug: string) {
    setPracticeEditTarget({ course, slug });
    setPanel('practice');
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
      <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
        {([['write','✏️ Write note'],['practice','🧩 Write practice'],['drafts','📝 Drafts'],['manage','📁 Manage'],['courses','📚 Courses']] as const).map(([p,label]) => (
          <button key={p} className={`btn btn-sm ${panel === p ? 'btn-primary' : ''}`}
            onClick={() => setPanel(p)}>{label}</button>
        ))}
      </div>

      {panel === 'write'    && <WritePanel        token={token} showToast={showToast} editTarget={editTarget} onEditDone={() => setEditTarget(null)} draftTarget={draftTarget?.type==='note' ? draftTarget as NoteDraft : null} onDraftLoaded={() => setDraftTarget(null)} />}
      {panel === 'practice' && <PracticeWritePanel token={token} showToast={showToast} editTarget={practiceEditTarget} onEditDone={() => setPracticeEditTarget(null)} draftTarget={draftTarget?.type==='practice' ? draftTarget as PracticeDraft : null} onDraftLoaded={() => setDraftTarget(null)} />}
      {panel === 'drafts'   && <DraftsPanel showToast={showToast} onEditDraft={(d) => { setDraftTarget(d); setPanel(d.type === 'note' ? 'write' : 'practice'); }} />}
      {panel === 'manage'   && <ManagePanel        token={token} showToast={showToast} onEdit={handleEdit} onEditPractice={handleEditPractice} />}
      {panel === 'courses'  && <CoursesPanel       token={token} showToast={showToast} />}

      {toast && <Toast {...toast} />}
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Write Panel  （含实时 Preview + Edit 自动填充）
// ════════════════════════════════════════════════════════════════
function WritePanel({ token, showToast, editTarget, onEditDone, draftTarget, onDraftLoaded }: {
  token: string;
  showToast: (m: string, t?: any) => void;
  editTarget: EditTarget;
  onEditDone: () => void;
  draftTarget: NoteDraft | null;
  onDraftLoaded: () => void;
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

  // 从 Drafts 恢复草稿
  useEffect(() => {
    if (!draftTarget) return;
    setCourse(draftTarget.course);
    setSection(draftTarget.section);
    setSlug(draftTarget.slug);
    setLang(draftTarget.lang);
    setTitle(draftTarget.title);
    setDesc(draftTarget.description);
    setDate(draftTarget.date);
    setYoutube(draftTarget.youtube);
    setBilibili(draftTarget.bilibili);
    setTags(draftTarget.tags);
    setBody(draftTarget.body);
    onDraftLoaded();
    showToast('Draft loaded ✓');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftTarget]);

  function saveDraft() {
    const draft: NoteDraft = {
      id: `note-${slug || Date.now()}`,
      type: 'note', savedAt: Date.now(),
      course, section: effectiveSection, slug, lang, title,
      description, date, youtube, bilibili, tags, body,
    };
    upsertDraft(draft);
    showToast('Draft saved ✓');
  }

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

    // 从 MIME type 推断扩展名（截图 file.name 可能是 'image.png' 或空）
    const mimeToExt: Record<string, string> = {
      'image/png': 'png', 'image/jpeg': 'jpg', 'image/gif': 'gif',
      'image/webp': 'webp', 'image/svg+xml': 'svg',
    };
    const ext = mimeToExt[file.type] || file.name.split('.').pop() || 'png';
    const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // 统一存到 content/images/ 下，不依赖 section 是否已填
    const ghPath = `content/images/${name}`;
    const base64 = await fileToBase64(file);

    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${ghPath}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `upload image: ${name}`, content: base64, branch }),
    });

    if (!r.ok) {
      const err = await r.json().catch(() => ({}));
      showToast(`Upload failed: ${err.message || r.status}`, 'error');
      return null;
    }
    return `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${ghPath}`;
  }, [token, owner, repo, branch, showToast]);

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
            <button className="btn" style={{width:'100%',marginTop:8,background:'var(--lemon)'}} onClick={saveDraft}>
              💾 Save draft
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
// Drafts Panel — 草稿列表，支持 Edit / Delete
// ════════════════════════════════════════════════════════════════
function DraftsPanel({ showToast, onEditDraft }: {
  showToast: (m: string, t?: any) => void;
  onEditDraft: (draft: Draft) => void;
}) {
  const [drafts, setDrafts] = useState<Draft[]>([]);

  useEffect(() => { setDrafts(loadDrafts()); }, []);

  function handleDelete(id: string) {
    if (!confirm('Delete this draft?')) return;
    deleteDraft(id);
    setDrafts(loadDrafts());
    showToast('Draft deleted');
  }

  function formatTime(ts: number) {
    const d = new Date(ts);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  if (drafts.length === 0) {
    return (
      <div className="admin-panel" style={{ textAlign: 'center', padding: '60px 0', color: 'var(--ink-soft)' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📝</div>
        <h3 style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>No drafts yet</h3>
        <p style={{ fontWeight: 600, fontSize: 14 }}>Click "Save draft" while writing a note or practice set.</p>
      </div>
    );
  }

  const noteDrafts = drafts.filter(d => d.type === 'note');
  const practiceDrafts = drafts.filter(d => d.type === 'practice');

  return (
    <div className="admin-panel">
      <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginBottom: 20, fontWeight: 600 }}>
        {drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved locally in this browser.
      </p>

      {noteDrafts.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid var(--ink)' }}>
            ✏️ Notes ({noteDrafts.length})
          </h3>
          {noteDrafts.map(d => (
            <DraftCard key={d.id} draft={d} onEdit={() => onEditDraft(d)} onDelete={() => handleDelete(d.id)} formatTime={formatTime} />
          ))}
        </div>
      )}

      {practiceDrafts.length > 0 && (
        <div>
          <h3 style={{ fontWeight: 800, fontSize: 15, marginBottom: 12, paddingBottom: 8, borderBottom: '2px solid var(--ink)' }}>
            🧩 Practice ({practiceDrafts.length})
          </h3>
          {practiceDrafts.map(d => (
            <DraftCard key={d.id} draft={d} onEdit={() => onEditDraft(d)} onDelete={() => handleDelete(d.id)} formatTime={formatTime} />
          ))}
        </div>
      )}
    </div>
  );
}

function DraftCard({ draft, onEdit, onDelete, formatTime }: {
  draft: Draft; onEdit: () => void; onDelete: () => void; formatTime: (ts: number) => string;
}) {
  const title = draft.type === 'note'
    ? (draft as NoteDraft).title || (draft as NoteDraft).slug || 'Untitled note'
    : (draft as PracticeDraft).title || (draft as PracticeDraft).slug || 'Untitled practice';

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
      borderRadius: 14, marginBottom: 10, background: draft.type === 'note' ? 'var(--bg-2)' : 'var(--lemon-bg)',
      border: '2px solid var(--ink)', flexWrap: 'wrap',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 12, color: 'var(--ink-soft)', fontWeight: 600, display: 'flex', gap: 10 }}>
          <span>{draft.course}</span>
          <span>·</span>
          <span>Saved {formatTime(draft.savedAt)}</span>
        </div>
      </div>
      <button className="btn btn-sm" style={{ background: 'var(--lemon)', fontSize: 12 }} onClick={onEdit}>✏️ Edit</button>
      <button className="btn btn-sm" style={{ fontSize: 12 }} onClick={onDelete}>🗑 Delete</button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// Manage Panel  （notes + practice，含 Edit 按钮）
// ════════════════════════════════════════════════════════════════
function ManagePanel({ token, showToast, onEdit, onEditPractice }: {
  token: string;
  showToast: (m: string, t?: any) => void;
  onEdit: (target: EditTarget) => void;
  onEditPractice: (course: string, slug: string) => void;
}) {
  const { owner, repo, branch } = SITE.github;
  const [files, setFiles]     = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [tab, setTab]         = useState<'notes' | 'practice'>('notes');

  useEffect(() => { loadAll(); }, []); // eslint-disable-line

  async function loadAll() {
    setLoading(true);
    try {
      const r = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`,
        { headers: { Authorization: `Bearer ${token}` } });
      const d = await r.json();
      setFiles(d.tree || []);
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

  const noteFiles = files.filter(f =>
    f.path.startsWith('content/courses/') && f.path.endsWith('.md') &&
    f.path.toLowerCase().includes(search.toLowerCase())
  );
  const practiceFiles = files.filter(f =>
    f.path.startsWith('content/practice/') && f.path.endsWith('.md') &&
    f.path.toLowerCase().includes(search.toLowerCase())
  );
  const shown = tab === 'notes' ? noteFiles : practiceFiles;

  return (
    <div className="admin-panel">
      {/* tab switch */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button className={`btn btn-sm ${tab === 'notes' ? 'btn-primary' : ''}`} onClick={() => setTab('notes')}>
          📄 Notes ({noteFiles.length})
        </button>
        <button className={`btn btn-sm ${tab === 'practice' ? 'btn-primary' : ''}`} onClick={() => setTab('practice')}>
          🧩 Practice ({practiceFiles.length})
        </button>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' }}>
        <input className="form-input" style={{ flex: 1 }} placeholder="Search…" value={search} onChange={e => setSearch(e.target.value)} />
        <button className="btn btn-sm" onClick={loadAll}>↺ Refresh</button>
      </div>

      {loading
        ? <div style={{ textAlign: 'center', padding: 40 }}><span className="spinner" style={{ borderColor: 'var(--bg-2)', borderTopColor: 'var(--ink)' }} /></div>
        : <>
          <p style={{ fontSize: 13, color: 'var(--ink-faint)', marginBottom: 14 }}>{shown.length} file{shown.length !== 1 ? 's' : ''}</p>

          {tab === 'notes' && shown.map(f => {
            const parts = f.path.replace('content/courses/', '').split('/');
            const [course, section, filename] = parts;
            const isZh = filename?.includes('.zh.');
            const slug = filename?.replace(/\.(en|zh)\.md$/, '');
            const lang = isZh ? 'zh' : 'en';
            return (
              <div key={f.path} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, marginBottom: 8, background: 'var(--bg-2)', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12.5, flex: 1, color: 'var(--ink-soft)' }}>
                  <strong style={{ color: 'var(--ink)' }}>{course}</strong> / {section} / {filename}
                </span>
                <span className={`post-tag ${isZh ? 'sky' : 'default'}`} style={{ fontSize: 11 }}>{isZh ? '中文' : 'EN'}</span>
                <button className="btn btn-sm" style={{ padding: '5px 12px', fontSize: 12, background: 'var(--lemon)' }}
                  onClick={() => onEdit({ course, section, slug, lang: lang as 'en' | 'zh' })}>✏️ Edit</button>
                <button className="btn btn-sm" style={{ padding: '5px 10px', fontSize: 12 }}
                  onClick={() => deleteFile(f.path, f.sha)}>🗑 Delete</button>
              </div>
            );
          })}

          {tab === 'practice' && shown.map(f => {
            const parts = f.path.replace('content/practice/', '').split('/');
            const [course, filename] = parts;
            const slug = filename?.replace(/\.md$/, '');
            return (
              <div key={f.path} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 14px', borderRadius: 12, marginBottom: 8, background: 'var(--lemon-bg)', flexWrap: 'wrap' }}>
                <span style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12.5, flex: 1, color: 'var(--ink-soft)' }}>
                  <strong style={{ color: 'var(--ink)' }}>{course}</strong> / {filename}
                </span>
                <span className="post-tag lemon" style={{ fontSize: 11 }}>practice</span>
                <button className="btn btn-sm" style={{ padding: '5px 12px', fontSize: 12, background: 'var(--lemon)' }}
                  onClick={() => onEditPractice(course, slug)}>✏️ Edit</button>
                <button className="btn btn-sm" style={{ padding: '5px 10px', fontSize: 12 }}
                  onClick={() => deleteFile(f.path, f.sha)}>🗑 Delete</button>
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

// ════════════════════════════════════════════════════════════════
// Practice Write Panel — 写练习题
// ════════════════════════════════════════════════════════════════
function PracticeWritePanel({ token, showToast, editTarget, onEditDone, draftTarget, onDraftLoaded }: {
  token: string;
  showToast: (m: string, t?: any) => void;
  editTarget: { course: string; slug: string } | null;
  onEditDone: () => void;
  draftTarget: PracticeDraft | null;
  onDraftLoaded: () => void;
}) {
  const { owner, repo, branch } = SITE.github;
  const [course, setCourse]         = useState(COURSES[0].slug);
  const [section, setSection]       = useState('');
  const [slug, setSlug]             = useState('');
  const [title, setTitle]           = useState('');
  const [difficulty, setDifficulty] = useState<'foundation'|'standard'|'challenge'>('standard');
  const [tags, setTags]             = useState<string[]>([]);
  const [tagInput, setTagInput]     = useState('');
  const [relatedNote, setRelatedNote] = useState('');
  const [body, setBody]             = useState(PRACTICE_TEMPLATE);
  const [saving, setSaving]         = useState(false);
  const [loading, setLoading]       = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // 接收从 Manage 传来的 edit target，自动加载文件
  useEffect(() => {
    if (!editTarget) return;
    setCourse(editTarget.course);
    setSlug(editTarget.slug);
    loadExisting(editTarget.course, editTarget.slug);
    onEditDone();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editTarget]);

  // 从 Drafts 恢复草稿
  useEffect(() => {
    if (!draftTarget) return;
    setCourse(draftTarget.course);
    setSection(draftTarget.section);
    setSlug(draftTarget.slug);
    setTitle(draftTarget.title);
    setDifficulty(draftTarget.difficulty as any);
    setTags(draftTarget.tags);
    setRelatedNote(draftTarget.relatedNote);
    setBody(draftTarget.body);
    onDraftLoaded();
    showToast('Draft loaded ✓');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftTarget]);

  function saveDraft() {
    const draft: PracticeDraft = {
      id: `practice-${slug || Date.now()}`,
      type: 'practice', savedAt: Date.now(),
      course, section, slug, title, difficulty, tags, relatedNote, body,
    };
    upsertDraft(draft);
    showToast('Draft saved ✓');
  }

  async function loadExisting(c: string, s: string) {
    setLoading(true);
    const ghPath = `content/practice/${c}/${s}.md`;
    try {
      const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${ghPath}`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (!r.ok) throw new Error();
      const d = await r.json();
      const text = decodeBase64(d.content);
      // parse frontmatter
      const fm = parseFrontmatter(text);
      setTitle(fm.data.title || '');
      setSection(fm.data.section || '');
      setDifficulty(fm.data.difficulty || 'standard');
      setTags(Array.isArray(fm.data.tags) ? fm.data.tags : []);
      setRelatedNote(fm.data.related_note || '');
      setBody(fm.body);
      showToast('Loaded ✓');
    } catch {
      showToast('File not found', 'error');
    } finally { setLoading(false); }
  }

  async function save() {
    if (!title || !slug) { showToast('Fill in title and slug', 'error'); return; }
    setSaving(true);
    const fm = [
      '---',
      `title: "${title}"`,
      `course: ${course}`,
      section ? `section: ${section}` : '',
      `difficulty: ${difficulty}`,
      tags.length ? `tags: [${tags.join(', ')}]` : '',
      relatedNote ? `related_note: ${relatedNote}` : '',
      '---',
    ].filter(Boolean).join('\n');
    const full = `${fm}\n\n${body}`;
    const encoded = btoa(unescape(encodeURIComponent(full)));
    const ghPath = `content/practice/${course}/${slug}.md`;
    let sha: string | undefined;
    try {
      const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${ghPath}`,
        { headers: { Authorization: `Bearer ${token}` } });
      if (r.ok) sha = (await r.json()).sha;
    } catch {}
    const r = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${ghPath}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: sha ? `update practice: ${slug}` : `add practice: ${slug}`, content: encoded, branch, ...(sha ? { sha } : {}) }),
    });
    r.ok ? showToast('Practice set published ✓') : showToast(`Error: ${(await r.json()).message}`, 'error');
    setSaving(false);
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !tags.includes(t)) setTags(ts => [...ts, t]);
    setTagInput('');
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12, gap: 8 }}>
        <button className={`btn btn-sm ${showPreview ? 'btn-primary' : ''}`} onClick={() => setShowPreview(p => !p)}>
          {showPreview ? '📝 Editor only' : '👁 Split preview'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr' : '260px 1fr', gap: 24, alignItems: 'start' }}>
        {!showPreview && (
          <div className="admin-sidebar">
            <h3>Practice metadata</h3>

            <div className="form-group">
              <label className="form-label">Course</label>
              <select className="form-select" value={course} onChange={e => setCourse(e.target.value)}>
                {COURSES.map(c => <option key={c.slug} value={c.slug}>{c.title}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Slug (filename)</label>
              <input className="form-input" placeholder="quadratics-set1" value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))} />
            </div>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input className="form-input" placeholder="Quadratic Equations — Set 1" value={title}
                onChange={e => setTitle(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Section</label>
              <input className="form-input" placeholder="e.g. calculus, algebra, jihe"
                value={section} onChange={e => setSection(e.target.value.toLowerCase().replace(/\s+/g,'-'))} />
              <p style={{fontSize:11.5,color:'var(--ink-faint)',marginTop:4,fontWeight:600}}>
                Same as the note's section (used for "Revision notes" link)
              </p>
            </div>
            <div className="form-group">
              <label className="form-label">Difficulty</label>
              <select className="form-select" value={difficulty} onChange={e => setDifficulty(e.target.value as any)}>
                <option value="foundation">🌱 Foundation</option>
                <option value="standard">⭐ Standard</option>
                <option value="challenge">🔥 Challenge</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Related note slug</label>
              <input className="form-input" placeholder="quadratic-equations" value={relatedNote}
                onChange={e => setRelatedNote(e.target.value)} />
              <p style={{ fontSize: 11.5, color: 'var(--ink-faint)', marginTop: 5, fontWeight: 600 }}>
                Slug of the matching note — shows "Go to Practice" button on that note page
              </p>
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
                <input className="form-input" placeholder="Add tag + Enter" value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())} style={{ flex: 1 }} />
                <button className="btn btn-sm" onClick={addTag}>+</button>
              </div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={save} disabled={saving}>
              {saving ? <><span className="spinner" /> Publishing…</> : '🚀 Publish practice set'}
            </button>
            <button className="btn" style={{ width: '100%', marginTop: 8, background: 'var(--lemon)' }} onClick={saveDraft}>
              💾 Save draft
            </button>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* path bar */}
          <div className="admin-panel" style={{ padding: '12px 16px', fontSize: 12.5, fontFamily: 'JetBrains Mono,monospace', color: 'var(--ink-soft)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
            <span>content/practice/<strong style={{ color: 'var(--ink)' }}>{course}</strong>/{slug || '…'}.md</span>
            {showPreview && (
              <button className="btn btn-primary btn-sm" onClick={save} disabled={saving} style={{ fontFamily: 'DM Sans,sans-serif' }}>
                {saving ? <><span className="spinner" /> Saving…</> : '🚀 Publish'}
              </button>
            )}
          </div>

          {/* hint */}
          <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--lemon-bg)', border: '1.5px solid var(--lemon-deep)', fontSize: 13, fontWeight: 600, lineHeight: 1.6 }}>
            <strong>Format:</strong> use <code>[[MCQ]]</code>, <code>[[FILL]]</code>, <code>[[SHORT]]</code> to start each question.
            Mark correct MCQ options with <code>✓</code>. See the template below for examples.
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: showPreview ? '1fr 1fr' : '1fr', gap: 12 }}>
            <div className="admin-panel" style={{ padding: 0, overflow: 'hidden' }}>
              <textarea className="form-textarea"
                style={{ borderRadius: 0, minHeight: 580, padding: '18px 22px', width: '100%' }}
                value={body} onChange={e => setBody(e.target.value)} />
            </div>
            {showPreview && (
              <div style={{ borderRadius: 20, background: '#fff', boxShadow: 'var(--shadow)', border: '2px solid var(--ink)', padding: '20px 26px', minHeight: 580, overflowY: 'auto' }}>
                <div style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 14, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.08em' }}>Preview (raw)</div>
                <pre style={{ fontFamily: 'JetBrains Mono,monospace', fontSize: 12.5, lineHeight: 1.7, whiteSpace: 'pre-wrap', color: 'var(--ink)' }}>{body}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const PRACTICE_TEMPLATE = `[[MCQ]]
question: Which method works best for solving $x^2 - 5x + 6 = 0$?
A: Quadratic formula
B: Factoring ✓
C: Completing the square
D: Graphing
explanation: The numbers −2 and −3 multiply to 6 and add to −5, so factoring is quickest.

[[FILL]]
question: Solve — $x^2 - 9 = 0$. Give the positive root.
answer: 3
tolerance: 0
explanation: x² = 9, so x = ±3.

[[SHORT]]
question: Solve $2x^2 + 5x - 3 = 0$ using the quadratic formula. Show your working.
marks: 3
answer: |
  Using a=2, b=5, c=−3:
  x = (−5 ± √(25+24)) / 4 = (−5 ± 7) / 4
  x = 1/2  or  x = −3`;

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



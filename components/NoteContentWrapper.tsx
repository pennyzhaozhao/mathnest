'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { SITE } from '@/lib/config';
import type { Lang } from '@/lib/notes';

function NoteContentInner({
  html, course, section, slug, langs,
}: {
  html: string; course: string; section: string; slug: string; langs: Lang[];
}) {
  const searchParams = useSearchParams();
  const reqLang = (searchParams.get('lang') || 'en') as Lang;
  const [content, setContent] = useState(html);
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState<Lang>('en');

  useEffect(() => {
    if (reqLang === activeLang) return;

    if (reqLang === 'en') {
      setContent(html);
      setActiveLang('en');
      return;
    }

    if (!langs.includes('zh')) return;

    setLoading(true);
    fetchMarkdown(course, section, slug, 'zh')
      .then(async (md) => {
        if (!md) throw new Error('empty');
        const { marked } = await import('marked');
        const katex = await import('katex');
        const withKatex = renderWithKatex(md, katex.default);
        const rendered = marked.parse(withKatex, { async: false }) as string;
        setContent(rendered);
        setActiveLang('zh');
      })
      .catch(() => {
        setContent(html);
        setActiveLang('en');
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqLang]);

  const switchToEn = () => {
    const p = new URLSearchParams(window.location.search);
    p.delete('lang');
    const q = p.toString();
    window.history.replaceState(null, '', window.location.pathname + (q ? '?' + q : ''));
    setContent(html);
    setActiveLang('en');
  };

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(255,246,233,.75)',
          backdropFilter: 'blur(4px)', borderRadius: 16, zIndex: 10,
          display: 'grid', placeItems: 'center',
        }}>
          <div className="spinner" />
        </div>
      )}
      {activeLang === 'zh' && (
        <div style={{
          padding: '10px 16px', borderRadius: 12, background: '#D8EFFF',
          color: 'var(--sky-deep)', fontSize: 13.5, fontWeight: 600,
          marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 10,
        }}>
          🌐 正在显示中文版本
          <button onClick={switchToEn} style={{
            border: 'none', background: 'none', color: 'var(--sky-deep)',
            fontWeight: 700, cursor: 'pointer', textDecoration: 'underline',
            fontFamily: 'inherit', fontSize: 13,
          }}>
            Switch to English
          </button>
        </div>
      )}
      <article className="prose" dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
}

// ── fetch 策略 ──────────────────────────────────────────────────
// 本地开发：走 /api/note-content 读磁盘（文件还没在 GitHub 上）
// 生产环境：走 GitHub raw URL（内容已 push 到仓库）
async function fetchMarkdown(
  course: string, section: string, slug: string, lang: Lang,
): Promise<string | null> {
  const isDev = process.env.NODE_ENV === 'development';

  if (isDev) {
    const res = await fetch(
      `/api/note-content?course=${encodeURIComponent(course)}&section=${encodeURIComponent(section)}&slug=${encodeURIComponent(slug)}&lang=${lang}`
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.content || null;
  }

  const { owner, repo, branch } = SITE.github;
  const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/content/courses/${course}/${section}/${slug}.${lang}.md`;
  const res = await fetch(url);
  if (!res.ok) return null;
  return res.text();
}

// ── KaTeX 客户端渲染 ────────────────────────────────────────────
function renderWithKatex(md: string, katex: any): string {
  md = md.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    try { return katex.renderToString(tex.trim(), { displayMode: true, throwOnError: false }); }
    catch { return `$$${tex}$$`; }
  });
  md = md.replace(/\$([^$\n]+?)\$/g, (_, tex) => {
    try { return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false }); }
    catch { return `$${tex}$`; }
  });
  return md;
}

export default function NoteContentWrapper(props: {
  html: string; course: string; section: string; slug: string; langs: Lang[];
}) {
  return (
    <Suspense fallback={<article className="prose" dangerouslySetInnerHTML={{ __html: props.html }} />}>
      <NoteContentInner {...props} />
    </Suspense>
  );
}

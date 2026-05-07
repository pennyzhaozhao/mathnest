'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import type { Lang } from '@/lib/notes';
import { applyCallouts, normalizeLooseCallouts } from '@/lib/callouts';

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

    // 切回英文：直接用 SSG 预渲染的 HTML
    if (reqLang === 'en') {
      setContent(html);
      setActiveLang('en');
      return;
    }

    if (!langs.includes('zh')) return;

    setLoading(true);

    // next.config.js 在构建时把 content/**/*.md 复制到 public/content/
    // 所以本地和生产都可以直接 fetch 这个静态 URL
    const url = `/content/courses/${course}/${section}/${slug}.zh.md`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.text();
      })
      .then(async (raw) => {
        // 去掉 frontmatter（--- ... ---）
        const md = raw.replace(/^---[\s\S]+?---\n?/, '').trim();

        const { marked } = await import('marked');
        const katex = await import('katex');
        const withKatex = renderWithKatex(normalizeLooseCallouts(md), katex.default);
        const rendered = marked.parse(withKatex, { async: false }) as string;
        setContent(applyCallouts(rendered));
        setActiveLang('zh');
      })
      .catch(() => {
        // 没有中文版或网络问题：保持英文
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

function renderWithKatex(md: string, katex: any): string {
  // 块级优先
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

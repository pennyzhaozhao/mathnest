'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { SITE } from '@/lib/config';
import type { Lang } from '@/lib/notes';

// 运行时：从 GitHub raw 拿到另一语言的 MD，然后用 /api/render 渲染
// 注意：在静态导出模式下不能用 Next.js API routes，
// 所以我们直接在浏览器里调 Anthropic-compatible markdown-it 做轻量渲染，
// OR 更简单：读 ?lang 后 fetch 已经预生成好的 GitHub raw MD，
// 并用一个轻量客户端 markdown renderer 渲染（marked.js via CDN）。
// 这样完全不需要服务器。

function NoteContentInner({
  html,
  course, section, slug, langs,
}: {
  html: string;
  course: string;
  section: string;
  slug: string;
  langs: Lang[];
}) {
  const searchParams = useSearchParams();
  const reqLang = (searchParams.get('lang') || 'en') as Lang;
  const [content, setContent] = useState(html); // 初始是 SSG 的英文 HTML
  const [loading, setLoading] = useState(false);
  const [activeLang, setActiveLang] = useState<Lang>('en');

  useEffect(() => {
    if (reqLang === activeLang) return;
    if (!langs.includes(reqLang)) return;

    // 如果切换回英文，直接用预渲染的 HTML
    if (reqLang === 'en') {
      setContent(html);
      setActiveLang('en');
      return;
    }

    // 切换到中文：从 GitHub raw 拿 .zh.md，用 marked 轻量渲染
    setLoading(true);
    const { owner, repo, branch } = SITE.github;
    const url = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/content/courses/${course}/${section}/${slug}.zh.md`;

    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error('Not found');
        return r.text();
      })
      .then(async (md) => {
        // 动态 import 本地包（Next.js webpack 支持，不能用 CDN URL）
        const [{ marked }, katex] = await Promise.all([
          import('marked'),
          import('katex'),
        ]);
        const withKatex = renderWithKatex(md, katex.default);
        setContent(marked(withKatex) as string);
        setActiveLang('zh');
      })
      .catch(() => {
        // fallback: 保持英文
        setContent(html);
        setActiveLang('en');
      })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqLang]);

  return (
    <div style={{ position: 'relative' }}>
      {loading && (
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(255,246,233,.7)',
          backdropFilter: 'blur(4px)', borderRadius: 16, zIndex: 10,
          display: 'grid', placeItems: 'center',
        }}>
          <div className="spinner" />
        </div>
      )}
      {activeLang === 'zh' && langs.includes('zh') && (
        <div style={{ padding: '10px 16px', borderRadius: 12, background: '#D8EFFF', color: 'var(--sky-deep)', fontSize: 13.5, fontWeight: 600, marginBottom: 20, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
          🌐 正在显示中文版本 · <button onClick={() => { const p = new URLSearchParams(location.search); p.delete('lang'); history.replaceState(null,'',location.pathname+(p.toString()?'?'+p:'')); setContent(html); setActiveLang('en'); }} style={{ border: 'none', background: 'none', color: 'var(--sky-deep)', fontWeight: 700, cursor: 'pointer', textDecoration: 'underline', fontFamily: 'inherit', fontSize: 13 }}>Switch to English</button>
        </div>
      )}
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

// 用 katex 渲染行内和块级公式（浏览器端）
function renderWithKatex(md: string, katex: any): string {
  // 块级 $$...$$
  md = md.replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
    try { return katex.renderToString(tex, { displayMode: true, throwOnError: false }); }
    catch { return `$$${tex}$$`; }
  });
  // 行内 $...$
  md = md.replace(/\$([^$\n]+?)\$/g, (_, tex) => {
    try { return katex.renderToString(tex, { displayMode: false, throwOnError: false }); }
    catch { return `$${tex}$`; }
  });
  return md;
}

export default function NoteContentWrapper(props: {
  html: string;
  course: string;
  section: string;
  slug: string;
  langs: Lang[];
}) {
  return (
    <Suspense fallback={<article className="prose" dangerouslySetInnerHTML={{ __html: props.html }} />}>
      <NoteContentInner {...props} />
    </Suspense>
  );
}

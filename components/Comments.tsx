'use client';
import { useEffect, useRef } from 'react';
import { SITE } from '@/lib/config';

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    // 避免重复注入
    if (ref.current.querySelector('iframe')) return;

    const script = document.createElement('script');
    script.src = 'https://giscus.app/client.js';
    script.setAttribute('data-repo', SITE.giscus.repo);
    script.setAttribute('data-repo-id', SITE.giscus.repoId);
    script.setAttribute('data-category', SITE.giscus.category);
    script.setAttribute('data-category-id', SITE.giscus.categoryId);
    script.setAttribute('data-mapping', 'pathname');
    script.setAttribute('data-strict', '0');
    script.setAttribute('data-reactions-enabled', '1');
    script.setAttribute('data-emit-metadata', '0');
    script.setAttribute('data-input-position', 'bottom');
    script.setAttribute('data-theme', 'light');
    script.setAttribute('data-lang', 'en');
    script.setAttribute('data-loading', 'lazy');
    script.crossOrigin = 'anonymous';
    script.async = true;
    ref.current.appendChild(script);
  }, []);

  return (
    <div className="comments-section">
      <h3>Comments</h3>
      <p style={{ fontSize: 14, color: 'var(--ink-soft)', marginBottom: 20 }}>
        Powered by{' '}
        <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--coral-deep)' }}>
          giscus
        </a>{' '}
        — uses GitHub Discussions, so you'll need a GitHub account to comment.
      </p>
      {SITE.giscus.repoId === 'REPLACE_ME' ? (
        <div style={{ padding: '24px', borderRadius: 16, background: 'var(--bg-2)', color: 'var(--ink-soft)', fontSize: 14, boxShadow: 'var(--shadow-in)' }}>
          ⚙️ Comments not configured yet. Visit{' '}
          <a href="https://giscus.app" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--coral-deep)' }}>
            giscus.app
          </a>{' '}
          to get your repo/category IDs, then update <code>lib/config.ts</code>.
        </div>
      ) : (
        <div ref={ref} />
      )}
    </div>
  );
}

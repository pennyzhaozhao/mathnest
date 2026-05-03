'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/config';

// Twikoo 评论，已通过 Netlify 部署
// envId 格式：https://你的站点名.netlify.app/.netlify/functions/twikoo
// 填入 lib/config.ts → twikoo.envId

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const envId: string = (SITE as any).twikoo?.envId ?? '';
  const notConfigured = !envId || envId === 'REPLACE_ME';

  useEffect(() => {
    if (notConfigured || !ref.current) return;

    // 每次 pathname 变化时重置容器，避免 twikoo 重复挂载
    ref.current.innerHTML = '';

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js';
    script.async = true;
    script.onload = () => {
      if (!ref.current) return;
      (window as any).twikoo?.init({
        envId,
        el: ref.current,
        path: pathname,    // 每篇文章独立评论区
        lang: 'en',
      });
    };
    // 如果已经加载过 twikoo 脚本，直接 init 不重复加载
    if ((window as any).twikoo) {
      (window as any).twikoo.init({
        envId,
        el: ref.current,
        path: pathname,
        lang: 'en',
      });
    } else {
      document.head.appendChild(script);
    }

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [envId, pathname, notConfigured]);

  return (
    <div className="comments-section">
      <h3>Comments</h3>

      {notConfigured ? (
        <div style={{
          padding: '20px 24px', borderRadius: 16,
          background: 'var(--bg-2)', color: 'var(--ink-soft)',
          fontSize: 14, lineHeight: 1.7, boxShadow: 'var(--shadow-in)',
        }}>
          ⚙️ Fill in <code>twikoo.envId</code> in <code>lib/config.ts</code> to enable comments.
          <br />
          Netlify envId format:{' '}
          <code style={{ fontSize: 12.5 }}>https://your-site.netlify.app/.netlify/functions/twikoo</code>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 20 }}>
            No account needed — just leave your name and comment.
          </p>
          <div ref={ref} />
        </>
      )}
    </div>
  );
}

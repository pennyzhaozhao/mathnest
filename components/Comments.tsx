'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { SITE } from '@/lib/config';

// ================================================================
// Twikoo 评论系统 — 支持匿名游客评论，无需任何账号
//
// 部署步骤（Cloudflare Workers，免费，约10分钟）：
//
// 1. MongoDB Atlas 免费注册 https://www.mongodb.com/atlas
//    新建 Free Cluster（M0） → Connect → Drivers
//    复制连接字符串：mongodb+srv://user:pass@cluster.xxxx.mongodb.net/twikoo
//
// 2. Cloudflare Dashboard → Workers & Pages → Create Worker
//    把这个文件的内容粘进去：
//    https://github.com/twikoojs/twikoo/blob/main/src/server/cloudflare-worker/index.js
//    → Settings → Variables and Secrets → 添加：
//      MONGODB_URI = mongodb+srv://你的连接字符串
//    → Deploy
//    拿到 Worker URL：https://twikoo.yourname.workers.dev
//
// 3. 把这个 URL 填进 lib/config.ts 的 twikoo.envId
//
// ================================================================

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const envId = (SITE as any).twikoo?.envId || '';
  const notConfigured = !envId || envId === 'REPLACE_ME';

  useEffect(() => {
    if (notConfigured || !ref.current) return;

    // 动态加载 Twikoo（避免 SSR 问题）
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/twikoo@1.6.39/dist/twikoo.all.min.js';
    script.async = true;
    script.onload = () => {
      (window as any).twikoo?.init({
        envId,
        el: ref.current,
        // path 用当前页面路径区分不同文章的评论
        path: pathname,
        lang: 'en',
      });
    };
    document.head.appendChild(script);

    return () => {
      // 清理：移除 script 和评论容器内容
      document.head.removeChild(script);
      if (ref.current) ref.current.innerHTML = '';
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
          <strong>⚙️ Comments not set up yet.</strong>
          <br />
          Deploy Twikoo to Cloudflare Workers (free):
          <ol style={{ marginTop: 10, marginLeft: 18, fontSize: 13.5 }}>
            <li>Create free MongoDB Atlas cluster → copy connection string</li>
            <li>Create Cloudflare Worker, paste{' '}
              <a href="https://github.com/twikoojs/twikoo/blob/main/src/server/cloudflare-worker/index.js"
                 target="_blank" rel="noopener noreferrer" style={{ color: 'var(--coral-deep)' }}>
                this script
              </a>, add <code>MONGODB_URI</code> env var
            </li>
            <li>Copy your Worker URL into <code>lib/config.ts → twikoo.envId</code></li>
          </ol>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 13.5, color: 'var(--ink-soft)', marginBottom: 20 }}>
            No account needed — leave your name and comment below.
          </p>
          <div ref={ref} />
        </>
      )}
    </div>
  );
}

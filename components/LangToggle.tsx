'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Lang } from '@/lib/notes';
import { Suspense } from 'react';

function LangToggleInner({ langs, current }: { langs: Lang[]; current: Lang }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (langs.length < 2) return null;

  const switch_ = (lang: Lang) => {
    const params = new URLSearchParams(searchParams.toString());
    if (lang === 'en') {
      params.delete('lang');
    } else {
      params.set('lang', lang);
    }
    const q = params.toString();
    router.push(pathname + (q ? '?' + q : ''));
  };

  return (
    <div className="lang-toggle" title="Switch language / 切换语言">
      <button className={current === 'en' ? 'active' : ''} onClick={() => switch_('en')}>EN</button>
      <button className={current === 'zh' ? 'active' : ''} onClick={() => switch_('zh')}>中文</button>
    </div>
  );
}

// Suspense boundary required for useSearchParams in Next.js App Router
export default function LangToggle(props: { langs: Lang[]; current: Lang }) {
  return (
    <Suspense>
      <LangToggleInner {...props} />
    </Suspense>
  );
}

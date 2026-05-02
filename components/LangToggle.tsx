'use client';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import type { Lang } from '@/lib/notes';
import { Suspense } from 'react';

function LangToggleInner({ langs }: { langs: Lang[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = (searchParams.get('lang') || 'en') as Lang;

  if (langs.length < 2) return null;

  const switchLang = (lang: Lang) => {
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
      <button className={current === 'en' ? 'active' : ''} onClick={() => switchLang('en')}>EN</button>
      <button className={current === 'zh' ? 'active' : ''} onClick={() => switchLang('zh')}>中文</button>
    </div>
  );
}

export default function LangToggle({ langs }: { langs: Lang[] }) {
  return (
    <Suspense fallback={<div className="lang-toggle"><button className="active">EN</button></div>}>
      <LangToggleInner langs={langs} />
    </Suspense>
  );
}

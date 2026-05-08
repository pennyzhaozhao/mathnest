'use client';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useMemo, useRef, useState } from 'react';

type TocItem = {
  id: string;
  text: string;
  level: number;
};

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s-]/gu, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '') || 'section';
}

function collectHeadings(): TocItem[] {
  const article = document.querySelector<HTMLElement>('.note-article');
  if (!article) return [];

  const used = new Map<string, number>();
  const headings = Array.from(article.querySelectorAll<HTMLHeadingElement>('h1, h2, h3, h4, h5, h6'));

  return headings.map((heading) => {
    const text = heading.textContent?.trim() || 'Section';
    const base = heading.id || slugify(text);
    const count = used.get(base) ?? 0;
    used.set(base, count + 1);

    const id = count === 0 ? base : `${base}-${count + 1}`;
    heading.id = id;

    return { id, text, level: Number(heading.tagName.slice(1)) };
  });
}

function NoteTocInner() {
  const searchParams = useSearchParams();
  const currentLang = searchParams.get('lang') === 'zh' ? 'zh' : 'en';
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState('');
  const tocRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const article = document.querySelector<HTMLElement>('.note-article');
    if (!article) return;

    const refresh = () => {
      const next = collectHeadings();
      setItems(next);
      setActiveId((current) => next.some((item) => item.id === current) ? current : next[0]?.id || '');
    };

    refresh();

    const mutationObserver = new MutationObserver(refresh);
    mutationObserver.observe(article, { childList: true, subtree: true });

    return () => mutationObserver.disconnect();
  }, []);

  useEffect(() => {
    if (items.length === 0) return;

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-18% 0px -68% 0px', threshold: [0, 1] }
    );

    headings.forEach((heading) => intersectionObserver.observe(heading));
    return () => intersectionObserver.disconnect();
  }, [items]);

  useEffect(() => {
    if (!activeId || !tocRef.current) return;
    const selector = `a[href="#${CSS.escape(activeId)}"]`;
    tocRef.current.querySelector<HTMLAnchorElement>(selector)?.scrollIntoView({
      block: 'nearest',
      behavior: 'smooth',
    });
  }, [activeId]);

  const visibleItems = useMemo(() => items.filter((item) => item.text.length > 0), [items]);

  if (visibleItems.length < 2) return null;

  return (
    <aside className="note-toc" ref={tocRef} aria-label={currentLang === 'zh' ? '文章目录' : 'Note contents'}>
      <div className="note-toc-head">
        <span className="note-toc-icon" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
        <span>{currentLang === 'zh' ? '目录' : 'Contents'}</span>
        <strong>{visibleItems.length}</strong>
      </div>
      <nav className="note-toc-list">
        {visibleItems.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={activeId === item.id ? 'active' : ''}
            data-level={item.level}
            onClick={(event) => {
              event.preventDefault();
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              window.history.replaceState(null, '', `#${item.id}`);
              setActiveId(item.id);
            }}
          >
            {item.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export default function NoteToc() {
  return (
    <Suspense fallback={null}>
      <NoteTocInner />
    </Suspense>
  );
}

'use client';

type Feature = {
  icon: 'bilingual' | 'video' | 'tags' | 'comments';
  title: string;
  body: string;
  bg: string;
  accent: string;
  featured?: boolean;
};

const FEATURES: Feature[] = [
  {
    icon: 'bilingual',
    title: 'Bilingual by design',
    body: 'Notes can live in English and 中文, with one-tap switching where both versions exist.',
    bg: 'var(--lilac-bg)',
    accent: 'var(--lilac)',
    featured: true,
  },
  {
    icon: 'video',
    title: 'Video + notes',
    body: 'Walkthroughs paired with concise written notes.',
    bg: 'var(--coral-bg)',
    accent: 'var(--coral)',
  },
  {
    icon: 'tags',
    title: 'Auto-tagged',
    body: 'Course and topic tags keep the catalog tidy.',
    bg: 'var(--mint-bg)',
    accent: 'var(--mint)',
  },
  {
    icon: 'comments',
    title: 'Open comments',
    body: 'Questions and corrections stay open.',
    bg: 'var(--sky-bg)',
    accent: 'var(--sky)',
  },
];

function StickerIcon({ type, accent, featured }: { type: Feature['icon']; accent: string; featured?: boolean }) {
  const size = featured ? 78 : 66;
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 80 80',
    fill: 'none',
    xmlns: 'http://www.w3.org/2000/svg',
    style: { display: 'block', marginBottom: featured ? 18 : 14 },
  };

  if (type === 'bilingual') {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M16 18c8-3 16-2 24 2v42c-8-4-16-5-24-2V18Z" fill="#fff" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
        <path d="M40 20c8-4 16-5 24-2v42c-8-3-16-2-24 2V20Z" fill={accent} stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
        <path d="M40 20v42" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <text x="20" y="42" fill="var(--ink)" fontSize="14" fontWeight="900" fontFamily="JetBrains Mono, monospace">EN</text>
        <text x="45" y="42" fill="#fff" fontSize="11" fontWeight="900" fontFamily="Nunito, sans-serif">中文</text>
      </svg>
    );
  }

  if (type === 'video') {
    return (
      <svg {...common} aria-hidden="true">
        <rect x="13" y="13" width="54" height="36" rx="9" fill={accent} stroke="var(--ink)" strokeWidth="4" />
        <path d="M35 25v13l12-6.5L35 25Z" fill="#fff" stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
        <path d="M18 59h30M18 67h21" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
        <path d="M56 59h6" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === 'tags') {
    return (
      <svg {...common} aria-hidden="true">
        <path d="M18 22h25l16 16-24 24-25-25 8-15Z" fill="#fff" stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
        <path d="M30 15h25l16 16-24 24-25-25 8-15Z" fill={accent} stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
        <circle cx="42" cy="27" r="4" fill="#fff" stroke="var(--ink)" strokeWidth="3" />
        <path d="M40 39h16M43 33l-4 18M53 33l-4 18" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }

  return (
    <svg {...common} aria-hidden="true">
      <path d="M16 18h46c4 0 7 3 7 7v24c0 4-3 7-7 7H39L25 67v-11h-9c-4 0-7-3-7-7V25c0-4 3-7 7-7Z" fill={accent} stroke="var(--ink)" strokeWidth="4" strokeLinejoin="round" />
      <path d="M32 34c1-6 13-6 14 0 1 4-3 6-7 8v4" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="39" cy="53" r="2.6" fill="#fff" />
      <path d="M55 50l9 9M61 47l6 6" stroke="var(--ink)" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}

export default function FeatureCards() {
  return (
    <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: '1.35fr repeat(3,1fr)', gap: 20 }}>
      {FEATURES.map(({ icon, title, body, bg, accent, featured }) => (
        <div
          key={title}
          style={{
            padding: featured ? '28px 26px' : '22px 20px',
            borderRadius: 18,
            background: bg,
            border: '2.5px solid var(--ink)',
            boxShadow: '4px 4px 0 var(--ink)',
            transition: 'transform .12s, box-shadow .12s',
            cursor: 'default',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translate(-2px,-2px)';
            e.currentTarget.style.boxShadow = '6px 6px 0 var(--ink)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = '';
            e.currentTarget.style.boxShadow = '4px 4px 0 var(--ink)';
          }}
        >
          <StickerIcon type={icon} accent={accent} featured={featured} />
          <h3 style={{ fontWeight: 900, fontSize: featured ? 22 : 16, lineHeight: 1.15, marginBottom: 8 }}>{title}</h3>
          <p style={{ fontSize: featured ? 14.5 : 13.5, color: 'rgba(35,35,58,.68)', lineHeight: 1.55, fontWeight: 600 }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

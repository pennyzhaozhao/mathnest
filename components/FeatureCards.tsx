'use client';

const FEATURES = [
  { ico: 'EN/中', title: 'Bilingual by design', body: 'Notes can live in English and 中文, with one-tap switching where both versions exist.', bg: 'var(--lilac-bg)', accent: 'var(--lilac)', featured: true },
  { ico: '▶', title: 'Video + notes',  body: 'Walkthroughs paired with concise written notes.', bg: 'var(--coral-bg)', accent: 'var(--coral)' },
  { ico: '#', title: 'Auto-tagged',    body: 'Course and topic tags keep the catalog tidy.', bg: 'var(--mint-bg)', accent: 'var(--mint)' },
  { ico: '?', title: 'Open comments',  body: 'Questions and corrections stay open.', bg: 'var(--sky-bg)', accent: 'var(--sky)' },
];

export default function FeatureCards() {
  return (
    <div className="feature-grid" style={{ display: 'grid', gridTemplateColumns: '1.35fr repeat(3,1fr)', gap: 20 }}>
      {FEATURES.map(({ ico, title, body, bg, accent, featured }) => (
        <div
          key={title}
          style={{
            padding: featured ? '28px 26px' : '22px 20px', borderRadius: 18,
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
          <div style={{
            width: featured ? 54 : 42, height: featured ? 54 : 42, borderRadius: featured ? 14 : 11, display: 'grid', placeItems: 'center',
            fontSize: featured ? 18 : 18, marginBottom: featured ? 18 : 14, background: 'rgba(255,255,255,.5)',
            color: accent, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace',
            border: '2px solid var(--ink)', boxShadow: '2px 2px 0 var(--ink)',
          }}>{ico}</div>
          <h3 style={{ fontWeight: 900, fontSize: featured ? 22 : 16, lineHeight: 1.15, marginBottom: 8 }}>{title}</h3>
          <p style={{ fontSize: featured ? 14.5 : 13.5, color: 'rgba(26,26,46,.64)', lineHeight: 1.55, fontWeight: 600 }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

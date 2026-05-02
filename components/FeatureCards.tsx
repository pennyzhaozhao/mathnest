'use client';

const FEATURES = [
  { ico: '🎬', title: 'Video + notes',  body: 'Each topic pairs a YouTube/Bilibili walkthrough with concise written notes.' },
  { ico: '🏷️', title: 'Auto-tagged',    body: 'Tag a note with a course and topic — the catalog organises itself automatically.' },
  { ico: '💬', title: 'Open comments',  body: 'Ask questions, suggest corrections, leave a kind word — comments under every note.' },
  { ico: '🌍', title: 'Bilingual',       body: 'Notes in English and 中文 where it makes sense — switch with one tap.' },
];

export default function FeatureCards() {
  return (
    <div className="grid-3" style={{ gridTemplateColumns: 'repeat(4,1fr)' }}>
      {FEATURES.map(({ ico, title, body }) => (
        <div
          key={title}
          className="card"
          style={{ padding: '28px 22px', background: 'var(--bg-2)', boxShadow: 'var(--shadow-out)', transition: 'transform .2s' }}
          onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-4px)')}
          onMouseLeave={e => (e.currentTarget.style.transform = '')}
        >
          <div style={{
            width: 52, height: 52, borderRadius: 16, display: 'grid', placeItems: 'center',
            fontSize: 24, marginBottom: 16,
            background: 'linear-gradient(135deg,var(--coral),var(--coral-deep))', color: '#fff',
            boxShadow: '6px 6px 14px rgba(0,0,0,.1),inset 2px 2px 4px rgba(255,255,255,.3)',
          }}>{ico}</div>
          <h3 style={{ fontFamily: 'Fraunces, serif', fontSize: 18, marginBottom: 8, letterSpacing: '-.01em' }}>{title}</h3>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

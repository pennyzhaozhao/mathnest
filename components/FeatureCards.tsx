'use client';

const FEATURES = [
  { ico: '🎬', title: 'Video + notes',  body: 'Each topic pairs a YouTube/Bilibili walkthrough with concise written notes.', bg: 'var(--coral-bg)', accent: 'var(--coral)' },
  { ico: '🏷️', title: 'Auto-tagged',    body: 'Tag a note with a course and topic — the catalog organises itself automatically.', bg: 'var(--mint-bg)', accent: 'var(--mint)' },
  { ico: '💬', title: 'Open comments',  body: 'Ask questions, suggest corrections, leave a kind word — no account needed.', bg: 'var(--sky-bg)', accent: 'var(--sky)' },
  { ico: '🌍', title: 'Bilingual',       body: 'Notes in English and 中文 where it makes sense — switch with one tap.', bg: 'var(--lilac-bg)', accent: 'var(--lilac)' },
];

export default function FeatureCards() {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20 }}>
      {FEATURES.map(({ ico, title, body, bg, accent }) => (
        <div
          key={title}
          style={{
            padding: '26px 22px', borderRadius: 20,
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
            width: 52, height: 52, borderRadius: 14, display: 'grid', placeItems: 'center',
            fontSize: 26, marginBottom: 16, background: accent,
            border: '2.5px solid var(--ink)', boxShadow: '3px 3px 0 var(--ink)',
          }}>{ico}</div>
          <h3 style={{ fontWeight: 800, fontSize: 17, marginBottom: 8 }}>{title}</h3>
          <p style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55, fontWeight: 600 }}>{body}</p>
        </div>
      ))}
    </div>
  );
}

import Link from 'next/link';
import { COURSES } from '@/lib/config';
import { getAllNoteIndex, getRecentNotes } from '@/lib/notes';
import PostCard from '@/components/PostCard';
import FeatureCards from '@/components/FeatureCards';

export default function HomePage() {
  const recent = getRecentNotes(3);
  const allNotes = getAllNoteIndex();

  return (
    <>
      {/* ── Hero ── */}
      <section className="container" style={{ padding: '38px 22px 30px' }}>
        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
            .hero-visual { display: none !important; }
            .hero-stats { gap: 12px !important; }
          }
          @media (max-width: 480px) {
            .hero-stats > div { padding: 10px 14px !important; }
          }
        `}</style>
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.15fr .85fr', gap: 38, alignItems: 'center' }}>
          <div>
            {/* eyebrow */}
            <div style={{ marginBottom: 16 }}>
              <span className="pill">
                <span className="dot-live" />
                A small, growing library — built note by note
              </span>
            </div>

            <h1 style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 900,
              fontSize: 'clamp(40px,5.5vw,68px)', lineHeight: 1.02,
              letterSpacing: 0, marginBottom: 18,
            }}>
              Maths notes,<br />
              made to{' '}
              <span className="click-chip" style={{
                background: 'var(--lemon)', borderRadius: 12, padding: '0 10px',
                border: '2.5px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)',
                display: 'inline-block', transform: 'rotate(-1.5deg) translateY(2px)',
              }}>
                click.
              </span>
            </h1>

            <p style={{ fontSize: 16.5, color: 'var(--ink-soft)', maxWidth: 500, marginBottom: 24, lineHeight: 1.58, fontWeight: 600 }}>
              A personal corner of the internet for KS3, IGCSE, A-Level, AP and university maths.
              Free notes, video walkthroughs, worked examples — open to anyone, forever.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 28 }}>
              <Link href="/courses" className="btn btn-primary" style={{ fontSize: 15 }}>Browse the notes →</Link>
              <Link href="/about" className="btn" style={{ fontSize: 15 }}>About this site</Link>
            </div>

            {/* stats */}
            <div className="hero-stats" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              {[
                { n: '6', label: 'Tracks', bg: 'var(--coral-bg)', border: 'var(--coral)' },
                { n: String(allNotes.length), label: allNotes.length === 1 ? 'Note' : 'Notes', bg: 'var(--mint-bg)', border: 'var(--mint)' },
                { n: 'EN/中', label: 'Bilingual', bg: 'var(--sky-bg)', border: 'var(--sky)' },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '10px 15px', borderRadius: 12,
                  background: s.bg, border: '2.5px solid var(--ink)',
                  boxShadow: '2px 2px 0 var(--ink)',
                }}>
                  <div style={{ fontWeight: 900, fontSize: 22, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontWeight: 700, fontSize: 10.5, color: 'var(--ink-soft)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* hero illustration — restrained note card */}
          <div className="hero-visual" style={{ position: 'relative', height: 300 }}>
            <div style={{
              position: 'absolute', top: 70, left: '16%', width: '62%', height: 132,
              borderRadius: 18, background: '#EFE7D8',
              border: '2.5px solid var(--ink)', boxShadow: '3px 3px 0 var(--ink)',
              transform: 'rotate(2.5deg)', zIndex: 0,
            }} />
            <HeroCard color="var(--sky-bg)" style={{ top: 50, left: '9%', width: '66%' }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Quadratic Formula</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, background: '#fff', padding: '8px 12px', borderRadius: 10, border: '2px solid var(--ink)' }}>
                x = (−b ± √(b²−4ac)) / 2a
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {['A-Level','Algebra'].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </HeroCard>
          </div>
        </div>
      </section>

      {/* ── Courses ── */}
      <section className="container" style={{ padding: '0 22px 56px' }}>
        <div className="course-catalog-head">
          <div>
            <div className="course-catalog-pill">
              <span className="pill">📚 Course catalog</span>
            </div>
            <h2>{COURSES.length} tracks, one growing library.</h2>
            <p>Start with the track you recognise. New notes settle into the right place as the library grows.</p>
          </div>
          <Link href="/courses" className="course-catalog-link">See all tracks →</Link>
        </div>
        <div className="course-shelf" aria-label="Curated course tracks">
          {COURSES.map((c) => (
            <Link key={c.slug} href={`/courses/${c.slug}`} className="course-shelf-link">
              <div className="course-shelf-card" data-color={c.color}>
                <div className="course-icon">{c.icon}</div>
                <div className="course-sub">{c.subtitle}</div>
                <h3>{c.title}</h3>
                <p className="course-desc">{c.description}</p>
                <div className="course-footer">
                  <span><span className="dot-live" /> Growing</span>
                  <div className="course-arrow">→</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent notes ── */}
      {recent.length > 0 && (
        <section className="container" style={{ padding: '0 22px 56px' }}>
          <div className="sec-head">
            <span className="pill">🌱 Latest notes</span>
            <h2>Fresh from the desk.</h2>
            <p style={{ fontSize: 15 }}>Recently published notes, trimmed and sorted into their course tracks.</p>
          </div>
          <div className="grid-3">
            {recent.map((n) => <PostCard key={`${n.course}/${n.slug}`} note={n} />)}
          </div>
          <div style={{ textAlign: 'center', marginTop: 28 }}>
            <Link href="/notes" className="btn">See all notes →</Link>
          </div>
        </section>
      )}

      {/* ── Features ── */}
      <section className="container" style={{ padding: '0 22px 56px' }}>
        <div className="sec-head">
          <span className="pill">✨ How it works</span>
          <h2>Simple, open, free.</h2>
        </div>
        <FeatureCards />
      </section>

      {/* ── CTA ── */}
      <div className="container" style={{ padding: '0 22px 68px' }}>
        <div style={{
          padding: '46px 36px', borderRadius: 24, textAlign: 'center',
          background: 'var(--lemon-bg)',
          border: '2.5px solid var(--ink)',
          boxShadow: '5px 5px 0 var(--ink)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* decorative circles */}
          <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: 'var(--lemon)', opacity: .32, top: -76, right: -52, border: '2px solid rgba(0,0,0,.08)' }} />
          <div style={{ position: 'absolute', width: 130, height: 130, borderRadius: '50%', background: 'var(--sky-bg)', opacity: .5, bottom: -44, left: -34 }} />

          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 'clamp(30px,4vw,44px)', letterSpacing: 0, lineHeight: 1.05, marginBottom: 14, color: 'var(--ink)', position: 'relative', zIndex: 1 }}>
            Free to read,<br />forever.
          </h2>
          <p style={{ fontSize: 16, color: 'var(--ink-soft)', maxWidth: 500, margin: '0 auto 24px', fontWeight: 600, position: 'relative', zIndex: 1 }}>
            No accounts, no paywalls, no ads. Just notes, slowly piling up.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link href="/courses" className="btn" style={{ background: '#fff', color: 'var(--ink)' }}>Browse the notes</Link>
            <a href={`https://github.com/pennyzhaozhao/mathnest`} target="_blank" rel="noopener noreferrer"
              className="btn" style={{ background: 'var(--lilac-bg)', color: 'var(--ink)' }}>View on GitHub ↗</a>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: 'var(--ink-soft)', display: 'flex', gap: 18, justifyContent: 'center', fontWeight: 700, position: 'relative', zIndex: 1 }}>
            {['Open source', 'Free forever', 'No tracking'].map(t => <span key={t}>♡ {t}</span>)}
          </div>
        </div>
      </div>
    </>
  );
}

/* ── tiny local components ── */
function HeroCard({ children, color, style }: any) {
  return (
    <div style={{
      position: 'absolute', borderRadius: 18, padding: 18, zIndex: 1,
      background: color,
      border: '2.5px solid var(--ink)',
      boxShadow: '4px 4px 0 var(--ink)',
      ...style,
    }}>
      {children}
    </div>
  );
}
function Tag({ children }: any) {
  return (
    <span style={{
      fontSize: 11, padding: '3px 9px', borderRadius: 999,
      background: '#fff', fontWeight: 700, color: 'var(--ink)',
      border: '1.5px solid var(--ink)',
    }}>{children}</span>
  );
}

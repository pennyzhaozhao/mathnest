import Link from 'next/link';
import { COURSES } from '@/lib/config';
import { getRecentNotes } from '@/lib/notes';
import PostCard from '@/components/PostCard';
import FeatureCards from '@/components/FeatureCards';

export default function HomePage() {
  const recent = getRecentNotes(3);

  return (
    <>
      {/* ── Hero ── */}
      <section className="container" style={{ padding: '56px 22px 48px' }}>
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
        <div className="hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr .9fr', gap: 48, alignItems: 'center' }}>
          <div>
            {/* eyebrow */}
            <div style={{ marginBottom: 20 }}>
              <span className="pill">
                <span className="dot-live" />
                A small, growing library — built note by note
              </span>
            </div>

            <h1 style={{
              fontFamily: 'Nunito, sans-serif', fontWeight: 900,
              fontSize: 'clamp(42px,6vw,76px)', lineHeight: 1.05,
              letterSpacing: '-.025em', marginBottom: 22,
            }}>
              Maths notes,<br />
              made to{' '}
              <span style={{
                background: 'var(--lemon)', borderRadius: 12, padding: '0 10px',
                border: '2.5px solid var(--ink)', boxShadow: '3px 3px 0 var(--ink)',
                display: 'inline-block', transform: 'rotate(-1.5deg)',
              }}>
                click.
              </span>
            </h1>

            <p style={{ fontSize: 17.5, color: 'var(--ink-soft)', maxWidth: 500, marginBottom: 30, lineHeight: 1.65, fontWeight: 600 }}>
              A personal corner of the internet for KS3, IGCSE, A-Level, AP and university maths.
              Free notes, video walkthroughs, worked examples — open to anyone, forever.
            </p>

            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
              <Link href="/courses" className="btn btn-primary" style={{ fontSize: 16 }}>Browse the notes →</Link>
              <Link href="/about" className="btn" style={{ fontSize: 16 }}>About this site</Link>
            </div>

            {/* stats */}
            <div className="hero-stats" style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { n: '6', label: 'Tracks', bg: 'var(--coral-bg)', border: 'var(--coral)' },
                { n: '∞', label: 'Free practice', bg: 'var(--mint-bg)', border: 'var(--mint)' },
                { n: 'EN/中', label: 'Bilingual', bg: 'var(--sky-bg)', border: 'var(--sky)' },
              ].map(s => (
                <div key={s.label} style={{
                  padding: '12px 18px', borderRadius: 14,
                  background: s.bg, border: '2.5px solid var(--ink)',
                  boxShadow: '3px 3px 0 var(--ink)',
                }}>
                  <div style={{ fontWeight: 900, fontSize: 26, lineHeight: 1 }}>{s.n}</div>
                  <div style={{ fontWeight: 700, fontSize: 12, color: 'var(--ink-soft)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '.05em' }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* hero illustration — cartoon floating cards */}
          <div className="hero-visual" style={{ position: 'relative', height: 500 }}>
            {/* decorative blobs */}
            <div style={{ position: 'absolute', width: 200, height: 200, borderRadius: '50%', background: 'var(--lemon)', opacity: .35, top: -30, right: -20, zIndex: 0, border: '2px solid var(--lemon-deep)' }} />
            <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: 'var(--mint)', opacity: .3, bottom: 20, left: -20, zIndex: 0, border: '2px solid var(--mint-deep)' }} />

            <HeroCard color="var(--coral-bg)" style={{ top: 0, left: '5%', width: '60%', animationDelay: '0s' }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Quadratic Formula</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 13, background: '#fff', padding: '8px 12px', borderRadius: 10, border: '2px solid var(--ink)' }}>
                x = (−b ± √(b²−4ac)) / 2a
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {['A-Level','Algebra'].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </HeroCard>

            <HeroCard color="var(--mint-bg)" style={{ top: '36%', right: '2%', width: '54%', animationDelay: '-2s' }}>
              <div style={{ fontWeight: 800, fontSize: 16, marginBottom: 8 }}>Notes + examples</div>
              <p style={{ fontSize: 13, color: 'var(--ink-soft)', lineHeight: 1.5, fontWeight: 600 }}>
                Plain-English explanation, then examples that look exactly like the exam.
              </p>
              <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                {['IGCSE','Trig'].map(t => <Tag key={t}>{t}</Tag>)}
              </div>
            </HeroCard>

            <HeroCard color="var(--lilac-bg)" style={{ bottom: '2%', left: '10%', width: '56%', animationDelay: '-4s' }}>
              <div style={{ height: 72, borderRadius: 12, background: 'var(--lilac)', border: '2.5px solid var(--ink)', display: 'grid', placeItems: 'center', fontSize: 28, color: '#fff', boxShadow: '3px 3px 0 var(--ink)' }}>▶</div>
              <div style={{ fontWeight: 800, fontSize: 15, marginTop: 10 }}>Video walkthrough</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ink-soft)', marginTop: 6, fontWeight: 700 }}>
                <span>YouTube · 8:24</span><span>初中数学</span>
              </div>
            </HeroCard>
          </div>
        </div>
      </section>

      {/* ── Courses ── */}
      <section className="container" style={{ padding: '0 22px 72px' }}>
        <div className="sec-head">
          <span className="pill">📚 Course catalog</span>
          <h2>Six tracks, one growing library.</h2>
          <p>Each track auto-organises itself by topic tag as new notes go live.</p>
        </div>
        <div className="grid-3">
          {COURSES.map((c) => (
            <Link key={c.slug} href={`/courses/${c.slug}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <div className="course-card" data-color={c.color}>
                <div className="course-icon">{c.icon}</div>
                <div className="course-sub">{c.subtitle}</div>
                <h3>{c.title}</h3>
                <p className="course-desc">{c.description}</p>
                <div className="course-footer">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="dot-live" />Growing
                  </span>
                  <div className="course-arrow">→</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Recent notes ── */}
      {recent.length > 0 && (
        <section className="container" style={{ padding: '0 22px 72px' }}>
          <div className="sec-head">
            <span className="pill">🌱 Latest notes</span>
            <h2>Fresh from the desk.</h2>
            <p>New notes get tagged and sorted into their course automatically.</p>
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
      <section className="container" style={{ padding: '0 22px 72px' }}>
        <div className="sec-head">
          <span className="pill">✨ How it works</span>
          <h2>Simple, open, free.</h2>
        </div>
        <FeatureCards />
      </section>

      {/* ── CTA ── */}
      <div className="container" style={{ padding: '0 22px 80px' }}>
        <div style={{
          padding: '56px 40px', borderRadius: 28, textAlign: 'center',
          background: 'var(--coral)',
          border: '2.5px solid var(--ink)',
          boxShadow: '6px 6px 0 var(--ink)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* decorative circles */}
          <div style={{ position: 'absolute', width: 220, height: 220, borderRadius: '50%', background: 'var(--lemon)', opacity: .3, top: -80, right: -60, border: '2px solid rgba(0,0,0,.1)' }} />
          <div style={{ position: 'absolute', width: 160, height: 160, borderRadius: '50%', background: '#fff', opacity: .15, bottom: -50, left: -40 }} />

          <h2 style={{ fontFamily: 'Nunito, sans-serif', fontWeight: 900, fontSize: 'clamp(32px,4.5vw,50px)', letterSpacing: '-.02em', lineHeight: 1.05, marginBottom: 14, color: '#fff', position: 'relative', zIndex: 1 }}>
            Free to read,<br />forever.
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,.92)', maxWidth: 500, margin: '0 auto 26px', fontWeight: 600, position: 'relative', zIndex: 1 }}>
            No accounts, no paywalls, no ads. Just notes, slowly piling up.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            <Link href="/courses" className="btn" style={{ background: '#fff', color: 'var(--ink)' }}>Browse the notes</Link>
            <a href={`https://github.com/pennyzhaozhao/mathnest`} target="_blank" rel="noopener noreferrer"
              className="btn btn-ghost">View on GitHub ↗</a>
          </div>
          <div style={{ marginTop: 16, fontSize: 13, color: 'rgba(255,255,255,.8)', display: 'flex', gap: 18, justifyContent: 'center', fontWeight: 700, position: 'relative', zIndex: 1 }}>
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
      position: 'absolute', borderRadius: 20, padding: 18, zIndex: 1,
      background: color,
      border: '2.5px solid var(--ink)',
      boxShadow: '5px 5px 0 var(--ink)',
      animation: 'floaty 5s ease-in-out infinite',
      ...style,
    }}>
      <style>{`@keyframes floaty{0%,100%{transform:translateY(0) rotate(-1deg)}50%{transform:translateY(-10px) rotate(1deg)}}`}</style>
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

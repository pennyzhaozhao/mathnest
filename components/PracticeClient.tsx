'use client';
import { useState, useRef, useEffect } from 'react';
import type { PracticeSet, MCQ, Fill, Short, Question } from '@/lib/practice';

export default function PracticeClient({ set }: { set: PracticeSet }) {
  const [answers, setAnswers]     = useState<Record<string, any>>({});
  const [checked, setChecked]     = useState<Record<string, boolean>>({});
  const [showAnswer, setShowAnswer] = useState<Record<string, boolean>>({});
  const [score, setScore]         = useState<{ correct: number; total: number } | null>(null);

  const difficultyColor = {
    foundation: { bg: 'var(--mint-bg)',   text: 'var(--mint-deep)',   label: 'Foundation' },
    standard:   { bg: 'var(--sky-bg)',    text: 'var(--sky-deep)',    label: 'Standard'   },
    challenge:  { bg: 'var(--coral-bg)',  text: 'var(--coral-deep)',  label: 'Challenge'  },
  }[set.difficulty];

  function checkAll() {
    const newChecked: Record<string, boolean> = {};
    let correct = 0;
    let total = 0;
    for (const q of set.questions) {
      if (q.type === 'short') continue; // 简答题不计分
      total++;
      const result = isCorrect(q, answers[q.id]);
      newChecked[q.id] = result;
      if (result) correct++;
    }
    setChecked(newChecked);
    setScore({ correct, total });
    // 滚动到结果
    document.getElementById('score-banner')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function reset() {
    setAnswers({});
    setChecked({});
    setShowAnswer({});
    setScore(null);
  }

  // 方案C：所有题型都算进进度
  // MCQ/Fill：有 answers 就算 answered
  // Short：点击了 Show model answer 就算 answered（self-assessed）
  const totalCount = set.questions.length;
  const answeredCount = set.questions.filter(q => {
    if (q.type === 'short') return showAnswer[q.id] === true;
    return answers[q.id] !== undefined;
  }).length;
  const gradableCount = set.questions.filter(q => q.type !== 'short').length;

  return (
    <div>
      {/* score banner */}
      {score && (
        <div id="score-banner" style={{
          padding: '20px 28px', borderRadius: 18, marginBottom: 32,
          background: score.correct === score.total ? 'var(--mint-bg)' : score.correct >= score.total * 0.6 ? 'var(--lemon-bg)' : 'var(--coral-bg)',
          border: '2.5px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
        }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 28 }}>
              {score.correct === score.total ? '🎉' : score.correct >= score.total * 0.6 ? '👍' : '💪'}{' '}
              {score.correct} / {score.total} correct
            </div>
            <div style={{ fontWeight: 700, color: 'var(--ink-soft)', fontSize: 14, marginTop: 4 }}>
              {score.correct === score.total
                ? 'Perfect score! Brilliant work.'
                : score.correct >= score.total * 0.6
                ? 'Good effort — check the ones you missed.'
                : 'Keep practising — review the explanations below.'}
            </div>
          </div>
          <button className="btn" onClick={reset}>↺ Try again</button>
        </div>
      )}

      {/* progress bar */}
      {!score && totalCount > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: 13, color: 'var(--ink-soft)', marginBottom: 8 }}>
            <span>{answeredCount} / {totalCount} answered</span>
            <span style={{ color: 'var(--ink)', background: difficultyColor.bg, padding: '2px 10px', borderRadius: 999, border: '1.5px solid var(--ink)', fontSize: 12 }}>
              {difficultyColor.label}
            </span>
          </div>
          <div style={{ height: 10, borderRadius: 999, background: '#eee', border: '2px solid var(--ink)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(answeredCount / totalCount) * 100}%`, background: 'var(--mint)', borderRadius: 999, transition: 'width .3s' }} />
          </div>
          {set.questions.some(q => q.type === 'short') && (
            <p style={{ fontSize: 11.5, color: 'var(--ink-faint)', marginTop: 6, fontWeight: 600 }}>
              Short answer questions count when you view the model answer
            </p>
          )}
        </div>
      )}

      {/* questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {set.questions.map((q, i) => (
          <div key={q.id}>
            {q.type === 'mcq'   && <MCQCard   q={q} idx={i} answers={answers} setAnswers={setAnswers} checked={checked} showAnswer={showAnswer} setShowAnswer={setShowAnswer} submitted={!!score} />}
            {q.type === 'fill'  && <FillCard  q={q} idx={i} answers={answers} setAnswers={setAnswers} checked={checked} showAnswer={showAnswer} setShowAnswer={setShowAnswer} submitted={!!score} />}
            {q.type === 'short' && <ShortCard q={q} idx={i} showAnswer={showAnswer} setShowAnswer={setShowAnswer} />}
          </div>
        ))}
      </div>

      {/* submit / reset */}
      {gradableCount > 0 && (
        <div style={{ marginTop: 36, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          {!score ? (
            <button className="btn btn-primary" style={{ fontSize: 16 }} onClick={checkAll}
              disabled={answeredCount === 0}>
              ✓ Check answers
            </button>
          ) : (
            <button className="btn" onClick={reset}>↺ Try again</button>
          )}
          {!score && answeredCount < gradableCount && gradableCount > 0 && (
            <span style={{ fontSize: 13.5, color: 'var(--ink-soft)', fontWeight: 600 }}>
              Answer all MCQ and fill-in questions to check
            </span>
          )}
        </div>
      )}
    </div>
  );
}

// ── helpers ──────────────────────────────────────────────────
function isCorrect(q: Question, ans: any): boolean {
  if (q.type === 'mcq') {
    const correct = q.options.find(o => o.correct)?.label;
    return ans === correct;
  }
  if (q.type === 'fill') {
    if (ans === undefined || ans === '') return false;
    const clean = (s: string) => s.replace(/\s/g, '').toLowerCase();
    if (q.tolerance > 0) {
      const n = parseFloat(ans);
      const a = parseFloat(q.answer);
      return !isNaN(n) && !isNaN(a) && Math.abs(n - a) <= q.tolerance;
    }
    return clean(String(ans)) === clean(q.answer);
  }
  return false;
}

function QuestionCard({ idx, type, marks, children }: { idx: number; type: string; marks?: number; children: React.ReactNode }) {
  const typeLabel: Record<string, { label: string; bg: string }> = {
    mcq:   { label: 'Multiple choice', bg: 'var(--sky-bg)'   },
    fill:  { label: 'Fill in the blank', bg: 'var(--lemon-bg)' },
    short: { label: 'Short answer', bg: 'var(--lilac-bg)'    },
  };
  const t = typeLabel[type] || { label: type, bg: 'var(--bg-2)' };
  return (
    <div style={{
      background: '#fff', borderRadius: 20,
      border: '2.5px solid var(--ink)', boxShadow: '4px 4px 0 var(--ink)',
      overflow: 'hidden',
    }}>
      {/* card header */}
      <div style={{ padding: '12px 22px', borderBottom: '2px solid var(--ink)', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 800, fontSize: 14 }}>Q{idx + 1}</span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <span style={{ fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 999, background: '#fff', border: '1.5px solid var(--ink)' }}>{t.label}</span>
          {marks && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-soft)' }}>[{marks} mark{marks > 1 ? 's' : ''}]</span>}
        </div>
      </div>
      <div style={{ padding: '22px 24px' }}>{children}</div>
    </div>
  );
}

function QuestionText({ text }: { text: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    import('katex').then((katex) => {
      let html = text
        .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
          try { return (katex as any).default.renderToString(tex.trim(), { displayMode: true, throwOnError: false }); }
          catch { return tex; }
        })
        .replace(/\$([^$\n]+?)\$/g, (_, tex) => {
          try { return (katex as any).default.renderToString(tex.trim(), { displayMode: false, throwOnError: false }); }
          catch { return tex; }
        });
      if (ref.current) ref.current.innerHTML = html;
    }).catch(() => {
      if (ref.current) ref.current.textContent = text;
    });
  }, [text]);

  return (
    <p ref={ref} style={{ fontWeight: 700, fontSize: 16.5, lineHeight: 1.6, marginBottom: 18 }}>
      {text}
    </p>
  );
}

function Explanation({ text }: { text?: string }) {
  if (!text) return null;
  return (
    <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 12, background: 'var(--sky-bg)', border: '2px solid var(--ink)', fontSize: 14, fontWeight: 600, lineHeight: 1.6 }}>
      💡 {text}
    </div>
  );
}

// ── MCQ card ─────────────────────────────────────────────────
function MCQCard({ q, idx, answers, setAnswers, checked, showAnswer, setShowAnswer, submitted }: any) {
  const selected: string | undefined = answers[q.id];
  const isChecked = submitted || checked[q.id] !== undefined;
  const correct = q.options.find((o: any) => o.correct)?.label;

  // shuffle once per render (stable via index seed)
  const shuffled = [...q.options];

  function optionStyle(label: string) {
    const base: React.CSSProperties = {
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      borderRadius: 12, border: '2px solid var(--ink)', marginBottom: 10,
      cursor: isChecked ? 'default' : 'pointer', fontWeight: 700, fontSize: 15,
      transition: 'transform .1s, box-shadow .1s',
      background: '#fff', boxShadow: '2px 2px 0 var(--ink)',
    };
    if (!isChecked) {
      if (selected === label) { base.background = 'var(--sky-bg)'; base.boxShadow = '3px 3px 0 var(--ink)'; }
      return base;
    }
    if (label === correct) { base.background = 'var(--mint-bg)'; base.border = '2px solid var(--mint-deep)'; base.boxShadow = '2px 2px 0 var(--mint-deep)'; return base; }
    if (label === selected && label !== correct) { base.background = 'var(--coral-bg)'; base.border = '2px solid var(--coral-deep)'; base.boxShadow = '2px 2px 0 var(--coral-deep)'; return base; }
    base.opacity = .55; base.boxShadow = 'none';
    return base;
  }

  return (
    <QuestionCard idx={idx} type="mcq">
      <QuestionText text={q.question} />
      {shuffled.map((o: any) => (
        <div key={o.label} style={optionStyle(o.label)}
          onClick={() => { if (!isChecked) setAnswers((a: any) => ({ ...a, [q.id]: o.label })); }}>
          <span style={{ width: 28, height: 28, borderRadius: 8, border: '2px solid var(--ink)', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 800, background: '#fff', flexShrink: 0 }}>
            {isChecked && o.label === correct ? '✓' : isChecked && o.label === selected && o.label !== correct ? '✗' : o.label}
          </span>
          {o.text}
        </div>
      ))}
      {isChecked && <Explanation text={q.explanation} />}
    </QuestionCard>
  );
}

// ── Fill card ────────────────────────────────────────────────
function FillCard({ q, idx, answers, setAnswers, checked, showAnswer, setShowAnswer, submitted }: any) {
  const val: string = answers[q.id] ?? '';
  const isChecked = submitted || checked[q.id] !== undefined;
  const correct = isChecked ? isCorrect(q, val) : null;

  return (
    <QuestionCard idx={idx} type="fill">
      <QuestionText text={q.question} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={val}
          onChange={e => { if (!isChecked) setAnswers((a: any) => ({ ...a, [q.id]: e.target.value })); }}
          placeholder="Your answer…"
          style={{
            padding: '11px 16px', borderRadius: 12, fontFamily: 'Nunito, sans-serif',
            fontSize: 16, fontWeight: 700, outline: 'none',
            border: isChecked
              ? `2px solid ${correct ? 'var(--mint-deep)' : 'var(--coral-deep)'}`
              : '2px solid var(--ink)',
            background: isChecked ? (correct ? 'var(--mint-bg)' : 'var(--coral-bg)') : '#fff',
            boxShadow: '2px 2px 0 var(--ink)',
            minWidth: 200,
          }}
          onKeyDown={e => { if (e.key === 'Enter' && !isChecked && val) {} }}
          disabled={isChecked}
        />
        {isChecked && (
          <span style={{ fontWeight: 800, fontSize: 15, color: correct ? 'var(--mint-deep)' : 'var(--coral-deep)' }}>
            {correct ? '✓ Correct!' : `✗ Answer: ${q.answer}`}
          </span>
        )}
        {!isChecked && (
          <button className="btn btn-sm"
            style={{ background: 'var(--lemon)' }}
            onClick={() => setShowAnswer((s: any) => ({ ...s, [q.id]: !s[q.id] }))}>
            {showAnswer[q.id] ? 'Hide answer' : 'Show answer'}
          </button>
        )}
      </div>
      {showAnswer[q.id] && !isChecked && (
        <div style={{ marginTop: 12, padding: '10px 14px', borderRadius: 10, background: 'var(--lemon-bg)', border: '2px solid var(--lemon-deep)', fontWeight: 700, fontSize: 14 }}>
          Answer: <span style={{ fontFamily: 'JetBrains Mono, monospace' }}>{q.answer}</span>
        </div>
      )}
      {isChecked && <Explanation text={q.explanation} />}
    </QuestionCard>
  );
}

// ── Short answer card ────────────────────────────────────────
function ShortCard({ q, idx, showAnswer, setShowAnswer }: any) {
  const [userAnswer, setUserAnswer] = useState('');

  return (
    <QuestionCard idx={idx} type="short" marks={q.marks}>
      <QuestionText text={q.question} />

      <textarea
        value={userAnswer}
        onChange={e => setUserAnswer(e.target.value)}
        placeholder="Write your working and answer here…"
        style={{
          width: '100%', minHeight: 120, padding: '12px 16px',
          borderRadius: 12, border: '2px solid var(--ink)',
          fontFamily: 'Nunito, sans-serif', fontSize: 14.5, fontWeight: 600,
          background: '#fff', outline: 'none', resize: 'vertical',
          boxShadow: 'inset 2px 2px 0 rgba(0,0,0,.05)',
          lineHeight: 1.6,
        }}
        onFocus={e => e.currentTarget.style.border = '2px solid var(--lilac-deep)'}
        onBlur={e => e.currentTarget.style.border = '2px solid var(--ink)'}
      />

      <div style={{ marginTop: 12, display: 'flex', gap: 10, alignItems: 'center' }}>
        <button className="btn btn-sm"
          style={{ background: showAnswer[q.id] ? 'var(--lilac)' : 'var(--lilac-bg)', color: showAnswer[q.id] ? '#fff' : 'var(--ink)' }}
          onClick={() => setShowAnswer((s: any) => ({ ...s, [q.id]: !s[q.id] }))}>
          {showAnswer[q.id] ? '🙈 Hide model answer' : '👁 Show model answer'}
        </button>
        <span style={{ fontSize: 12.5, color: 'var(--ink-soft)', fontWeight: 600 }}>
          Compare your working with the model answer
        </span>
      </div>

      {showAnswer[q.id] && q.answer && (
        <div style={{ marginTop: 14, padding: '16px 20px', borderRadius: 14, background: 'var(--lilac-bg)', border: '2.5px solid var(--ink)', boxShadow: '3px 3px 0 var(--ink)' }}>
          <div style={{ fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '.05em', marginBottom: 10, color: 'var(--lilac-deep)' }}>Model answer</div>
          <pre style={{ fontFamily: 'Nunito, sans-serif', fontSize: 14.5, fontWeight: 600, lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>{q.answer}</pre>
          {q.explanation && <Explanation text={q.explanation} />}
        </div>
      )}
    </QuestionCard>
  );
}

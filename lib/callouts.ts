const ICONS = {
  info: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 10.5v6"/><path d="M12 7.5h.01"/></svg>',
  check: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="m8 12.5 2.6 2.6L16.5 9"/></svg>',
  plus: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M12 7.5v9"/><path d="M7.5 12h9"/></svg>',
  warning: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 22 20H2L12 3Z"/><path d="M12 9v5"/><path d="M12 17h.01"/></svg>',
  caution: '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>',
};

const CALLOUT_TYPES: Record<string, { icon: string; label: string }> = {
  NOTE:      { icon: ICONS.info,    label: 'Note'      },
  TIP:       { icon: ICONS.check,   label: 'Tip'       },
  IMPORTANT: { icon: ICONS.plus,    label: 'Important' },
  WARNING:   { icon: ICONS.warning, label: 'Warning'   },
  CAUTION:   { icon: ICONS.caution, label: 'Caution'   },
};

const CALLOUT_TYPE_PATTERN = 'NOTE|TIP|IMPORTANT|WARNING|CAUTION';
const CALLOUT_LINE_RE = new RegExp(`^\\s*(?:>\\s*)?\\[!(${CALLOUT_TYPE_PATTERN})\\]\\s*$`, 'i');
const BLOCKQUOTE_RE = /^\s*>/;
const HEADING_RE = /^\s{0,3}#{1,6}\s+/;
const THEMATIC_BREAK_RE = /^\s{0,3}(?:[-*_]\s*){3,}$/;

function isCalloutBoundary(line: string): boolean {
  return HEADING_RE.test(line) || THEMATIC_BREAK_RE.test(line) || CALLOUT_LINE_RE.test(line);
}

function shouldEndLooseCalloutAfterBlank(nextLine: string | undefined): boolean {
  if (nextLine === undefined) return true;
  if (nextLine.trim() === '') return false;
  return isCalloutBoundary(nextLine);
}

// Make callouts forgiving in the editor:
// [!Tip]
// Therefore:
// - item
//
// becomes a normal blockquote callout before markdown parsing.
export function normalizeLooseCallouts(markdown: string): string {
  const lines = markdown.split(/\r?\n/);
  const output: string[] = [];
  let inLooseCallout = false;

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];
    const isCalloutStart = CALLOUT_LINE_RE.test(line);

    if (isCalloutStart) {
      output.push(BLOCKQUOTE_RE.test(line) ? line : `> ${line.trim()}`);
      inLooseCallout = true;
      continue;
    }

    if (!inLooseCallout) {
      output.push(line);
      continue;
    }

    if (BLOCKQUOTE_RE.test(line)) {
      output.push(line);
      continue;
    }

    if (line.trim() === '') {
      if (shouldEndLooseCalloutAfterBlank(lines[index + 1])) {
        output.push(line);
        inLooseCallout = false;
      } else {
        output.push('>');
      }
      continue;
    }

    if (isCalloutBoundary(line)) {
      output.push(line);
      inLooseCallout = false;
      continue;
    }

    output.push(`> ${line}`);
  }

  return output.join('\n');
}

// Parse HTML after markdown rendering and replace GitHub-style blockquote
// markers with the app's styled callout shell.
export function applyCallouts(html: string): string {
  const result: string[] = [];
  let i = 0;

  while (i < html.length) {
    const bqStart = html.indexOf('<blockquote>', i);
    if (bqStart === -1) {
      result.push(html.slice(i));
      break;
    }

    result.push(html.slice(i, bqStart));
    const afterOpen = bqStart + '<blockquote>'.length;

    let depth = 1;
    let j = afterOpen;
    while (j < html.length && depth > 0) {
      const open = html.indexOf('<blockquote>', j);
      const close = html.indexOf('</blockquote>', j);
      if (close === -1) break;
      if (open !== -1 && open < close) {
        depth++;
        j = open + '<blockquote>'.length;
      } else {
        depth--;
        if (depth === 0) {
          j = close;
          break;
        }
        j = close + '</blockquote>'.length;
      }
    }

    const inner = html.slice(afterOpen, j);
    const marker = inner.match(new RegExp(`^\\s*<p>\\[!(${CALLOUT_TYPE_PATTERN})\\](?:\\s*</p>|[ \\t]*)`, 'i'));

    if (marker) {
      const type = marker[1].toUpperCase();
      const { icon, label } = CALLOUT_TYPES[type];
      const body = inner
        .replace(new RegExp(`^\\s*<p>\\[!(${CALLOUT_TYPE_PATTERN})\\]\\s*</p>\\s*`, 'i'), '')
        .replace(new RegExp(`^\\s*<p>\\[!(${CALLOUT_TYPE_PATTERN})\\][ \\t]*`, 'i'), '<p>')
        .trim();

      result.push(
        `<div class="callout callout-${type.toLowerCase()}">` +
        `<div class="callout-title"><span class="callout-icon">${icon}</span>${label}</div>` +
        `<div class="callout-body">${body}</div></div>`
      );
    } else {
      result.push(`<blockquote>${inner}</blockquote>`);
    }

    i = j + '</blockquote>'.length;
  }

  return result.join('');
}

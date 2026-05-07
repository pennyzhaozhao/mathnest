const CALLOUT_TYPES: Record<string, { icon: string; label: string }> = {
  NOTE:      { icon: 'ℹ️',  label: 'Note'      },
  TIP:       { icon: '💡', label: 'Tip'       },
  IMPORTANT: { icon: '📣', label: 'Important' },
  WARNING:   { icon: '⚠️',  label: 'Warning'   },
  CAUTION:   { icon: '🚫', label: 'Caution'   },
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

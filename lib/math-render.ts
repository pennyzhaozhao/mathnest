function stripBlockquoteMarkersFromDisplayMath(tex: string): string {
  const lines = tex.split(/\r?\n/);
  const nonEmptyLines = lines.filter((line) => line.trim() !== '');
  const isBlockquoteMath =
    nonEmptyLines.length > 0 &&
    nonEmptyLines.every((line) => /^\s*>/.test(line));

  if (!isBlockquoteMath) return tex.trim();

  return lines
    .map((line) => line.replace(/^\s*>\s?/, ''))
    .join('\n')
    .trim();
}

export function renderMarkdownMath(md: string, katex: any): string {
  return md
    .replace(/\$\$([\s\S]+?)\$\$/g, (_, tex) => {
      const cleanTex = stripBlockquoteMarkersFromDisplayMath(tex);
      try {
        return katex.renderToString(cleanTex, { displayMode: true, throwOnError: false });
      } catch {
        return `$$${tex}$$`;
      }
    })
    .replace(/\$([^$\n]+?)\$/g, (_, tex) => {
      try {
        return katex.renderToString(tex.trim(), { displayMode: false, throwOnError: false });
      } catch {
        return `$${tex}$`;
      }
    });
}

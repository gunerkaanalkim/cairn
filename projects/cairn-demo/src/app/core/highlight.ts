/**
 * Dependency free syntax highlighter used by the documentation site.
 * It escapes the source first and then wraps a single tokenizer pass in
 * span elements, so no user supplied markup can ever reach the DOM.
 */

export type CodeLang = 'ts' | 'html' | 'css' | 'bash';

const ESCAPES: Readonly<Record<string, string>> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
};

function escapeHtml(source: string): string {
  return source.replace(/[&<>]/g, (char) => ESCAPES[char] ?? char);
}

function wrap(token: string, cls: string): string {
  return '<span class="' + cls + '">' + token + '</span>';
}

const TS_KEYWORDS =
  'import|export|from|default|const|let|var|function|class|extends|implements|interface|type|enum|readonly|return|if|else|for|of|in|while|switch|case|break|continue|new|await|async|try|catch|finally|throw|typeof|instanceof|as|is|void|null|undefined|true|false|this|super|public|private|protected|static|abstract|declare|satisfies|keyof|infer';

const TS_PATTERN = new RegExp(
  [
    '(\\/\\/[^\\n]*|\\/\\*[\\s\\S]*?\\*\\/)',
    "('(?:\\\\.|[^'\\\\])*'|\"(?:\\\\.|[^\"\\\\])*\"|`(?:\\\\.|[^`\\\\])*`)",
    '\\b(' + TS_KEYWORDS + ')\\b',
    '\\b(\\d+(?:\\.\\d+)?)\\b',
    '([A-Za-z_$][\\w$]*)(?=\\()',
  ].join('|'),
  'g'
);

function highlightTs(escaped: string): string {
  return escaped.replace(TS_PATTERN, (match, comment, str, keyword, num, fn) => {
    if (comment) return wrap(match, 'tok-com');
    if (str) return wrap(match, 'tok-str');
    if (keyword) return wrap(match, 'tok-key');
    if (num) return wrap(match, 'tok-num');
    if (fn) return wrap(match, 'tok-fn');
    return match;
  });
}

const HTML_PATTERN = new RegExp(
  [
    '(&lt;!--[\\s\\S]*?--&gt;)',
    '(&lt;\\/?[\\w-]+)',
    '(\\/?&gt;)',
    '("(?:[^"]*)")',
    "('(?:[^']*)')",
    '([@\\[\\(#*]?[\\w:.-]+[\\]\\)]?)(?==)',
    '(\\{\\{[^}]*\\}\\})',
  ].join('|'),
  'g'
);

function highlightHtml(escaped: string): string {
  return escaped.replace(
    HTML_PATTERN,
    (match, comment, openTag, closeTag, doubleStr, singleStr, attr, interpolation) => {
      if (comment) return wrap(match, 'tok-com');
      if (openTag || closeTag) return wrap(match, 'tok-tag');
      if (doubleStr || singleStr) return wrap(match, 'tok-str');
      if (attr) return wrap(match, 'tok-att');
      if (interpolation) return wrap(match, 'tok-fn');
      return match;
    }
  );
}

const CSS_PATTERN = new RegExp(
  [
    '(\\/\\*[\\s\\S]*?\\*\\/)',
    '(@[\\w-]+)',
    '(--[\\w-]+|[\\w-]+)(?=\\s*:)',
    '(#[0-9a-fA-F]{3,8}\\b|\\b\\d+(?:\\.\\d+)?(?:px|rem|em|%|s|ms|fr|vh|vw)?\\b)',
  ].join('|'),
  'g'
);

function highlightCss(escaped: string): string {
  return escaped.replace(CSS_PATTERN, (match, comment, atRule, prop, value) => {
    if (comment) return wrap(match, 'tok-com');
    if (atRule) return wrap(match, 'tok-key');
    if (prop) return wrap(match, 'tok-att');
    if (value) return wrap(match, 'tok-num');
    return match;
  });
}

const BASH_PATTERN = /(#[^\n]*)|(^|\n)(npm|npx|ng|node|yarn|pnpm)\b/g;

function highlightBash(escaped: string): string {
  return escaped.replace(BASH_PATTERN, (match, comment, lead, command) => {
    if (comment) return wrap(match, 'tok-com');
    if (command) return (lead ?? '') + wrap(command, 'tok-key');
    return match;
  });
}

export function highlight(source: string, lang: CodeLang): string {
  const escaped = escapeHtml(source);
  switch (lang) {
    case 'ts':
      return highlightTs(escaped);
    case 'html':
      return highlightHtml(escaped);
    case 'css':
      return highlightCss(escaped);
    case 'bash':
      return highlightBash(escaped);
    default:
      return escaped;
  }
}

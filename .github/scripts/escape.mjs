// Everything a stranger typed passes through here before it reaches an SVG,
// the README or an issue comment. It was four identical copies, one per
// renderer, which is three chances for them to drift apart.

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&apos;',
};

/** Escape the five characters that change meaning in HTML and SVG. */
export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => HTML_ESCAPES[character]);
}

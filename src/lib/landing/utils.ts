export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function excerpt(content: string, limit = 120) {
  const text = stripHtml(content);
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

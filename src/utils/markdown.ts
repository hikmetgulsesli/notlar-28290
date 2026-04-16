export interface MarkdownNode {
  type: 'heading' | 'paragraph' | 'blockquote' | 'code-block' | 'list' | 'list-item' | 'strong' | 'em' | 'hr' | 'text';
  content?: string;
  level?: number;
  children?: MarkdownNode[];
  ordered?: boolean;
  language?: string;
}

export function renderMarkdownToHTML(markdown: string): string {
  if (!markdown) return '';

  const lines = markdown.split('\n');
  let html = '';
  let i = 0;
  let inCodeBlock = false;
  let codeBlockContent = '';
  let codeBlockLang = '';

  while (i < lines.length) {
    const line = lines[i];

    // Code blocks
    if (line.trimStart().startsWith('```')) {
      if (inCodeBlock) {
        html += `<pre class="bg-surface-variant rounded-lg p-4 my-3 overflow-x-auto"><code class="font-mono text-sm text-on-surface leading-relaxed">${escapeHtml(codeBlockContent.trimEnd())}</code></pre>`;
        inCodeBlock = false;
        codeBlockContent = '';
        codeBlockLang = '';
      } else {
        inCodeBlock = true;
        codeBlockLang = line.trimStart().slice(3).trim();
      }
      i++;
      continue;
    }

    if (inCodeBlock) {
      codeBlockContent += (codeBlockContent ? '\n' : '') + line;
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.*)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = inlineMarkdown(headingMatch[2]);
      html += `<h${level} class="text-on-surface font-bold mt-6 mb-3 ${headingClasses(level)}">${text}</h${level}>`;
      i++;
      continue;
    }

    // Horizontal rule
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(line.trim())) {
      html += `<hr class="border-outline-variant/20 my-6" />`;
      i++;
      continue;
    }

    // Blockquote
    if (line.trimStart().startsWith('>')) {
      let blockquoteContent = '';
      while (i < lines.length && lines[i].trimStart().startsWith('>')) {
        blockquoteContent += (blockquoteContent ? '\n' : '') + lines[i].replace(/^>\s?/, '');
        i++;
      }
      html += `<blockquote class="border-l-4 border-primary pl-4 my-3 text-on-surface-variant italic">${inlineMarkdown(blockquoteContent)}</blockquote>`;
      continue;
    }

    // Unordered list
    if (/^[-*+]\s+/.test(line.trimStart())) {
      let items = '';
      while (i < lines.length && /^[-*+]\s+/.test(lines[i].trimStart())) {
        const itemText = lines[i].trimStart().replace(/^[-*+]\s+/, '');
        items += `<li class="text-on-surface ml-4 mb-1">${inlineMarkdown(itemText)}</li>`;
        i++;
      }
      html += `<ul class="my-3 list-disc">${items}</ul>`;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line.trimStart())) {
      let items = '';
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trimStart())) {
        const itemText = lines[i].trimStart().replace(/^\d+\.\s+/, '');
        items += `<li class="text-on-surface ml-4 mb-1">${inlineMarkdown(itemText)}</li>`;
        i++;
      }
      html += `<ol class="my-3 list-decimal">${items}</ol>`;
      continue;
    }

    // Empty line
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph
    let paragraph = line;
    i++;
    while (i < lines.length && lines[i].trim() !== '' && !lines[i].trimStart().startsWith('#') && !lines[i].trimStart().startsWith('>') && !lines[i].trimStart().startsWith('```') && !/^[-*+]\s+/.test(lines[i].trimStart()) && !/^\d+\.\s+/.test(lines[i].trimStart())) {
      paragraph += ' ' + lines[i];
      i++;
    }
    html += `<p class="text-on-surface-variant leading-relaxed my-3">${inlineMarkdown(paragraph)}</p>`;
  }

  return html;
}

function inlineMarkdown(text: string): string {
  let result = escapeHtml(text);

  // Bold
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong class="text-on-surface font-semibold">$1</strong>');

  // Italic
  result = result.replace(/\*(.+?)\*/g, '<em class="text-on-surface italic">$1</em>');

  // Inline code
  result = result.replace(/`([^`]+)`/g, '<code class="font-mono bg-surface-variant text-on-surface px-1.5 py-0.5 rounded text-sm">$1</code>');

  // Links
  result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

  return result;
}

function headingClasses(level: number): string {
  switch (level) {
    case 1: return 'text-3xl tracking-tight';
    case 2: return 'text-2xl tracking-tight';
    case 3: return 'text-xl';
    case 4: return 'text-lg';
    default: return 'text-base';
  }
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

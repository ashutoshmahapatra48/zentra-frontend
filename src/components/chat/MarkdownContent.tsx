import ReactMarkdown from 'react-markdown';
import bash from 'highlight.js/lib/languages/bash';
import css from 'highlight.js/lib/languages/css';
import javascript from 'highlight.js/lib/languages/javascript';
import json from 'highlight.js/lib/languages/json';
import python from 'highlight.js/lib/languages/python';
import sql from 'highlight.js/lib/languages/sql';
import typescript from 'highlight.js/lib/languages/typescript';
import xml from 'highlight.js/lib/languages/xml';
import rehypeHighlight from 'rehype-highlight';
import remarkGfm from 'remark-gfm';

const languages = {
  bash,
  shell: bash,
  css,
  javascript,
  js: javascript,
  json,
  python,
  py: python,
  sql,
  typescript,
  ts: typescript,
  xml,
  html: xml,
};

/** Renders model Markdown as safe React elements with GFM and code highlighting. */
export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="assistant-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeHighlight, { languages, subset: Object.keys(languages) }]]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

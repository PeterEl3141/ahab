import React, { useEffect, useRef } from 'react';
import './QuoteBlock.css';

const QuoteBlock = ({ block, onUpdate, isPreview }) => {
  const { content = '', cite = '' } = block || {};
  const ref = useRef(null);

  const autosize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => { autosize(); }, [content]);

  if (isPreview) {
    return (
      <figure className="quote-preview">
        <blockquote><em>{content}</em></blockquote>
        {cite ? <figcaption>— {cite}</figcaption> : null}
      </figure>
    );
  }

  return (
    <div className="quote-editor">
      <textarea
        ref={ref}
        className="quote-text"
        rows={1}
        placeholder="Write a memorable line…"
        value={content}
        onChange={(e) => onUpdate({ content: e.target.value, cite })}
        onInput={autosize}
      />
      <input
        className="quote-cite"
        type="text"
        placeholder="Attribution (e.g. Oscar Wilde, 1893)"
        value={cite}
        onChange={(e) => onUpdate({ content, cite: e.target.value })}
      />
    </div>
  );
};

export default QuoteBlock;

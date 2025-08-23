import React, { useEffect, useRef} from 'react';

const ParagraphBlock = ({ content, onUpdate }) => {
  const ref = useRef(null);

  const autosize = () => {
    const el = ref.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    autosize();
  }, [content]);

  return (
    <textarea
      ref={ref}
      className="block-paragraph"
      value={content}
      onChange={(e) => onUpdate(e.target.value)}
      onInput={autosize}
      rows={1}
      placeholder="Write your paragraph…"
      spellCheck
    />
  );
};

export default ParagraphBlock;
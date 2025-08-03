import React from 'react';

const ParagraphBlock = ({ content, onUpdate }) => {
  return (
    <input
      type="text"
      defaultValue={content}
      className="block-paragrpah"
      onChange={(e) => onUpdate(e.target.value)}

    />
  );
};

export default ParagraphBlock;
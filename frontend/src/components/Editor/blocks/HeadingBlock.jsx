import React from 'react';

const HeadingBlock = ({ content, onUpdate }) => {
    return (
      <input
        type="text"
        value={content}
        onChange={(e) => onUpdate(e.target.value)}
        className="block-heading"
        placeholder="Enter your title heres"
      />
    );
  };
  

export default HeadingBlock;
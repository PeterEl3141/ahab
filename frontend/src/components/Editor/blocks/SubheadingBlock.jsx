import React from 'react';

const SubheadingBlock = ({ content, onUpdate }) => {
  return (
    <input
      type="text"
      defaultValue={content}
      className="block-subheading"
      onChange={(e) => onUpdate(e.target.value)}

    />
  );
};

export default SubheadingBlock;
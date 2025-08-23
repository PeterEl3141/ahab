import React from 'react';
import './Toolbar.css';

const Toolbar = ({ addBlock, togglePreview, isPreview, onSave, onPublish, saving }) => {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <button onClick={() => addBlock('subheading')}>Sub-heading</button>
        <button onClick={() => addBlock('paragraph')}>Paragraph</button>
        <button onClick={() => addBlock('image')}>Image</button>
        <button onClick={() => addBlock('quote')}>Quote</button>
      </div>
      <div className="toolbar-right">
        <button onClick={togglePreview}>
          {isPreview ? 'Exit Preview' : 'Preview'}
        </button>

        <button onClick={onSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save Draft'}
        </button>

        <button onClick={onPublish} disabled={saving}>
          Publish
        </button>
      </div>
      
    </div>
  );
};

export default Toolbar;

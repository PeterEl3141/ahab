import React from 'react'

const Toolbar = ({ addBlock, togglePreview, isPreview, saveDraft}) => {
  return (
    <div className='toolbar'>
        <button onClick={() => addBlock('subheading')}>Sub-heading</button>
        <button onClick={() => addBlock('paragraph')}>Paragraph</button>
        <button onClick={() => addBlock('image')}>Image</button>
        <button onClick={togglePreview}>
        {isPreview ? 'Exit Preview' : 'Preview'}
        </button>
        <button onClick={() => saveDraft()}>Save Draft</button>

    </div>
  )
}

export default Toolbar

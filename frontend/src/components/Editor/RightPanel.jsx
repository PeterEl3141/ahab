import React from 'react';
import Block from './Block';
import { Droppable, Draggable } from '@hello-pangea/dnd';

const RightPanel = ({ blocks, setBlocks, handleDelete, isPreview }) => {

  const updateBlockContent = (id, newContent) => {
    setBlocks(prev =>
      prev.map(block =>
        block.id === id ? { ...block, content: newContent } : block
      )
    );
  };

  const handleImageChange = (id, fileUrl) => {
    setBlocks(prev =>
      prev.map(block =>
        block.id === id ? { ...block, content: fileUrl } : block
      )
    );
  };

  return (
    <div className="right-panel">
      {isPreview ? (
        <div className="preview-panel">
          {blocks.map(block => (
            <div key={block.id} className="preview-block">
              <Block block={block} isPreview />
            </div>
          ))}
        </div>
      ) : (
        <Droppable droppableId="editor">
          {(provided) => (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {blocks.map((block, index) => (
                <Draggable key={block.id} draggableId={block.id} index={index}>
                  {(provided) => (
                    <div
                      className="draggable-block"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="block-header">
                        <button className="delete-btn" onClick={() => handleDelete(block.id)}>✖</button>
                      </div>
                      <Block
                        block={block}
                        isPreview={isPreview}
                        onUpdate={(content) => updateBlockContent(block.id, content)}
                        onImageChange={handleImageChange}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};

export default RightPanel;

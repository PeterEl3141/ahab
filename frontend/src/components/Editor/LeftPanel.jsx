import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';


const LeftPanel = ({ drafts, setDrafts, handleDelete }) => {
  return (
    <div className="left-panel">
      <h3>Drafts</h3>
      <Droppable droppableId="drafts" isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="drafts-dropzone"
          >
            {drafts.length > 0
        ? drafts.map((block, index) => (
            <Draggable
                key={block.id}
                draggableId={block.id.toString()}
                index={index}
            >
                {(provided) => (
                <div
                    className="draft-block draggable-block"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                >   
                    <div className="block-header">
                    <button className="delete-btn" onClick={() => handleDelete(block.id)}>✖</button>
                    </div>
                    {block.type.toUpperCase()}
                </div>
                )}
            </Draggable>
            ))
        : <div style={{ padding: '1rem', color: '#aaa' }}>No drafts</div>
        }

            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

export default LeftPanel;

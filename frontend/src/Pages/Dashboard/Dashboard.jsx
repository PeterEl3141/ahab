import React, { useState } from 'react';
import './Dashboard.css';
import LeftPanel from '../../components/Editor/LeftPanel';
import RightPanel from '../../components/Editor/RightPanel';
import Toolbar from '../../components/Editor/Toolbar';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useEffect } from 'react';


const Dashboard = () => {

    const [blocks, setBlocks] = useState([
        { id: uuidv4(), type: 'heading', content: 'Enter your title here' },
        { id: uuidv4(), type: 'subheading', content: 'A nice subtitle' },
        { id: uuidv4(), type: 'paragraph', content: 'Lorem ipsum...' },
        { id: uuidv4(), type: 'image', content: null },
      ]);

  const [drafts, setDrafts] = useState([]);
  const [isPreview, setIsPreview] = useState(false);
  const [unpublishedArticles, setUnpublishedArticles] = useState([]);

  const togglePreview = () => {
    setIsPreview(prev => !prev);
  }


  useEffect(() => {
    // Load a saved draft from "Unpublished" page if it exists
    const savedDraft = localStorage.getItem('currentDraft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed?.blocks?.length > 0) {
          setBlocks(parsed.blocks);
          setIsPreview(false);

          // Optional: also set the created/updated metadata if you want
          // Remove draft from storage after loading
          localStorage.removeItem('currentDraft');
        }
      } catch (err) {
        console.error('Failed to parse currentDraft:', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('unpublished', JSON.stringify(unpublishedArticles));
  }, [unpublishedArticles]);
  
  
  
  const saveDraft = () => {
    const now = new Date().toISOString();
    const headingBlock = blocks.find(b => b.type === 'heading');
  
    const newDraft = {
      id: uuidv4(),
      title: headingBlock?.content || "Untitled",
      createdAt: now,
      updatedAt: now,
      blocks: blocks,
    };
  
    setUnpublishedArticles(prev => [...prev, newDraft]);
  };
  


  const addBlock = (type) => {
    const newBlock = {
      id: uuidv4(),
      type,
      content: type === 'image' ? null : '',
    };
    setBlocks(prev => [...prev, newBlock]);
  };



  const handleDragEnd = (result) => {
    console.log('Drag result:', result);
    const { source, destination } = result;
  
    if (!destination) return;
  
    const isSameList = source.droppableId === destination.droppableId;
  
    // Get source/destination lists and setters
    const sourceList = source.droppableId === 'editor' ? blocks : drafts;
    const destList = destination.droppableId === 'editor' ? blocks : drafts;
  
    const setSource = source.droppableId === 'editor' ? setBlocks : setDrafts;
    const setDest = destination.droppableId === 'editor' ? setBlocks : setDrafts;
  
    // Protect against bad index
    if (source.index < 0 || source.index >= sourceList.length) return;
  
    const movedItem = sourceList[source.index];
    if (!movedItem) return;
  
    if (isSameList) {
      // Reorder within same list
      const updated = Array.from(sourceList);
      updated.splice(source.index, 1);
      updated.splice(destination.index, 0, movedItem);
      setSource(updated);
    } else {
      // Move between lists
      const newSource = [...sourceList];
      newSource.splice(source.index, 1);
  
      const newDest = [...destList];
      newDest.splice(destination.index, 0, movedItem);
  
      setSource(newSource);
      setDest(newDest);
    }
  };

  const handleDelete = (id) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    setDrafts(prev => prev.filter(d => d.id !== id));
  }
  

  return (
    <DragDropContext onDragEnd={handleDragEnd} disableInteractiveElementBlocking={true}>
      <div className="dashboard-container">
        <div className="editor-layout">
          <LeftPanel drafts={drafts} setDrafts={setDrafts} handleDelete={handleDelete}/>
          <RightPanel blocks={blocks} setBlocks={setBlocks} handleDelete={handleDelete} 
          togglePreview={togglePreview} isPreview={isPreview}/>
        </div>
        <Toolbar addBlock={addBlock} togglePreview={togglePreview} isPreview={isPreview} saveDraft={saveDraft}/>
      </div>
    </DragDropContext>
  );
};

export default Dashboard;



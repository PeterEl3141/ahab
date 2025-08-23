import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import LeftPanel from '../../components/Editor/LeftPanel';
import RightPanel from '../../components/Editor/RightPanel';
import Toolbar from '../../components/Editor/Toolbar';
import { v4 as uuidv4 } from 'uuid';
import { DragDropContext } from '@hello-pangea/dnd';
import { createArticle, updateArticle, publishArticle, fetchArticleById } from '../../api/articles';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const initialBlocks = [
  { id: uuidv4(), type: 'subheading', content: 'A nice subtitle' },
  { id: uuidv4(), type: 'paragraph', content: 'Lorem ipsum...' },
  { id: uuidv4(), type: 'image', content: null },
];


// Dashboard.jsx (near where you defined normalizeBlocks)
const normalizeBlocks = (serverBlocks = []) =>
  serverBlocks.map((b) => {
    const type = b.type;
    // prefer simple {content} but accept Editor.js {data.text} and image {data.url}
    const content =
      b.content ??
      b?.data?.text ??
      (type === 'image' ? (b?.data?.file?.url || b?.data?.url || null) : '');

    // preserve citation for quotes; accept Editor.js caption
    const cite = type === 'quote'
      ? (b.cite ?? b?.data?.caption ?? '')
      : undefined;

    return {
      // keep any existing keys to avoid future data loss
      ...b,
      id: b.id || uuidv4(),
      type,
      content,
      ...(cite !== undefined ? { cite } : {}),
    };
  });


const Dashboard = () => {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [drafts, setDrafts] = useState([]);               // left “library”
  const [isPreview, setIsPreview] = useState(false);
  const [articleId, setArticleId] = useState(null);       // backend id once saved
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Blog');       // Books | Music | Blog
  const [saving, setSaving] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams(); // for /dashboard/:id if you add it

  const togglePreview = () => setIsPreview(p => !p);

  // helper: turn {type:'heading'} into {type:'quote'}
  const migrateHeadingToQuote = (arr = []) =>
  arr.map(b => (b.type === 'heading'
    ? { ...b, type: 'quote', cite: b.cite || '' }
    : b
  ));

  // 1) Load by ID from navigation state or route params
  useEffect(() => {
    const navId = location.state?.draftId || params.id;
    if (!navId) return;

    let cancelled = false;
    (async () => {
      try {
        const { data } = await fetchArticleById(navId);
        if (cancelled) return;
        setArticleId(data.id ?? null);
        setTitle(data.title ?? '');
        setCategory(data.category ?? 'Blog');
        setBlocks(migrateHeadingToQuote(normalizeBlocks(data.blocks)));
        setIsPreview(false);
      } catch (e) {
        console.error('Failed to fetch draft by id:', e);
      } finally {
        // clear state so hot reloads don’t re-fetch
        if (location.state?.draftId) {
          navigate(location.pathname, { replace: true });
        }
      }
    })();

    return () => { cancelled = true; };
  }, [location.state?.draftId, params.id, location.pathname, navigate]);

  // 2) Fallback: load an inline draft from localStorage (legacy path)
  useEffect(() => {
    const savedDraft = localStorage.getItem('currentDraft');
    if (!savedDraft) return;

    try {
      const parsed = JSON.parse(savedDraft);
      if (parsed?.blocks?.length > 0) {
        setBlocks(migrateHeadingToQuote(normalizeBlocks(parsed.blocks)));
        setArticleId(parsed.id ?? null);
        setTitle(parsed.title ?? '');
        setCategory(parsed.category ?? 'Blog');
        setIsPreview(false);
      }
    } catch (e) {
      console.error('Failed to parse currentDraft:', e);
    } finally {
      localStorage.removeItem('currentDraft');
    }
  }, []);

  

  // Keep title in sync with first heading if empty
  useEffect(() => {
    if (!title) {
      const h = blocks.find((b) => b.type === 'heading');
      if (h?.content) setTitle(h.content);
    }
  }, [blocks, title]);

  const addBlock = (type) => {
    setBlocks((prev) => [
      ...prev,
      { id: uuidv4(), type, ...(type === 'image' ? { content: null } : { content: '' }), ...(type === 'quote' ? { cite: '' } : {}) }
    ]);
  };
  

  const handleDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const pick = (id) => (id === 'editor' ? blocks : drafts);
    const setPick = (id) => (id === 'editor' ? setBlocks : setDrafts);

    const sourceList = pick(source.droppableId);
    const destList = pick(destination.droppableId);
    const setSource = setPick(source.droppableId);
    const setDest = setPick(destination.droppableId);

    const moved = sourceList[source.index];
    if (!moved) return;

    if (source.droppableId === destination.droppableId) {
      const updated = Array.from(sourceList);
      updated.splice(source.index, 1);
      updated.splice(destination.index, 0, moved);
      setSource(updated);
    } else {
      const newSource = [...sourceList];
      newSource.splice(source.index, 1);
      const newDest = [...destList];
      newDest.splice(destination.index, 0, moved);
      setSource(newSource);
      setDest(newDest);
    }
  };

  const handleDelete = (id) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  // ---- Backend wiring ----
  const doSave = async () => {
    const heading = blocks.find(b => b.type === 'heading');
    const effectiveTitle = title || heading?.content || 'Untitled';
    setSaving(true);
    try {
      const payload = {
        title: effectiveTitle,
        category,
        blocks,               // <— send full blocks, including { cite }
        published: false,
      };
  
      if (!articleId) {
        const { data } = await createArticle(payload);
        setArticleId(data.id);
        return data;
      } else {
        const { data } = await updateArticle(articleId, payload);
        return data;
      }
    } finally {
      setSaving(false);
    }
  };
  

  const doPublish = async () => {
    const saved = await doSave();
    const id = saved?.id || articleId;
    await publishArticle(id);
    alert('Published!');
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd} disableInteractiveElementBlocking>
      <div className="dashboard-container">
        <div className="dashboard-topbar">
          <input
            className="title-input"
            placeholder="Article title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <select className="category-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option>Blog</option>
            <option>Books</option>
            <option>Music</option>
          </select>
        </div>

        <div className="editor-layout">
          <LeftPanel drafts={drafts} setDrafts={setDrafts} handleDelete={handleDelete} />
          <RightPanel
            blocks={blocks}
            setBlocks={setBlocks}
            handleDelete={handleDelete}
            isPreview={isPreview}
          />
        </div>

        <Toolbar
          addBlock={addBlock}
          togglePreview={togglePreview}
          isPreview={isPreview}
          onSave={doSave}
          onPublish={doPublish}
          saving={saving}
        />
      </div>
    </DragDropContext>
  );
};

export default Dashboard;

import React, { useEffect, useMemo, useState, useContext } from 'react';
import './Article.css';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchArticleById, publishArticle, unpublishArticle, deleteArticle } from '../../api/articles';
import { AuthContext } from '../../Context/AuthContext.jsx';
import Comments from '../../components/Comments/Comments.jsx';



// If your API base url is set (Vite/CRA), we can resolve relative image paths like "/uploads/.."
const API_BASE = import.meta.env.VITE_API_URL || '';

const resolveUrl = (url) => {
  if (!url) return '';
  return /^https?:\/\//i.test(url) ? url : `${API_BASE}${url}`;
};

// Minimal sanitizer placeholder (recommend real sanitization server-side)
// For launch speed, keep as-is if only trusted authors can post.
const sanitize = (html) => html || '';

/** Expecting Editor.js output:
 * {
 *   time: number,
 *   blocks: [{ type: string, data: object }, ...],
 *   version: string
 * }
 */
const useEditorBlocks = (rawBlocks) => {
  return useMemo(() => {
    if (!rawBlocks) return [];

    const data = typeof rawBlocks === 'string' ? safeParse(rawBlocks) : rawBlocks;

    // Case 1: canonical Editor.js object with { blocks: [...] }
    if (data && Array.isArray(data.blocks)) return data.blocks;

    // Case 2: already an array AND looks like Editor.js (each item has .type and .data)
    if (Array.isArray(data) && data.every(b => b && typeof b === 'object' && 'type' in b && 'data' in b)) {
      return data;
    }

    // Otherwise, NOT Editor.js — let legacy path handle it.
    return [];
  }, [rawBlocks]);
};


function safeParse(s) {
  try { return JSON.parse(s); } catch { return null; }
}

const EditorBlock = ({ block }) => {
  const { type, data = {} } = block || {};

  switch (type) {
    case 'header': {
      const level = Math.min(Math.max(data.level || 2, 1), 6);
      const Tag = `h${level}`;
      return <Tag dangerouslySetInnerHTML={{ __html: sanitize(data.text) }} />;
    }

    case 'paragraph':
      return <p dangerouslySetInnerHTML={{ __html: sanitize(data.text) }} />;

    case 'image': {
      const src = resolveUrl(data?.file?.url || data?.url);
      const caption = data?.caption || '';
      return (
        <figure>
          {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
          <img src={src} alt={caption || 'article image'} style={{ maxWidth: '100%', height: 'auto' }} />
          {caption ? <figcaption dangerouslySetInnerHTML={{ __html: sanitize(caption) }} /> : null}
        </figure>
      );
    }

    case 'list': {
      const items = Array.isArray(data?.items) ? data.items : [];
      if (!items.length) return null;
      if (data.style === 'ordered') {
        return (
          <ol>
            {items.map((it, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: sanitize(it) }} />
            ))}
          </ol>
        );
      }
      return (
        <ul>
          {items.map((it, i) => (
            <li key={i} dangerouslySetInnerHTML={{ __html: sanitize(it) }} />
          ))}
        </ul>
      );
    }

    case 'quote': {
      // Support both shapes: Editor.js ({text, caption}) and your simple blocks ({content, cite})
      const text = sanitize(data?.text ?? data?.content ?? '');
      const caption = sanitize(data?.caption ?? data?.cite ?? '');
    
      return (
        <figure className="article-quote">
          <blockquote>
            <em dangerouslySetInnerHTML={{ __html: text }} />
          </blockquote>
          {caption ? (
            <figcaption>
              - <span dangerouslySetInnerHTML={{ __html: caption }} />
            </figcaption>
          ) : null}
        </figure>
      );
    }
    

    case 'delimiter':
      return <hr />;

    case 'code':
      return (
        <pre>
          <code>{data.code || ''}</code>
        </pre>
      );

    case 'table': {
      const rows = Array.isArray(data?.content) ? data.content : [];
      if (!rows.length) return null;
      return (
        <table>
          <tbody>
            {rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) => (
                  <td key={c} dangerouslySetInnerHTML={{ __html: sanitize(cell) }} />
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }

    // Add more Editor.js plugins here if you use them (embed, checklist, etc.)

    default:
      return null;
  }
};

const Article = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [status, setStatus] = useState({ loading: true, error: null });
  const { token, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const reload = async () => {
    try {
        setStatus({ loading: true, error: null });
        const { data } = await fetchArticleById(id);
        setArticle(data);
        document.title = `${data?.title ?? 'Article'} – Ahab's Dream`;
        setStatus({ loading: false, error: null });
    } catch (err) {
        const msg = err?.response?.data?.message || err?.message || 'Failed to load article';
        setStatus({ loading: false, error: msg });
    }
  }

  useEffect(() => {
    reload();
  }, [id]);

  const handleTogglePublish = async () => {
    if (!article) return;
    setBusy(true);
    try {
      if (article.published) await unpublishArticle(article.id);
      else await publishArticle(article.id);
      await reload();
    } catch (e) {
      console.error(e);
      alert('Failed to update publish status.');
    } finally {
      setBusy(false);
    }
  };
  
  const handleEdit = () => {
    if (!article) return;
    navigate('/dashboard', { state: { draftId: article.id } });
  };
  
  const handleDelete = async () => {
    if (!article) return;
    if (!window.confirm('Delete this article? This cannot be undone.')) return;
    setBusy(true);
    try {
      await deleteArticle(article.id);
      navigate(`/articleList/${(article.category || 'blog').toLowerCase()}`);
    } catch (e) {
      console.error(e);
      alert('Failed to delete article.');
    } finally {
      setBusy(false);
    }
  };
  

  const editorBlocks = useEditorBlocks(article?.blocks);

  // --- Optional ultra-short legacy fallback (delete if you truly don't need it) ---
  // If you had old drafts like [{type:'paragraph', content:'...'}], map once:
  const legacyBlocks = useMemo(() => {
    if (!Array.isArray(article?.blocks)) return null;
    if (!article.blocks.every(b => 'type' in b && 'content' in b)) return null;
    return article.blocks.map(b => (
      b.type === 'paragraph' ? { type: 'paragraph', data: { text: b.content } }
      : b.type === 'heading' ? { type: 'header', data: { level: 1, text: b.content } }
      : b.type === 'subheading' ? { type: 'header', data: { level: 2, text: b.content } }
      : b.type === 'image' ? { type: 'image', data: { url: b.content } }
      : b.type === 'quote' ? { type: 'quote', data: { text: b.content, caption: b.cite || '' } }
      : null
    )).filter(Boolean);
  }, [article?.blocks]);
  const blocksToRender = editorBlocks.length ? editorBlocks : (legacyBlocks || []);
  // -------------------------------------------------------------------------------

  if (status.loading) {
    return (
      <div className="article">
        <div className="skeleton-title" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
        <div className="skeleton-line" />
      </div>
    );
  }

  if (status.error || !article) {
    return <p style={{ padding: '2rem' }}>{status.error || 'Article not found'}</p>;
  }

  return (
    <div className="article">
      {token && article && (
        <div className='admin-toolbar'>
            <button onClick={handleEdit} disabled={busy}>Edit</button>
            <button onClick={handleTogglePublish} disabled={busy}>
                {article.published ? 'Unpublish' : 'Publish'}
            </button>
            <button onClick={handleDelete} disabled={busy}>Delete</button>
        </div>
      )}
      <h1 className="article-title">{article.title}</h1>
      {article.author?.email && <p className="article-meta">By {article.author.email}</p>}

      {blocksToRender.map((block, i) => (
        <div key={i}><EditorBlock block={block} /></div>
      ))}
      <div className="comments-wrap">
        <Comments articleId={Number(id)} currentUser={user || null}/>
      </div>
    </div>
  );
};

export default Article;

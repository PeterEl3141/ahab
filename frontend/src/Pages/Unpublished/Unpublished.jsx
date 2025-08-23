import React, { useEffect, useState } from 'react';
import './Unpublished.css';
import { useNavigate } from 'react-router-dom';
import { fetchArticles, deleteArticle, publishArticle } from '../../api/articles';

const Unpublished = () => {
  const [unpublishedArticles, setUnpublishedArticles] = useState([]);
  const [publishing, setPublishing] = useState({}); // { [id]: true } for per-row spinner/disable
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadDrafts = async () => {
    try {
      setLoading(true);
      setError('');
      const { data } = await fetchArticles(undefined, false); // published=false
      setUnpublishedArticles(Array.isArray(data) ? data : data?.items || []);
    } catch (e) {
      console.error(e);
      setError('Could not load drafts. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDrafts();
  }, []);

  const handlePublish = async (id) => {
    // optimistic: remove immediately; fall back to refetch on error
    setPublishing((m) => ({ ...m, [id]: true }));
    setUnpublishedArticles((prev) => prev.filter((d) => d.id !== id));
    try {
      await publishArticle(id);
      // optional: toast/snackbar here
    } catch (e) {
      console.error(e);
      alert('Failed to publish. Restoring the item.');
      // restore by refetching (simplest)
      loadDrafts();
    } finally {
      setPublishing((m) => ({ ...m, [id]: false }));
    }
  };

  const handleView = (draft) => {
    navigate('/dashboard', { state: { draftId: draft.id } });
    // If you move to /dashboard/:id later:
    // navigate(`/dashboard/${draft.id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this draft? This cannot be undone.')) return;
    try {
      await deleteArticle(id);
      setUnpublishedArticles(prev => prev.filter(d => d.id !== id));
    } catch (e) {
      console.error(e);
      alert('Failed to delete draft. Please try again.');
    }
  };

  return (
    <div className="unpublished-container">
      <h1>Unpublished Articles</h1>

      {loading && <p>Loading drafts…</p>}
      {!loading && error && <p className="error">{error}</p>}
      {!loading && !error && unpublishedArticles.length === 0 && <p>No drafts yet.</p>}

      {!loading && !error && unpublishedArticles.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date Created</th>
              <th>Last Updated</th>
              <th>Category</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {unpublishedArticles.map((draft) => (
              <tr key={draft.id}>
                <td>{draft.title || '(Untitled)'}</td>
                <td>{draft.createdAt ? new Date(draft.createdAt).toLocaleDateString() : '—'}</td>
                <td>{draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString() : '—'}</td>
                <td>{draft.category || 'Uncategorized'}</td>
                <td className="actions">
                  <button onClick={() => handleView(draft)}>View / Edit</button>
                  <button 
                    onClick={() => handlePublish(draft.id)}
                    disabled={!!publishing[draft.id]}
                    title="Publish this draft">{publishing[draft.id] ? 'Publishing…' : 'Publish'}
                  </button>
                  <button onClick={() => handleDelete(draft.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Unpublished;

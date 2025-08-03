import React, { useEffect, useState } from 'react';
import './Unpublished.css';

const Unpublished = () => {
  const [unpublishedArticles, setUnpublishedArticles] = useState([]);
  const handleView = (draft) => {
    localStorage.setItem('currentDraft', JSON.stringify(draft));
    window.location.href = '/dashboard'; // You can use `useNavigate` if preferred
  };
  
  const handleDelete = (id) => {
    const updated = unpublishedArticles.filter(d => d.id !== id);
    setUnpublishedArticles(updated);
    localStorage.setItem('unpublished', JSON.stringify(updated));
  };
  

  useEffect(() => {
    const stored = localStorage.getItem('unpublished');
    if (stored) {
      try {
        setUnpublishedArticles(JSON.parse(stored));
      } catch (err) {
        console.error('Error parsing unpublished articles from localStorage', err);
        setUnpublishedArticles([]);
      }
    }
  }, []);

  return (
    <div className="unpublished-container">
      <h1>Unpublished Articles</h1>
      {unpublishedArticles.length === 0 ? (
        <p>No drafts yet.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Date Created</th>
              <th>Last Updated</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            {unpublishedArticles.map((draft) => (
              <tr key={draft.id}>
                <td>{draft.title || '(Untitled)'}</td>
                <td>{new Date(draft.createdAt).toLocaleDateString()}</td>
                <td>{new Date(draft.updatedAt).toLocaleDateString()}</td>
                <td>{draft.category || 'Uncategorized'}</td>
                <td>
                    <button onClick={() => handleView(draft)}>View / Edit</button>
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

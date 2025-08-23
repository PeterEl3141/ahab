import React, { useRef, useState } from 'react';
import { uploadImage } from '../../../api/articles';

const ImageBlock = ({ content, onImageChange }) => {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const onPick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true); setErr('');
    try {
      const { url } = await uploadImage(file); // backend should return { url: '/uploads/...' }
      onImageChange(url);
    } catch (e) {
      setErr('Upload failed');
      console.error(e);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="image-block">
      {content ? (
        <img src={content} alt="selected" style={{ maxWidth: '100%', height: 'auto' }} />
      ) : (
        <div className="image-placeholder" onClick={() => inputRef.current?.click()}>
          {busy ? 'Uploading…' : 'Click to choose an image'}
        </div>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onPick}
      />
      {content && (
        <div style={{ marginTop: 8 }}>
          <button onClick={() => inputRef.current?.click()} disabled={busy}>Replace</button>
          <button onClick={() => onImageChange(null)} disabled={busy} style={{ marginLeft: 8 }}>Remove</button>
        </div>
      )}
      {err && <div className="error">{err}</div>}
    </div>
  );
};

export default ImageBlock;

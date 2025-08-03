import React, { useRef } from 'react';
import './ImageBlock.css'; // optional styling

const ImageBlock = ({ content, onImageChange }) => {
  const fileInputRef = useRef();

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      onImageChange(reader.result); // base64 string
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="image-block">
      {content ? (
        <img src={content} alt="uploaded" className="image-preview" />
      ) : (
        <div className="image-upload-placeholder" onClick={() => fileInputRef.current.click()}>
          <span className="plus-icon">+</span>
        </div>
      )}
      <input
        type="file"
        accept="image/*"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
    </div>
  );
};

export default ImageBlock;

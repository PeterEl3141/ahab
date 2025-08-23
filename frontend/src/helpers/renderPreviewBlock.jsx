export const renderPreviewBlock = (block, i) => {
    if (!block) return null;
  
    const text = block.content ?? block.data?.text ?? '';
    const imgSrc = block.content ?? block.data?.url ?? '';
  
    switch (block.type) {
      case 'heading':
        return <h2 key={i} style={{ margin: '0 0 .5rem' }}>{text}</h2>;
      case 'subheading':
        return <h3 key={i} style={{ margin: '0 0 .5rem', opacity: 0.85 }}>{text}</h3>;
      case 'paragraph':
        return <p key={i} style={{ margin: '.5rem 0', lineHeight: 1.6 }}>{text}</p>;
      case 'image':
        return imgSrc ? (
          <img
            key={i}
            src={imgSrc}
            alt=""
            style={{ width: '100%', maxHeight: 240, objectFit: 'cover', borderRadius: 6 }}
          />
        ) : null;
      default:
        return null;
    }
  };
  
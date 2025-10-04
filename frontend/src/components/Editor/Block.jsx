import React from 'react';
import HeadingBlock from './blocks/HeadingBlock';
import SubheadingBlock from './blocks/SubheadingBlock';
import ParagraphBlock from './blocks/ParagraphBlock';
import ImageBlock from './blocks/ImageBlock';
import QuoteBlock from './blocks/QuoteBlock';

const Block = ({ block, isPreview = false, onUpdate, onImageChange }) => {
    if (!block) return null;
  
    if (isPreview) {
      switch (block.type) {
        case 'heading':
          return <h1>{block.content}</h1>;
        case 'subheading':
          return <h2>{block.content}</h2>;
        case 'paragraph':
          return <p>{block.content}</p>;
        case 'quote':
          return <p>{block.content}</p>;
        case 'image':
          return block.content ? <img src={block.content} alt="preview" /> : null;
        default:
          return null;
      }
    }
  
    // Editable mode
    switch (block.type) {
      case 'heading':
        return <HeadingBlock content={block.content} onUpdate={onUpdate} />;
      case 'subheading':
        return <SubheadingBlock content={block.content} onUpdate={onUpdate} />;
      case 'paragraph':
        return <ParagraphBlock content={block.content} onUpdate={onUpdate} />;
      case 'quote':
        return <QuoteBlock block={block} isPreview={isPreview} onUpdate={onUpdate} />;
      case 'image':
        return (
          <ImageBlock
            content={block.content}
            onImageChange={(url) => onImageChange(block.id, url)}
          />
        );
      default:
        return null;
    }
  };
  
export default Block;

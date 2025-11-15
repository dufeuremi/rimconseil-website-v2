import React from 'react';
import { API_BASE_URL } from '../App';
import { processImageUrl } from '../utils/imageUtils';
import './blocks/EditableBlock.css';

// Helper function to safely parse HTML content
export function cleanHtmlContent(html) {
  if (typeof html !== 'string') return '';
  
  const temp = document.createElement('div');
  
  // Handle escaped HTML
  if (html.includes('&lt;') || html.includes('&gt;')) {
    const textArea = document.createElement('textarea');
    textArea.innerHTML = html;
    temp.innerHTML = textArea.value;
  } else {
    temp.innerHTML = html;
  }
  
  // Remove inline styles
  temp.querySelectorAll('a, b, i, strong, em, u, s').forEach(el => {
    el.removeAttribute('style');
  });
  
  return temp.innerHTML;
}

// Block components
const TitleBlock = ({ content }) => (
  <h1 className="editable-block title" dangerouslySetInnerHTML={{ __html: cleanHtmlContent(content) }} />
);

const SubtitleBlock = ({ content }) => (
  <h2 className="editable-block subtitle" dangerouslySetInnerHTML={{ __html: cleanHtmlContent(content) }} />
);

const TextBlock = ({ content, variant = '' }) => {
  const className = variant ? `editable-block text-${variant}` : 'editable-block text';
  return <div className={className} dangerouslySetInnerHTML={{ __html: cleanHtmlContent(content) }} />;
};

const ImageBlock = ({ content, alt }) => {
  const [imageLoaded, setImageLoaded] = React.useState(false);
  const [imageError, setImageError] = React.useState(false);
  
  const processedUrl = processImageUrl(content);
  
  if (!processedUrl) {
    return (
      <div className="article-image-placeholder">
        <div className="article-image-placeholder-icon">📷</div>
        <div>Image non disponible</div>
      </div>
    );
  }
  return (
    <div className="article-image-container">
      <img
        src={processedUrl}
        alt={alt || "Image de l'article"}
        className="article-image"
        style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
        onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
      />
      {alt && (
        <div className="article-image-caption">{alt}</div>
      )}
    </div>
  );
};

const AnnotationBlock = ({ content }) => (
  <div className="editable-block annotation" dangerouslySetInnerHTML={{ __html: cleanHtmlContent(content) }} />
);

// Component mapping based on block type
const BLOCK_COMPONENTS = {
  'Titre': TitleBlock,
  'Sous-Titre': SubtitleBlock,
  'Texte': TextBlock,
  'Texte 2 col.': props => <TextBlock {...props} variant="2-col" />,
  'Texte 3 col.': props => <TextBlock {...props} variant="3-col" />,
  'Annotation': AnnotationBlock,
  'Image': ImageBlock,
};

// Block wrapper component
const BlockWrapper = ({ children }) => (
  <div style={{ marginBottom: '1.5rem' }}>
    {children}
  </div>
);

// ArticleRenderer component
const ArticleRenderer = ({ contentJson, isEdit = false, isDashboard = false }) => {
  // Parse content if it's a string
  let parsedContent;
  if (typeof contentJson === 'string') {
    try {
      parsedContent = JSON.parse(contentJson);
    } catch (e) {
      console.error("Error parsing content_json:", e);
      return <div className="editable-block text">{contentJson}</div>;
    }
  } else {
    parsedContent = contentJson;
  }

  // Validate content structure
  if (!parsedContent?.blocks || typeof parsedContent !== 'object') {
    console.warn("Invalid content_json structure:", parsedContent);
    const fallbackContent = typeof parsedContent === 'string' ? parsedContent : JSON.stringify(parsedContent);
    return <div className="editable-block text">{fallbackContent}</div>;
  }

  // Convert to array and sort by order
  const blocksArray = Object.entries(parsedContent.blocks)
    .map(([name, blockData]) => ({ ...blockData, name }))
    .sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <div style={{ textAlign: 'left' }} className="is-rendering">
      {blocksArray.map((block, index) => {
        const { type, content, alt, name } = block;
        // On retire les images de corps de texte en mode édition/dashboard
        if ((isEdit || isDashboard) && type === 'Image') {
          return null;
        }
        const BlockComponent = BLOCK_COMPONENTS[type] || TextBlock;
        return (
          <BlockWrapper key={name || `block-${index}`}>
            <BlockComponent content={content} alt={alt} />
          </BlockWrapper>
        );
      })}
    </div>
  );
};

export default ArticleRenderer; 
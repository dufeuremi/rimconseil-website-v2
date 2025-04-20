import React from 'react';
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

const ImageBlock = ({ content, alt }) => (
  <img 
    src={content} 
    alt={alt || 'Article image'} 
    className="max-width-100 display-block margin-auto"
    style={{ 
      maxWidth: '100%',
      height: 'auto',
      display: 'block',
      margin: '1rem auto',
      borderRadius: '4px'
    }}
  />
);

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
const ArticleRenderer = ({ contentJson }) => {
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
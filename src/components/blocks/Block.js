import React from 'react';
import './Block.css';

// Function to get friendly names for block types
const getFriendlyBlockName = (blockName) => {
  if (!blockName) return '';
  
  // Extract type from name like "title_1" -> "Title"
  const parts = blockName.split('_');
  if (parts.length < 2) return blockName;
  
  // Get base type
  const baseType = parts[0];
  
  // Capitalize first letter
  return baseType.charAt(0).toUpperCase() + baseType.slice(1);
};

const Block = ({ children, onDelete, onMoveUp, onMoveDown, isFirst, isLast, isEditing, blockName, ...props }) => {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete();
  };

  const handleMoveUp = (e) => {
    e.stopPropagation();
    onMoveUp();
  };

  const handleMoveDown = (e) => {
    e.stopPropagation();
    onMoveDown();
  };

  // Get friendly display name
  const displayName = getFriendlyBlockName(blockName);

  return (
    <div className={`content-block ${isEditing ? 'is-editing' : ''}`} {...props}>
      <div className="block-controls">
        {blockName && (
          <span className="block-name" title="Type de bloc" style={{ 
            fontSize: '10px', 
            color: '#666', 
            marginRight: '8px',
            padding: '2px 5px',
            background: '#f0f0f0',
            borderRadius: '3px'
          }}>
            {displayName}
          </span>
        )}
        <button 
          className="move-block-button" 
          onClick={handleMoveUp}
          disabled={isFirst}
          title="Déplacer vers le haut"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 4L4 8M8 4L12 8M8 4V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button 
          className="move-block-button" 
          onClick={handleMoveDown}
          disabled={isLast}
          title="Déplacer vers le bas"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12L4 8M8 12L12 8M8 12V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button 
          className="delete-block" 
          onClick={handleDelete}
          title="Supprimer"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>
      <div className="block-content">
        {children}
      </div>
    </div>
  );
};

export default Block; 
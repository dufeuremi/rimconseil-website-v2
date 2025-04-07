import React, { useState, useEffect, useRef } from 'react';
import './EditableBlock.css';

const EditableBlock = ({ initialContent, onChange, placeholder, tag: Tag = 'div', className = '', onEditingChange }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(initialContent || '');
  const contentRef = useRef(null);

  useEffect(() => {
    if (initialContent !== undefined) {
      setContent(initialContent);
    }
  }, [initialContent]);

  // Fonction pour positionner le curseur correctement
  const positionCursorAtEnd = () => {
    if (!contentRef.current) return;
    
    const range = document.createRange();
    const selection = window.getSelection();
    
    // Sélectionne le contenu du nœud de texte
    range.selectNodeContents(contentRef.current);
    // Place le curseur à la fin du contenu
    range.collapse(false);
    
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onEditingChange?.(false);
    // Si le contenu ne contient que des espaces, on le considère comme vide
    const trimmedContent = content.trim();
    if (trimmedContent === '') {
      setContent('');
      onChange('');
    } else {
      onChange(content);
    }
  };

  const handleInput = (e) => {
    const newContent = e.target.innerText;
    setContent(newContent);
    onChange(newContent);
    // S'assurer que le curseur reste bien positionné
    window.requestAnimationFrame(() => {
      if (isEditing) {
        // Préserver la position du curseur après la mise à jour du contenu
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    });
  };

  const handleFocus = () => {
    setIsEditing(true);
    onEditingChange?.(true);
    
    // Attendre que le DOM soit mis à jour avant de positionner le curseur
    window.requestAnimationFrame(() => {
      positionCursorAtEnd();
    });
  };

  const handleKeyDown = (e) => {
    // Si l'utilisateur appuie sur Backspace et que le contenu est vide
    if (e.key === 'Backspace' && contentRef.current?.innerText.trim() === '') {
      setContent('');
      onChange('');
    }
  };

  return (
    <Tag
      ref={contentRef}
      className={`editable-block ${className} ${isEditing ? 'is-editing' : ''} ${!content ? 'is-empty' : ''}`}
      contentEditable
      onFocus={handleFocus}
      onBlur={handleBlur}
      onInput={handleInput}
      onKeyDown={handleKeyDown}
      suppressContentEditableWarning
      data-placeholder={placeholder || "rédiger..."}
    >
      {content}
    </Tag>
  );
};

export default EditableBlock; 
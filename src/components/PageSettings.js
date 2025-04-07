import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from './Input';
import Button from './Button';
import Text from './Text';
import Dropdown from './Dropdown';
import Block from './blocks/Block';
import EditableBlock from './blocks/EditableBlock';
import ImageBlock from './blocks/ImageBlock';
import './PageSettings.css';

const BLOCK_TYPES = [
  'Titre',
  'Sous-Titre',
  'Texte',
  'Texte 2 col.',
  'Texte 3 col.',
  'Image',
  'Annotation'
];

const getBlockConfig = (type) => {
  switch (type) {
    case 'Titre':
      return { tag: 'h1', className: 'title', placeholder: 'Écrire un titre...' };
    case 'Sous-Titre':
      return { tag: 'h2', className: 'subtitle', placeholder: 'Écrire un sous-titre...' };
    case 'Texte':
      return { tag: 'div', className: 'text', placeholder: 'Écrire du texte...' };
    case 'Texte 2 col.':
      return { tag: 'div', className: 'text-2-col', placeholder: 'Écrire du texte en 2 colonnes...' };
    case 'Texte 3 col.':
      return { tag: 'div', className: 'text-3-col', placeholder: 'Écrire du texte en 3 colonnes...' };
    case 'Annotation':
      return { tag: 'div', className: 'annotation', placeholder: 'Écrire une annotation...' };
    default:
      return { tag: 'div', className: 'text', placeholder: 'Écrire du texte...' };
  }
};

const PageSettings = ({ onSave, initialData }) => {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState(initialData?.blocks || []);
  const [lastAddedBlockId, setLastAddedBlockId] = useState(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    path: initialData?.path || 'rimconseil.com/',
    date: initialData?.date || '',
    category: initialData?.category || '',
  });

  useEffect(() => {
    if (lastAddedBlockId) {
      const element = document.querySelector(`[data-block-id="${lastAddedBlockId}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        const editableElement = element.querySelector('[contenteditable="true"]');
        if (editableElement) {
          setTimeout(() => {
            editableElement.focus();
          }, 100);
        }
      }
      setLastAddedBlockId(null);
    }
  }, [lastAddedBlockId]);

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (typeof onSave === 'function') {
      onSave({ ...formData, blocks });
    } else {
      console.log('Données sauvegardées :', { ...formData, blocks });
    }
  };

  const handleBack = () => {
    navigate('/dashboard/pages');
  };

  const handleAddBlock = (blockType) => {
    const newBlockId = Date.now();
    setBlocks(prev => [...prev, {
      id: newBlockId,
      type: blockType,
      content: '',
      isEditing: true
    }]);
    setLastAddedBlockId(newBlockId);
  };

  const handleDeleteBlock = (blockId) => {
    setBlocks(prev => prev.filter(block => block.id !== blockId));
  };

  const handleBlockContentChange = (blockId, content) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, content } : block
    ));
  };

  const handleBlockEditingState = (blockId, isEditing) => {
    setBlocks(prev => prev.map(block => 
      block.id === blockId ? { ...block, isEditing } : block
    ));
  };

  const handleMoveBlock = (blockId, direction) => {
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === blockId);
      if (index === -1) return prev;
      
      const newBlocks = [...prev];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      if (newIndex < 0 || newIndex >= newBlocks.length) return prev;
      
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[newIndex];
      newBlocks[newIndex] = temp;
      
      return newBlocks;
    });
  };

  const renderBlock = (block, index, array) => {
    if (block.type === 'Image') {
      return (
        <Block 
          key={block.id} 
          onDelete={() => handleDeleteBlock(block.id)}
          onMoveUp={() => handleMoveBlock(block.id, 'up')}
          onMoveDown={() => handleMoveBlock(block.id, 'down')}
          isFirst={index === 0}
          isLast={index === array.length - 1}
          isEditing={block.isEditing}
          data-block-id={block.id}
        >
          <ImageBlock
            initialImage={block.content}
            onChange={(content) => handleBlockContentChange(block.id, content)}
          />
        </Block>
      );
    }

    const config = getBlockConfig(block.type);
    return (
      <Block 
        key={block.id} 
        onDelete={() => handleDeleteBlock(block.id)}
        onMoveUp={() => handleMoveBlock(block.id, 'up')}
        onMoveDown={() => handleMoveBlock(block.id, 'down')}
        isFirst={index === 0}
        isLast={index === array.length - 1}
        isEditing={block.isEditing}
        data-block-id={block.id}
      >
        <EditableBlock
          {...config}
          initialContent={block.content}
          onChange={(content) => handleBlockContentChange(block.id, content)}
          onEditingChange={(isEditing) => handleBlockEditingState(block.id, isEditing)}
        />
      </Block>
    );
  };

  return (
    <div className="page-settings">
      <div className="page-settings-header">
        <div className="header-left">
          <button className="back-button" onClick={handleBack}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <Text variant="h1">Page</Text>
        </div>
        <Button 
          variant="primary" 
          className="publish-button"
          onClick={() => console.log('Publication en cours...', { ...formData, blocks })}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 2L11 13M22 2L15 22L11 13M22 2L2 9L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Publier
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="settings-section">
          <Input
            label="Titre"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
          />
          <Input
            label="Chemin de l'article"
            value={formData.path}
            onChange={(e) => handleChange('path', e.target.value)}
          />
          <Input
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
          <Input
            label="Catégorie"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          />
        </div>

        <div className="content-section">
          <h1 className="section-title">Rédaction</h1>
          <div className="blocks-container">
            {blocks.map((block, index, array) => renderBlock(block, index, array))}
          </div>
          <div className="add-block-button">
            <Dropdown
              trigger={
                <Button variant="secondary">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Ajouter un block
                </Button>
              }
              items={BLOCK_TYPES}
              onSelect={handleAddBlock}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default PageSettings; 
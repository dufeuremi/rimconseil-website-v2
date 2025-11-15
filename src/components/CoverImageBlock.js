import React, { useState, useRef, useEffect } from 'react';
import imageCompression from 'browser-image-compression';
import { processImageUrl } from '../utils/imageUtils';
import './blocks/ImageBlock.css';

const CoverImageBlock = ({ initialImage, onChange }) => {
  // Gérer le cas où initialImage est soit une string (URL), soit un objet { preview, file }
  const getImageUrl = (img) => {
    if (!img) return '';
    if (typeof img === 'object' && img.preview) return img.preview;
    if (typeof img === 'string') return processImageUrl(img);
    return '';
  };

  const [image, setImage] = useState(getImageUrl(initialImage));
  const [isUploading, setIsUploading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef(null);
  const uniqueId = useRef(`cover-image-${Math.random().toString(36).substr(2, 9)}`).current;

  // Sync internal state with prop changes
  useEffect(() => {
    setImage(getImageUrl(initialImage));
    setImageLoaded(false);
    setImageError(false);
  }, [initialImage]);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      
      // Vérifier la taille du fichier (max 10 MB selon le backend, mais on compresse à 5 MB)
      const maxSize = 10 * 1024 * 1024; // 10 MB
      const fileSizeInMB = file.size / (1024 * 1024);
      
      console.log(`📸 Image sélectionnée: ${file.name}`);
      console.log(`📊 Taille: ${fileSizeInMB.toFixed(2)} MB`);
      
      if (file.size > maxSize) {
        alert('❌ Fichier trop volumineux (> 10 MB). Veuillez choisir une image plus petite.');
        setIsUploading(false);
        return;
      }
      
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        alert('❌ Veuillez sélectionner une image.');
        setIsUploading(false);
        return;
      }
      
      try {
        // Options de compression - max 5MB pour l'envoi au serveur
        const options = {
          maxSizeMB: 5,
          maxWidthOrHeight: 1920,
          useWebWorker: true,
          fileType: file.type
        };
        
        console.log(`📸 Image originale: ${file.name} (${fileSizeInMB.toFixed(2)} MB)`);
        
        // Compresser l'image si nécessaire
        const compressedFile = await imageCompression(file, options);
        const compressedSizeMB = compressedFile.size / (1024 * 1024);
        
        console.log(`✅ Image compressée: ${compressedFile.name} (${compressedSizeMB.toFixed(2)} MB)`);
        
        // Créer une preview locale avec URL.createObjectURL
        const previewUrl = URL.createObjectURL(compressedFile);
        setImage(previewUrl);
        // Passer à la fois la preview ET le fichier compressé
        onChange({
          preview: previewUrl,
          file: compressedFile,
          fileName: compressedFile.name,
          fileSize: compressedFile.size
        });
      } catch (error) {
        console.error('Erreur lors du traitement de l\'image:', error);
        alert('Erreur lors du traitement de l\'image. Veuillez réessayer avec une autre image.');
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent form submission
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleRemoveImage = (e) => {
    e.preventDefault();
    setImage('');
    // Indiquer qu'on veut supprimer l'image (chaîne vide selon la doc backend)
    onChange({ 
      preview: '', 
      file: null, 
      remove: true  // Flag pour indiquer la suppression
    });
  };

  return (
    <div className="image-block">
      {image ? (
        <div className="image-preview" style={{ position: 'relative' }}>
          <img
            src={image}
            alt="Image de couverture"
            style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            onError={e => { e.target.onerror = null; e.target.src = '/images/placeholder.jpg'; }}
          />
          <div className="image-preview-buttons">
            <button
              className="change-image-button"
              onClick={handleButtonClick}
              type="button"
            >
              Changer l'image
            </button>
            <button
              className="remove-image-button"
              onClick={handleRemoveImage}
              type="button"
            >
              Retirer
            </button>
          </div>
        </div>
      ) : (
        <div className="upload-container">
          <div className="upload-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <p>Cliquez pour ajouter une image</p>
            {isUploading && <p className="uploading-text">Chargement en cours...</p>}
          </div>
          <button
            className="upload-button"
            onClick={handleButtonClick}
            type="button"
          >
            Upload
          </button>
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        id={uniqueId}
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default CoverImageBlock; 
import React, { useState } from 'react';
import ErrorDialog from './ErrorDialog';
import imageCompression from 'browser-image-compression';
import { processImageUrl } from '../../utils/imageUtils';
import './ImageBlock.css';

const ImageBlock = ({ initialImage, onChange }) => {
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
  const [errorMsg, setErrorMsg] = useState("");

  React.useEffect(() => {
    setImage(getImageUrl(initialImage));
    setImageLoaded(false);
    setImageError(false);
  }, [initialImage]);

  const handleImageChange = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      // Vérifier la taille (max 10 MB, mais on compresse à 5 MB)
      const maxSize = 10 * 1024 * 1024;
      const fileSizeInMB = file.size / (1024 * 1024);
      if (file.size > maxSize) {
        setErrorMsg('❌ Fichier trop volumineux (> 10 MB). Veuillez choisir une image plus petite.');
        setIsUploading(false);
        return;
      }
      // Vérifier le type
      if (!file.type.startsWith('image/')) {
        setErrorMsg('❌ Veuillez sélectionner une image.');
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
        // Compresser l'image
        const compressedFile = await imageCompression(file, options);
        const compressedSizeMB = compressedFile.size / (1024 * 1024);
        console.log(`✅ Image compressée: ${compressedFile.name} (${compressedSizeMB.toFixed(2)} MB)`);
        // Créer une preview locale avec URL.createObjectURL
        const previewUrl = URL.createObjectURL(compressedFile);
        setImage(previewUrl);
        // Passer le fichier compressé ET la preview
        try {
          await onChange({
            preview: previewUrl,
            file: compressedFile,
            fileName: compressedFile.name,
            fileSize: compressedFile.size
          });
        } catch (uploadError) {
          setErrorMsg('Erreur lors de l\'envoi de l\'image au serveur.');
        }
        setIsUploading(false);
      } catch (error) {
        console.error('Erreur lors de la compression:', error);
        setErrorMsg('Erreur lors du traitement de l\'image.');
        setIsUploading(false);
      }
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent form submission
    document.getElementById('image-upload').click();
  };

  return (
    <div className="image-block">
      <ErrorDialog message={errorMsg} onClose={() => setErrorMsg("")} />
      {image ? (
        <div className="image-preview" style={{ position: 'relative' }}>
          {!imageLoaded && !imageError && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: '#f8f9fa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1,
              fontSize: '0.85rem',
              color: '#6c757d'
            }}>
              Chargement...
            </div>
          )}
          <img
            src={image}
            alt="Contenu"
            onLoad={() => { setImageLoaded(true); setImageError(false); }}
            onError={() => { setImageLoaded(false); setImageError(true); }}
            style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
          />
          <button 
            className="change-image-button"
            onClick={handleButtonClick}
          >
            Changer l'image
          </button>
        </div>
      ) : (
        <div className="upload-container">
          <div className="upload-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 16L8.586 11.414C8.96106 11.0391 9.46967 10.8284 10 10.8284C10.5303 10.8284 11.0389 11.0391 11.414 11.414L16 16M14 14L15.586 12.414C15.9611 12.0391 16.4697 11.8284 17 11.8284C17.5303 11.8284 18.0389 12.0391 18.414 12.414L20 14M14 8H14.01M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
              {!imageLoaded && !imageError && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: '#f8f9fa',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 1,
                  fontSize: '0.85rem',
                  color: '#6c757d'
                }}>
                  Chargement...
                </div>
              )}
            <p>Cliquez pour ajouter une image</p>
            {isUploading && <p className="uploading-text">Chargement en cours...</p>}
          </div>
                onLoad={() => { setImageLoaded(true); setImageError(false); }}
                onError={() => { setImageLoaded(false); setImageError(true); }}
                style={{ opacity: imageLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
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
        id="image-upload"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageBlock; 
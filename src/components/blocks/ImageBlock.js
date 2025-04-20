import React, { useState } from 'react';
import './ImageBlock.css';

const ImageBlock = ({ initialImage, onChange }) => {
  const [image, setImage] = useState(initialImage || '');
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const imageData = reader.result;
        setImage(imageData);
        onChange(imageData);
        setIsUploading(false);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = (e) => {
    e.preventDefault(); // Prevent form submission
    document.getElementById('image-upload').click();
  };

  return (
    <div className="image-block">
      {image ? (
        <div className="image-preview">
          <img src={image} alt="Contenu" />
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
        id="image-upload"
        accept="image/*"
        onChange={handleImageChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageBlock; 
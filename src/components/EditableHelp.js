import React, { useState } from 'react';
import styled from 'styled-components';

const HelpButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 80px;
  background: #2196F3;
  color: white;
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 2px 10px rgba(0,0,0,0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background: #1976D2;
  }
`;

const HelpModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
`;

const HelpContent = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  margin: 1rem;
`;

const HelpTitle = styled.h2`
  margin-top: 0;
  color: #333;
  font-size: 1.5rem;
`;

const HelpSection = styled.div`
  margin-bottom: 1.5rem;
`;

const HelpSubtitle = styled.h3`
  color: #2196F3;
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
`;

const HelpList = styled.ul`
  line-height: 1.6;
  color: #666;
`;

const HelpStep = styled.li`
  margin-bottom: 0.5rem;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;

  &:hover {
    color: #333;
  }
`;

const EditableHelp = () => {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <HelpButton onClick={() => setShowHelp(true)} title="Aide pour l'édition">
        ?
      </HelpButton>

      {showHelp && (
        <HelpModal onClick={() => setShowHelp(false)}>
          <HelpContent onClick={(e) => e.stopPropagation()}>
            <CloseButton onClick={() => setShowHelp(false)}>&times;</CloseButton>
            
            <HelpTitle>Guide d'édition de contenu</HelpTitle>

            <HelpSection>
              <HelpSubtitle>🎯 Comment modifier le texte</HelpSubtitle>
              <HelpList>
                <HelpStep><strong>Cliquez</strong> sur n'importe quel texte souligné en bleu</HelpStep>
                <HelpStep><strong>Modifiez</strong> le contenu directement</HelpStep>
                <HelpStep><strong>Cliquez ailleurs</strong> pour sauvegarder automatiquement</HelpStep>
              </HelpList>
            </HelpSection>

            <HelpSection>
              <HelpSubtitle>✨ Outils de formatage</HelpSubtitle>
              <HelpList>
                <HelpStep><strong>B</strong> - Mettre en gras (Ctrl+B)</HelpStep>
                <HelpStep><strong>I</strong> - Mettre en italique (Ctrl+I)</HelpStep>
                <HelpStep><strong>🔗</strong> - Ajouter un lien</HelpStep>
              </HelpList>
            </HelpSection>

            <HelpSection>
              <HelpSubtitle>💾 Sauvegarde</HelpSubtitle>
              <HelpList>
                <HelpStep>La sauvegarde est <strong>automatique</strong> quand vous cliquez ailleurs</HelpStep>
                <HelpStep>Un message "✅ Sauvegardé" confirme l'enregistrement</HelpStep>
                <HelpStep>Utilisez le bouton "Enregistrer" en haut à droite pour sauvegarder la page complète</HelpStep>
              </HelpList>
            </HelpSection>

            <HelpSection>
              <HelpSubtitle>⚠️ Important</HelpSubtitle>
              <HelpList>
                <HelpStep>Les modifications sont visibles uniquement après sauvegarde</HelpStep>
                <HelpStep>Utilisez "Annuler" pour revenir à la version précédente</HelpStep>
                <HelpStep>Le statut de connexion s'affiche en bas à gauche</HelpStep>
              </HelpList>
            </HelpSection>

            <HelpSection>
              <HelpSubtitle>🛠️ En cas de problème</HelpSubtitle>
              <HelpList>
                <HelpStep>Rafraîchissez la page (F5) pour récupérer la dernière version</HelpStep>
                <HelpStep>Vérifiez que vous êtes bien connecté (statut en bas à gauche)</HelpStep>
                <HelpStep>Contactez l'administrateur si les problèmes persistent</HelpStep>
              </HelpList>
            </HelpSection>
          </HelpContent>
        </HelpModal>
      )}
    </>
  );
};

export default EditableHelp; 
# 📷 Guide d'Intégration des Images - Frontend React

## 🎯 Vue d'ensemble

Ce guide explique comment utiliser correctement les images des articles et actualités depuis votre backend selon la documentation officielle.

## 🔧 Architecture

### Fichiers créés/modifiés :
- `src/utils/imageUtils.js` - Utilitaires d'images
- `src/components/SmartImage.js` - Composant intelligent pour images
- `src/utils/imageUtils.test.js` - Tests et exemples

## 📋 Logique de Priorité

Selon la documentation backend, chaque article/actualité peut avoir :
- **`cover_img_path`** : Image de couverture (priorité 1)
- **`img_path`** : Image principale (priorité 2)

**Ordre de priorité pour l'affichage :** `cover_img_path` → `img_path` → `placeholder`

## 🛠️ Fonctions Utilitaires

### `getDisplayImage(item)`
Détermine automatiquement quelle image afficher selon la priorité.

```javascript
import { getDisplayImage } from '../utils/imageUtils';

const article = {
  cover_img_path: "/uploads/cover-123.jpg",
  img_path: "/uploads/main-123.jpg"
};

const imageUrl = getDisplayImage(article);
// Résultat: "http://localhost:4000/uploads/cover-123.jpg"
```

### `processImageUrl(imagePath)`
Traite une URL d'image pour gérer les différents formats.

```javascript
processImageUrl("/uploads/image-123.jpg")  
// → "http://localhost:4000/uploads/image-123.jpg"

processImageUrl("data:image/png;base64,...")  
// → "data:image/png;base64,..." (inchangé)
```

### `getImageWithFallback(item, preferCover)`
Obtient une image avec choix de priorité.

```javascript
getImageWithFallback(article, true)   // Préfère cover_img_path
getImageWithFallback(article, false)  // Préfère img_path
```

## 🎨 Composant SmartImage

Composant React intelligent avec fallback automatique.

```jsx
import SmartImage from '../components/SmartImage';

function ArticleCard({ article }) {
  return (
    <div className="article-card">
      <SmartImage 
        item={article}
        alt={article.titre}
        className="article-image"
        preferCover={true}  // true pour listes, false pour détail
      />
      <h3>{article.titre}</h3>
    </div>
  );
}
```

### Props du SmartImage :
- `item` : Objet article/actualité
- `alt` : Texte alternatif
- `className` : Classes CSS
- `preferCover` : Préférer cover_img_path (true) ou img_path (false)
- `fallback` : Image de fallback (défaut: "/images/placeholder.jpg")

## 📱 Exemples d'Usage

### 1. Liste d'Articles (utilise cover_img_path en priorité)

```jsx
function ArticlesList() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/articles')
      .then(r => r.json())
      .then(setArticles);
  }, []);

  return (
    <div className="articles-list">
      {articles.map(article => (
        <div key={article.id} className="article-card">
          <SmartImage 
            item={article}
            alt={article.titre}
            className="article-thumbnail"
            preferCover={true}
          />
          <div className="content">
            <h3>{article.titre}</h3>
            <p>{article.text_preview}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
```

### 2. Page Détail Article (utilise img_path en priorité)

```jsx
function ArticleDetail({ articleId }) {
  const [article, setArticle] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:4000/api/articles/${articleId}`)
      .then(r => r.json())
      .then(setArticle);
  }, [articleId]);

  if (!article) return <div>Chargement...</div>;

  return (
    <article>
      <h1>{article.titre}</h1>
      
      <SmartImage 
        item={article}
        alt={article.titre}
        className="article-hero-image"
        preferCover={false}  // Préfère img_path pour le détail
      />
      
      <div dangerouslySetInnerHTML={{ __html: article.content }} />
    </article>
  );
}
```

### 3. Composant Article Existant (mis à jour)

Le composant `Article.js` existant a été mis à jour pour utiliser automatiquement la nouvelle logique :

```jsx
// Avant
<Article coverImage={article.cover_img_path || article.img_path || ''} />

// Après - Plus besoin de gérer manuellement, c'est automatique !
<Article coverImage={article.img_path || article.cover_img_path || ''} />
```

## 🎭 CSS Recommandé

```css
.article-card {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  min-height: 150px;
}

.article-thumbnail {
  width: 200px;
  height: 150px;
  object-fit: cover;
  flex-shrink: 0;
}

.article-hero-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
  margin: 2rem 0;
}

/* Loading state */
.image-loading {
  opacity: 0.7;
  transition: opacity 0.3s ease;
}
```

## 🧪 Test Rapide

Pour tester que tout fonctionne :

```javascript
// Dans la console du navigateur
fetch('http://localhost:4000/api/articles')
  .then(r => r.json())
  .then(articles => {
    console.log('Premier article:', articles[0]);
    
    // Test de la fonction utilitaire
    import('../utils/imageUtils.js').then(({ getDisplayImage }) => {
      console.log('Image à afficher:', getDisplayImage(articles[0]));
    });
  });
```

## ⚠️ Points Importants

1. **URL complète requise** : Les chemins `/uploads/...` sont automatiquement préfixés avec `API_BASE_URL`

2. **Fallback automatique** : Si une image ne charge pas, le système essaie automatiquement l'autre image

3. **Performance** : Les images base64 sont supportées mais les URLs `/uploads/` sont recommandées

4. **Responsive** : Le composant SmartImage s'adapte automatiquement

## 🚀 Migration des Composants Existants

Pour migrer vos composants existants :

1. **Remplacer** `coverImage={article.cover_img_path || article.img_path || ''}` 
2. **Par** `coverImage={article.img_path || article.cover_img_path || ''}`
3. **Ou mieux** : Utiliser `SmartImage` pour une gestion complète

## 📞 Support

En cas de problème :
1. Vérifier que `API_BASE_URL` pointe vers `http://localhost:4000`
2. Vérifier que les images existent sur le serveur
3. Utiliser les outils de développement pour inspecter les requêtes réseau
4. Consulter `imageUtils.test.js` pour des exemples de test
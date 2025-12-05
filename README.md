# Atomic Clean Architecture - Frontend Demo

Une démo d'architecture frontend propre utilisant React, Three.js et une structure atomique (Atomic Design). Le projet est maintenant frontend-only, avec un système d'API configurable pour communiquer avec des services REST externes.

## Fonctionnalités

- **Architecture Atomique** : Composants organisés en atoms, molecules, organisms, pages.
- **3D avec Three.js** : Intégration de scènes 3D (cubes, personnages, Terre).
- **État Global** : Gestion d'état avec Redux Toolkit.
- **API REST** : Système flexible pour communiquer avec des APIs externes (configurable via `.env`).
- **i18n** : Translations stored per key with language sub-objects (ex: `app.title = { fr: 'Mon Application', en: 'My Application' }`).
-- **Docker** : Conteneurisation simple pour développement et build statique.
- **Styled Components** : Styles encapsulés via `styled-components` et thème centralisé.

## Technologies

- **React 19** avec Vite
- **Three.js** et React Three Fiber/Drei
- **Redux Toolkit** pour la gestion d'état
- **styled-components** pour le style des composants
- **Docker** pour la conteneurisation
- **ESLint** pour le linting

## Structure du Projet

```
code/
├── index.html
├── package.json
├── src/               # Code source React
│   ├── index.jsx
│   ├── components/
│   │   ├── atoms/
│   │   ├── molecules/
│   │   ├── organisms/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   ├── lib/
│   └── styles/
├── public/
├── .env
├── Dockerfile
├── Dockerfile.dev
├── vite.config.js
├── styles/
  ├── globals.css
  ├── theme.js
├── eslint.config.js
```

## Installation

### Avec Docker (recommandé)
1. Clone le repo :
   ```bash
   git clone https://github.com/Kataman7/atomic-clean-architecture.git
   cd atomic-clean-architecture
   ```

2. Lance les services :
   ```bash
   docker-compose up dev--build
   ```
  - Mode dev : `http://localhost:5173`

### Mise en prod

* ``docker compose up build --build -d``
* ``git checkout prod``
* ``docker compose run exporter``

### Configuration API
Modifie `code/.env` pour définir l'URL de l'API :
```
VITE_API_URL=http://votre-api.com
```

### Utilisation des Services API
## Exemples dans le Code

Le projet contient plusieurs exemples pratiques de React, Three.js, Redux et API. Voici un aperçu :

### Gestion d'État avec Redux et useState
- **Store Redux** (`src/lib/store/store.js`) : Configuration centralisée avec `configureStore`.
- **Slice Redux** (`src/lib/store/slices/counterSlice.js`) : Définition d'un état compteur avec `createSlice`, actions `increment`, `decrement`, `setValue`.
- **Utilisation dans un composant** (`src/pages/PagCounters.jsx`) :
  - `useSelector` pour lire l'état global.
  - `useDispatch` pour dispatcher des actions.
  - `useState` pour un état local alternatif.
  - `useEffect` pour synchroniser avec les params d'URL (`useParams`).
  - `useState` et `useEffect` pour gérer un compteur local.

### Composants Atomiques (Atomic Design)
- **Atom Button** (`src/components/atoms/AtmButton.jsx`) : Bouton simple avec props `label`, `onClick`, styles via `styled-components`.
## Notes & éléments manquants
- Le README listait `tailwind.config.js` et Tailwind CSS, mais le projet utilise `styled-components` pour le style.
- Fichier `.env` Vite est à la racine du dossier `code/` (`code/.env`) — README mis à jour.
- Pas de suite de tests (Jest / RTL) incluse actuellement — recommander d'en ajouter pour la couverture.
 - Translations utilisent une structure inversée (clé -> languages) :
   - Exemple :
     ```js
     translations.app.theme.light = { fr: 'Clair', en: 'Light' }
     ```
   - Le `LanguageContext.t()` supporte ce format et conserve une compatibilité avec l'ancien format (en cas d'anciens contenus).
- `package-lock.json` contient des traces de tailwind dans l'historique ; vérifier si tu veux réactiver Tailwind.
- `AtmButton` utilise `styled-components` — si tu souhaites des classes utilitaires, on peut ajouter Tailwind et config.
- **Molécule Counter** (`src/components/molecules/MolCounter.jsx`) : Combine des atoms, utilise `useDispatch` pour Redux.

#### Nommage & préfixes des composants

Dans ce projet on utilise une convention claire pour les noms de composants :

- `Atm` pour `atoms` — petits composants réutilisables (boutons, inputs, textes, éléments 3D). Ex : `AtmButton`, `AtmText`, `ThreeAtmCube`.
- `Mol` pour `molecules` — groupes d'atoms formant une unité logique (compteur, section). Ex : `MolCounter`.
- `Org` pour `organisms` — sections plus complexes ou des morceaux de page (scène 3D, panneaux). Ex : `ThreeOrgScene`.
- `Lay` pour `layout` — structure et zones partagées (en-tête, navigation). Ex : `LayHeader`.

Pourquoi utiliser des préfixes ?
- Organisation : quand tu regardes un import, tu vois rapidement à quelle couche appartient le composant.
- Réutilisabilité : les atoms sont petits et réutilisables ; si tu vois `Atm` tu sais que le composant doit rester simple.
- Clarté pour le designer / dev : facilite la navigation, recherche et création de nouveaux composants.

Conseil : garde les atoms le plus petits possible (single-responsibility). Les molecules peuvent combiner plusieurs atoms pour fournir une fonctionnalité plus riche.

### Layout & organisation des composants

Le dossier `src/components/layout` contient les composants responsables de la structure globale de l'application : header, footer et barres de navigation.

- `LayHeader.jsx` : le composant d'en-tête principal ; il utilise `AtmButton` pour les actions générales (ex : changement de thème / langue). Il est importé et rendu dans les pages principales pour fournir une barre supérieure cohérente.
- Les `organisms` et `pages` consomment `layout` pour organiser le rendu global : par exemple la page `PagHome` intègre `LayHeader` et des `organisms` comme la scène Three.js.

Conseil de bonne pratique :
- Garder la logique d'affichage (layout) séparée de la logique métier (organisms/pages) pour réutilisation et testabilité.
- Les `layout` peuvent aussi gérer le `ThemeProvider` et l'état global du layout (menu ouvert/fermé, paramètres utilisateur) via Redux ou Context.

### Three.js et Animations 3D
- **Scène 3D** (`src/components/organisms/ThreeOrgScene.jsx`) : Utilise `<Canvas>` de React Three Fiber, lumières (`ambientLight`, `directionalLight`), contrôles (`OrbitControls`).
- **Cube Interactif** (`src/components/atoms/ThreeAtmCube.jsx`) :
  - `useRef` pour référencer le mesh.
  - `useState` pour états `hovered` et `active`.
  - `useFrame` pour animation de rotation continue.
  - Événements : `onClick`, `onPointerOver/Out` pour interactions.
  - Props : position, couleur, taille, wireframe.
- **Page Cubes** (`src/pages/PagCubes.jsx`) : Montre plusieurs cubes dans une scène, avec instructions utilisateur.

### Routage avec React Router
- **Routes** (`src/routes/routes.jsx`) : Définition des routes avec `<Routes>` et `<Route>`, params dynamiques (`:value?`), route 404.

### Communication API
- **API Générique** (`src/services/products/api.js`) : Fonction `API()` utilisant `fetch`, configurable via `.env`, gestion d'erreurs, sérialisation JSON automatique.
- **Queries/Mutations** (`src/services/products/queries.js`, `mutations.js`) : Fonctions pour GET/POST/PUT/DELETE, prêtes à l'emploi.

### Hooks React
- `useState` : Gestion d'états locaux (compteurs, hover).
- `useEffect` : Effets secondaires (sync URL, fetch potentiel).
- `useRef` : Références DOM/Three.js.
- `useFrame` : Animations Three.js.

#### Pour les débutants — comprendre et utiliser les Hooks React

Les "hooks" sont la façon moderne d'utiliser l'état et les effets dans React. Voici une explication accessible si tu n'as jamais fait de React :

- Pourquoi "use" ?
  - Tous les hooks (built-in ou custom) doivent commencer par "use" (ex : `useState`, `useEffect`, `useTranslation`). C'est une règle pour React qui permet au parser d'identifier des hooks et d'assurer leur exécution correcte.

- Règles importantes :
  - Appelle des hooks seulement dans le corps d'un composant React ou d'un custom hook.
  - Appelle des hooks au même niveau (pas dans des conditions/loops) — cela permet à React de garder l'ordre d'appel identique entre les rendus.

- Exemples simples :
  - useState :
    ```jsx
    import React, { useState } from 'react'

    function Counter() {
      const [count, setCount] = useState(0)

      return (
        <div>
          <button onClick={() => setCount(count + 1)}> + </button>
          <p>{count}</p>
        </div>
      )
    }
    ```

  - useEffect :
    ```jsx
    import React, { useEffect } from 'react'

    function Example() {
      useEffect(() => {
        // code qui s'exécute après le rendu
        const id = setInterval(() => console.log('tick'), 1000)
        return () => clearInterval(id) // cleanup quand le composant est démonté
      }, []) // [] -> exécute une seule fois (similaire componentDidMount)

      return <div>Check console</div>
    }
    ```

  - useRef : utile quand tu as besoin d'une référence mutable qui ne déclenche pas de re-render :
    ```jsx
    const ref = useRef(null)
    // ref.current contient la valeur
    ```

- Créer ses propres hooks (patterns utiles)
  - Un custom hook centralise une logique réutilisable :
    ```js
    // useWindowWidth.js
    import { useState, useEffect } from 'react'

    export function useWindowWidth() {
      const [width, setWidth] = useState(window.innerWidth)
      useEffect(() => {
        const onResize = () => setWidth(window.innerWidth)
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
      }, [])
      return width
    }
    ```

  - Appelle `useWindowWidth()` dans n'importe quel composant pour obtenir la largeur, sans dupliquer la logique.

#### Nommage des callbacks et handlers
- Préfixe "on" pour props liées aux événements : `onClick`, `onSave`, `onToggle`.
- Préfixe "handle" pour fonctions locales qui traitent un événement : `handleSubmit`, `handleToggle`.

Cela rend le code plus lisible pour les autres devs et facilite l'intégration entre atoms/molecules et UI.

Ces exemples montrent comment combiner React moderne, 3D, état global et API dans une architecture propre.

## Architecture

### Atomic Design
- **Atoms** : Composants de base (boutons, inputs, modèles 3D)
- **Molecules** : Combinaisons d'atoms (compteurs, etc.)
- **Organisms** : Sections complexes (scènes 3D)
- **Pages** : Pages complètes avec logique

### État Global
Utilise Redux pour l'état partagé (ex. : compteur).

### API
Système générique pour les appels REST, avec gestion d'erreurs et sérialisation automatique.

## Déploiement

Pour déployer en production :
1. Construit l'image de production directement depuis `code/Dockerfile` :
  ```powershell
  docker build -t atomic-clean-architecture:latest -f code/Dockerfile code
  ```
2. Pousse vers un registry ou déploie le conteneur
3. Les fichiers statiques sont servis par Nginx

⚠️ Note sur le montage `./build` :

Dans cette version simplifiée, il n'y a plus de service `build` qui monte `./build` dans Nginx. Pour déployer en production, nous recommandons d'utiliser `code/Dockerfile` qui copie les fichiers buildés (`/app/dist`) dans l'image Nginx — ainsi pas besoin de mounts host pour la production.

Si tu utilises encore `./build` pour prévisualiser localement, rappelle-toi qu'un montage `./build:/usr/share/nginx/html` (dans une compose configurée pour Nginx) masquera les fichiers à l'intérieur de l'image si le dossier hôte est vide. Dans ce cas, remplis `./build` avant de lancer Nginx.

## Contribution

1. Fork le repo
2. Crée une branche : `git checkout -b feature/nouvelle-fonction`
3. Commit tes changements : `git commit -am 'Ajoute nouvelle fonction'`
4. Push : `git push origin feature/nouvelle-fonction`
5. Ouvre une PR

## Licence

ISC
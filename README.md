# 📝 Markdown Editor App

Une application d'édition Markdown moderne avec gestion de projets et de notes, inspirée du design d'Arc Browser.

![Gruvbox Theme](https://img.shields.io/badge/theme-Gruvbox-fb4934)
![React](https://img.shields.io/badge/React-18-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6)
![Material-UI](https://img.shields.io/badge/MUI-5-007fff)

## ✨ Fonctionnalités

- 📊 **Gestion de Projets**
  - Organisation des notes par projets
  - Codes couleur personnalisables
  - Vue d'ensemble des projets

- 📝 **Éditeur Markdown**
  - Interface moderne et intuitive
  - Prévisualisation en temps réel
  - Thème Gruvbox intégré
  - Support complet de la syntaxe Markdown

- 🏷️ **Tags et Organisation**
  - Système de tags colorés
  - Filtrage des notes par tags
  - Organisation flexible

- ✅ **Gestion des Tâches**
  - Liste de tâches par note
  - Suivi des tâches terminées
  - Dates d'échéance

- 📤 **Export**
  - Export en PDF
  - Mise en page optimisée

## 🚀 Pour Commencer

### Prérequis

- Node.js (v16 ou supérieur)
- npm ou yarn

### Installation

1. Clonez le dépôt :
```bash
git clone [url-du-repo]
cd markdownEditorApp
```

2. Installez les dépendances :
```bash
npm install
```

3. Lancez l'application en mode développement :
```bash
npm run dev
```

L'application sera accessible à l'adresse `http://localhost:5173`

## 🛠️ Technologies Utilisées

- **Frontend**
  - React 18
  - TypeScript
  - Material-UI (MUI)
  - @uiw/react-md-editor
  - Emotion (CSS-in-JS)

- **État et Stockage**
  - React Context
  - LocalStorage pour la persistance

- **Outils de Développement**
  - Vite
  - ESLint
  - Jest pour les tests

## 📦 Structure du Projet

```
markdownEditorApp/
├── src/
│   ├── components/      # Composants React
│   ├── contexts/        # Contextes React
│   ├── hooks/          # Hooks personnalisés
│   ├── theme/          # Configuration du thème
│   ├── types/          # Types TypeScript
│   └── utils/          # Utilitaires
├── public/             # Assets statiques
└── tests/              # Tests unitaires
```

## 🎨 Personnalisation

### Thème

L'application utilise le thème Gruvbox par défaut. Vous pouvez personnaliser les couleurs dans `src/theme/index.ts`.

### Raccourcis Clavier

- `Ctrl/Cmd + S` : Sauvegarde manuelle
- `Ctrl/Cmd + P` : Export PDF
- `Ctrl/Cmd + F` : Recherche

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push sur la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [React MD Editor](https://github.com/uiwjs/react-md-editor) pour l'éditeur Markdown
- [Material-UI](https://mui.com/) pour les composants UI
- [Gruvbox](https://github.com/morhetz/gruvbox) pour l'inspiration du thème

---

Fait avec ❤️ pour la productivité et l'organisation

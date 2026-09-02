# GuitarTabs

Application mobile (Expo / React Native) pour stocker les tablatures des chansons apprises à la guitare.

Les arpèges ne sont pas stockés en ASCII mais dans un modèle structuré (`sections → mesures → notes`) et rendus graphiquement en SVG.

Les chansons en accords suivent le même principe : une grille structurée (`sections → mesures → accords`) avec les paroles sous chaque mesure.

## Démarrer

```bash
npm install
npm run web    # version web, pour développer
npm start      # Metro + QR code pour Expo Go (Android / iOS)
```

## Scripts

| Commande | Effet |
| --- | --- |
| `npm run web` | Lance l'app dans le navigateur |
| `npm start` | Lance Metro (QR code Expo Go) |
| `npm run android` / `npm run ios` | Lance sur un appareil / émulateur |
| `npm run typecheck` | Vérifie les types (`tsc --noEmit`) |

## État

- [x] Config Expo + web + TypeScript strict
- [x] Thème à tokens (couleurs, polices, dimensions de tablature)
- [x] Modèle de données des chansons
- [x] Rendu SVG de tablature (mesures justifiées, notes simultanées, sections, reprises, techniques)
- [x] Éditeur d'arpège : grille tappable, pavé de frettes, techniques, sections et mesures
- [x] Persistance locale (AsyncStorage)
- [x] Format accords : grille de mesures + paroles, rendu, éditeur, capo
- [x] Aperçu cliquable dans les éditeurs (tap sur une mesure pour l'éditer)
- [ ] Export / import JSON
- [ ] Diagrammes d'accords (positions sur le manche)

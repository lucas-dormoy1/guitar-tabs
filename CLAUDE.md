# GuitarTabs — Mes tablatures de guitare

## Objectif du projet

Application mobile (Android + iOS) + version web de dev, pour stocker, consulter et saisir les tablatures des chansons apprises à la guitare.

Deux formats de chanson :

- **`arpege`** — tablature **rendue graphiquement** (6 cordes, cases, mesures) à partir d'un modèle de données structuré. **Pas d'ASCII**, le rendu doit être beau et lisible. C'est le format prioritaire.
- **`accords`** — mesures d'accords avec les paroles dessous (pas encore implémenté).

## Stack technique

- **Framework** : Expo SDK 54 (React Native)
- **Langage** : TypeScript strict
- **Navigation** : Expo Router (file-based routing, Stack)
- **Rendu de tablature** : `react-native-svg` (identique web et natif, net à tout zoom)
- **State** : React Context (`ChansonsContext`)
- **Stockage** : local `AsyncStorage`, écriture debouncée (400 ms) — pas de backend, pas de compte
- **Polices** : Plus Jakarta Sans via `@expo-google-fonts/plus-jakarta-sans` + `expo-font`
- **Tests** : aucun pour l'instant (à ajouter quand la logique métier se stabilise)

## Commandes

```bash
npm run web        # version web de dev (le mode de travail par défaut)
npm start          # Metro + QR code pour Expo Go
npm run typecheck  # tsc --noEmit
```

## Git

- Remote : `git@github-perso:lucas-dormoy1/guitar-tabs.git` (alias SSH `github-perso` → clé `id_ed25519_perso`)
- **Identité configurée en local sur ce repo** : `lucas-dormoy1 <luludorm@gmail.com>`, signature avec `id_ed25519_perso.pub`
- ⚠️ Le `.gitconfig` global de la machine est celui du compte **pro Agicap** et n'a aucun `includeIf` : ne jamais commiter ici sans que la config locale soit en place (`git config --local --get user.email` doit renvoyer l'adresse perso).
- **Conventional commits** (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`)

## Architecture

```
app/                          ← Routes (Expo Router) — PAS de fichiers non-route ici
├── _layout.tsx               ← Layout racine (Stack, polices, ChansonsProvider)
├── index.tsx                 ← Liste des chansons + création
├── chanson/
│   └── [id].tsx              ← Écran de lecture (tablature rendue, échelle S/M/L)
└── edition/
    └── [id].tsx              ← Éditeur d'arpège (orchestre grille + pavé + structure)
components/
├── tablature/
│   ├── Tablature.tsx         ← Mesure la largeur, calcule le layout, rend le SVG
│   └── Systeme.tsx           ← Rendu SVG d'un système (cordes, barres, notes, techniques, reprises)
└── edition/
    ├── BarreStructure.tsx    ← Navigation sections / mesures + ajouts
    ├── GrilleMesure.tsx      ← Grille tappable corde × pas de la mesure courante
    └── PaveSaisie.tsx        ← Pavé de frettes 0-12, effacer, techniques
contexts/
└── ChansonsContext.tsx       ← Chansons + CRUD + persistance AsyncStorage
styles/                       ← Styles séparés (hors app/ pour éviter les conflits Expo Router)
├── root-layout.styles.ts
├── index.styles.ts
├── chanson.styles.ts
├── tablature.styles.ts
├── edition.styles.ts
├── edition-grille.styles.ts
└── edition-pave.styles.ts
theme/
├── colors.ts                 ← Tokens de couleurs (source de vérité)
├── fonts.ts                  ← Tokens de polices (source de vérité)
└── tablature.ts              ← Dimensions du rendu + échelles S/M/L + largeur max + étirement max
types/chanson.ts              ← Modèle de données (Chanson, Section, Mesure, Note, Technique)
utils/
├── layoutTablature.ts        ← Calcul pur du layout (systèmes, justification, positions x/y)
├── editionChanson.ts         ← Mutations pures du modèle (poser/retirer note, mesures, sections)
├── stockage.ts               ← Lecture / écriture AsyncStorage
└── chansonsDemo.ts           ← Chanson de démo, utilisée comme seed au premier lancement
```

## Modèle de données

Une chanson `arpege` se décompose en `sections[] → mesures[] → notes[]`.

- **Grille de subdivisions** : chaque mesure a un nombre de `pas` (8 = croches en 4/4, 12 = triolets, 16 = doubles). Une note occupe un `pas`. Pas de durées rythmiques réelles (ni hampes, ni ligatures).
- **Notes simultanées** : plusieurs notes avec le même `pas` sur des cordes différentes. Les notes d'une mesure sont triées par `pas` puis par `corde`.
- **Numérotation des cordes** : `1` = mi aigu (ligne du haut) … `6` = mi grave (ligne du bas). L'accordage est stocké **du grave à l'aigu** (`["E","A","D","G","B","e"]`), d'où `lettreCorde()` qui fait la conversion.
- **Sections** : `nom` + `repetitions`. Une section commence toujours sur un nouveau système, avec son label au-dessus. `repetitions > 1` affiche les barres de reprise et `×N`.
- **Techniques** : `hammer`, `pull`, `slide-up`, `slide-down`, `bend` portées par la note de **départ** — le rendu cherche la note suivante sur la même corde **dans la même mesure**. `mute` n'est pas une liaison : elle remplace le numéro de frette par `×`.
- **Mutations** : toutes les fonctions de `utils/editionChanson.ts` sont **pures et immutables** et remettent `majLe` à jour. Ne jamais muter une chanson en place dans un composant.

## Rendu de la tablature

- Le layout est calculé hors React dans `utils/layoutTablature.ts`, puis dessiné par `Systeme.tsx`.
- **Justification** : les mesures sont groupées en systèmes selon la largeur nominale, puis la largeur de pas est recalculée par système pour remplir la ligne, plafonnée à `ETIREMENT_MAX` (×1.5). C'est pour ça que `MesurePlacee` porte son propre `largeurPas` — ne jamais utiliser `dims.largeurPas` pour positionner une note, passer par `xPas()`.
- **Largeur de page** : le bloc est plafonné à `LARGEUR_MAX` (560 px) puis centré, sinon la tablature s'étale sur un écran large.

## Éditeur d'arpège

- Une mesure éditée à la fois, sélectionnée via `BarreStructure`.
- **Saisie** : tap sur une case → sélection ; tap sur une frette du pavé → pose ou remplace la note ; **re-tap sur la case sélectionnée → efface**. Les techniques s'appliquent à la note sélectionnée (re-tap = retire).
- L'aperçu en bas de l'éditeur rend la section courante avec le vrai composant `Tablature`.
- Les temps forts sont marqués dans la grille via `pasParTemps()` (4 temps par mesure).

## Conventions de style

- **Zéro couleur hex en dur** dans les `.tsx` ou `.styles.ts` — toujours passer par `theme/colors.ts` (les couleurs de la tablature y sont préfixées `tab*`).
- **Zéro dimension en dur** dans le rendu de tablature — tout passe par `dimensionsTablature(echelle)` dans `theme/tablature.ts`, pour que les échelles S/M/L restent cohérentes.
- **Styles séparés** : chaque écran/composant a son fichier `.styles.ts` dans `styles/` (jamais dans `app/`, où Expo Router traite tout fichier comme une route), qui exporte `styles`.
- Les `.tsx` n'importent que `{ styles }` — pas de `StyleSheet` ni de couleur directement dans le JSX.
- **Nommage en français** pour le métier (`mesure`, `corde`, `frette`, `pas`, `accordage`), comme le reste du projet.

## Palette

Direction retenue : **encre & blanc froid** — quasi monochrome, fond gris froid (`#F1F2F5`), papier blanc, frettes presque noires (`#14161A`), un seul accent bleu d'encre (`#2F4FCF`) pour les techniques, les badges et les actions. Rien ne doit concurrencer visuellement les chiffres de frette.

## Règles de développement

- **Pas de commentaires explicatifs dans le code** — le code doit être lisible seul ; ce qui mérite explication va dans ce fichier ou dans `docs/`.
- Garder le code simple et lisible.
- **Logique pure hors des composants** : tout calcul de layout ou toute mutation du modèle va dans `utils/`, pas dans le JSX.
- Mettre à jour ce fichier à chaque étape structurante.
- L'utilisateur connaît TypeScript, ne pas expliquer les bases TS.
- Pas d'objectif pédagogique sur ce projet (contrairement à Intermittence) : aller droit au but.

## Reste à faire

- Export / import JSON (backup et passage web ↔ téléphone) — les deux stockages sont distincts
- Confirmation ou annulation sur les suppressions de mesure / section (aujourd'hui immédiates ; `Alert` de RN ne marche pas sur web)
- Suppression d'une chanson depuis la liste
- Format `accords` : mesures + paroles, avec transposition et capo
- Champs `bpm`, `tonalite`, `capo`, `statut`, `notes` non éditables depuis l'UI
- Icône, splash screen, favicon (`assets/`, à référencer dans `app.json`)
- `eas init` pour obtenir le `projectId` (l'`eas.json` est prêt)
- Tests (Jest + jest-expo), en reprenant la config d'Intermittence si besoin

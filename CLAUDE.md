# GuitarTabs — Mes tablatures de guitare

## Objectif du projet

Application mobile (Android + iOS) + version web de dev, pour stocker, consulter et saisir les tablatures des chansons apprises à la guitare.

Deux formats de chanson :

- **`arpege`** — tablature **rendue graphiquement** (6 cordes, cases, mesures) à partir d'un modèle de données structuré. **Pas d'ASCII**, le rendu doit être beau et lisible. C'est le format prioritaire.
- **`accords`** — grille de mesures d'accords avec les paroles sous chaque mesure, rendue en `View`/`Text` (pas de SVG : c'est du texte).

L'app sert à **rejouer ses chansons**, pas à les cataloguer : l'écran de lecture ne montre que ce dont on a besoin guitare en main. Pas de tags de statut, de tonalité, de bpm ni de compte de mesures — ils ont été retirés volontairement, ne pas les remettre sans raison. Le `capo` est la seule métadonnée affichée, parce qu'elle change la façon de jouer.

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
│   └── [id].tsx              ← Écran de lecture (arpège : échelle S/M/L ; accords : grille + capo)
└── edition/
    └── [id].tsx              ← Route d'édition : titre/artiste communs + aiguillage par format
components/
├── tablature/
│   ├── Tablature.tsx         ← Mesure la largeur, calcule le layout, rend le SVG
│   └── Systeme.tsx           ← Rendu SVG d'un système (cordes, barres, notes, techniques, reprises)
├── accords/
│   └── GrilleAccords.tsx     ← Rendu de la grille d'accords (barres de mesure, accords, paroles)
└── edition/
    ├── EditeurArpege.tsx     ← Éditeur d'arpège (structure + grille + pavé de frettes)
    ├── EditeurAccords.tsx    ← Éditeur d'accords (structure + chips d'accords + paroles + pavé)
    ├── BarreStructure.tsx    ← Navigation sections / mesures + ajouts (commune aux deux formats)
    ├── GrilleMesure.tsx      ← Grille tappable corde × pas de la mesure courante
    ├── PaveSaisie.tsx        ← Pavé de frettes 0-12, effacer, techniques
    └── PaveAccords.tsx       ← Pavé racines (12) + couleurs (m, 7, maj7, sus4…), retirer
contexts/
└── ChansonsContext.tsx       ← Chansons + CRUD + persistance AsyncStorage
styles/                       ← Styles séparés (hors app/ pour éviter les conflits Expo Router)
├── root-layout.styles.ts
├── index.styles.ts
├── chanson.styles.ts
├── tablature.styles.ts
├── accords.styles.ts
├── edition.styles.ts             ← Commun aux deux éditeurs (blocs, libellés, actions, chips)
├── edition-grille.styles.ts
├── edition-pave.styles.ts
└── edition-pave-accords.styles.ts
theme/
├── colors.ts                 ← Tokens de couleurs (source de vérité)
├── fonts.ts                  ← Tokens de polices (source de vérité)
└── tablature.ts              ← Dimensions du rendu + échelles S/M/L + largeur max + étirement max
types/chanson.ts              ← Modèle de données (Chanson, Section, Mesure, Note, Technique, MesureAccords)
utils/
├── layoutTablature.ts        ← Calcul pur du layout arpège (systèmes, justification, positions x/y)
├── accords.ts                ← Analyse d'un nom d'accord (racine / couleur / basse), découpage en lignes
├── editionChanson.ts         ← Mutations pures de l'arpège (poser/retirer note, mesures, sections)
├── editionAccords.ts         ← Mutations pures des accords (poser/retirer accord, paroles, mesures)
├── migrations.ts             ← Migration des chansons stockées (ancien `accords.contenu` texte)
├── stockage.ts               ← Lecture / écriture AsyncStorage
└── chansonsDemo.ts           ← Chansons de démo (une par format), seed au premier lancement
```

## Modèle de données

Une chanson `arpege` se décompose en `sections[] → mesures[] → notes[]`.

- **Grille de subdivisions** : chaque mesure a un nombre de `pas` (8 = croches en 4/4, 12 = triolets, 16 = doubles). Une note occupe un `pas`. Pas de durées rythmiques réelles (ni hampes, ni ligatures).
- **Notes simultanées** : plusieurs notes avec le même `pas` sur des cordes différentes. Les notes d'une mesure sont triées par `pas` puis par `corde`.
- **Numérotation des cordes** : `1` = mi aigu (ligne du haut) … `6` = mi grave (ligne du bas). L'accordage est stocké **du grave à l'aigu** (`["E","A","D","G","B","e"]`), d'où `lettreCorde()` qui fait la conversion.
- **Sections** : `nom` + `repetitions`. Une section commence toujours sur un nouveau système, avec son label au-dessus. `repetitions > 1` affiche les barres de reprise et `×N`.
- **Techniques** : `hammer`, `pull`, `slide-up`, `slide-down`, `bend` portées par la note de **départ** — le rendu cherche la note suivante sur la même corde **dans la même mesure**. `mute` n'est pas une liaison : elle remplace le numéro de frette par `×`.
- **Mutations** : toutes les fonctions de `utils/editionChanson.ts` sont **pures et immutables** et remettent `majLe` à jour. Ne jamais muter une chanson en place dans un composant.

Une chanson `accords` se décompose en `sections[] → mesures[]`, chaque `MesureAccords` portant `accords: string[]` (0 à `ACCORDS_MAX` = 4) et des `paroles` optionnelles.

- **Un accord est une chaîne** (`"Am7"`, `"D/F#"`), pas une structure : c'est ce qu'on lit sur une grille. `utils/accords.ts` sait l'analyser (`analyserAccord` → racine, hauteur, suffixe, basse) sans que le modèle ait à le pré-mâcher.
- **Mesure vide = on tient l'accord précédent** — c'est la convention des grilles, donc une mesure sans accord se rend avec sa seule barre de mesure.
- **Paroles portées par la mesure** : c'est ce qui aligne le texte sous les accords sans avoir à mesurer le texte. Une mesure = un fragment de paroles.
- **`mesuresParLigne`** (2, 3 ou 4) est une propriété de la **chanson**, pas de la section : la grille reste régulière d'un bout à l'autre. Le rendu n'est donc pas justifié comme l'arpège, il est découpé par `decouperEnLignes()`, qui renvoie des `CelluleAccords` (la mesure + son index dans la section, pour la sélection) et complète la dernière ligne avec des `null` pour que les mesures gardent la même largeur partout.
- **Pas de transposition** : elle a été implémentée puis retirée — on note la chanson telle qu'on la joue. Ce qui compte, c'est le **capo** (`libelleCapo()` : « Aucun », « 1re case », « Ne case »), éditable dans le bloc commun de l'éditeur et affiché en lecture. Ne pas réintroduire de transposition sans demande explicite.
- **Mutations** : `utils/editionAccords.ts`, mêmes règles que l'arpège (pures, immutables, `majLe`).
- **Migration** : l'ancien format (`accords.contenu`, du texte libre) est converti à la lecture par `utils/migrations.ts` — le texte est déplacé dans `notes` pour ne rien perdre, et une section vide est créée.

## Rendu de la tablature

- Le layout est calculé hors React dans `utils/layoutTablature.ts`, puis dessiné par `Systeme.tsx`.
- **Justification** : les mesures sont groupées en systèmes selon la largeur nominale, puis la largeur de pas est recalculée par système pour remplir la ligne, plafonnée à `ETIREMENT_MAX` (×1.5). C'est pour ça que `MesurePlacee` porte son propre `largeurPas` — ne jamais utiliser `dims.largeurPas` pour positionner une note, passer par `xPas()`.
- **Largeur de page** : le bloc est plafonné à `LARGEUR_MAX` (560 px) puis centré, sinon la tablature s'étale sur un écran large.

## Éditeur d'arpège

- Une mesure éditée à la fois, sélectionnée via `BarreStructure` **ou directement dans l'aperçu** (voir « Sélection de la mesure » plus bas).
- **Saisie** : tap sur une case → sélection ; tap sur une frette du pavé → pose ou remplace la note ; **re-tap sur la case sélectionnée → efface**. Les techniques s'appliquent à la note sélectionnée (re-tap = retire).
- L'aperçu en bas de l'éditeur rend la section courante avec le vrai composant `Tablature`.
- Les temps forts sont marqués dans la grille via `pasParTemps()` (4 temps par mesure).

## Rendu et édition des accords

- **Rendu** (`GrilleAccords`) : pas de SVG — des `View`/`Text`, une mesure = une cellule `flex: 1` avec sa barre de mesure à gauche (la dernière cellule remplie de la ligne porte aussi la barre de droite). Plusieurs accords dans une mesure se partagent la largeur à parts égales, ce qui donne leur position approximative dans la mesure. Même plafond de largeur que la tablature (`LARGEUR_MAX`, centré).
- La zone paroles d'une ligne n'est rendue que si **au moins une** mesure de cette ligne a des paroles, pour ne pas laisser de bandes vides sur les grilles sans texte.
- **Éditeur** : une mesure à la fois via `BarreStructure` (le composant est commun aux deux formats, d'où le type `SectionQuelconque`). Les accords de la mesure sont des chips ; tap sur une chip → sélection, tap sur `+` → nouvel emplacement, **re-tap = désélection**. Contrairement à l'arpège, le re-tap n'efface pas : la suppression passe par « Retirer » du pavé, parce qu'un accord tapé est plus coûteux à ressaisir qu'une frette.
- **Pavé** : la rangée de racines écrit ou remplace la racine en gardant la couleur (`changerRacine`), la rangée de couleurs remplace le suffixe (`changerSuffixe`). Les couleurs sont désactivées tant qu'aucun accord n'existe à l'emplacement sélectionné.
- La route `app/edition/[id].tsx` ne fait plus que les champs communs (titre, artiste, capo) et l'aiguillage vers `EditeurArpege` ou `EditeurAccords`, chacun recevant `chanson` + `onChanger`.

## Sélection de la mesure

Les deux rendus (`Tablature` et `GrilleAccords`) acceptent `selection` + `onMesure` **optionnels** : sans eux ils sont passifs (écran de lecture), avec eux la mesure sélectionnée prend un fond `tabSelection` et un tap la rend courante. C'est ce qui rend l'aperçu de l'éditeur cliquable — le premier réflexe est de cliquer sur la partition, pas sur les pastilles de la barre de structure.

- Les index passés à `onMesure` sont **relatifs au tableau `sections` reçu par le composant**. Comme l'aperçu ne rend que la section courante (`sections={[section]}`), il reçoit toujours `0` comme index de section et l'éditeur y substitue le vrai — d'où le `(_, iMesure)`.
- Côté arpège, c'est `MesurePlacee` qui porte `indexSection` / `indexMesure` : le layout coupe une section en plusieurs systèmes, donc la position d'une mesure dessinée n'est **pas** déductible de son ordre à l'écran. Les zones tappables sont des `<Rect fill="transparent">` posés **après** le dessin (`onPress` est mappé sur `onClick` par `react-native-svg` sur web) ; le fond de sélection, lui, est dessiné **avant** les cordes pour rester sous les chiffres.

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
- **Factoriser les deux éditeurs** : `EditeurArpege` et `EditeurAccords` partagent ~130 lignes identiques (bloc `Structure`, en-tête de section avec le compteur de répétitions, les trois actions mesure/section, le clamp de `position`). À extraire en `BlocSection` + un hook de position, sinon chaque évolution devra être faite deux fois.
- Échelles S/M/L pour la grille d'accords : l'écran de lecture ne les propose que pour l'arpège, les tailles de `accords.styles.ts` sont fixes
- Confirmation ou annulation sur les suppressions de mesure / section (aujourd'hui immédiates ; `Alert` de RN ne marche pas sur web)
- Suppression d'une chanson depuis la liste
- Champs `bpm`, `tonalite`, `statut`, `notes` toujours dans le modèle mais **ni éditables ni affichés** — à trancher : les rendre utiles (tri, filtre) ou les sortir du modèle. Le `capo` est éditable depuis l'éditeur.
- Accords : saisie libre d'un accord hors du pavé (slash chords, `add11`…) et diagrammes de position sur le manche
- Icône, splash screen, favicon (`assets/`, à référencer dans `app.json`)
- `eas init` pour obtenir le `projectId` (l'`eas.json` est prêt)
- Tests (Jest + jest-expo), en reprenant la config d'Intermittence si besoin

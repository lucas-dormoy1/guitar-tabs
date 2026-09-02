---
name: release
description: Publie une version — bump de version, tag vX.Y.Z, build APK Android sur EAS
---

# Skill /release — Bump + tag + build EAS

Une release, ici, c'est **un tag `vX.Y.Z` poussé sur `main`**. C'est lui, et rien d'autre, qui déclenche le workflow `.eas/workflows/build-android.yml` et produit l'APK installable sur le téléphone.

Un push sur `main` ne build pas. C'est volontaire : le plan Expo gratuit donne **15 builds Android par mois**, sans dépassement possible (une fois épuisés, plus aucun build jusqu'au 1er du mois suivant). Chaque tag coûte donc ~1/15 du quota — ne pas en poser à la légère, et ne jamais en poser « pour voir ».

## Étape 1 : Pré-vol

Vérifie tout ça avant de toucher à quoi que ce soit. Si un point casse, **arrête-toi et signale-le** au lieu de corriger d'autorité.

1. `git rev-parse --abbrev-ref HEAD` → doit être `main`
2. `git status --porcelain` → doit être **vide** (le bump sera le seul changement)
3. `git fetch origin && git status -sb` → pas de commit en retard sur `origin/main` ; s'il y a des commits locaux non poussés, ils partiront avec la release, c'est normal, mais dis-le
4. `npm run typecheck` → doit passer (le workflow le relance côté EAS, autant ne pas gaspiller le voyage)
5. `git config --local --get user.email` → doit renvoyer `luludorm@gmail.com` (cf. skill `/commit`, la config globale est celle du compte pro)

## Étape 2 : Choisir le numéro

Lis la version courante dans `app.json` (`expo.version`) et les tags existants (`git tag -l --sort=-v:refname`).

Propose le numéro suivant en **semver**, en te basant sur les commits depuis le dernier tag (`git log <dernier-tag>..HEAD --oneline`) :

- `fix:` / `chore:` / `docs:` seulement → **patch** (1.0.0 → 1.0.1)
- au moins un `feat:` → **mineure** (1.0.0 → 1.1.0)
- changement de modèle de données sans migration, ou refonte d'un écran → **majeure**

Affiche la liste des commits depuis le dernier tag avec la version proposée, et **demande confirmation**. L'utilisateur tranche.

S'il n'y a **aucun** tag (première release), pars de la version d'`app.json`.

## Étape 3 : Bump

Mets la nouvelle version dans **les deux** fichiers, ils doivent rester alignés :

- `app.json` → `expo.version`
- `package.json` → `version`

Rien d'autre. Ne touche pas à `eas.json`, ni au `versionCode` Android : `eas.json` est en `appVersionSource: "remote"`, c'est EAS qui gère le compteur côté serveur.

## Étape 4 : Commit + tag

```bash
git add app.json package.json
git commit -m "chore: release vX.Y.Z"
git tag -a vX.Y.Z -m "vX.Y.Z"
```

Conventions du projet pour le message de commit (conventional commits, **pas de co-author, pas de mention d'outil**) : voir le skill `/commit`.

Le tag doit **commencer par `v`** — le trigger du workflow est `tags: [v*]`, un tag `1.0.1` ne déclenchera rien.

## Étape 5 : Push — demande confirmation

C'est l'étape qui consomme un build et qui est publique. **Demande confirmation explicite avant de pousser.**

```bash
git push origin main
git push origin vX.Y.Z
```

Les deux commandes sont nécessaires : `git push` seul **ne pousse pas les tags**.

## Étape 6 : Suivi du build

```bash
npx eas-cli@latest workflow:list
```

Puis l'URL du run sur expo.dev pour l'avancement, et l'onglet Builds pour le QR code / lien de téléchargement de l'APK une fois vert.

Donne le lien à l'utilisateur. Ne reste pas à poller en boucle : un build Android prend une dizaine de minutes, et la file du plan gratuit est en basse priorité (l'attente peut être longue aux heures de pointe).

## Si le workflow ne se déclenche pas

Le trigger `on.push` suppose que le repo GitHub est **connecté au projet EAS** (GitHub App Expo installée + repo lié dans expo.dev → project settings → GitHub). Tant que ce n'est pas fait, le `.yml` est inerte.

Fallback, qui marche sans connexion GitHub :

```bash
npx eas-cli@latest workflow:run .eas/workflows/build-android.yml
```

⚠️ Le login EAS est **interactif** (`npx eas-cli@latest login`) : impossible depuis un shell d'agent. Si la commande réclame une authentification, passe la main à l'utilisateur.

## Si le build échoue

**Ne re-tague pas le même numéro** (pas de `git tag -f`, pas de tag supprimé/recréé). Deux options :

- l'échec vient de l'infra ou du réseau → relance le même commit via `workflow_dispatch` sur expo.dev, ou `npx eas-cli@latest workflow:run`, ça ne demande pas de nouveau tag
- l'échec vient du code → corrige, et repars sur une **version patch** (1.0.1 → 1.0.2)

Dans les deux cas, chaque tentative consomme un build du quota. Signale-le si le compteur commence à monter dans le mois.

## Ce que la release ne fait pas

- **Pas d'iOS** : le build sur appareil demande un compte Apple Developer payant et `app.json` n'a pas de `bundleIdentifier`. Sur iPhone, rester sur Expo Go (`npm start`).
- **Pas de publication sur un store** : le profil utilisé est `preview` (APK, `distribution: internal`), c'est un APK qu'on installe à la main. Un passage au Play Store demanderait le profil `production` (AAB) et un job `submit`.
- **Pas de release notes** : le tag annoté porte juste le numéro. Si l'utilisateur en veut, `git log <tag précédent>..HEAD --oneline` fait le brouillon.

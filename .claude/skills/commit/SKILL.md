---
name: commit
description: Stage, review en profondeur, commit et push les changements
---

# Skill /commit — Review + Commit + Push

## Étape 1 : Vérification pré-staging

Avant de stager quoi que ce soit :

1. Lance `git status` pour voir tous les fichiers modifiés/ajoutés/supprimés
2. **Vérifie qu'aucun fichier sensible ne sera stagé** — bloque si tu trouves :
   - Fichiers d'environnement : `.env`, `.env.*` (sauf `.env.example`)
   - Secrets/credentials : `*.pem`, `*.key`, `*.p12`, `*.jks`, `*.p8`, `credentials.*`, `secret*`
   - Tokens/configs privées : fichiers contenant des API keys, tokens, mots de passe
3. Si des fichiers sensibles sont détectés :
   - Liste-les à l'utilisateur
   - Demande confirmation avant de continuer
   - Propose de les ajouter au `.gitignore`

## Étape 2 : Staging

Stage tous les changements avec `git add -A`.

## Étape 3 : Review approfondi

Lance un **sub-agent** (Agent tool, subagent_type: general-purpose) pour faire une review complète du diff stagé.

Donne-lui ce prompt :

```
Tu es un code reviewer senior. Analyse le diff git staged ci-dessous de manière approfondie.

Exécute `git diff --cached` pour obtenir le diff complet.
Lis aussi le fichier CLAUDE.md à la racine du projet pour connaître les conventions.

Fais une review complète couvrant :

1. **Bugs & erreurs logiques** — off-by-one, null/undefined non gérés, mauvais types, calculs de layout faux
2. **Sécurité** — données sensibles en dur, dépendances douteuses
3. **Code mort & oublis** — console.log, TODO/FIXME orphelins, code commenté, imports inutilisés
4. **Conventions du projet** — respect du CLAUDE.md (pas de commentaires dans le code, zéro hex en dur hors theme/, styles séparés, logique pure dans utils/)
5. **Qualité & maintenabilité** — duplication, nommage, complexité excessive, abstractions prématurées

Pour chaque problème trouvé, donne :
- Le fichier et la ligne
- La sévérité : BLOQUANT (doit être corrigé avant commit) ou SUGGESTION (amélioration non critique)
- Une explication courte
- Un fix proposé

Si tout est clean, réponds exactement : "LGTM"

Termine par un résumé : nombre de bloquants, nombre de suggestions.
```

## Étape 4 : Affichage du résultat

**TOUJOURS afficher le résultat complet de la review à l'utilisateur**, quel que soit le résultat (LGTM ou problèmes trouvés). Le format d'affichage est :

```
## Review - X bloquant(s), Y suggestion(s)

### Bloquants (si présents)
1. **Description courte** — fichier:ligne
   Explication + fix proposé

### Suggestions (si présentes)
1. **Description courte** — fichier:ligne
   Explication
```

## Étape 5 : Décision

### Si le sub-agent répond "LGTM" (aucun bloquant, aucune suggestion) :

1. Affiche le résultat de la review (LGTM)
2. Génère un message de commit **conventional commit** basé sur le diff
3. Demande confirmation à l'utilisateur avant de commiter
4. Commite avec ce message
5. Push sur la branche courante avec `git push -u origin HEAD`

### Si le sub-agent trouve des **suggestions** et/ou des **bloquants** :

1. Affiche le résultat complet de la review
2. Demande ce qu'il veut faire :
   - Corriger automatiquement (Claude applique les fixes)
   - Corriger manuellement (l'utilisateur corrige lui-même)
   - Ignorer et commit tel quel
3. Après corrections appliquées, lance `git add -A` pour stager
4. Demande à l'utilisateur : "Re-review ou commit direct ?"
   - Si re-review → relance l'étape 3 (une seule fois, pas de boucle)
   - Si commit direct → commit + push

## Avant tout commit

Lance `npm run typecheck` — un typecheck qui échoue est bloquant.

## Format du commit

- **Conventional commits** : `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`
- Message concis (1 ligne titre, corps optionnel si beaucoup de changements)
- **Pas de `Co-Authored-By`, pas de mention de Claude ou d'un outil** dans le message — ni en pied, ni dans le corps
- Utilise un HEREDOC pour le message :

  ```bash
  git commit -m "$(cat <<'EOF'
  feat: description courte

  Corps optionnel avec détails.
  EOF
  )"
  ```

## Identité Git

Le `.gitconfig` **global** de la machine est celui du compte pro (Agicap) et n'a aucun `includeIf` : c'est la config **locale** du repo qui rétablit l'identité perso.

- Remote : `git@github-perso:lucas-dormoy1/guitar-tabs.git` (alias SSH `github-perso` → clé `id_ed25519_perso`)
- Identité locale attendue : `lucas-dormoy1 <luludorm@gmail.com>`
- Les commits sont **signés en SSH** : `commit.gpgsign` et `gpg.format=ssh` viennent du global, `user.signingkey` local pointe sur `id_ed25519_perso.pub`

**Avant le premier commit d'une session, vérifie** :

```bash
git config --local --get user.email   # doit renvoyer luludorm@gmail.com
```

Si ça renvoie autre chose (ou rien), **arrête-toi et signale-le** : le commit partirait sous l'adresse pro.

Ne jamais modifier la config git, ni globale ni locale.

Note : `git log --show-signature` affiche `gpg.ssh.allowedSignersFile needs to be configured` et `%G?` vaut `N`. C'est normal — seule la *vérification* locale n'est pas configurée. Les commits sont bien signés, c'est GitHub qui les vérifie.

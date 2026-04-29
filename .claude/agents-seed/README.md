# Agents Seed — Équipe de développement générique

Hiérarchie de 11 agents Claude Code réutilisable sur n'importe quel projet.

## Installation

```bash
cp agents-seed/*.md .claude/agents/
```

## Pré-requis

Un fichier `CLAUDE.md` à la racine du projet décrivant :
- **Stack technique** : langages, frameworks, base de données, cloud
- **Architecture** : structure des dossiers, patterns, conventions de nommage
- **Comment lancer** : commandes dev, build, test, deploy
- **Fichiers clés** : entry point, config, routes, etc.

Les agents lisent ce fichier avant toute action pour s'adapter au projet.

## Hiérarchie

```
Idée de projet
└── Orchestrateur
    └── Chef de Projet (PM)
        └── Architecte
            ├── Frontend
            │   └── QA / Tests
            │       └── DevOps
            │
            ├── Backend
            │   └── Code Review
            │
            └── Data / ML
                └── Sécurité
                    └── Tech Writer

Production
```

Chaque agent fait son travail puis délègue automatiquement à son/ses enfant(s).
Les noeuds terminaux (DevOps, Code Review, Tech Writer) finalisent leur branche.

## Utilisation

| Scénario | Point d'entrée | Cascade |
|---|---|---|
| Nouvelle feature | `orchestrateur` | Pipeline complet |
| Bug simple | `orchestrateur` | Raccourci → backend/frontend → reviewer |
| Nouveau modèle IA | `llm` | → security → tech-writer |
| Pré-déploiement | `security` + `qa` | security → tech-writer / qa → devops |
| Doc uniquement | `tech-writer` | Direct |

## Personnalisation

Pour ajouter du contexte spécifique à un agent sans modifier le seed :
1. Documenter dans `CLAUDE.md` (préféré — tous les agents le lisent)
2. Ou dupliquer l'agent et ajouter le contexte directement

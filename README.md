# FairShare

<p align="center">
  <img src="/public/fairshare-logo.svg" alt="FairShare Logo" width="120" />
</p>

<p align="center">
  <strong>Partagez vos dépenses entre amis, sans friction.</strong>
</p>

---

## 📖 Présentation

FairShare est une application web de gestion de dépenses en groupe, conçue pour simplifier le partage des frais lors de voyages, sorties, colocations ou événements entre amis.  
Grâce à un algorithme intelligent de **minimisation des transactions**, FairShare réduit le nombre de virements nécessaires pour équilibrer les comptes.

Développé dans le cadre du concours **Hackverse 3.0**, ce projet répond aux exigences d'un MVP moderne : interface mobile-first, temps réel, et architecture scalable.

---

## ✨ Fonctionnalités

- 🔐 **Authentification simplifiée** par pseudo (sans mot de passe)
- 👥 **Création et gestion de groupes** avec code d'invitation unique
- 💸 **Ajout de dépenses partagées** avec répartition équitable ou personnalisée
- 📊 **Calcul automatique des soldes** : qui doit combien à qui
- ⚡ **Algorithme de minimisation des transactions** (Greedy) pour limiter les virements
- 📱 **Interface mobile-first** avec animations fluides (Framer Motion)
- 📈 **Page d'activité** avec statistiques personnelles et graphiques (Recharts)
- 👤 **Page de profil** avec résumé des dépenses et paramètres

---

## 🛠️ Technologies

| Catégorie            | Outils                                                                                   |
|----------------------|------------------------------------------------------------------------------------------|
| **Framework**        | [Next.js 14](https://nextjs.org/) (App Router) + React 19 + TypeScript                  |
| **Base de données**  | PostgreSQL hébergé sur [Supabase](https://supabase.com/)                                 |
| **ORM**              | [Prisma](https://www.prisma.io/) (v7)                                                    |
| **Authentification** | Pseudo stocké dans `localStorage` + contexte React                                       |
| **UI / Styles**      | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) + [Framer Motion](https://www.framer.com/motion/) |
| **Graphiques**       | [Recharts](https://recharts.org/)                                                        |
| **Déploiement**      | [Vercel](https://vercel.com/)                                                            |
| **Gestion d'état**   | [TanStack Query](https://tanstack.com/query)                                             |

---

## 📦 Installation locale

### Prérequis

- Node.js 18+ et npm (ou pnpm/yarn)
- Compte Supabase (gratuit)

### Étapes

1. **Cloner le dépôt**

```bash
git clone https://github.com/ton-compte/fairshare.git
cd fairshare
```

2. **Installer les dépendances**

```bash
npm install
```

3. **Configurer les variables d'environnement**

Crée un fichier `.env` à la racine :

```env
DATABASE_URL="postgresql://postgres:[...]@aws-0-eu-central-1.pooler.supabase.co:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[...]@aws-0-eu-central-1.pooler.supabase.co:5432/postgres"
```

> Récupère ces URLs depuis Supabase → **Project Settings** → **Database** → **Connection string** → **URI**.

4. **Pousser le schéma Prisma vers la base de données**

```bash
npx prisma db push
npx prisma generate
```

5. **Lancer le serveur de développement**

```bash
npm run dev
```

L'application sera accessible sur [http://localhost:3000](http://localhost:3000).

---

## 📁 Structure du projet

```
fairshare/
├── app/                    # Routes Next.js (App Router)
│   ├── api/                # Endpoints REST (users, groups, expenses, stats, balances)
│   ├── layout.tsx
│   ├── page.tsx            # Écran principal (routage par onglets)
│   └── globals.css
├── components/
│   ├── fairshare/          # Composants métier (GroupList, Dashboard, Profile, etc.)
│   └── ui/                 # Composants shadcn/ui
├── contexts/
│   └── user-context.tsx    # Gestion du pseudo utilisateur
├── lib/
│   ├── prisma.ts           # Client Prisma singleton
│   └── debts.ts            # Algorithmes de calcul des dettes et minimisation
├── prisma/
│   └── schema.prisma       # Modèle de données
├── public/                 # Assets statiques (logo, icônes)
└── package.json
```
---

## 🧪 Scripts disponibles

| Commande               | Description                                         |
|------------------------|-----------------------------------------------------|
| `npm run dev`          | Lance le serveur de développement Next.js           |
| `npm run build`        | Compile l'application pour la production            |
| `npm run start`        | Démarre le serveur de production                    |
| `npx prisma studio`    | Ouvre Prisma Studio pour visualiser les données     |
| `npx prisma db push`   | Synchronise le schéma avec la base de données       |
| `npx prisma generate`  | Génère le client Prisma                             |

---

## 🤝 Contribuer

Les contributions sont les bienvenues !  
Pour signaler un bug ou proposer une amélioration, ouvre une issue ou une pull request.

---

## 📄 Licence

Ce projet a été réalisé dans le cadre du concours **Hackverse 3.0**.  
Code source libre de droits pour évaluation.

---

## 📧 Contact

Équipe FairShare – [Voir le dépôt GitHub](https://github.com/Njome-David/Pre_Hackverse_NEWBIES)
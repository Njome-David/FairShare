# FairShare

<p align="center">
  <img src="/public/fairshare-logo.svg" alt="FairShare Logo" width="120" />
</p>

<p align="center">
  <strong>Partagez vos dépenses entre amis, sans friction.</strong>
</p>

<p align="center">
  <a href="#-quest-ce-que-fairshare-">Présentation</a> ·
  <a href="#-comment-utiliser-fairshare-">Utilisation</a> ·
  <a href="#-fonctionnalit%C3%A9s">Fonctionnalités</a> ·
  <a href="#%EF%B8%8F-technologies">Technologies</a> ·
  <a href="#-installation-locale">Installation</a>
</p>

---

## 📖 Qu'est-ce que FairShare ?

**FairShare** est une application qui vous aide à gérer facilement les dépenses de groupe.  
Que vous partiez en week-end entre amis, que vous viviez en colocation, ou que vous organisiez un dîner, FairShare calcule **qui doit combien à qui**, et propose même le **nombre minimum de remboursements** pour tout équilibrer.

**Exemple concret :**  
Alice, Bob et Charlie partent en voyage. Alice paie l'hôtel (90 000 FCFA), Bob paie le restaurant (45 000 FCFA), et Charlie paie les billets de train (30 000 FCFA).  
Avec FairShare, vous n'avez pas besoin de faire 3 virements chacun. L'application vous dit exactement :  
👉 *"Bob doit 15 000 FCFA à Alice, Charlie doit 10 000 FCFA à Alice."*  
C'est tout !

Développée dans le cadre du concours **Hackverse 3.0 (Projet 4)**, FairShare est pensée pour être **simple**, **rapide**, et **utilisable sur mobile** comme une vraie application.

---

## 🚀 Comment utiliser FairShare ?

Voici un petit guide pour comprendre chaque écran de l'application.

### 1️⃣ Première connexion – *"Bienvenue sur FairShare"*
- Vous arrivez sur un écran d'accueil qui vous demande simplement **votre pseudo**.
- Pas de mot de passe, pas d'email : entrez le nom que vos amis reconnaîtront, et c'est parti !

### 2️⃣ L'écran d'accueil (liste des groupes)
- Après avoir entré votre pseudo, vous voyez la liste de tous vos groupes.
- Vous pouvez :
  - **Créer un nouveau groupe** (choisissez un nom et un emoji).
  - **Rejoindre un groupe existant** avec un code d'invitation (que vous recevez d'un ami).
  - **Accéder à un groupe** en cliquant dessus.

### 3️⃣ À l'intérieur d'un groupe
- **En haut**, vous voyez :
  - Le nom du groupe et le total dépensé.
  - Le **code d'invitation** (partagez-le avec vos amis pour qu'ils rejoignent).
  - La **liste des membres** (cliquez pour voir tous les participants).

- **La carte principale** vous indique **"On te doit X FCFA"** ou **"Tu dois X FCFA"**. C'est votre situation globale dans ce groupe.

- **Les remboursements suggérés** : FairShare a déjà calculé le nombre minimum de virements à faire. Pour chaque suggestion, vous pouvez marquer **"Remboursé"** quand c'est fait. Une barre de progression vous montre l'avancement.

- **Les dépenses récentes** : Toutes les dépenses du groupe apparaissent ici, classées par date. Vous pouvez en supprimer si besoin.

- **Le bouton "+" en bas** permet d'ajouter une nouvelle dépense. Remplissez la description, le montant (en FCFA, multiple de 25), qui a payé, et pour qui. La répartition se fait automatiquement !

### 4️⃣ La page Activité
- Accessible depuis la barre de navigation en bas.
- Elle vous montre **vos statistiques personnelles** sur tous vos groupes :
  - Total dépensé
  - Nombre de groupes
  - Nombre de dépenses
  - Moyenne par groupe
- Un **graphique en camembert** vous montre la répartition de vos dépenses par groupe.

### 5️⃣ La page Profil
- Accessible depuis la barre de navigation en bas.
- Vous y retrouvez votre **pseudo** et les mêmes statistiques globales.
- Un bouton **"Se déconnecter"** vous permet de changer de compte.

---

## ✨ Fonctionnalités

- 🔐 **Authentification simplifiée** par pseudo (sans mot de passe)
- 👥 **Création et gestion de groupes** avec code d'invitation unique
- 💸 **Ajout de dépenses partagées** avec répartition équitable ou personnalisée (montants en FCFA, multiples de 25)
- 📊 **Calcul automatique des soldes** : qui doit combien à qui
- ⚡ **Algorithme de minimisation des transactions** (Greedy) pour limiter les virements
- 📱 **Interface mobile-first** avec animations fluides (Framer Motion)
- 📈 **Page d'activité** avec statistiques personnelles et graphiques (Recharts)
- 👤 **Page de profil** avec résumé des dépenses et déconnexion
- 📲 **PWA** : installable sur l'écran d'accueil de votre smartphone (Android/iOS)

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
| **PWA**              | [@ducanh2912/next-pwa](https://www.npmjs.com/package/@ducanh2912/next-pwa)               |

---

## 📦 Installation locale

### Prérequis

- Node.js 18+ et npm
- Compte Supabase (gratuit)

### Étapes

1. **Cloner le dépôt**

```bash
git clone https://github.com/Njome-David/Pre_Hackverse_NEWBIES.git
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

## 📧 Contact

Équipe **NEWBIES** – [Voir le dépôt GitHub](https://github.com/Njome-David/Pre_Hackverse_NEWBIES)

---

**FairShare** – *Partagez vos dépenses entre amis, sans friction.*



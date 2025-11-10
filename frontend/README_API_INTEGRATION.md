# Smart Energy Hotel Manager - Frontend React

## 🎯 Architecture

Frontend React moderne prêt à se connecter à votre API Laravel backend.

### Stack Technologique
- **React 18** + TypeScript
- **Tailwind CSS** pour le design
- **Recharts** pour les graphiques énergétiques
- **Axios** pour les appels API
- **React Router** pour la navigation
- **Shadcn/ui** pour les composants UI

## 📁 Structure du projet

```
src/
├── components/
│   ├── ui/                    # Composants UI réutilisables (Shadcn)
│   ├── dashboards/            # Dashboards par rôle
│   │   ├── AdminDashboard.tsx
│   │   ├── TechnicianDashboard.tsx
│   │   └── ClientDashboard.tsx
│   └── DashboardLayout.tsx    # Layout principal avec sidebar
├── contexts/
│   ├── AuthContext.tsx        # Gestion authentification
│   └── ThemeContext.tsx       # Mode sombre/clair
├── pages/
│   ├── Index.tsx             # Page d'accueil
│   ├── Login.tsx             # Page de connexion
│   ├── Dashboard.tsx         # Router des dashboards
│   └── NotFound.tsx          # Page 404
├── services/
│   └── api.ts                # Configuration Axios + API endpoints
├── types/
│   └── index.ts              # Types TypeScript
└── index.css                 # Design system

```

## 🔌 Connexion à votre API Laravel

### 1. Configuration de base

Créez un fichier `.env` à la racine :

```env
VITE_API_URL=http://localhost:8000/api
```

### 2. Endpoints API attendus

Le fichier `src/services/api.ts` définit tous les endpoints. Votre API Laravel doit implémenter :

#### Authentification
```
POST   /api/login
POST   /api/logout  
GET    /api/user
```

#### Chambres
```
GET    /api/rooms
GET    /api/rooms/{id}
POST   /api/rooms
PUT    /api/rooms/{id}
DELETE /api/rooms/{id}
PATCH  /api/rooms/{id}/mode
PATCH  /api/rooms/{id}/equipment
```

#### Capteurs
```
GET    /api/sensors
GET    /api/sensors/room/{roomId}
GET    /api/sensors/{id}/readings
POST   /api/sensors
PUT    /api/sensors/{id}
DELETE /api/sensors/{id}
```

#### Alertes
```
GET    /api/alerts
PATCH  /api/alerts/{id}/acknowledge
PATCH  /api/alerts/{id}/resolve
```

#### Énergie
```
GET    /api/energy/consumption
GET    /api/energy/statistics
```

#### Interventions
```
GET    /api/interventions
GET    /api/interventions/technician/{id}
POST   /api/interventions
PUT    /api/interventions/{id}
PATCH  /api/interventions/{id}/complete
```

#### Utilisateurs
```
GET    /api/users
POST   /api/users
PUT    /api/users/{id}
DELETE /api/users/{id}
```

#### Rapports
```
POST   /api/reports/generate
```

### 3. Format des réponses attendues

#### Login
```json
{
  "token": "jwt-token-here",
  "user": {
    "id": "1",
    "email": "admin@hotel.com",
    "name": "Administrateur",
    "role": "admin",
    "roomId": null
  }
}
```

#### Liste des chambres
```json
{
  "data": [
    {
      "id": "1",
      "number": "101",
      "floor": 1,
      "type": "standard",
      "status": "occupied",
      "currentTemperature": 22.5,
      "targetTemperature": 22,
      "lightStatus": true,
      "climatizationStatus": true,
      "mode": "comfort",
      "clientId": "5"
    }
  ]
}
```

### 4. Authentification JWT

Le frontend envoie automatiquement le token JWT dans le header :
```
Authorization: Bearer {token}
```

Configuration dans `src/services/api.ts` :
```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

## 🚀 Installation et lancement

```bash
# Installer les dépendances
npm install

# Lancer en mode développement
npm run dev

# Build pour production
npm run build
```

## 👥 Comptes de démonstration

Actuellement en mode mock. Remplacez par vos vraies routes Laravel :

- **Admin** : admin@hotel.com
- **Technicien** : tech@hotel.com  
- **Client** : client@hotel.com

## 🎨 Design System

Couleurs définies dans `src/index.css` :
- **Primary** : Bleu tech (210 100% 45%)
- **Secondary** : Vert énergie (142 76% 36%)
- **Accent** : Or hôtelier (45 93% 47%)
- **Success, Warning, Info, Destructive** : Codes couleur sémantiques

Mode sombre automatique avec `ThemeContext`.

## 📊 Interfaces par rôle

### Administrateur
- Dashboard avec KPIs énergétiques
- Graphiques de consommation (Recharts)
- Gestion chambres, capteurs, utilisateurs
- Alertes et rapports PDF

### Technicien
- Interventions assignées
- Traitement des alertes
- Statistiques par zone
- Déclaration de pannes

### Client
- Contrôle chambre temps réel
- Modes : Confort, Éco, Nuit
- Température, éclairage, climatisation
- Stats de consommation personnelle

## 🔐 Sécurité

- JWT stocké dans localStorage
- Redirection automatique si 401
- Routes protégées avec `ProtectedRoute`
- Validation des inputs côté client

## 📱 Responsive

Optimisé pour desktop, tablette et mobile avec Tailwind CSS.

## 🛠 Personnalisation

### Modifier les couleurs
Éditez `src/index.css` (variables CSS HSL)

### Ajouter des pages
1. Créer le composant dans `src/pages/`
2. Ajouter la route dans `src/App.tsx`
3. Ajouter le lien dans `src/components/DashboardLayout.tsx`

### Modifier les endpoints API
Éditez `src/services/api.ts`

## 📚 Documentation Laravel attendue

Votre API Laravel doit :
- ✅ Utiliser JWT/Sanctum pour l'auth
- ✅ Retourner du JSON
- ✅ Gérer les CORS
- ✅ Implémenter les endpoints listés ci-dessus
- ✅ Respecter les formats de réponse

## 🐛 Debugging

Console browser pour voir :
- Appels API (Network tab)
- Erreurs TypeScript
- Logs de l'application

## 📝 TODO Backend Laravel

- [ ] Implémenter tous les endpoints API
- [ ] Configurer JWT/Sanctum
- [ ] Créer migrations MySQL
- [ ] Seeders pour données de test
- [ ] Middlewares d'authentification
- [ ] Policies pour les rôles
- [ ] Rate limiting
- [ ] Génération PDF (DomPDF)
- [ ] WebSockets pour temps réel (optionnel)

## 📞 Support

Frontend 100% fonctionnel et prêt à l'emploi dès que votre API Laravel sera opérationnelle !

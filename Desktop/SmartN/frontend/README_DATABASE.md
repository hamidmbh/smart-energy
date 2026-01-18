# Base de Données - Smart Energy Hotel Manager

## Vue d'ensemble

Ce projet utilise un système de base de données mock complet basé sur **localStorage** pour simuler une base de données réelle. La base de données est automatiquement initialisée avec des données de démonstration au premier chargement de l'application.

## Structure de la Base de Données

### Tables

#### 1. **Users** (Utilisateurs)
Stocke les informations des utilisateurs du système.

| Champ | Type | Description |
|-------|------|-------------|
| id | string | Identifiant unique |
| email | string | Email de l'utilisateur |
| name | string | Nom complet |
| role | 'admin' \| 'technician' \| 'client' | Rôle de l'utilisateur |
| roomId | string? | ID de la chambre (pour les clients) |

**Utilisateurs par défaut:**
- `admin@hotel.com` - Administrateur principal
- `tech@hotel.com` - Technicien
- `client@hotel.com` - Client (Chambre 101)
- `client2@hotel.com` - Client (Chambre 102)

#### 2. **Rooms** (Chambres)
Gère les chambres de l'hôtel et leurs équipements.

| Champ | Type | Description |
|-------|------|-------------|
| id | string | Identifiant unique |
| number | string | Numéro de chambre |
| floor | number | Étage |
| type | string | Type (Standard, Suite, Deluxe) |
| status | 'occupied' \| 'vacant' \| 'maintenance' | Statut |
| currentTemperature | number | Température actuelle (°C) |
| targetTemperature | number | Température cible (°C) |
| lightStatus | boolean | État des lumières |
| climatizationStatus | boolean | État de la climatisation |
| mode | 'eco' \| 'comfort' \| 'night' \| 'maintenance' | Mode de fonctionnement |
| clientId | string? | ID du client occupant |

**Données initiales:** 5 chambres (101, 102, 201, 202, 301)

#### 3. **Sensors** (Capteurs)
Capteurs installés dans les chambres.

| Champ | Type | Description |
|-------|------|-------------|
| id | string | Identifiant unique |
| name | string | Nom du capteur |
| type | 'temperature' \| 'humidity' \| 'light' \| 'motion' \| 'energy' | Type |
| roomId | string | ID de la chambre |
| value | number | Valeur actuelle |
| unit | string | Unité de mesure |
| status | 'active' \| 'inactive' \| 'error' | Statut |
| lastReading | string | Dernière lecture (ISO date) |

**Données initiales:** 6 capteurs répartis dans les chambres

#### 4. **Alerts** (Alertes)
Alertes et notifications système.

| Champ | Type | Description |
|-------|------|-------------|
| id | string | Identifiant unique |
| type | 'overconsumption' \| 'anomaly' \| 'maintenance' \| 'critical' | Type |
| severity | 'low' \| 'medium' \| 'high' \| 'critical' | Gravité |
| message | string | Message descriptif |
| roomId | string? | ID de la chambre concernée |
| sensorId | string? | ID du capteur concerné |
| status | 'pending' \| 'acknowledged' \| 'resolved' | Statut |
| createdAt | string | Date de création (ISO) |
| resolvedAt | string? | Date de résolution (ISO) |

**Données initiales:** 3 alertes actives

#### 5. **EnergyConsumption** (Consommation Énergétique)
Historique de consommation énergétique.

| Champ | Type | Description |
|-------|------|-------------|
| id | string | Identifiant unique |
| roomId | string? | ID de la chambre |
| date | string | Date (YYYY-MM-DD) |
| consumption | number | Consommation (kWh) |
| cost | number | Coût (€) |
| period | 'hourly' \| 'daily' \| 'weekly' \| 'monthly' | Période |

**Données initiales:** 30 jours d'historique pour toutes les chambres (~150 enregistrements)

#### 6. **Interventions** (Interventions Techniques)
Interventions de maintenance et réparations.

| Champ | Type | Description |
|-------|------|-------------|
| id | string | Identifiant unique |
| type | string | Type d'intervention |
| description | string | Description détaillée |
| roomId | string | ID de la chambre |
| technicianId | string | ID du technicien |
| status | 'pending' \| 'in_progress' \| 'completed' \| 'cancelled' | Statut |
| priority | 'low' \| 'medium' \| 'high' \| 'urgent' | Priorité |
| createdAt | string | Date de création (ISO) |
| completedAt | string? | Date de complétion (ISO) |
| notes | string? | Notes additionnelles |

**Données initiales:** 3 interventions (en cours, en attente, terminée)

## API Mock

Toutes les opérations de base de données sont disponibles via des API mockées dans `src/services/api.ts`:

### Rooms API
```typescript
roomsAPI.getAll()                                    // Obtenir toutes les chambres
roomsAPI.getOne(id)                                  // Obtenir une chambre
roomsAPI.create(data)                                // Créer une chambre
roomsAPI.update(id, data)                            // Mettre à jour une chambre
roomsAPI.delete(id)                                  // Supprimer une chambre
roomsAPI.updateMode(id, mode)                        // Changer le mode
roomsAPI.controlEquipment(id, equipment, state)      // Contrôler un équipement
```

### Sensors API
```typescript
sensorsAPI.getAll()                    // Obtenir tous les capteurs
sensorsAPI.getByRoom(roomId)           // Capteurs d'une chambre
sensorsAPI.create(data)                // Créer un capteur
sensorsAPI.update(id, data)            // Mettre à jour un capteur
sensorsAPI.delete(id)                  // Supprimer un capteur
```

### Alerts API
```typescript
alertsAPI.getAll()                     // Obtenir toutes les alertes
alertsAPI.acknowledge(id)              // Acquitter une alerte
alertsAPI.resolve(id, notes)           // Résoudre une alerte
```

### Energy API
```typescript
energyAPI.getConsumption(period, roomId?)    // Obtenir la consommation
energyAPI.getStatistics(startDate, endDate)  // Statistiques d'énergie
```

### Interventions API
```typescript
interventionsAPI.getAll()                    // Toutes les interventions
interventionsAPI.getByTechnician(id)         // Par technicien
interventionsAPI.create(data)                // Créer une intervention
interventionsAPI.update(id, data)            // Mettre à jour
interventionsAPI.complete(id, notes)         // Marquer comme terminée
```

### Users API
```typescript
usersAPI.getAll()                      // Obtenir tous les utilisateurs
usersAPI.create(data)                  // Créer un utilisateur
usersAPI.update(id, data)              // Mettre à jour
usersAPI.delete(id)                    // Supprimer
```

## Fonctions Utilitaires

### Gestion de la Base de Données

```typescript
import { initializeDatabase, resetDatabase, getDatabaseStats } from '@/services/database';

// Initialiser la base de données (automatique au démarrage)
initializeDatabase();

// Réinitialiser complètement la base de données
resetDatabase();

// Obtenir les statistiques
const stats = getDatabaseStats();
// Retourne: { users: 4, rooms: 5, sensors: 6, alerts: 3, energyRecords: 150, interventions: 3 }
```

### Accès Direct aux Tables

```typescript
import { usersDB, roomsDB, sensorsDB, alertsDB, energyDB, interventionsDB } from '@/services/database';

// Opérations CRUD
const allRooms = roomsDB.getAll();
const room = roomsDB.getById('101');
roomsDB.create(newRoom);
roomsDB.update('101', { status: 'maintenance' });
roomsDB.delete('101');

// Requêtes personnalisées
const occupiedRooms = roomsDB.query(r => r.status === 'occupied');
const criticalAlerts = alertsDB.query(a => a.severity === 'critical');
```

## Authentification

L'authentification utilise également la base de données mock:

```typescript
// Se connecter avec un email existant
await login('admin@hotel.com', 'any-password');

// Les utilisateurs disponibles sont dans la table users
// Tout mot de passe est accepté pour la démo
```

## Migration vers une API Réelle

Pour connecter à une API Laravel réelle:

1. Configurer `VITE_API_URL` dans `.env`
2. Les appels API sont déjà structurés dans `src/services/api.ts`
3. Remplacer les implémentations mock par de vrais appels `axios`
4. La structure des données est déjà compatible

## Persistance des Données

- Les données sont stockées dans `localStorage`
- Elles persistent entre les rechargements de page
- Pour réinitialiser: supprimer les clés `db_*` du localStorage ou appeler `resetDatabase()`

## Console de Développement

Pour inspecter ou manipuler la base de données en développement:

```javascript
// Dans la console du navigateur
import { usersDB, roomsDB, resetDatabase } from './src/services/database';

// Voir toutes les chambres
console.table(roomsDB.getAll());

// Ajouter une chambre
roomsDB.create({ id: '401', number: '401', floor: 4, type: 'Suite', status: 'vacant' });

// Réinitialiser tout
resetDatabase();
```

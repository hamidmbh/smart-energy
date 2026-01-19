# Smart Energy Hotel Manager

A comprehensive energy management system for hotels that enables real-time monitoring, control, and optimization of energy consumption across rooms, floors, and equipment.

## 🎯 Overview

Smart Energy Hotel Manager is a full-stack application designed to help hotels monitor and manage their energy consumption efficiently. The system provides real-time sensor data, automated alerts, room control capabilities, and detailed energy analytics for administrators, technicians, and guests.

## ✨ Features

### Core Functionality
- **Multi-Role System**: Separate dashboards for Administrators, Technicians, and Clients
- **Room Management**: Control temperature, lighting, and climatization for each room
- **Sensor Monitoring**: Real-time data from temperature, humidity, light, motion, and energy sensors
- **Energy Analytics**: Track consumption patterns, costs, and generate statistics
- **Alert System**: Automated alerts for overconsumption, anomalies, and maintenance needs
- **Intervention Management**: Track and manage technical interventions
- **Report Generation**: Generate PDF reports for energy consumption and statistics
- **Floor Management**: Organize rooms by floors with technician assignments

### User Roles

#### 👨‍💼 Administrator
- Dashboard with KPIs and energy consumption graphs
- Manage rooms, sensors, users, and floors
- View and resolve alerts
- Generate comprehensive reports
- Monitor overall hotel energy consumption

#### 🔧 Technician
- View assigned interventions
- Acknowledge and resolve alerts
- Monitor assigned floors and rooms
- Track intervention history
- Declare equipment failures


## 🏗️ Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Charts**: Recharts
- **State Management**: React Context API
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Form Handling**: React Hook Form + Zod validation

### Backend
- **Framework**: Laravel 12
- **PHP Version**: 8.2+
- **Authentication**: Laravel Sanctum (Personal Access Tokens)
- **Database**: MySQL
- **MQTT**: Real-time sensor data via PHP MQTT Client
- **PDF Generation**: DomPDF
- **API**: RESTful API with versioning (v1)

## 📁 Project Structure

```
smart energy/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/      # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   └── dashboards/ # Role-specific dashboards
│   │   ├── contexts/       # React contexts (Auth, Theme)
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services and database mock
│   │   └── types/          # TypeScript type definitions
│   ├── public/             # Static assets
│   └── package.json
│
└── backend/                 # Laravel backend API
    ├── app/
    │   ├── Http/
    │   │   └── Controllers/
    │   │       └── Api/V1/ # API controllers
    │   ├── Models/         # Eloquent models
    │   └── Observers/      # Model observers
    ├── database/
    │   ├── migrations/     # Database migrations
    │   └── seeders/        # Database seeders
    └── routes/
        └── api.php         # API routes
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm/bun
- **PHP** 8.2+
- **Composer** (PHP dependency manager)
- **MySQL** 8.0+
- **MQTT Broker** (optional, for real-time sensor data)

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd "smart energy"
```

#### 2. Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=smart_energy
# DB_USERNAME=your_username
# DB_PASSWORD=your_password

# Run migrations and seeders
php artisan migrate --seed

# Start the development server
php artisan serve
```

The backend API will be available at `http://localhost:8000`

#### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install
# or
bun install

# Copy environment file
cp .env.example .env

# Configure API URL in .env
# VITE_API_URL=http://localhost:8000/api/v1

# Start development server
npm run dev
# or
bun dev
```

The frontend will be available at `http://localhost:5173` (or the port shown in terminal)

### Demo Accounts

After running migrations with seeders, you can use these accounts:

- **Administrator**: `admin@hotel.com` / `password`
- **Technician**: `tech@hotel.com` / `password`

## 🔌 API Documentation

### Base URL
```
http://localhost:8000/api/v1
```

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer {token}
```

### Endpoints

#### Authentication
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /user` - Get current authenticated user

#### Rooms
- `GET /rooms` - List all rooms
- `GET /rooms/{id}` - Get room details
- `POST /rooms` - Create a new room
- `PUT /rooms/{id}` - Update room
- `DELETE /rooms/{id}` - Delete room
- `PATCH /rooms/{id}/mode` - Update room mode
- `PATCH /rooms/{id}/equipment` - Control room equipment

#### Sensors
- `GET /sensors` - List all sensors
- `GET /sensors/{id}` - Get sensor details
- `GET /sensors/room/{roomId}` - Get sensors by room
- `GET /sensors/{id}/readings` - Get sensor readings
- `POST /sensors` - Create sensor
- `PUT /sensors/{id}` - Update sensor
- `DELETE /sensors/{id}` - Delete sensor

#### Alerts
- `GET /alerts` - List all alerts
- `PATCH /alerts/{id}/acknowledge` - Acknowledge alert
- `PATCH /alerts/{id}/resolve` - Resolve alert

#### Energy
- `GET /energy/consumption` - Get energy consumption data
- `GET /energy/statistics` - Get energy statistics

#### Interventions
- `GET /interventions` - List all interventions
- `GET /interventions/technician/{id}` - Get interventions by technician
- `POST /interventions` - Create intervention
- `PUT /interventions/{id}` - Update intervention
- `PATCH /interventions/{id}/complete` - Complete intervention

#### Users
- `GET /users` - List all users
- `POST /users` - Create user
- `PUT /users/{id}` - Update user
- `DELETE /users/{id}` - Delete user

#### Floors
- `GET /floors` - List all floors
- `GET /floors/{id}` - Get floor details
- `POST /floors` - Create floor
- `PUT /floors/{id}` - Update floor
- `DELETE /floors/{id}` - Delete floor

#### Reports
- `POST /reports/generate` - Generate PDF report

For detailed API documentation, see [frontend/README_API_INTEGRATION.md](frontend/README_API_INTEGRATION.md)

## 🗄️ Database

The application uses MySQL with the following main tables:

- `users` - User accounts and authentication
- `rooms` - Hotel rooms and their configurations
- `floors` - Building floors
- `sensors` - Sensor devices
- `sensor_readings` - Historical sensor data
- `sensors_data` - Real-time sensor data (MQTT)
- `alerts` - System alerts and notifications
- `energy_readings` - Energy consumption records
- `interventions` - Technical interventions
- `reports` - Generated reports
- `technician_floor` - Technician-floor assignments

For detailed database documentation, see [frontend/README_DATABASE.md](frontend/README_DATABASE.md)

## 🔧 Development

### Frontend Development

```bash
cd frontend

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Backend Development

```bash
cd backend

# Start Laravel development server
php artisan serve

# Run migrations
php artisan migrate

# Run seeders
php artisan db:seed

# Clear cache
php artisan cache:clear
php artisan config:clear

# Run tests
php artisan test
```

### MQTT Integration

The backend includes MQTT support for real-time sensor data:

```bash
# Listen to MQTT messages
php artisan mqtt:listen

# Test room sensor synchronization
php artisan test:room-sensor-sync
```

Configure MQTT settings in `backend/.env`:
```
MQTT_BROKER_HOST=localhost
MQTT_BROKER_PORT=1883
MQTT_CLIENT_ID=smart_energy_backend
```

## 🎨 Customization

### Frontend Styling

Colors and design tokens are defined in `frontend/src/index.css`. Modify CSS variables to customize the theme:

```css
--primary: 210 100% 45%;    /* Primary blue */
--secondary: 142 76% 36%;   /* Energy green */
--accent: 45 93% 47%;       /* Hotel gold */
```

### Adding New Pages

1. Create component in `frontend/src/pages/`
2. Add route in `frontend/src/App.tsx`
3. Add navigation link in `frontend/src/components/DashboardLayout.tsx`

### Adding New API Endpoints

1. Create controller in `backend/app/Http/Controllers/Api/V1/`
2. Add route in `backend/routes/api.php`
3. Create resource class in `backend/app/Http/Resources/` (optional)
4. Update frontend API service in `frontend/src/services/api.ts`

## 🧪 Testing

### Frontend
```bash
cd frontend
npm run lint
```

### Backend
```bash
cd backend
php artisan test
```

## 📦 Building for Production

### Frontend
```bash
cd frontend
npm run build
```

The production build will be in `frontend/dist/`

### Backend
```bash
cd backend

# Optimize for production
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Build assets (if using Laravel Mix/Vite)
npm run build
```

## 🔐 Security

- JWT tokens stored securely in localStorage
- Laravel Sanctum for API authentication
- CORS configured for frontend-backend communication
- Protected routes with authentication middleware
- Input validation on both frontend and backend
- SQL injection protection via Eloquent ORM
- XSS protection via Laravel's Blade templating

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Tablet (768px - 1919px)
- Mobile (320px - 767px)

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

## 🙏 Acknowledgments

- [Laravel](https://laravel.com) - PHP Framework
- [React](https://react.dev) - UI Library
- [shadcn/ui](https://ui.shadcn.com) - UI Components
- [Tailwind CSS](https://tailwindcss.com) - CSS Framework
- [Recharts](https://recharts.org) - Chart Library

---

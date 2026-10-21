# Banking Application

Bu proje, temel bankacılık işlemlerini (hesap yönetimi, para transferi, işlem geçmişi vb.) içeren tam yığın bir uygulamadır. Proje hem frontend hem backend katmanından oluşur ve PostgreSQL veritabanı kullanır.

---

## 🔧 Teknolojiler

### Backend

- Java 17 (Spring Boot)
- Spring Security, Spring Data JPA
- PostgreSQL
- Maven

### Frontend

- React (Vite)
- Context API
- Ant Design
- Axios
- SCSS

---

### Frontend Kurulum ve Çalıştırma

```bash
npm install
npm run dev
```

## 🐳 Docker ile Veritabanı Başlatma

İsteğe bağlı olarak PostgreSQL veritabanını Docker ile başlatabilirsiniz:

```bash
docker-compose -f docker-compose.dev.yml up -d postgres_db
```

## Frontend (frontend/)

### Prerequisites
- Node.js 18+ and npm 8+

### Setup

1. Install dependencies:
```bash
cd frontend
npm install
cd ..
```

### Available Commands

**Development Server:**
```bash
cd frontend
npm run dev
cd ..
```
Opens the app at `http://localhost:5173`

**Production Build:**
```bash
cd frontend
npm run build
cd ..
```
Creates optimized build in `frontend/dist/`

**Run Tests:**
```bash
cd frontend
npm test
cd ..
```

**Build & Preview:**
```bash
cd frontend
npm run preview
cd ..
```
Preview production build locally

### Environment Variables

The frontend comes with a pre-configured `.env` file:
```
VITE_API_BASE_URL=http://localhost:8000
```

The frontend connects to the backend API at this URL. For production deployment, set `VITE_API_BASE_URL` to the deployed backend URL via `--build-arg` in Docker or via your CI/CD environment.

### Running with the Backend

The frontend requires the backend server to be running. See the **Full-Stack Local Development** section in this README for complete setup instructions.


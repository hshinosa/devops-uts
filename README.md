# DevOps UTS - Web To-Do List

Aplikasi Task Management berbasis Next.js dengan implementasi DevOps end-to-end.

## 📋 Project Status

### ✅ Completed
- **Application**: Next.js 15 + MySQL database ready
- **Authentication**: Login system with NextAuth.js (admin/admin123)
- **Docker Image**: Built and pushed to Docker Hub

### 🔄 In Progress (Tim)
- **Anggota 1**: ✅ Docker + Authentication (COMPLETE)
- **Anggota 2**: Docker Compose
- **Anggota 3**: Kubernetes
- **Anggota 4**: Ansible Inventory
- **Anggota 5**: Ansible Playbook
- **Anggota 6**: Prometheus
- **Anggota 7**: Grafana

## 🐳 Docker Image (Anggota 1)

**Image tersedia di Docker Hub**: `mochammadrs/todo-app:latest`

```bash
# Pull image
docker pull mochammadrs/todo-app:latest

# Run container
docker run -d -p 3000:3000 \
  -e DB_HOST=host.docker.internal \
  -e DB_PORT=3306 \
  -e DB_USER=root \
  -e DB_NAME=todo_devops \
  mochammadrs/todo-app:latest
```

📖 **Detail lengkap**: Lihat [DOCKER_IMPLEMENTATION.md](./DOCKER_IMPLEMENTATION.md)

## 🚀 Quick Start (Development)

```bash
# 1. Clone repository
git clone <repo-url>
cd devops-uts/app

# 2. Install dependencies
npm install

# 3. Setup environment
cp .env.example .env.local

# 4. Setup database
node scripts/setupDb.js

# 5. Run development server
npm run dev
```

## 📚 Dokumentasi

- **[docs/TEAM_GUIDE.md](docs/TEAM_GUIDE.md)** - Panduan untuk setiap anggota tim
- **[docs/PROJECT_DEVOPS.md](docs/PROJECT_DEVOPS.md)** - Spesifikasi proyek lengkap
- **[docs/QUICK_START.md](docs/QUICK_START.md)** - Quick reference commands
- **[DOCKER_IMPLEMENTATION.md](./DOCKER_IMPLEMENTATION.md)** - Docker implementation (Anggota 1)

## 🛠️ Tech Stack

- **Frontend/Backend**: Next.js 15
- **Database**: MySQL 8.0
- **Animations**: Framer Motion
- **Container**: Docker
- **Orchestration**: Docker Compose, Kubernetes (WIP)
- **Automation**: Ansible (WIP)
- **Monitoring**: Prometheus + Grafana (WIP)

## 👥 Tim & Pembagian Tugas

Lihat detail di [docs/TEAM_GUIDE.md](docs/TEAM_GUIDE.md)

---

**University Project** - DevOps Implementation

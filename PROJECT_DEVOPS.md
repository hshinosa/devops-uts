---

# 📌 Proyek UAS DevOps

## Web To-Do List Berbasis React, Express, dan PostgreSQL

---

## 1️⃣ Deskripsi Aplikasi

Aplikasi **Web To-Do List** merupakan aplikasi berbasis web yang digunakan untuk membantu pengguna dalam mencatat, mengelola, dan memantau daftar tugas harian secara digital. Aplikasi ini dibangun dengan pendekatan **full-stack** dan diintegrasikan menggunakan konsep **DevOps**.

Aplikasi terdiri dari tiga komponen utama:

* **Frontend** menggunakan React.js sebagai antarmuka pengguna
* **Backend** menggunakan Express.js sebagai REST API
* **Database** menggunakan PostgreSQL untuk penyimpanan data tugas

Seluruh aplikasi dikemas menggunakan **Docker**, dikelola dengan **Docker Compose** dan **Kubernetes**, dikonfigurasi otomatis menggunakan **Ansible**, serta dimonitor menggunakan **Prometheus** dan **Grafana**.

---

## 2️⃣ Tujuan Pengembangan

* Mengimplementasikan konsep **DevOps end-to-end**
* Menerapkan containerization menggunakan Docker
* Mengelola deployment menggunakan Kubernetes
* Mengotomatisasi konfigurasi server menggunakan Ansible
* Melakukan monitoring dan visualisasi sistem menggunakan Prometheus dan Grafana

---

## 3️⃣ Arsitektur Sistem

```
User
 ↓
React Frontend (Port 3000)
 ↓
Express Backend API (Port 5000)
 ↓
PostgreSQL Database (Port 5432)
```

---

## 4️⃣ Teknologi yang Digunakan

| Komponen      | Teknologi                  |
| ------------- | -------------------------- |
| Frontend      | React.js                   |
| Backend       | Express.js (Node.js)       |
| Database      | PostgreSQL                 |
| Container     | Docker                     |
| Orkestrasi    | Docker Compose, Kubernetes |
| Automation    | Ansible                    |
| Monitoring    | Prometheus                 |
| Visualization | Grafana                    |

---

## 5️⃣ Fitur Aplikasi

* Menambahkan To-Do
* Menampilkan daftar To-Do
* Mengubah status To-Do (selesai/belum)
* Menghapus To-Do
* Penyimpanan data persisten menggunakan PostgreSQL

---

## 6️⃣ Pembagian Tugas Kelompok (7 Orang)

### 👤 Anggota 1 – Docker (Build & Image Management)

**Tanggung Jawab:**

* Mengelola repository GitHub
* Membuat Dockerfile untuk:

  * React Frontend
  * Express Backend
* Melakukan build image aplikasi
* Melakukan push image ke Docker Hub

**Yang Dikembangkan:**

* `frontend/Dockerfile`
* `backend/Dockerfile`
* Docker Hub repository
* Dokumentasi build image

---

### 👤 Anggota 2 – Docker Compose (Local Orchestration)

**Tanggung Jawab:**

* Membuat file `docker-compose.yml`
* Mengatur service:

  * Frontend
  * Backend
  * PostgreSQL
* Mengatur environment variable
* Menjalankan aplikasi secara lokal

**Yang Dikembangkan:**

* `docker-compose.yml`
* Environment variable database
* Dokumentasi local deployment

---

### 👤 Anggota 3 – Kubernetes (Deployment & Service)

**Tanggung Jawab:**

* Menyusun manifest Kubernetes
* Membuat:

  * Deployment frontend
  * Deployment backend
  * Deployment PostgreSQL
  * Service dan ConfigMap
* Melakukan deployment ke cluster Kubernetes

**Yang Dikembangkan:**

* `k8s/frontend.yaml`
* `k8s/backend.yaml`
* `k8s/postgres.yaml`
* Service & ConfigMap

---

### 👤 Anggota 4 – Ansible (Infrastructure Setup)

**Tanggung Jawab:**

* Menyusun inventory Ansible
* Mengonfigurasi managed host
* Menginstal dependency server:

  * Docker
  * Kubernetes tools
  * Node Exporter

**Yang Dikembangkan:**

* `ansible/inventory`
* Konfigurasi managed host
* Dokumentasi setup server

---

### 👤 Anggota 5 – Ansible (Automation Playbook)

**Tanggung Jawab:**

* Membuat playbook Ansible
* Mengotomatisasi:

  * Instalasi Docker
  * Pull image Docker
  * Setup environment server
* Menjalankan playbook otomatis

**Yang Dikembangkan:**

* `ansible/setup.yml`
* Role Ansible (opsional)
* Dokumentasi automation

---

### 👤 Anggota 6 – Prometheus (Monitoring)

**Tanggung Jawab:**

* Menginstal dan mengonfigurasi Prometheus
* Menyusun file `prometheus.yml`
* Mengatur scraping metrics:

  * Node Exporter
  * Kubernetes
* Memastikan target dalam kondisi **UP**

**Yang Dikembangkan:**

* `monitoring/prometheus.yml`
* Konfigurasi monitoring
* Dokumentasi metrics

---

### 👤 Anggota 7 – Grafana (Visualization)

**Tanggung Jawab:**

* Menginstal Grafana
* Menghubungkan Grafana ke Prometheus
* Membuat dashboard monitoring:

  * CPU Usage
  * Memory Usage
  * Pod Status
  * Container Resource Usage

**Yang Dikembangkan:**

* Dashboard Grafana
* Data source Prometheus
* Dokumentasi visualisasi

---

## 7️⃣ Struktur Direktori Proyek

```
todo-devops/
│
├── frontend/
│   └── Dockerfile
│
├── backend/
│   └── Dockerfile
│
├── docker-compose.yml
│
├── k8s/
│   ├── frontend.yaml
│   ├── backend.yaml
│   └── postgres.yaml
│
├── ansible/
│   ├── inventory
│   └── setup.yml
│
├── monitoring/
│   └── prometheus.yml
│
└── README.md
```

---

## 8️⃣ Output yang Diharapkan

* Aplikasi To-Do List berjalan dengan baik
* Image berhasil di-push ke Docker Hub
* Deployment aktif di Kubernetes
* Konfigurasi server otomatis menggunakan Ansible
* Monitoring aktif di Prometheus
* Dashboard Grafana menampilkan data real-time

---

## 9️⃣ Penutup

Proyek ini diharapkan dapat menunjukkan pemahaman mahasiswa terhadap penerapan konsep **DevOps secara menyeluruh**, mulai dari development, deployment, automation, hingga monitoring dan visualisasi sistem.
# 📁 Ansible Infrastructure Setup

**Anggota 4 - Proyek UAS DevOps: Web To-Do List**

Direktori ini berisi konfigurasi Ansible untuk Infrastructure Setup, mencakup automatisasi instalasi Docker, Kubernetes tools, dan Node Exporter pada managed hosts.

---

## 📋 Struktur Direktori

```
ansible/
├── ansible.cfg              # Konfigurasi default Ansible
├── inventory                # Daftar managed hosts
├── group_vars/
│   └── all.yml              # Variabel global untuk semua hosts
├── install-docker.yml       # Playbook instalasi Docker
├── install-kubernetes.yml   # Playbook instalasi Kubernetes tools
├── install-node-exporter.yml # Playbook instalasi Node Exporter
└── README.md                # Dokumentasi ini
```

---

## ⚙️ Prerequisites

### Pada Control Node (mesin yang menjalankan Ansible):
- Python 3.8+
- Ansible 2.14+
- SSH key untuk akses ke managed hosts

### Pada Managed Hosts:
- Ubuntu 20.04 / 22.04 LTS
- Python 3 terinstal
- SSH server aktif
- User dengan akses sudo tanpa password

---

## 🚀 Cara Penggunaan

### 1. Konfigurasi Inventory

Edit file `inventory` dan sesuaikan IP address managed hosts:

```ini
[webservers]
web1 ansible_host=YOUR_WEB_SERVER_IP ansible_user=ubuntu

[kubernetes_master]
k8s-master ansible_host=YOUR_K8S_MASTER_IP ansible_user=ubuntu
```

### 2. Konfigurasi Variables

Edit `group_vars/all.yml` untuk menyesuaikan versi software:

```yaml
docker_version: '24.0'
kubernetes_version: '1.28'
node_exporter_version: '1.7.0'
```

### 3. Test Koneksi

```bash
# Test koneksi ke semua hosts
ansible all -m ping

# Test koneksi ke grup tertentu
ansible webservers -m ping
```

### 4. Jalankan Playbook

```bash
# Install Docker pada semua hosts
ansible-playbook install-docker.yml

# Install Kubernetes tools pada kubernetes group
ansible-playbook install-kubernetes.yml

# Install Node Exporter pada semua hosts
ansible-playbook install-node-exporter.yml

# Jalankan semua playbook sekaligus
ansible-playbook install-docker.yml install-kubernetes.yml install-node-exporter.yml
```

---

## 📝 Deskripsi Playbook

### `install-docker.yml`
Menginstal Docker CE dengan fitur:
- ✅ Docker CE (Community Edition)
- ✅ Docker Compose Plugin
- ✅ Docker Buildx Plugin
- ✅ Konfigurasi logging (json-file driver)
- ✅ Menambahkan user ke docker group

### `install-kubernetes.yml`
Menginstal Kubernetes tools dengan konfigurasi:
- ✅ kubectl, kubeadm, kubelet
- ✅ Disable swap
- ✅ Kernel modules (overlay, br_netfilter)
- ✅ Sysctl networking configuration
- ✅ Containerd dengan systemd cgroup driver

### `install-node-exporter.yml`
Menginstal Prometheus Node Exporter dengan:
- ✅ Binary dari GitHub releases
- ✅ Systemd service dengan security hardening
- ✅ Textfile collector directory
- ✅ Firewall configuration (jika UFW aktif)

---

## 🔍 Verifikasi

### Check Syntax Playbook
```bash
ansible-playbook --syntax-check install-docker.yml
ansible-playbook --syntax-check install-kubernetes.yml
ansible-playbook --syntax-check install-node-exporter.yml
```

### Dry Run (Check Mode)
```bash
ansible-playbook install-docker.yml --check
ansible-playbook install-kubernetes.yml --check
ansible-playbook install-node-exporter.yml --check
```

### List Tasks
```bash
ansible-playbook install-docker.yml --list-tasks
```

### Inventory Graph
```bash
ansible-inventory --graph
```

---

## 🐛 Troubleshooting

### SSH Connection Failed
```bash
# Test SSH langsung
ssh -i ~/.ssh/id_rsa ubuntu@192.168.1.10

# Cek SSH key permissions
chmod 600 ~/.ssh/id_rsa
```

### Permission Denied
```bash
# Pastikan user memiliki sudo access tanpa password
# Di managed host, jalankan:
echo "ubuntu ALL=(ALL) NOPASSWD:ALL" | sudo tee /etc/sudoers.d/ubuntu
```

### Package Installation Failed
```bash
# Clear apt cache di managed host
ansible all -m apt -a "update_cache=yes" --become
```

---

## 📊 Metrics Endpoint

Setelah Node Exporter terinstal, metrics tersedia di:
```
http://<host-ip>:9100/metrics
```

Contoh query untuk Prometheus:
```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'node'
    static_configs:
      - targets: 
        - '192.168.1.10:9100'
        - '192.168.1.11:9100'
```

---

## 📚 Referensi

- [Ansible Documentation](https://docs.ansible.com/)
- [Docker Installation Guide](https://docs.docker.com/engine/install/)
- [Kubernetes Setup Guide](https://kubernetes.io/docs/setup/)
- [Node Exporter GitHub](https://github.com/prometheus/node_exporter)

---

**Dibuat oleh**: Anggota 4  
**Proyek**: UAS DevOps - Web To-Do List

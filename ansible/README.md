# Ansible Automation

Automated infrastructure setup playbook untuk Todo DevOps project.

## 📋 Overview

Playbook ini mengotomatisasi instalasi dan konfigurasi tools DevOps:
- **Docker CE** - Container runtime
- **Docker Compose** - Multi-container orchestration
- **Kubernetes Tools** - kubectl dan Minikube
- **Node Exporter** - Prometheus metrics exporter

## 🚀 Quick Start

### Prerequisites

1. **Ansible installed** on control machine:
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ansible -y

# Verify
ansible --version
```

2. **Inventory file** exists (created by Anggota 4):
```bash
ls ansible/inventory
```

3. **SSH access** to managed hosts configured

### Run Playbook

```bash
# Syntax check
ansible-playbook ansible/setup.yml --syntax-check -i ansible/inventory

# Dry run (no changes)
ansible-playbook ansible/setup.yml -i ansible/inventory --check

# Execute playbook
ansible-playbook ansible/setup.yml -i ansible/inventory

# Run with verbose output
ansible-playbook ansible/setup.yml -i ansible/inventory -v
```

### Run Specific Phases (Using Tags)

```bash
# Only install Docker
ansible-playbook ansible/setup.yml -i ansible/inventory --tags docker

# Only install Kubernetes tools
ansible-playbook ansible/setup.yml -i ansible/inventory --tags kubernetes

# Only install Node Exporter
ansible-playbook ansible/setup.yml -i ansible/inventory --tags node_exporter

# Run verification only
ansible-playbook ansible/setup.yml -i ansible/inventory --tags verify
```

## 📦 What Gets Installed

### 1. System Updates
- Update apt cache
- Upgrade all packages
- Install common dependencies (curl, wget, git, vim, etc.)

### 2. Docker
- Docker CE (latest stable)
- Docker CLI
- Containerd
- Docker Buildx Plugin
- Docker Compose Plugin
- Adds user to docker group

### 3. Docker Compose
- Docker Compose v2.24.0+
- Installed to `/usr/local/bin/docker-compose`
- Symlinked to `/usr/bin/docker-compose`

### 4. Kubernetes Tools
- **kubectl** - Kubernetes CLI
- **Minikube** - Local Kubernetes cluster
- **conntrack** - Required dependency

### 5. Node Exporter
- Version 1.7.0
- Runs as systemd service
- Listens on port 9100
- User: `node_exporter`

## ✅ Verification

### Manual Verification Commands

```bash
# Check all installations
ansible all -i ansible/inventory -m command -a "docker --version"
ansible all -i ansible/inventory -m command -a "docker-compose --version"
ansible all -i ansible/inventory -m command -a "kubectl version --client"
ansible all -i ansible/inventory -m command -a "minikube version"
ansible all -i ansible/inventory -m shell -a "systemctl status node_exporter"

# Test Docker
ansible all -i ansible/inventory -m shell -a "docker run hello-world"

# Test Node Exporter metrics
ansible all -i ansible/inventory -m shell -a "curl -s http://localhost:9100/metrics | head -n 10"
```

### Expected Output

```
Docker version 24.0.x
Docker Compose version v2.24.0
kubectl version --client: v1.28.x
minikube version: v1.32.x
node_exporter.service - active (running)
```

## 🔧 Troubleshooting

### Issue 1: "UNREACHABLE!" error
```bash
# Test connectivity
ansible all -i ansible/inventory -m ping

# Check SSH access
ssh user@hostname

# Fix: Update inventory with correct credentials
```

### Issue 2: Docker installation fails
```bash
# Check internet connection
ansible all -i ansible/inventory -m shell -a "ping -c 3 google.com"

# Manually update cache
ansible all -i ansible/inventory -m apt -a "update_cache=yes" -b

# Re-run with verbose
ansible-playbook setup.yml -i inventory -v --tags docker
```

### Issue 3: Permission denied for Docker
```bash
# Add user to docker group (already done by playbook)
sudo usermod -aG docker $USER

# Logout and login again
# Or activate group without logout
newgrp docker

# Test
docker run hello-world
```

### Issue 4: Minikube won't start
```bash
# Check virtualization
egrep -c '(vmx|svm)' /proc/cpuinfo  # Should be > 0

# Start with Docker driver
minikube start --driver=docker

# Check status
minikube status
```

### Issue 5: Node Exporter not accessible
```bash
# Check service status
systemctl status node_exporter

# Check port
netstat -tuln | grep 9100

# Check logs
journalctl -u node_exporter -f

# Restart service
sudo systemctl restart node_exporter
```

## 📊 Playbook Structure

```
ansible/setup.yml
├── PHASE 1: System Update & Prerequisites
├── PHASE 2: Docker Installation
├── PHASE 3: Docker Compose Installation
├── PHASE 4: Kubernetes Tools Installation
├── PHASE 5: Node Exporter Installation
└── PHASE 6: Final Verification
```

## 🎯 Supported Platforms

- **OS**: Ubuntu 20.04+, Debian 10+
- **Architecture**: x86_64 (amd64)
- **Ansible**: 2.9+

## 🔐 Security Notes

1. **Sudo Access**: Playbook requires `become: yes` (sudo privileges)
2. **Docker Group**: Automatically adds user to docker group (no sudo needed for docker commands)
3. **Service User**: Node Exporter runs as non-root user `node_exporter`
4. **Firewall**: Ensure port 9100 is accessible if using remote monitoring

## 📝 Variables

Edit variables at the top of `setup.yml`:

```yaml
vars:
  docker_compose_version: "2.24.0"
  node_exporter_version: "1.7.0"
  minikube_version: "latest"
```

## 🚦 Next Steps

After playbook completes:

1. **Logout and Login** to apply Docker group membership
2. **Test Docker**:
   ```bash
   docker run hello-world
   docker ps
   ```

3. **Start Minikube**:
   ```bash
   minikube start --driver=docker
   minikube status
   kubectl get nodes
   ```

4. **Verify Monitoring**:
   ```bash
   curl http://localhost:9100/metrics
   ```

5. **Integrate with Other Components**:
   - Use Docker for Anggota 1's Dockerfile
   - Use Docker Compose for Anggota 2's compose file
   - Use Kubernetes for Anggota 3's manifests
   - Use Node Exporter for Anggota 6's Prometheus

## 📚 Resources

- [Ansible Documentation](https://docs.ansible.com/)
- [Docker Install Guide](https://docs.docker.com/engine/install/ubuntu/)
- [Kubernetes Setup](https://kubernetes.io/docs/tasks/tools/)
- [Minikube Guide](https://minikube.sigs.k8s.io/docs/start/)
- [Node Exporter](https://github.com/prometheus/node_exporter)

## 👥 Team Integration

This playbook is part of the Todo DevOps project:
- **Anggota 4**: Creates inventory file (prerequisite)
- **Anggota 5**: This playbook (automation)
- **Anggota 1-3**: Use installed tools for containerization
- **Anggota 6-7**: Use Node Exporter for monitoring

---

**Author**: Anggota 5 - The Automator  
**Last Updated**: January 2026  
**Version**: 1.0

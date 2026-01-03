# Kubernetes Manifests

This directory contains Kubernetes manifests for deploying the Todo DevOps application.

## Files

- `mysql.yaml` - MySQL database deployment with persistent storage
- `nextjs-app.yaml` - Next.js application deployment with auto-scaling
- `ingress.yaml` - Ingress controller for custom domain routing

## Quick Start

```bash
# Apply MySQL deployment
kubectl apply -f k8s/mysql.yaml

# Wait for MySQL to be ready
kubectl wait --for=condition=ready pod -l app=mysql --timeout=120s

# Apply Next.js app deployment
kubectl apply -f k8s/nextjs-app.yaml

# Get services
kubectl get services

# Access the application
kubectl get svc nextjs-service
```

## Optional: Ingress Setup

```bash
# Install NGINX Ingress Controller (if not already installed)
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.1/deploy/static/provider/cloud/deploy.yaml

# Wait for ingress controller
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

# Apply ingress
kubectl apply -f k8s/ingress.yaml

# Add to hosts file (Windows: C:\Windows\System32\drivers\etc\hosts)
# 127.0.0.1 todo.local

# Access via custom domain
# http://todo.local
```

## Components

### MySQL
- PersistentVolumeClaim (5Gi)
- ConfigMap (database configuration)
- Secret (credentials)
- Deployment (1 replica)
- Service (ClusterIP on port 3306)

### Next.js App
- Deployment (2-10 replicas with HPA)
- Service (LoadBalancer on port 80)
- HorizontalPodAutoscaler (scale 2-10 pods based on CPU 60%, Memory 70%)
- Health checks (liveness & readiness probes)
- Resource limits: CPU 500m-1000m, Memory 512Mi-1Gi

### Ingress (Optional)
- Custom domain routing (todo.local)
- Path-based routing support
- SSL/TLS ready

## Resource Allocation

### MySQL
- **Requests**: 250m CPU, 256Mi Memory
- **Limits**: 500m CPU, 512Mi Memory
- **Storage**: 5Gi persistent volume

### Next.js App
- **Requests**: 500m CPU, 512Mi Memory
- **Limits**: 1000m CPU, 1Gi Memory
- **Auto-scaling**: 2-10 pods based on load

## Verify Deployment

```bash
# Check pods
kubectl get pods

# Check services
kubectl get services

# Check logs
kubectl logs deployment/nextjs-app

# Describe pod
kubectl describe pod <pod-name>
```

## Cleanup

```bash
kubectl delete -f k8s/nextjs-app.yaml
kubectl delete -f k8s/mysql.yaml
```

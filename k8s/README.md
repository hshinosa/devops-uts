# Kubernetes Manifests

This directory contains Kubernetes manifests for deploying the Todo DevOps application.

## Files

- `mysql.yaml` - MySQL database deployment with persistent storage
- `nextjs-app.yaml` - Next.js application deployment with auto-scaling

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

## Components

### MySQL
- PersistentVolumeClaim (5Gi)
- ConfigMap (database configuration)
- Secret (credentials)
- Deployment (1 replica)
- Service (ClusterIP on port 3306)

### Next.js App
- Deployment (3 replicas)
- Service (LoadBalancer on port 80)
- HorizontalPodAutoscaler (scale 3-10 pods)
- Health checks (liveness & readiness probes)

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

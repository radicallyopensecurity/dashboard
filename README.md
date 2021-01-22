ROS Dashboard
=============

Docker Build
------------

A Docker image can be built from the Dockerfile to later on compile the frontend:

```
docker build -t dashboard-builder .
```

This builder then can be used in Git Hooks to compile the application assets:

```
docker run --rm -v /home/dev/dashboard.git:/source:ro dashboard-builder
```

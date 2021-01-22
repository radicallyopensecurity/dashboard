ROS Dashboard
=============

Staging Deployment
------------------

The staging system has a git hook to deploy updates on changes to a branch.

```
git remote add staging ssh://dev@git.staging.radical.sexy:33222/dashboard.git
```

A new branch name can be created and pushed to the staging system:

```
git checkout -b my-cool-feature
```

It will be deployed to https://git.staging.radical.sexy/ros-dashboard/my-cool-feature once pushed to staging:

```
git push staging
```

Docker Build
------------

A Docker image can be built from the Dockerfile to later on compile the frontend:

```
docker build -t dashboard-builder .
```

This builder then can be used in Git Hooks to compile the application assets:

```
docker run --rm \
  -v /home/dev/dashboard.git:/source:ro \
  -v /var/www:/target \
  -e REV=main \
  dashboard-builder
```

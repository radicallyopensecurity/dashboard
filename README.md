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

Setup Notes
-----------

The ROS dashboard VM is not exposed to the Internet.
For development purposes the SSH daemon is accessible via port-forwarding from the git VM on staging.

```
iptables -t nat -A PREROUTING -p tcp --dport 33222 -j DNAT --to-destination 172.18.73.11:22222 -m comment --comment "expose ros-dashboard sshd"
iptables -t nat -A POSTROUTING -o enp7s0 -j MASQUERADE -m comment --comment "expose ros-dashboard sshd"
iptables -A FORWARD -m state --state RELATED,ESTABLISHED -j ACCEPT 
iptables -P FORWARD DROP
iptables -A FORWARD -i enp7s0 -o enp1s0 -j ACCEPT
iptables -A FORWARD -i enp1s0 -o enp7s0 -p tcp --dport 22222 -j ACCEPT
echo 1 > /proc/sys/net/ipv4/ip_forward
```

Within the VM a directory /dashboard.git contains a bare git repository configured with a post-receive hook [docker/post-receive.sh](docker/post-receive.sh).

```
git clone https://github.com/radicallyopensecurity/dashboard /dashboard.git
cp docker/post-receive.sh /dashboard.git/hooks/post-receive
chmod a+x /dashboard.git/hooks/post-receive
```

The directory is owned by the `dev` user, who also is the owner of `/var/www/html`:

```
adduser dev
chown dev:www-data /var/www/html
chmod g+s /var/www/html
```

The original Debian index.html file can be deleted in favor of nginx directory listing:

```
rm /var/www/html/index.*

cat > /etc/nginx/sites-available/default <<EOF
server {
        listen 80 default_server;
        listen [::]:80 default_server;
        root /var/www/html;
        index index.html;

        location ~ /$ {
                autoindex on;
                autoindex_exact_size off;
                autoindex_format html;
                autoindex_localtime on;
        }

        location / {
                # First attempt to serve request as file, then
                # as directory, then fall back to displaying a 404.
                try_files $uri $uri/ =404;
        }
}
EOF

systemctl reload nginx
```

The hosting Git nginx server proxies the location `/ros-dashboard` to the above webserver.


#!/bin/sh

# Generate a private key for the root CA
openssl genrsa -out root-ca.key 2048

# Create and self-sign the root CA certificate
openssl req -x509 -new -nodes -key root-ca.key -sha256 -days 1024 -out root-ca.pem -subj "/CN=RootCA"

# Generate a private key 
openssl genrsa -out server.key 2048

# Create a certificate signing request (CSR)
openssl req -new -key server.key -out server.csr -subj "/CN=ros-dashboard.test"

# Create a configuration file for server certificate usage
echo "authorityKeyIdentifier=keyid,issuer
basicConstraints=CA:FALSE
keyUsage = digitalSignature, nonRepudiation, keyEncipherment, dataEncipherment
subjectAltName = @alt_names

[alt_names]
DNS.1 = ros-dashboard.test" > server.ext

# Generate the SSL certificate using the CA
openssl x509 -req -in server.csr -CA root-ca.pem -CAkey root-ca.key -CAcreateserial -out crt.pem -days 500 -sha256 -extfile server.ext

# (Linux) Copy to certificate store and update
sudo cp root-ca.pem /usr/local/share/ca-certificates/root-ca.crt
sudo update-ca-certificates

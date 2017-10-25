#!/usr/bin/bash

KEYSTORE_DIR=source/server/_tls-keystore_

if [[ -f $KEYSTORE_DIR/key.pem || -f $KEYSTORE_DIR/cert.pem ]]; then
       printf "Keys already exists. Exiting.\n"
       exit 0
fi

# Create directory
rm -rf $KEYSTORE_DIR
mkdir $KEYSTORE_DIR


# Generate privae key
openssl genrsa -out $KEYSTORE_DIR/key.pem 2048

# Make certificate sign request
openssl req -new -sha256 -key $KEYSTORE_DIR/key.pem -days 3650 -out $KEYSTORE_DIR/csr.pem

# Create "self-signed" public key
openssl x509 -req -days 3650 -in $KEYSTORE_DIR/csr.pem -signkey $KEYSTORE_DIR/key.pem -out $KEYSTORE_DIR/cert.pem


# Clean CSR
rm -f $KEYSTORE_DIR/csr.pem

printf "Done.\n"
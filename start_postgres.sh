#!/bin/bash

# Pull the latest PostgreSQL image
docker pull postgres:16.2-alpine3.19

# Run the PostgreSQL container
docker run --name la79y-postgres \
            --network app-tier \
           -e POSTGRES_USER=admin \
           -e POSTGRES_PASSWORD=1234 \
           -e POSTGRES_DB=la79y \
           -p 5432:5432 \
           -d postgres:16.2-alpine3.19

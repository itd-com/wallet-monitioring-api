#!/bin/sh
docker login
docker build . --file Dockerfile --tag metanetcorp/bank-gateway-api-dev:latest
docker push metanetcorp/bank-gateway-api-dev:latest
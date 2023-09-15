#!/bin/sh
docker login
docker build . --file Dockerfile --tag metanetcorp/bank-gateway-api-prod:latest
docker push metanetcorp/bank-gateway-api-prod:latest
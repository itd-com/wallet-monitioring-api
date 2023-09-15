#!/bin/sh
docker login
docker build . --file Dockerfile --tag iamta/wallet-monitioring-api-prod:latest
docker push iamta/wallet-monitioring-api-prod:latest
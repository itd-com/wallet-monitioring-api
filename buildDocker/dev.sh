#!/bin/sh
docker login
docker build . --file Dockerfile --tag iamta/wallet-monitioring-api-dev:latest
docker push iamta/wallet-monitioring-api-dev:latest
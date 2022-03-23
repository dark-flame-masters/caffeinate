#!/bin/sh
docker-compose -f docker-compose.yml up -d --build
docker-compose -f docker-compose.certbot.yml up --build
docker-compose down --remove-orphans
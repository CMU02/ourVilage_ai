#!/bin/bash

# 배포 스크립트
set -e

echo "🚀 Starting deployment..."

# 환경 변수 설정
export IMAGE_TAG=${GITHUB_SHA:-latest}
export REGISTRY=${REGISTRY:-ghcr.io}
export IMAGE_NAME=${IMAGE_NAME:-mytown_ai}

echo "📦 Pulling latest image: $REGISTRY/$IMAGE_NAME:$IMAGE_TAG"

# Docker 이미지 pull
docker pull $REGISTRY/$IMAGE_NAME:$IMAGE_TAG

# 기존 컨테이너 중지 및 제거
echo "🛑 Stopping existing containers..."
docker-compose down || true

# 새 이미지로 컨테이너 시작
echo "🔄 Starting new containers..."
docker-compose up -d

# 헬스체크
echo "🏥 Performing health check..."
sleep 10

for i in {1..30}; do
  if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Health check passed!"
    break
  fi
  
  if [ $i -eq 30 ]; then
    echo "❌ Health check failed after 30 attempts"
    docker-compose logs app
    exit 1
  fi
  
  echo "⏳ Waiting for application to start... ($i/30)"
  sleep 2
done

echo "🎉 Deployment completed successfully!"
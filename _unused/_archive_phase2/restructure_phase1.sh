#!/bin/bash

# AIFI 프로젝트 구조 개선 - Phase 1: 안전한 폴더 구조 생성
# 이 스크립트는 기존 파일을 건드리지 않고 새로운 폴더 구조만 생성합니다

echo "🏗️ AIFI 프로젝트 구조 개선 - Phase 1"
echo "================================="
echo ""

# 프로젝트 루트 확인
PROJECT_ROOT="/Users/sohee/Downloads/run/dev/airenew"
cd "$PROJECT_ROOT" || exit 1

echo "📁 새로운 폴더 구조 생성 중..."

# 1. assets 폴더 구조 생성
echo "  - assets/ 폴더 생성..."
mkdir -p assets/css
mkdir -p assets/js
mkdir -p assets/images

# 2. 섹션별 폴더 생성
echo "  - 섹션별 폴더 생성..."
mkdir -p dashboard
mkdir -p concept-art/js
mkdir -p media-gallery
mkdir -p prompt-generator

# 3. 백업 통합 폴더 생성
echo "  - 백업 통합 폴더 생성..."
mkdir -p _archive/backups
mkdir -p _archive/old-versions
mkdir -p _archive/deprecated

echo ""
echo "✅ Phase 1 완료: 폴더 구조 생성 완료"
echo ""

# 현재 구조 확인
echo "📊 생성된 폴더 구조:"
echo "------------------------"
tree -d -L 2 2>/dev/null || find . -type d -maxdepth 2 | grep -E "^\./(assets|dashboard|concept-art|media-gallery|prompt-generator|_archive)" | sort

echo ""
echo "🔍 다음 단계:"
echo "  1. restructure_phase2.sh 실행 - CSS 파일 통합"
echo "  2. restructure_phase3.sh 실행 - 파일 이동 및 경로 업데이트"
echo ""
echo "⚠️  주의: 각 단계 실행 후 테스트를 권장합니다"
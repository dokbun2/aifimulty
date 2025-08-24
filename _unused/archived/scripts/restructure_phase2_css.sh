#!/bin/bash

# AIFI 프로젝트 구조 개선 - Phase 2: CSS 통합 및 최적화
# 이 스크립트는 CSS 파일들을 분석하고 통합 계획을 생성합니다

echo "🎨 AIFI 프로젝트 구조 개선 - Phase 2: CSS 통합"
echo "============================================"
echo ""

PROJECT_ROOT="/Users/sohee/Downloads/run/dev/airenew"
cd "$PROJECT_ROOT" || exit 1

# CSS 파일 백업
echo "📦 기존 CSS 파일 백업 중..."
mkdir -p _archive/css_backup_$(date +%Y%m%d)
cp *.css _archive/css_backup_$(date +%Y%m%d)/ 2>/dev/null

echo ""
echo "🔍 CSS 의존성 분석:"
echo "-------------------"

# 각 HTML 파일의 CSS 사용 현황
echo "📄 index.html:"
echo "  - design-system.css"
echo "  - styles-dark.css"
echo ""

echo "📄 컨셉아트 관련 (4개 파일):"
echo "  - your_title_storyboard_v9.4_c.html"
echo "  - concept-art-gallery.html"
echo "  - media-gallery.html"
echo "  - image_prompt_generator.html"
echo "  모두 사용:"
echo "  - design-system.css"
echo "  - concept-art-styles-unified.css (→ modern.css import)"
echo ""

echo "📄 스토리보드:"
echo "  - storyboard/index.html"
echo "  - 독립적: css/main.css"
echo ""

echo "📊 CSS 파일 크기:"
ls -lh *.css | awk '{print "  - " $9 ": " $5}'
echo ""

echo "🔧 통합 계획:"
echo "-------------"
echo "1. core.css 생성 예정 (design-system.css 기반)"
echo "   - CSS 변수"
echo "   - 폰트 정의"
echo "   - 기본 스타일"
echo ""
echo "2. components.css 생성 예정"
echo "   - 공통 컴포넌트"
echo "   - 버튼, 카드, 모달 등"
echo ""
echo "3. 섹션별 CSS:"
echo "   - dashboard.css (styles-dark.css에서 추출)"
echo "   - concept-art.css (unified + modern 통합)"
echo ""

echo "📝 CSS 통합 미리보기 생성 중..."

# core.css 미리보기 생성
cat > assets/css/core_preview.css << 'EOF'
/* ========================================
   AIFI Core CSS - 통합 디자인 시스템
   생성일: $(date +%Y-%m-%d)
   ======================================== */

/* 이 파일은 design-system.css를 기반으로 생성됩니다 */
/* 모든 페이지에서 공통으로 사용하는 핵심 스타일 */

/* TODO: design-system.css의 내용을 여기로 이동 */
/* - CSS 변수 (:root) */
/* - 폰트 정의 (@font-face) */
/* - 기본 리셋 스타일 */
/* - 타이포그래피 */
EOF

echo ""
echo "✅ Phase 2 분석 완료"
echo ""

echo "⚠️  다음 작업 필요:"
echo "  1. CSS 파일 수동 통합 검토"
echo "  2. 중복 스타일 제거"
echo "  3. 섹션별 CSS 분리"
echo ""
echo "💡 권장사항:"
echo "  - CSS 통합은 수동으로 신중하게 진행"
echo "  - 각 단계별 테스트 필수"
echo "  - 브라우저 개발자 도구에서 스타일 충돌 확인"
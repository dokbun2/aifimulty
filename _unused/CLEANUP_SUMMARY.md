# 프로젝트 정리 요약 보고서

## 📅 정리 일자
2025-08-24

## 📊 정리 전후 비교

### 정리 전
- 전체 파일 수: 약 150개
- 루트 디렉토리 파일: 약 40개
- 백업/아카이브 폴더: 3개 (_archive, _archive_phase2, archived)

### 정리 후  
- 활성 파일 수: 약 30-40개
- 루트 디렉토리 파일: 16개
- 정리된 파일: 약 110개 (75% 감소)

## 🗂️ _unused 폴더로 이동된 항목

### 폴더 (전체 이동)
- _archive/
- _archive_phase2/
- archived/

### HTML 파일 (레거시/백업)
- concept-art-legacy.html
- index_old.html
- index-apple-backup.html
- media-gallery-apple-backup.html
- media-gallery-apple-backup-20250822-123848.html
- media-gallery-fixed.html
- prompt-builder-backup-pre-apple.html
- prompt-builder.html.backup
- features-section.html
- aifi-gpts-section.html
- diagnose-media-gallery.html
- find-images.html
- storyboard/index_backup.html
- storyboard/auto-expand.html
- storyboard/debug.html
- concept-art/index_backup.html
- concept-art/gallery.html

### CSS 파일
- concept-art-styles-unified.css (루트)
- styles-dark.css
- styles-dark_backup.css
- apple-design-system.css
- css/section-improvements.css
- assets/css/concept-art-styles-modern.css
- assets/css/core_backup.css
- assets/css/concept-art-styles-unified_backup.css
- storyboard/css/main.css
- storyboard/css/main_backup.css

### JavaScript 파일
- simple_video_player.js
- icons.js
- media-gallery-fix.js
- media-gallery-safe.js
- assets/js/video-player.js
- dashboard/dashboard.js
- storyboard/js/app_backup.js

### 기타 파일
- hero-background(수정).mp4
- og-image1.jpg
- 11.jpg
- sample-storyboard.json
- media-gallery-import-guide.md
- design-system.md

## ✅ 현재 활성 파일 구조

### 메인 페이지
- index.html (대시보드)
- storyboard/index.html
- concept-art/index.html
- media-gallery/index.html
- prompt-generator/index.html

### 활성 리소스
- apple-developer-style.css
- mobile-video-fix.css
- tabler-icons.js
- script.js
- hero-background.mp4
- favicon_io/ (파비콘 세트)
- assets/fonts/ (Paperlogy 폰트)
- storyboard/js/ (활성 JS 파일들)
- concept-art/js/bundle.js

## 🔍 주의사항

### index.html에서 참조하지만 실제 사용되지 않는 링크
1. media-gallery-apple.html → 실제 활성: media-gallery/index.html
2. prompt-builder.html → 실제 활성: prompt-generator/index.html

이 링크들은 index.html에서 업데이트가 필요합니다.

### 중복 폰트 파일
- /fonts/ 폴더와 /assets/fonts/ 폴더에 동일한 Paperlogy 폰트 세트 존재
- 하나로 통합 권장

## 💾 복구 방법
필요시 _unused 폴더에서 파일을 다시 복구할 수 있습니다.
```bash
mv _unused/[파일명] ./
```

## 🎯 추가 권장사항
1. index.html의 잘못된 링크 수정
2. 중복 폰트 파일 정리
3. _unused 폴더는 확인 후 완전 삭제 가능
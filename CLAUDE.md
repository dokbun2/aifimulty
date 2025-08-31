# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AIFI (아이파이) is an AI-based video production and concept art management web application. It's a pure frontend application using vanilla HTML, CSS, and JavaScript, designed for creating and managing video storyboards and concept art prompts for AI video/image generation tools.

## Architecture

### Core Applications

The project is now organized into a modular structure with three main applications:

1. **Dashboard** (`index.html`) - Central hub for project navigation and stage-based workflow
2. **Storyboard** (`storyboard/index.html`) - Video storyboard management with hierarchical structure (Sequence → Scene → Shot)
3. **Concept Art** (`concept-art/index.html`) - Character/location/prop prompt management system
4. **Media Gallery** (`media-gallery/index.html`) - Apple-style media management interface
5. **Prompt Builder** (`prompt-builder.html`) - Advanced prompt engineering tool

### Technology Stack
- Pure HTML5, CSS3, JavaScript (ES6+)
- No build tools or package managers required
- Browser localStorage for data persistence
- Netlify deployment
- Custom Paperlogy font (9 weights)

### Current File Structure
```
/
├── index.html                     # Main dashboard
├── storyboard/
│   ├── index.html                # Storyboard application
│   ├── js/
│   │   ├── app.js                # Main storyboard logic (refactoring in progress)
│   │   ├── storyboard-functions.js
│   │   ├── shot-ui-improvements.js
│   │   └── modules/              # Refactored modular components
│   │       ├── app-config.js     # Configuration and constants
│   │       ├── app-utils.js      # Utility functions (includes Dropbox URL conversion)
│   │       ├── data/
│   │       │   ├── storage.js    # localStorage management
│   │       │   └── import-export.js # JSON import/export
│   │       ├── ui/
│   │       │   ├── navigation.js # Navigation UI components
│   │       │   └── content-display.js # Content display functions
│   │       ├── stage/
│   │       │   └── stage-converter.js # Stage 4-7 data conversion
│   │       └── events/
│   │           └── event-handlers.js # Event listeners and handlers
│   └── css/
│       └── apple-style.css       # Apple-inspired UI
├── concept-art/
│   ├── index.html                # Concept art manager
│   └── js/
│       ├── bundle.js             # Bundled logic
│       └── gallery.js            # Gallery functionality
├── media-gallery/
│   └── index.html                # Media gallery
├── assets/
│   ├── fonts/                    # Paperlogy font files
│   └── css/
│       └── core.css              # Shared styles
└── netlify.toml                  # Deployment config
```

## Development Commands

### Local Development
```bash
# Python (recommended)
python -m http.server 8000

# Node.js alternatives
npx serve .
npx http-server .

# Direct file access (limited functionality)
# Simply open index.html in browser
```

### Deployment
```bash
# Deploy to Netlify (automatic on push to main)
# Live URL: https://aifiwb.netlify.app
```

## Key Architectural Patterns

### Data Management
- **localStorage Keys**: 
  - Storyboard: `breakdownData_[projectName]`
  - Concept Art: `conceptArtManagerData_v1.2`
  - Stage transitions: `stage[N]TempJson`, `stage[N]TempFileName`
  - Image cache: `imageUrlCache_[projectName]`
  - Stage-specific: `stage6ImagePrompts_[projectName]`, `stage7VideoPrompts_[projectName]`

### Storyboard Data Structure
```javascript
{
  project_info: { name, film_id },
  film_metadata: { title, genre, director, duration },
  breakdown_data: {
    sequences: [
      {
        id, name, description,
        scenes: [
          {
            id, sequence_id, name, description,
            shots: [] // Shot references
          }
        ]
      }
    ],
    shots: [
      {
        id, scene_id, title, description,
        content: { dialogue, narration, sound_effects },
        image_design: {
          ai_generated_images: {
            universal: [], nanobana: [], midjourney: [], ...
          }
        },
        main_images: [], reference_images: [],
        video_urls: {}, audio_urls: {}
      }
    ]
  }
}
```

### Recent Features & Improvements

#### Code Refactoring (진행 중)
- **Phase 1-3 완료 (45% 완료)**: app.js를 모듈화된 구조로 리팩토링
- **IIFE 패턴 사용**: 브라우저 호환성을 위해 ES6 모듈 대신 IIFE 패턴 적용
- **모듈 구조**:
  - `app-config.js`: 설정 및 상수
  - `app-utils.js`: 유틸리티 함수 (escapeHtmlAttribute, showMessage, copyToClipboard, convertDropboxUrl 등)
  - `data/storage.js`: localStorage 관리
  - `data/import-export.js`: JSON 가져오기/내보내기
  - `ui/navigation.js`: 네비게이션 UI
  - `ui/content-display.js`: 컨텐츠 표시
  - `stage/stage-converter.js`: Stage 데이터 변환
  - `events/event-handlers.js`: 이벤트 핸들러

#### Dropbox URL Auto-conversion
- Automatically converts Dropbox share links (`dl=0`) to direct image links (`raw=1`)
- Applied to: Main images, reference images, and all AI-generated image inputs
- Caches converted URLs for performance
- 함수 위치: `AppUtils.convertDropboxUrl()`

#### Image Management
- Support for 20+ AI tools (Universal, Nanobana, Midjourney, Ideogram, etc.)
- Three image slots per AI tool per shot
- Main images (2 slots) and reference images (3 slots) per shot
- Stage 6 (image prompts) and Stage 7 (video prompts) integration

### UI/UX Patterns
- Apple-inspired design with glassmorphism effects
- Tab-based navigation for shot details
- Modal dialogs for image viewing and editing
- Real-time preview updates
- Responsive grid layouts

## Important Implementation Notes

### URL Processing
- Always use `convertDropboxUrl()` function for Dropbox links
- Cache processed URLs using `imageUrlCache` global object
- Update preview immediately after URL change

### Data Persistence
- Always call `saveDataToLocalStorage()` after data modifications
- Check localStorage quota (handle `QuotaExceededError`)
- Use JSON export/import for backup and cross-device transfer

### Korean Language Support
- Primary interface language is Korean
- Use Korean placeholders and messages
- Support both Korean and English prompts

### Browser Compatibility
- Test on Chrome, Firefox, Safari, Edge
- Ensure localStorage is available
- Handle iframe security for Google Drive embeds

## Custom Rules

- 답변은 한국어로 해줘 (Respond in Korean)
- 아이콘은 rails_icons 쓰고, tabler 써줘 (Use rails_icons and tabler for icons)

## Common Development Tasks

### Adding New AI Tool Support
1. Add to `IMAGE_AI_TOOLS` array in `storyboard/js/app.js`
2. Update image slot generation in `createShotImageTab()`
3. Ensure proper data structure initialization

### Modifying Data Structure
1. Update localStorage key versioning
2. Implement data migration in `loadDataFromLocalStorage()`
3. Test backward compatibility
4. Update JSON export/import handlers

### Debugging
- Use browser DevTools Console
- Check `window.debugData` for runtime inspection
- Monitor localStorage usage with `Storage` tab
- Use `console.log` with emojis for clear debugging (🔍, ✅, ❌, ⚠️)

## Stage-based Workflow

The application supports an 8-stage video production workflow:
1. Stage 1: Initial setup
2. Stage 2: Story breakdown
3. Stage 3-4: Development
4. Stage 5: Image prompt generation
5. Stage 6: Image creation
6. Stage 7: Video generation
7. Stage 8: Audio production

Each stage has specific data import/export capabilities for seamless workflow integration.
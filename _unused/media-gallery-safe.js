// Safe version of media gallery functions

// Load all media - simplified version
window.loadAllMedia = function() {
    console.log('=== loadAllMedia 실행 ===');
    
    try {
        // Load storyboard media
        loadStoryboardMediaSafe();
    } catch (e) {
        console.error('스토리보드 로딩 오류:', e);
    }
    
    try {
        // Load concept art media
        loadConceptArtMediaSafe();
    } catch (e) {
        console.error('컨셉아트 로딩 오류:', e);
    }
    
    // Update display
    const activeTab = document.querySelector('.tab-button.active');
    if (activeTab) {
        const tabName = activeTab.getAttribute('data-tab');
        showTab(tabName);
    }
};

// Safe storyboard loader
function loadStoryboardMediaSafe() {
    console.log('스토리보드 미디어 로딩...');
    const gallery = document.getElementById('storyboard-gallery');
    if (!gallery) {
        console.error('storyboard-gallery 요소를 찾을 수 없습니다');
        return;
    }
    
    let mediaCount = 0;
    let galleryHTML = '';
    
    // Find all breakdownData keys
    const keys = Object.keys(localStorage);
    const breakdownKeys = keys.filter(k => k.startsWith('breakdownData_'));
    
    console.log(`발견된 breakdownData 키: ${breakdownKeys.length}개`);
    
    // 먼저 간단한 방법으로 모든 이미지 URL 찾기
    breakdownKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (data) {
            // Midjourney 이미지 찾기 (더 정확한 패턴)
            const midjourneyRegex = /https?:\/\/cdn\.midjourney\.com\/[a-f0-9\-]+\/[^"'\s<>]+\.(png|jpg|jpeg|webp)/gi;
            const midjourneyMatches = data.match(midjourneyRegex);
            
            if (midjourneyMatches) {
                const uniqueUrls = [...new Set(midjourneyMatches)];
                console.log(`${key}에서 Midjourney 이미지 ${uniqueUrls.length}개 발견`);
                
                uniqueUrls.forEach((url, index) => {
                    // URL 정리
                    const cleanUrl = url.trim().replace(/['"]/g, '');
                    mediaCount++;
                    galleryHTML += createGalleryItemSafe({
                        url: cleanUrl,
                        title: `Midjourney ${index + 1}`,
                        type: 'image'
                    });
                    console.log(`이미지 추가: ${cleanUrl}`);
                });
            }
            
            // 다른 이미지 URL 찾기 (Midjourney 제외)
            const generalImageRegex = /https?:\/\/(?!cdn\.midjourney\.com)[^\s"'<>]+\.(jpg|jpeg|png|gif|webp)/gi;
            const imageMatches = data.match(generalImageRegex);
            
            if (imageMatches) {
                const uniqueUrls = [...new Set(imageMatches)];
                
                uniqueUrls.forEach((url, index) => {
                    const cleanUrl = url.trim().replace(/['"]/g, '');
                    mediaCount++;
                    galleryHTML += createGalleryItemSafe({
                        url: cleanUrl,
                        title: `이미지 ${index + 1}`,
                        type: 'image'
                    });
                });
            }
        }
    });
    
    // Update gallery
    if (mediaCount > 0) {
        gallery.innerHTML = galleryHTML;
        gallery.classList.remove('empty');
    } else {
        gallery.classList.add('empty');
        gallery.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎬</div>
                <div class="empty-state-title">스토리보드 미디어가 없습니다</div>
                <div class="empty-state-text">스토리보드에 이미지나 영상을 추가하면 여기에 표시됩니다</div>
            </div>
        `;
    }
    
    // Update count
    const countEl = document.getElementById('storyboard-count');
    if (countEl) countEl.textContent = mediaCount;
    
    console.log(`스토리보드 미디어: ${mediaCount}개 로드됨`);
}

// Safe concept art loader
function loadConceptArtMediaSafe() {
    console.log('컨셉아트 미디어 로딩...');
    const gallery = document.getElementById('conceptart-gallery');
    if (!gallery) return;
    
    let mediaCount = 0;
    let galleryHTML = '';
    
    const data = localStorage.getItem('conceptArtManagerData_v1.2');
    if (data) {
        try {
            const parsed = JSON.parse(data);
            
            ['characters', 'locations', 'props'].forEach(category => {
                if (parsed[category] && Array.isArray(parsed[category])) {
                    parsed[category].forEach(item => {
                        if (item.image_url) {
                            mediaCount++;
                            galleryHTML += createGalleryItemSafe({
                                url: item.image_url,
                                title: item.name || '이름 없음',
                                type: 'image'
                            });
                        }
                    });
                }
            });
        } catch (e) {
            console.error('컨셉아트 파싱 오류:', e);
        }
    }
    
    // Update gallery
    if (mediaCount > 0) {
        gallery.innerHTML = galleryHTML;
        gallery.classList.remove('empty');
    } else {
        gallery.classList.add('empty');
        gallery.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎨</div>
                <div class="empty-state-title">컨셉아트가 없습니다</div>
                <div class="empty-state-text">컨셉아트를 추가하면 여기에 표시됩니다</div>
            </div>
        `;
    }
    
    // Update count
    const countEl = document.getElementById('conceptart-count');
    if (countEl) countEl.textContent = mediaCount;
    
    console.log(`컨셉아트 미디어: ${mediaCount}개 로드됨`);
}

// Safe gallery item creator
function createGalleryItemSafe(item) {
    const isVideo = item.type === 'video';
    
    // Clean up URL (remove any trailing quotes or special characters)
    let cleanUrl = item.url;
    if (cleanUrl) {
        cleanUrl = cleanUrl.replace(/["'<>]/g, '').trim();
    }
    
    return `
        <div class="gallery-item" data-type="${item.type}">
            ${isVideo ? 
                `<div class="gallery-item-video">
                    <iframe src="${cleanUrl}" frameborder="0" allowfullscreen></iframe>
                </div>` :
                `<div class="gallery-item-image" onclick="openLightbox('${cleanUrl}', 'image')">
                    <img src="${cleanUrl}" 
                         alt="${item.title}" 
                         loading="lazy"
                         onerror="this.onerror=null; this.src='data:image/svg+xml,%3Csvg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'300\\' height=\\'200\\'%3E%3Crect fill=\\'%23333\\' width=\\'300\\' height=\\'200\\'/%3E%3Ctext fill=\\'%23999\\' x=\\'50%25\\' y=\\'50%25\\' text-anchor=\\'middle\\' dy=\\'.3em\\'%3E로드 실패%3C/text%3E%3C/svg%3E';">
                    <div class="gallery-item-overlay">
                        <span>🔍</span>
                    </div>
                </div>`
            }
            <div class="gallery-item-info">
                <div class="gallery-item-title">${item.title || '제목 없음'}</div>
            </div>
        </div>
    `;
}

console.log('Safe media gallery functions loaded. Call loadAllMedia() to test.');
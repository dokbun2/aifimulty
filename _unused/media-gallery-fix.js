// Fixed loadStoryboardMedia function for media-gallery-apple.html

function loadStoryboardMedia() {
    console.log('>>> loadStoryboardMedia 시작');
    const storyboardGallery = document.getElementById('storyboard-gallery');
    let mediaCount = 0;
    let hasMedia = false;
    let galleryHTML = '';
    
    // Check for breakdownData_ keys (actual keys used by storyboard)
    const allKeys = Object.keys(localStorage);
    const breakdownKeys = allKeys.filter(key => key.startsWith('breakdownData_'));
    console.log('발견된 breakdownData 키들:', breakdownKeys);
    
    // Also check for storyboardData (legacy)
    if (localStorage.getItem('storyboardData')) {
        breakdownKeys.push('storyboardData');
    }
    
    // Process each data key
    breakdownKeys.forEach(key => {
        const data = localStorage.getItem(key);
        if (!data) return;
        
        console.log(`${key} 처리 중, 크기: ${(data.length / 1024).toFixed(2)} KB`);
        
        try {
            const parsedData = JSON.parse(data);
            console.log('파싱 성공, 최상위 키:', Object.keys(parsedData));
            
            // Check for breakdown_data.shots structure
            if (parsedData.breakdown_data && parsedData.breakdown_data.shots) {
                const shots = parsedData.breakdown_data.shots;
                console.log(`breakdown_data.shots 발견: ${shots.length}개`);
                
                shots.forEach((shot, shotIndex) => {
                    console.log(`\n=== 샷 ${shotIndex + 1} 처리 중 ===`);
                    console.log('샷 ID:', shot.id || shot.shot_id);
                    console.log('샷 키들:', Object.keys(shot));
                    
                    // Check for image_prompts
                    if (shot.image_prompts) {
                        console.log('image_prompts 발견!');
                        const aiTools = ['midjourney', 'ideogram', 'leonardo', 'imagefx', 'openart', 'universal'];
                        
                        aiTools.forEach(aiTool => {
                            if (shot.image_prompts[aiTool] && shot.image_prompts[aiTool].images) {
                                Object.entries(shot.image_prompts[aiTool].images).forEach(([imageId, imageData]) => {
                                    if (imageData && imageData.url && imageData.url.trim() !== '') {
                                        hasMedia = true;
                                        mediaCount++;
                                        galleryHTML += createGalleryItem({
                                            url: imageData.url,
                                            title: `${shot.shot_number || shot.shot_id || shot.id || '샷'} - ${aiTool}`,
                                            subtitle: shot.shot_title || shot.description || '',
                                            type: 'image',
                                            category: 'shot'
                                        });
                                        console.log(`✅ 이미지 추가됨: ${imageData.url}`);
                                    }
                                });
                            }
                        });
                    }
                    
                    // Check for video_prompts
                    if (shot.video_prompts) {
                        console.log('video_prompts 발견!');
                        const videoTools = ['luma', 'kling', 'veo2', 'runway', 'pika', 'universal'];
                        
                        videoTools.forEach(videoTool => {
                            if (shot.video_prompts[videoTool] && shot.video_prompts[videoTool].videos) {
                                Object.entries(shot.video_prompts[videoTool].videos).forEach(([videoId, videoData]) => {
                                    if (videoData && videoData.url && videoData.url.trim() !== '') {
                                        hasMedia = true;
                                        mediaCount++;
                                        galleryHTML += createGalleryItem({
                                            url: videoData.url,
                                            title: `${shot.shot_number || shot.shot_id || shot.id || '샷'} - ${videoTool} 영상`,
                                            subtitle: shot.shot_title || shot.description || '',
                                            type: 'video',
                                            category: 'shot'
                                        });
                                        console.log(`✅ 비디오 추가됨: ${videoData.url}`);
                                    }
                                });
                            }
                        });
                    }
                });
            }
            
            // Check for project.sequences structure (old format)
            else if (parsedData.project && parsedData.project.sequences) {
                console.log('Old format detected (project.sequences)');
                // Handle old format if needed
            }
            
        } catch (e) {
            console.error(`Error parsing ${key}:`, e);
        }
    });
    
    // Update gallery
    if (hasMedia) {
        storyboardGallery.innerHTML = galleryHTML;
        storyboardGallery.classList.remove('empty');
    } else {
        storyboardGallery.classList.add('empty');
        storyboardGallery.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🎬</div>
                <div class="empty-state-title">스토리보드 미디어가 없습니다</div>
                <div class="empty-state-text">스토리보드에 이미지나 영상을 추가하면 여기에 표시됩니다</div>
            </div>
        `;
    }
    
    updateMediaCount('storyboard', mediaCount);
    console.log(`>>> loadStoryboardMedia 완료. 총 ${mediaCount}개 미디어 발견`);
}
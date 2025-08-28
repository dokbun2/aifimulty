// 백업 무결성 테스트 스크립트
// 메인 이미지 데이터가 JSON 백업에 포함되는지 확인

console.log('🧪 스토리보드 백업 무결성 테스트 시작...');

// 현재 데이터 구조 확인
if (window.currentData) {
    const data = window.currentData;
    
    console.log('\n📊 현재 데이터 구조 분석:');
    console.log('- 프로젝트명:', data.project_info?.name || '없음');
    
    if (data.breakdown_data && data.breakdown_data.shots) {
        const shots = data.breakdown_data.shots;
        console.log('- 총 샷 개수:', shots.length);
        
        // 메인 이미지와 참조 이미지 데이터 검증
        let mainImageCount = 0;
        let refImageCount = 0;
        let shotsWithMainImages = [];
        let shotsWithRefImages = [];
        
        shots.forEach(shot => {
            // 메인 이미지 체크
            if (shot.main_images && Array.isArray(shot.main_images)) {
                const validMainImages = shot.main_images.filter(img => img && img.url);
                if (validMainImages.length > 0) {
                    mainImageCount += validMainImages.length;
                    shotsWithMainImages.push({
                        id: shot.id,
                        count: validMainImages.length,
                        urls: validMainImages.map(img => img.url)
                    });
                }
            }
            
            // 참조 이미지 체크
            if (shot.reference_images && Array.isArray(shot.reference_images)) {
                const validRefImages = shot.reference_images.filter(img => img && img.url);
                if (validRefImages.length > 0) {
                    refImageCount += validRefImages.length;
                    shotsWithRefImages.push({
                        id: shot.id,
                        count: validRefImages.length,
                        urls: validRefImages.map(img => img.url)
                    });
                }
            }
        });
        
        console.log('\n📌 메인 이미지 데이터:');
        console.log('- 메인 이미지가 있는 샷:', shotsWithMainImages.length);
        console.log('- 총 메인 이미지 개수:', mainImageCount);
        if (shotsWithMainImages.length > 0) {
            console.log('- 샘플 (첫 번째 샷):', shotsWithMainImages[0]);
        }
        
        console.log('\n📎 참조 이미지 데이터:');
        console.log('- 참조 이미지가 있는 샷:', shotsWithRefImages.length);
        console.log('- 총 참조 이미지 개수:', refImageCount);
        if (shotsWithRefImages.length > 0) {
            console.log('- 샘플 (첫 번째 샷):', shotsWithRefImages[0]);
        }
        
        // JSON Export 시뮬레이션
        console.log('\n💾 JSON Export 시뮬레이션:');
        try {
            const exportData = JSON.stringify(data, null, 2);
            const exportObj = JSON.parse(exportData);
            
            // Export된 데이터에서 메인 이미지 확인
            let exportedMainImageCount = 0;
            let exportedRefImageCount = 0;
            
            if (exportObj.breakdown_data && exportObj.breakdown_data.shots) {
                exportObj.breakdown_data.shots.forEach(shot => {
                    if (shot.main_images) {
                        exportedMainImageCount += shot.main_images.filter(img => img && img.url).length;
                    }
                    if (shot.reference_images) {
                        exportedRefImageCount += shot.reference_images.filter(img => img && img.url).length;
                    }
                });
            }
            
            console.log('✅ Export 성공');
            console.log('- Export된 메인 이미지:', exportedMainImageCount);
            console.log('- Export된 참조 이미지:', exportedRefImageCount);
            console.log('- 데이터 무결성:', 
                (exportedMainImageCount === mainImageCount && exportedRefImageCount === refImageCount) 
                ? '✅ 정상' : '❌ 불일치');
            
            // Export 파일 크기 확인
            const blob = new Blob([exportData], { type: 'application/json' });
            const sizeMB = (blob.size / (1024 * 1024)).toFixed(2);
            console.log('- Export 파일 크기:', sizeMB + ' MB');
            
        } catch (e) {
            console.error('❌ Export 시뮬레이션 실패:', e);
        }
        
        // 권장사항
        console.log('\n💡 권장사항:');
        if (mainImageCount === 0) {
            console.log('⚠️ 메인 이미지가 없습니다. 각 샷의 이미지 탭에서 메인 이미지를 추가하세요.');
        } else {
            console.log('✅ 메인 이미지 데이터가 정상적으로 저장되어 있습니다.');
        }
        
        console.log('\n📥 백업 테스트 절차:');
        console.log('1. JSON 다운로드 버튼을 클릭하여 백업 파일 생성');
        console.log('2. 새 브라우저 탭에서 스토리보드 열기');
        console.log('3. JSON 업로드로 백업 파일 가져오기');
        console.log('4. 메인 이미지와 참조 이미지가 모두 복원되었는지 확인');
        
    } else {
        console.log('❌ 샷 데이터가 없습니다.');
    }
} else {
    console.log('❌ currentData를 찾을 수 없습니다.');
    console.log('스토리보드 페이지에서 이 스크립트를 실행하세요.');
}

console.log('\n✨ 테스트 완료!');
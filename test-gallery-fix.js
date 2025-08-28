// 미디어 갤러리 수정 테스트 스크립트
// 브라우저 콘솔에서 실행하여 수정사항 확인

console.log('🧪 미디어 갤러리 메인/참조 이미지 분리 테스트 시작...');

// localStorage에서 스토리보드 데이터 가져오기
const storyboardDataStr = localStorage.getItem('videoFrameworkData_v9.4');

if (storyboardDataStr) {
    try {
        const storyboardData = JSON.parse(storyboardDataStr);
        
        console.log('\n📊 스토리보드 데이터 분석:');
        
        if (storyboardData.breakdown_data && storyboardData.breakdown_data.shots) {
            const shots = storyboardData.breakdown_data.shots;
            
            console.log(`총 샷 개수: ${shots.length}`);
            
            // 첫 번째 샷 상세 확인
            if (shots.length > 0) {
                const firstShot = shots[0];
                console.log(`\n🎬 첫 번째 샷 (${firstShot.id}) 분석:`);
                
                // 메인 이미지 확인
                console.log('\n📌 메인 이미지:');
                if (firstShot.main_images && Array.isArray(firstShot.main_images)) {
                    console.log(`  - 메인 이미지 개수: ${firstShot.main_images.length}`);
                    firstShot.main_images.forEach((img, idx) => {
                        console.log(`  - 메인 ${idx+1}: ${img.url ? '✅ URL 있음' : '❌ URL 없음'}`);
                        if (img.url) {
                            console.log(`    URL: ${img.url.substring(0, 50)}...`);
                        }
                    });
                } else {
                    console.log('  - ❌ main_images 필드가 없음');
                }
                
                // 참조 이미지 확인
                console.log('\n📎 참조 이미지:');
                if (firstShot.reference_images && Array.isArray(firstShot.reference_images)) {
                    console.log(`  - 참조 이미지 개수: ${firstShot.reference_images.length}`);
                    firstShot.reference_images.forEach((img, idx) => {
                        console.log(`  - 참조 ${idx+1}: ${img.url ? '✅ URL 있음' : '❌ URL 없음'}`);
                        if (img.url) {
                            console.log(`    URL: ${img.url.substring(0, 50)}...`);
                        }
                    });
                } else {
                    console.log('  - ❌ reference_images 필드가 없음');
                }
            }
            
            // 전체 샷 통계
            console.log('\n📈 전체 샷 통계:');
            let totalMainImages = 0;
            let totalRefImages = 0;
            let shotsWithMainImages = 0;
            let shotsWithRefImages = 0;
            
            shots.forEach(shot => {
                if (shot.main_images && Array.isArray(shot.main_images)) {
                    const validMainImages = shot.main_images.filter(img => img && img.url);
                    if (validMainImages.length > 0) {
                        shotsWithMainImages++;
                        totalMainImages += validMainImages.length;
                    }
                }
                
                if (shot.reference_images && Array.isArray(shot.reference_images)) {
                    const validRefImages = shot.reference_images.filter(img => img && img.url);
                    if (validRefImages.length > 0) {
                        shotsWithRefImages++;
                        totalRefImages += validRefImages.length;
                    }
                }
            });
            
            console.log(`- 메인 이미지가 있는 샷: ${shotsWithMainImages}/${shots.length}`);
            console.log(`- 참조 이미지가 있는 샷: ${shotsWithRefImages}/${shots.length}`);
            console.log(`- 총 메인 이미지: ${totalMainImages}개`);
            console.log(`- 총 참조 이미지: ${totalRefImages}개`);
            
            // 수정 권장사항
            console.log('\n💡 권장사항:');
            if (totalMainImages === 0 && totalRefImages > 0) {
                console.log('⚠️ 메인 이미지가 없습니다. 스토리보드에서 메인 이미지 URL을 입력해주세요.');
            } else if (totalMainImages > 0) {
                console.log('✅ 메인 이미지가 정상적으로 분리되어 있습니다.');
            }
            
            // 미디어 갤러리에서 확인
            console.log('\n🖼️ 미디어 갤러리에서 표시 확인:');
            console.log('1. 미디어 갤러리 페이지를 새로고침하세요.');
            console.log('2. "스토리보드 이미지" 탭을 확인하세요.');
            console.log('3. 메인 이미지와 참조 이미지가 각각 별도로 표시되는지 확인하세요.');
            console.log('4. 중복 없이 올바르게 분류되었는지 확인하세요.');
            
        } else {
            console.log('❌ 스토리보드 데이터에 shots가 없습니다.');
        }
        
    } catch (e) {
        console.error('❌ 스토리보드 데이터 파싱 오류:', e);
    }
} else {
    console.log('❌ 스토리보드 데이터가 localStorage에 없습니다.');
    console.log('💡 스토리보드 페이지에서 데이터를 저장한 후 다시 시도하세요.');
}

console.log('\n✨ 테스트 완료!');
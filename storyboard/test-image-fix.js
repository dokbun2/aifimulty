// 이미지 URL 수정 테스트 스크립트
// 브라우저 콘솔에서 실행하여 수정사항 확인

console.log('🧪 메인/참조 이미지 URL 분리 테스트 시작...');

// 1. 함수 존재 확인
console.log('\n1️⃣ 함수 존재 확인:');
console.log('- updateMainImage 함수:', typeof updateMainImage === 'function' ? '✅ 존재' : '❌ 없음');
console.log('- updateReferenceImage 함수:', typeof updateReferenceImage === 'function' ? '✅ 존재' : '❌ 없음');

// 2. DOM 요소 확인
console.log('\n2️⃣ DOM 요소 확인:');
const testShotId = 'S01.01'; // 첫 번째 샷 ID로 테스트

// 메인 이미지 preview 요소 확인
const mainPreview0 = document.getElementById(`ref-preview-${testShotId}-ref-dup0`);
const mainPreview1 = document.getElementById(`ref-preview-${testShotId}-ref-dup1`);
console.log(`- 메인 이미지 preview 1 (${testShotId}-ref-dup0):`, mainPreview0 ? '✅ 존재' : '❌ 없음');
console.log(`- 메인 이미지 preview 2 (${testShotId}-ref-dup1):`, mainPreview1 ? '✅ 존재' : '❌ 없음');

// 참조 이미지 preview 요소 확인
const refPreview0 = document.getElementById(`ref-preview-${testShotId}-ref0`);
const refPreview1 = document.getElementById(`ref-preview-${testShotId}-ref1`);
const refPreview2 = document.getElementById(`ref-preview-${testShotId}-ref2`);
console.log(`- 참조 이미지 preview 1 (${testShotId}-ref0):`, refPreview0 ? '✅ 존재' : '❌ 없음');
console.log(`- 참조 이미지 preview 2 (${testShotId}-ref1):`, refPreview1 ? '✅ 존재' : '❌ 없음');
console.log(`- 참조 이미지 preview 3 (${testShotId}-ref2):`, refPreview2 ? '✅ 존재' : '❌ 없음');

// 3. 함수 호출 테스트
console.log('\n3️⃣ 함수 동작 테스트:');
console.log('테스트 URL: https://example.com/test-image.jpg');

// 메인 이미지 URL 설정 테스트
if (typeof updateMainImage === 'function') {
    try {
        updateMainImage(testShotId, 0, 'url', 'https://example.com/main-test-1.jpg');
        console.log('- 메인 이미지 1 업데이트:', '✅ 성공');
        
        // preview 확인
        const updatedMainPreview = document.getElementById(`ref-preview-${testShotId}-ref-dup0`);
        if (updatedMainPreview && updatedMainPreview.querySelector('img')) {
            console.log('  → 이미지 src:', updatedMainPreview.querySelector('img').src);
        }
    } catch (e) {
        console.log('- 메인 이미지 1 업데이트:', '❌ 실패', e.message);
    }
}

// 참조 이미지 URL 설정 테스트
if (typeof updateReferenceImage === 'function') {
    try {
        updateReferenceImage(testShotId, 0, 'url', 'https://example.com/ref-test-1.jpg');
        console.log('- 참조 이미지 1 업데이트:', '✅ 성공');
        
        // preview 확인
        const updatedRefPreview = document.getElementById(`ref-preview-${testShotId}-ref0`);
        if (updatedRefPreview && updatedRefPreview.querySelector('img')) {
            console.log('  → 이미지 src:', updatedRefPreview.querySelector('img').src);
        }
    } catch (e) {
        console.log('- 참조 이미지 1 업데이트:', '❌ 실패', e.message);
    }
}

// 4. 데이터 저장 확인
console.log('\n4️⃣ 데이터 저장 확인:');
if (window.currentData && window.currentData.breakdown_data && window.currentData.breakdown_data.shots) {
    const shot = window.currentData.breakdown_data.shots.find(s => s.id === testShotId);
    if (shot) {
        console.log('- 메인 이미지 데이터:', shot.main_images ? '✅ 존재' : '❌ 없음');
        if (shot.main_images) {
            console.log('  → 메인 이미지 개수:', shot.main_images.length);
            shot.main_images.forEach((img, idx) => {
                console.log(`  → 메인 ${idx+1}: ${img.url || '(비어있음)'}`);
            });
        }
        
        console.log('- 참조 이미지 데이터:', shot.reference_images ? '✅ 존재' : '❌ 없음');
        if (shot.reference_images) {
            console.log('  → 참조 이미지 개수:', shot.reference_images.length);
            shot.reference_images.forEach((img, idx) => {
                console.log(`  → 참조 ${idx+1}: ${img.url || '(비어있음)'}`);
            });
        }
    }
}

console.log('\n✨ 테스트 완료!');
console.log('위의 결과를 확인하고, 메인 이미지와 참조 이미지가 각각 올바른 preview 요소에 표시되는지 확인하세요.');
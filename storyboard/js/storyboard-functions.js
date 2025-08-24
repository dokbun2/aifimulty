// 스토리보드 전역 함수들
window.exportJSON = function() {
    if (!currentData) {
        showMessage('내보낼 데이터가 없습니다', 'error');
        return;
    }
    
    try {
        const dataStr = JSON.stringify(currentData, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const exportFileDefaultName = currentData.project_info?.name || 'storyboard_data.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', url);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.style.display = 'none';
        document.body.appendChild(linkElement);
        
        // 다운로드 완료 감지를 위한 이벤트 리스너
        linkElement.addEventListener('click', function() {
            // 약간의 지연 후 메시지 표시 (브라우저가 다운로드를 시작할 시간을 줌)
            setTimeout(() => {
                showMessage('JSON 파일이 다운로드되었습니다', 'success');
                // Clean up
                URL.revokeObjectURL(url);
                document.body.removeChild(linkElement);
            }, 100);
        });
        
        linkElement.click();
    } catch (error) {
        console.error('Export error:', error);
        showMessage('내보내기 중 오류가 발생했습니다', 'error');
    }
};

window.clearAllData = function() {
    localStorage.clear();
    currentData = null;
    selectedType = null;
    selectedId = null;
    selectedSceneId = null;
    
    // UI 초기화
    document.getElementById('navigation-content').innerHTML = `
        <div class="empty-state" id="nav-empty">
            <div class="empty-state-icon">📁</div>
            <div>데이터가 없습니다</div>
            <div style="font-size: 0.9rem; margin-top: 10px;">JSON 가져오기를 사용해 데이터를 로드해주세요</div>
        </div>
    `;
    
    document.getElementById('content-area').innerHTML = `
        <div class="empty-state">
            <div class="empty-state-icon">🎬</div>
            <div>시퀀스, 씬, 또는 샷을 선택하여 상세 정보를 확인하세요</div>
        </div>
    `;
    
    showMessage('모든 데이터가 초기화되었습니다', 'success');
};

window.resetToDefaults = function() {
    // 기본 샘플 데이터 로드
    fetch('../sample-storyboard.json')
        .then(response => response.json())
        .then(data => {
            // app.js의 전역 변수와 함수 사용
            if (window.currentData !== undefined) {
                window.currentData = data;
            }
            localStorage.setItem('storyboardData', JSON.stringify(data));
            if (typeof window.updateNavigation === 'function') {
                window.updateNavigation();
            }
            window.showMessage('샘플 데이터가 로드되었습니다', 'success');
        })
        .catch(error => {
            console.error('Error loading default data:', error);
            // 샘플 데이터가 없는 경우 기본 구조 생성
            const defaultData = {
                project_info: {
                    name: "Sample Project",
                    description: "샘플 프로젝트입니다"
                },
                breakdown_data: {
                    sequences: [],
                    scenes: [],
                    shots: []
                }
            };
            if (window.currentData !== undefined) {
                window.currentData = defaultData;
            }
            localStorage.setItem('storyboardData', JSON.stringify(defaultData));
            if (typeof window.updateNavigation === 'function') {
                window.updateNavigation();
            }
            window.showMessage('기본 구조가 생성되었습니다', 'success');
        });
};

window.expandAll = function() {
    // 모든 시퀀스 헤더 클릭하여 씬 로드
    document.querySelectorAll('.sequence-header').forEach(header => {
        const sequenceId = header.getAttribute('data-sequence-id');
        if (sequenceId) {
            const container = document.getElementById(`scenes-${sequenceId}`);
            if (container && container.classList.contains('collapsed')) {
                // 클릭 이벤트 트리거하여 씬 로드
                header.click();
            }
        }
    });
    
    // 약간의 지연 후 모든 씬 헤더 클릭하여 샷 로드
    setTimeout(() => {
        document.querySelectorAll('.scene-header').forEach(header => {
            const sceneId = header.getAttribute('data-scene-id');
            if (sceneId) {
                const container = document.getElementById(`shots-${sceneId}`);
                if (container && container.classList.contains('collapsed')) {
                    // 클릭 이벤트 트리거하여 샷 로드
                    header.click();
                }
            }
        });
    }, 100);
};

window.collapseAll = function() {
    document.querySelectorAll('.sequence-header').forEach(header => {
        header.classList.remove('expanded');
        const container = header.nextElementSibling;
        if (container && container.classList.contains('scenes-container')) {
            container.classList.add('collapsed');
        }
    });
    
    document.querySelectorAll('.scene-header').forEach(header => {
        header.classList.remove('expanded');
        const container = header.nextElementSibling;
        if (container && container.classList.contains('shots-container')) {
            container.classList.add('collapsed');
        }
    });
};

// Message display function
window.showMessage = function(message, type) {
    const messageContainer = document.getElementById('message-container');
    if (!messageContainer) {
        const container = document.createElement('div');
        container.id = 'message-container';
        container.className = 'message-container';
        document.body.appendChild(container);
    }
    
    const messageElement = document.createElement('div');
    messageElement.className = `message ${type}-message`;
    messageElement.innerHTML = `
        ${message}
        <button class="close-button" onclick="this.parentElement.remove()">×</button>
    `;
    
    document.getElementById('message-container').appendChild(messageElement);
    
    if (type !== 'error') {
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 2000);  // 5초에서 2초로 단축
    }
};

// Export global functions for use in HTML
if (typeof window !== 'undefined') {
    window.storyboardFunctions = {
        exportJSON: window.exportJSON,
        clearAllData: window.clearAllData,
        resetToDefaults: window.resetToDefaults,
        expandAll: window.expandAll,
        collapseAll: window.collapseAll,
        showMessage: window.showMessage
    };
}
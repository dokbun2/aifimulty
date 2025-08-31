/**
 * Stage Converter 모듈
 * Stage 4, 5, 6, 7 데이터 변환 및 처리
 */
(function(window) {
    'use strict';
    
    // 네임스페이스 생성
    window.StageConverter = window.StageConverter || {};
    
    /**
     * Stage 4 데이터 처리
     */
    window.StageConverter.processStage4Data = function(jsonData) {
        try {
            console.log('🎬 Stage 4 데이터 처리 시작');
            
            // Stage 4 데이터 형식 확인
            if (!jsonData.breakdown_data || !jsonData.breakdown_data.shots) {
                throw new Error('Stage 4 데이터 형식이 잘못되었습니다.');
            }
            
            // 샷 데이터 정규화
            jsonData.breakdown_data.shots.forEach(shot => {
                // 기본 필드 초기화
                if (!shot.id) shot.id = `shot_${Date.now()}_${Math.random()}`;
                if (!shot.name) shot.name = `Shot ${shot.id}`;
                if (!shot.scene_id) shot.scene_id = 'default_scene';
                
                // 이미지 디자인 초기화
                if (!shot.image_design) {
                    shot.image_design = {
                        aspect_ratio: '16:9',
                        selected_plan: 'plan_a'
                    };
                }
                
                // AI 이미지 초기화
                if (!shot.image_design.ai_generated_images) {
                    shot.image_design.ai_generated_images = {};
                }
            });
            
            console.log('✅ Stage 4 데이터 처리 완료');
            return jsonData;
            
        } catch (error) {
            console.error('❌ Stage 4 데이터 처리 실패:', error);
            throw error;
        }
    };
    
    /**
     * Stage 5 V5 형식 변환
     */
    window.StageConverter.convertStage5V5Format = function(data) {
        try {
            console.log('🎬 Stage 5 V5 형식 변환 시작');
            
            const sequences = {};
            const scenes = {};
            
            // 샷 데이터에서 시퀀스와 씬 추출
            data.breakdown_data?.shots?.forEach(shot => {
                const sceneId = shot.scene_id || 'default_scene';
                const sequenceId = shot.sequence_id || 'default_sequence';
                
                // 시퀀스 생성
                if (!sequences[sequenceId]) {
                    sequences[sequenceId] = {
                        id: sequenceId,
                        name: `Sequence ${sequenceId}`,
                        scenes: []
                    };
                }
                
                // 씬 생성
                if (!scenes[sceneId]) {
                    scenes[sceneId] = {
                        id: sceneId,
                        name: shot.scene_name || `Scene ${sceneId}`,
                        description: shot.scene_description || '',
                        location: shot.location || '',
                        time: shot.time || ''
                    };
                    
                    // 시퀀스에 씬 추가
                    if (!sequences[sequenceId].scenes.find(s => s.id === sceneId)) {
                        sequences[sequenceId].scenes.push(scenes[sceneId]);
                    }
                }
            });
            
            // 데이터 구조 업데이트
            if (!data.breakdown_data.sequences) {
                data.breakdown_data.sequences = Object.values(sequences);
            }
            
            console.log('✅ Stage 5 V5 형식 변환 완료');
            return data;
            
        } catch (error) {
            console.error('❌ Stage 5 V5 변환 실패:', error);
            return data;
        }
    };
    
    /**
     * Stage 5 데이터 처리
     */
    window.StageConverter.handleStage5SceneData = function(jsonData, suppressMessages = false) {
        try {
            console.log('🎬 Stage 5 데이터 처리 시작');
            
            // V5 형식으로 변환
            jsonData = window.StageConverter.convertStage5V5Format(jsonData);
            
            // Stage 5 특수 처리
            if (jsonData.stage5_scene_data) {
                // Scene 데이터 병합
                jsonData.breakdown_data.shots.forEach(shot => {
                    const sceneData = jsonData.stage5_scene_data[shot.scene_id];
                    if (sceneData) {
                        shot.scene_details = sceneData;
                    }
                });
            }
            
            if (!suppressMessages) {
                const showMessage = window.AppUtils?.showMessage || window.showMessage;
                showMessage?.('Stage 5 데이터 처리 완료', 'success');
            }
            
            console.log('✅ Stage 5 데이터 처리 완료');
            return jsonData;
            
        } catch (error) {
            console.error('❌ Stage 5 데이터 처리 실패:', error);
            if (!suppressMessages) {
                const showMessage = window.AppUtils?.showMessage || window.showMessage;
                showMessage?.('Stage 5 데이터 처리 실패', 'error');
            }
            return jsonData;
        }
    };
    
    /**
     * Stage 6 이미지 프롬프트 처리
     */
    window.StageConverter.processStage6ImagePrompts = function(promptData, currentData) {
        try {
            console.log('🎬 Stage 6 이미지 프롬프트 처리');
            
            if (!promptData || !currentData) {
                throw new Error('필수 데이터가 없습니다.');
            }
            
            // 샷별로 프롬프트 적용
            Object.keys(promptData).forEach(shotId => {
                const shot = currentData.breakdown_data?.shots?.find(s => s.id === shotId);
                if (shot) {
                    if (!shot.image_prompts) {
                        shot.image_prompts = {};
                    }
                    shot.image_prompts = { ...shot.image_prompts, ...promptData[shotId] };
                }
            });
            
            // Stage 6 데이터 저장
            if (window.DataStorage?.saveStageData) {
                window.DataStorage.saveStageData(6, promptData, currentData);
            }
            
            console.log('✅ Stage 6 프롬프트 처리 완료');
            return currentData;
            
        } catch (error) {
            console.error('❌ Stage 6 프롬프트 처리 실패:', error);
            throw error;
        }
    };
    
    /**
     * Stage 7 비디오 프롬프트 처리
     */
    window.StageConverter.processStage7VideoPrompts = function(promptData, currentData) {
        try {
            console.log('🎬 Stage 7 비디오 프롬프트 처리');
            
            if (!promptData || !currentData) {
                throw new Error('필수 데이터가 없습니다.');
            }
            
            // 샷별로 비디오 프롬프트 적용
            Object.keys(promptData).forEach(shotId => {
                const shot = currentData.breakdown_data?.shots?.find(s => s.id === shotId);
                if (shot) {
                    if (!shot.video_prompts) {
                        shot.video_prompts = {};
                    }
                    shot.video_prompts = { ...shot.video_prompts, ...promptData[shotId] };
                }
            });
            
            // Stage 7 데이터 저장
            if (window.DataStorage?.saveStageData) {
                window.DataStorage.saveStageData(7, promptData, currentData);
            }
            
            console.log('✅ Stage 7 프롬프트 처리 완료');
            return currentData;
            
        } catch (error) {
            console.error('❌ Stage 7 프롬프트 처리 실패:', error);
            throw error;
        }
    };
    
    /**
     * Stage 데이터 자동 감지 및 처리
     */
    window.StageConverter.detectAndProcessStage = function(jsonData) {
        try {
            // Stage 4 감지
            if (jsonData.stage === 4 || jsonData.stage4_data) {
                return window.StageConverter.processStage4Data(jsonData);
            }
            
            // Stage 5 감지
            if (jsonData.stage === 5 || jsonData.stage5_scene_data) {
                return window.StageConverter.handleStage5SceneData(jsonData);
            }
            
            // Stage 6 감지
            if (jsonData.stage === 6 || jsonData.stage6_image_prompts) {
                const prompts = jsonData.stage6_image_prompts || jsonData;
                return window.StageConverter.processStage6ImagePrompts(prompts, jsonData);
            }
            
            // Stage 7 감지
            if (jsonData.stage === 7 || jsonData.stage7_video_prompts) {
                const prompts = jsonData.stage7_video_prompts || jsonData;
                return window.StageConverter.processStage7VideoPrompts(prompts, jsonData);
            }
            
            // 기본 데이터 반환
            return jsonData;
            
        } catch (error) {
            console.error('❌ Stage 감지 및 처리 실패:', error);
            return jsonData;
        }
    };
    
    // 기존 전역 함수와의 호환성 유지
    if (!window.convertStage5V5Format) {
        window.convertStage5V5Format = window.StageConverter.convertStage5V5Format;
    }
    if (!window.handleStage5SceneData) {
        window.handleStage5SceneData = window.StageConverter.handleStage5SceneData;
    }
    
})(window);
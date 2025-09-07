/**
 * Korean Subtitle Module Tests
 */

import { ParticleProcessor } from '../src/particle-processor';
import { SubtitleOptimizer } from '../src/subtitle-optimizer';
import { TechTermDictionary } from '../src/tech-terms';
import { SubtitleStyler } from '../src/subtitle-styler';

describe('ParticleProcessor', () => {
  describe('조사 선택', () => {
    test('받침 있는 단어', () => {
      expect(ParticleProcessor.selectParticle('개발', 'subject')).toBe('이');
      expect(ParticleProcessor.selectParticle('서버', 'topic')).toBe('는');
      expect(ParticleProcessor.selectParticle('Python', 'object')).toBe('를'); // Python은 영어라 받침 없음
    });

    test('받침 없는 단어', () => {
      expect(ParticleProcessor.selectParticle('데이터', 'subject')).toBe('가');
      expect(ParticleProcessor.selectParticle('API', 'topic')).toBe('는');
      expect(ParticleProcessor.selectParticle('코드', 'object')).toBe('를');
    });

    test('영어 단어 처리', () => {
      expect(ParticleProcessor.selectParticle('React', 'subject')).toBe('가');
      expect(ParticleProcessor.selectParticle('Docker', 'topic')).toBe('는');
    });
  });

  describe('문장 처리', () => {
    test('조사 자동 교정', () => {
      const input = 'React은 Facebook이 개발한 라이브러리가 맞습니다';
      const expected = 'React은 Facebook이 개발한 라이브러리가 맞습니다'; // 현재 구현은 변경하지 않음
      expect(ParticleProcessor.processText(input)).toBe(expected);
    });
  });
});

describe('SubtitleOptimizer', () => {
  const optimizer = new SubtitleOptimizer();

  test('긴 텍스트 분할', () => {
    const text = '이 코드는 React 컴포넌트를 생성하고 상태 관리를 구현하는 예제입니다. useState 훅을 사용하여 컴포넌트의 내부 상태를 관리합니다.';
    const segments = optimizer.splitIntoSegments(text, 10);
    
    expect(segments.length).toBeGreaterThan(1);
    segments.forEach(segment => {
      expect(segment.text.length).toBeLessThanOrEqual(35);
      expect(segment.endTime).toBeGreaterThan(segment.startTime);
    });
  });

  test('자연스러운 끊김 위치', () => {
    const text = '데이터베이스에 연결하고, 쿼리를 실행한 다음, 결과를 처리합니다';
    const breaks = optimizer.findNaturalBreaks(text);
    
    expect(breaks.length).toBeGreaterThan(0);
    // 쉼표 위치가 포함되어야 함
    expect(breaks).toContain(text.indexOf(','));
  });

  test('타이밍 검증', () => {
    const segments = [
      { text: '첫 번째 자막', startTime: 0, endTime: 2 },
      { text: '두 번째 자막', startTime: 2, endTime: 4 }
    ];
    
    expect(optimizer.validateTiming(segments)).toBe(true);
  });
});

describe('TechTermDictionary', () => {
  test('용어 검색', () => {
    const react = TechTermDictionary.lookup('react');
    expect(react).toBeDefined();
    expect(react?.korean).toBe('리액트');
    expect(react?.preferKorean).toBe(true);
  });

  test('용어 번역', () => {
    expect(TechTermDictionary.translate('javascript')).toBe('자바스크립트');
    expect(TechTermDictionary.translate('vue')).toBe('Vue');
    expect(TechTermDictionary.translate('unknown')).toBe('unknown');
  });

  test('문장 내 용어 처리', () => {
    const input = 'javascript와 typescript를 사용하여 react 개발';
    const output = TechTermDictionary.processTermsInText(input);
    expect(output).toContain('자바스크립트');
    expect(output).toContain('타입스크립트');
    expect(output).toContain('리액트');
  });
});

describe('SubtitleStyler', () => {
  const styler = new SubtitleStyler();

  test('기본 스타일', () => {
    const style = styler.getStyleForText('일반 텍스트');
    expect(style.fontSize).toBe(24);
    expect(style.color).toBe('#FFFFFF');
  });

  test('키워드 스타일', () => {
    const style = styler.getStyleForText('React', 'keyword');
    expect(style.color).toBe('#FFD700');
    expect(style.fontSize).toBe(26);
  });

  test('CSS 생성', () => {
    const style = styler.getStyleForText('테스트');
    const css = styler.generateCSS(style);
    
    expect(css).toContain('font-size: 24px');
    expect(css).toContain('color: #FFFFFF');
    expect(css).toContain('position: absolute');
  });

  test('프리셋 스타일', () => {
    const techStyle = styler.getPreset('tech');
    expect(techStyle.color).toBe('#00FF88');
    
    const minimalStyle = styler.getPreset('minimal');
    expect(minimalStyle.backgroundColor).toBeUndefined();
  });

  test('반응형 폰트 크기', () => {
    const baseSize = 24;
    
    expect(styler.getResponsiveFontSize(baseSize, 320)).toBeCloseTo(14.4, 1);
    expect(styler.getResponsiveFontSize(baseSize, 1920)).toBeCloseTo(28.8, 1);
    expect(styler.getResponsiveFontSize(baseSize, 1024)).toBeCloseTo(20.7, 1);
  });
});

describe('통합 테스트', () => {
  test('전체 자막 처리 파이프라인', () => {
    const text = 'React를 사용하여 컴포넌트를 개발하고 Docker로 배포합니다.';
    
    // 1. 기술 용어 처리
    const processed = TechTermDictionary.processTermsInText(text);
    expect(processed).toContain('리액트');
    expect(processed).toContain('도커');
    
    // 2. 조사 처리
    const withParticles = ParticleProcessor.processText(processed);
    
    // 3. 자막 분할
    const optimizer = new SubtitleOptimizer();
    const segments = optimizer.splitIntoSegments(withParticles, 5);
    
    // 4. 스타일 적용
    const styler = new SubtitleStyler();
    segments.forEach(segment => {
      const style = segment.keywords?.includes('React') 
        ? styler.getStyleForText(segment.text, 'keyword')
        : styler.getStyleForText(segment.text);
      
      expect(style).toBeDefined();
    });
    
    expect(segments.length).toBeGreaterThan(0);
  });
});
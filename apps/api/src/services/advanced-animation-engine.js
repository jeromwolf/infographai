/**
 * Advanced Animation Engine
 * 3단계: 영화 수준의 동적 애니메이션 시스템 (65% → 80%)
 */

class AdvancedAnimationEngine {
  constructor() {
    this.animationLibrary = {
      // 타이핑 애니메이션
      typewriter: this.createTypewriterAnimation,
      codeTyping: this.createCodeTypingAnimation,

      // 차트 성장 애니메이션
      barGrowth: this.createBarGrowthAnimation,
      pieReveal: this.createPieRevealAnimation,
      lineDrawing: this.createLineDrawingAnimation,

      // 모프 변형 애니메이션
      morphShape: this.createMorphAnimation,
      dataTransform: this.createDataTransformAnimation,

      // 파티클 시스템
      dataFlow: this.createDataFlowAnimation,
      sparkleEffect: this.createSparkleAnimation,

      // 카메라 이동
      zoomIn: this.createZoomAnimation,
      slideReveal: this.createSlideRevealAnimation,

      // 3D 효과
      cardFlip: this.createCardFlipAnimation,
      cubeRotation: this.createCubeRotationAnimation
    };

    this.easingFunctions = {
      easeInOut: (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
      easeOut: (t) => t * (2 - t),
      bounce: (t) => {
        const n1 = 7.5625;
        const d1 = 2.75;
        if (t < 1 / d1) return n1 * t * t;
        if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
        if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
      },
      elastic: (t) => {
        const c4 = (2 * Math.PI) / 3;
        return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
      }
    };
  }

  /**
   * 타이핑 애니메이션 - 실제 키보드 타이핑 효과
   */
  createTypewriterAnimation(text, progress, options = {}) {
    const {
      speed = 50, // 밀리초당 문자
      cursor = true,
      blinkSpeed = 500,
      randomDelay = true
    } = options;

    const totalChars = text.length;
    const currentChar = Math.floor(progress * totalChars);
    const visibleText = text.substring(0, currentChar);

    // 커서 깜빡임
    const cursorVisible = cursor && Math.floor(Date.now() / blinkSpeed) % 2 === 0;
    const cursorChar = cursorVisible ? '|' : '';

    // 랜덤 지연 효과
    let displayText = visibleText;
    if (randomDelay && currentChar < totalChars) {
      const randomChance = Math.random();
      if (randomChance < 0.1) { // 10% 확률로 지연
        displayText = visibleText.substring(0, Math.max(0, visibleText.length - 1));
      }
    }

    return {
      text: displayText + cursorChar,
      isComplete: currentChar >= totalChars,
      progress: currentChar / totalChars
    };
  }

  /**
   * 코드 타이핑 애니메이션 - 구문 하이라이팅과 함께
   */
  createCodeTypingAnimation(code, progress, options = {}) {
    const { language = 'javascript', showCursor = true } = options;

    const lines = code.split('\n');
    const totalLines = lines.length;
    const currentLine = Math.floor(progress * totalLines);

    let animatedCode = '';

    for (let i = 0; i <= currentLine && i < totalLines; i++) {
      const line = lines[i];
      if (i === currentLine) {
        // 현재 라인은 타이핑 중
        const lineProgress = (progress * totalLines) - currentLine;
        const visibleChars = Math.floor(lineProgress * line.length);
        const visibleLine = line.substring(0, visibleChars);
        animatedCode += this.highlightCode(visibleLine, language);

        if (showCursor) {
          animatedCode += '<span class="cursor">|</span>';
        }
      } else if (i < currentLine) {
        // 이미 완료된 라인
        animatedCode += this.highlightCode(line, language);
      }

      if (i < totalLines - 1) animatedCode += '\n';
    }

    return {
      html: `<pre><code>${animatedCode}</code></pre>`,
      isComplete: currentLine >= totalLines - 1,
      currentLine,
      totalLines
    };
  }

  /**
   * 막대 차트 성장 애니메이션 - 부드러운 성장과 바운스
   */
  createBarGrowthAnimation(data, progress, options = {}) {
    const { staggerDelay = 0.2, easing = 'bounce' } = options;

    return data.map((item, index) => {
      const itemStartTime = index * staggerDelay;
      const itemProgress = Math.max(0, Math.min(1, (progress - itemStartTime) / (1 - itemStartTime)));

      const easedProgress = this.easingFunctions[easing](itemProgress);
      const animatedValue = item.value * easedProgress;

      return {
        ...item,
        animatedValue,
        height: easedProgress * 100, // 퍼센티지
        opacity: itemProgress > 0 ? 1 : 0,
        scale: itemProgress > 0.8 ? 1 + 0.1 * Math.sin(itemProgress * Math.PI * 4) : 1
      };
    });
  }

  /**
   * 원형 차트 리벨 애니메이션 - 세그먼트별 등장
   */
  createPieRevealAnimation(data, progress, options = {}) {
    const { rotationSpeed = 1, staggerDelay = 0.3 } = options;

    const total = data.reduce((sum, item) => sum + item.value, 0);
    let currentAngle = -90; // 12시 방향에서 시작

    return data.map((item, index) => {
      const segmentAngle = (item.value / total) * 360;
      const itemStartTime = index * staggerDelay;
      const itemProgress = Math.max(0, Math.min(1, (progress - itemStartTime) / (1 - itemStartTime)));

      const animatedAngle = segmentAngle * this.easingFunctions.easeOut(itemProgress);
      const rotation = currentAngle + (rotationSpeed * progress * 360) % 360;

      const result = {
        ...item,
        startAngle: currentAngle,
        endAngle: currentAngle + animatedAngle,
        rotation,
        opacity: itemProgress > 0 ? 1 : 0,
        scale: itemProgress > 0.9 ? 1.05 : 1
      };

      currentAngle += segmentAngle;
      return result;
    });
  }

  /**
   * 선 그래프 그리기 애니메이션 - 패스를 따라 그리기
   */
  createLineDrawingAnimation(points, progress, options = {}) {
    const { smoothing = true, showPoints = true } = options;

    const totalLength = this.calculatePathLength(points);
    const currentLength = totalLength * progress;

    let drawnPath = '';
    let accumulatedLength = 0;
    let visiblePoints = [];

    for (let i = 0; i < points.length - 1; i++) {
      const segmentLength = this.getDistance(points[i], points[i + 1]);

      if (accumulatedLength + segmentLength <= currentLength) {
        // 전체 세그먼트가 그려짐
        visiblePoints.push(points[i]);
        if (i === points.length - 2) visiblePoints.push(points[i + 1]);
      } else if (accumulatedLength < currentLength) {
        // 부분 세그먼트
        const partialProgress = (currentLength - accumulatedLength) / segmentLength;
        const partialPoint = this.interpolatePoint(points[i], points[i + 1], partialProgress);
        visiblePoints.push(points[i], partialPoint);
        break;
      }

      accumulatedLength += segmentLength;
    }

    return {
      visiblePoints,
      pathLength: currentLength,
      totalLength,
      progress,
      showParticles: progress > 0.5, // 중간부터 파티클 효과
      isComplete: progress >= 1
    };
  }

  /**
   * 모프 변형 애니메이션 - 도형간 부드러운 변형
   */
  createMorphAnimation(fromShape, toShape, progress, options = {}) {
    const { easing = 'easeInOut', steps = 20 } = options;

    const easedProgress = this.easingFunctions[easing](progress);

    // SVG 패스 모핑
    const morphedPath = this.interpolatePaths(fromShape.path, toShape.path, easedProgress);

    // 색상 모핑
    const morphedColor = this.interpolateColor(fromShape.color, toShape.color, easedProgress);

    // 위치 모핑
    const morphedPosition = {
      x: fromShape.x + (toShape.x - fromShape.x) * easedProgress,
      y: fromShape.y + (toShape.y - fromShape.y) * easedProgress
    };

    return {
      path: morphedPath,
      color: morphedColor,
      position: morphedPosition,
      progress: easedProgress,
      isComplete: progress >= 1
    };
  }

  /**
   * 데이터 플로우 애니메이션 - 파티클이 이동하는 효과
   */
  createDataFlowAnimation(fromNode, toNode, progress, options = {}) {
    const { particleCount = 5, particleSpeed = 1, particleSize = 3 } = options;

    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const particleOffset = (i / particleCount) * 0.3;
      const particleProgress = (progress + particleOffset) % 1;

      const x = fromNode.x + (toNode.x - fromNode.x) * particleProgress;
      const y = fromNode.y + (toNode.y - fromNode.y) * particleProgress;

      // 파티클 생명주기
      const life = Math.sin(particleProgress * Math.PI);
      const opacity = life * 0.8 + 0.2;
      const size = particleSize * life;

      particles.push({
        x, y, opacity, size,
        color: `hsla(${200 + i * 30}, 80%, 60%, ${opacity})`,
        trail: this.generateParticleTrail(x, y, particleProgress, i)
      });
    }

    return {
      particles,
      progress,
      isActive: true,
      connectionOpacity: Math.sin(progress * Math.PI * 2) * 0.3 + 0.7
    };
  }

  /**
   * 3D 카드 플립 애니메이션
   */
  createCardFlipAnimation(frontContent, backContent, progress, options = {}) {
    const { axis = 'y', perspective = 1000 } = options;

    const rotation = progress * 180;
    const showBack = rotation > 90;

    const transform = `perspective(${perspective}px) rotate${axis.toUpperCase()}(${rotation}deg)`;

    return {
      transform,
      frontVisible: !showBack,
      backVisible: showBack,
      frontOpacity: showBack ? 0 : Math.cos((rotation * Math.PI) / 180),
      backOpacity: showBack ? Math.cos(((rotation - 180) * Math.PI) / 180) : 0,
      shadowIntensity: Math.abs(Math.sin((rotation * Math.PI) / 180)) * 0.3
    };
  }

  /**
   * 구문 하이라이팅 헬퍼
   */
  highlightCode(code, language) {
    const keywords = {
      javascript: ['const', 'let', 'var', 'function', 'class', 'if', 'else', 'for', 'while', 'return'],
      python: ['def', 'class', 'if', 'else', 'elif', 'for', 'while', 'import', 'from', 'return'],
      css: ['color', 'background', 'font-size', 'margin', 'padding', 'display', 'position']
    };

    let highlighted = code;

    if (keywords[language]) {
      keywords[language].forEach(keyword => {
        const regex = new RegExp(`\\b${keyword}\\b`, 'g');
        highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
      });
    }

    // 문자열 하이라이팅
    highlighted = highlighted.replace(/(["'][^"']*["'])/g, '<span class="string">$1</span>');

    // 주석 하이라이팅
    highlighted = highlighted.replace(/(\/\/.*$|#.*$)/gm, '<span class="comment">$1</span>');

    return highlighted;
  }

  /**
   * 색상 보간
   */
  interpolateColor(color1, color2, progress) {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * progress);
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * progress);
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * progress);

    return `rgb(${r}, ${g}, ${b})`;
  }

  /**
   * 16진수 색상을 RGB로 변환
   */
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 };
  }

  /**
   * 두 점 사이의 거리 계산
   */
  getDistance(p1, p2) {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  }

  /**
   * 점 보간
   */
  interpolatePoint(p1, p2, progress) {
    return {
      x: p1.x + (p2.x - p1.x) * progress,
      y: p1.y + (p2.y - p1.y) * progress
    };
  }

  /**
   * 패스 길이 계산
   */
  calculatePathLength(points) {
    let totalLength = 0;
    for (let i = 0; i < points.length - 1; i++) {
      totalLength += this.getDistance(points[i], points[i + 1]);
    }
    return totalLength;
  }

  /**
   * 파티클 트레일 생성
   */
  generateParticleTrail(x, y, progress, particleIndex) {
    const trailLength = 3;
    const trail = [];

    for (let i = 0; i < trailLength; i++) {
      const trailProgress = Math.max(0, progress - (i * 0.05));
      const trailOpacity = (1 - i / trailLength) * 0.5;

      trail.push({
        x: x - (i * 2),
        y: y - (i * 2),
        opacity: trailOpacity,
        size: (trailLength - i) * 1
      });
    }

    return trail;
  }

  /**
   * SVG 패스 보간 (간단한 버전)
   */
  interpolatePaths(path1, path2, progress) {
    // 간단한 패스 모핑 구현
    // 실제로는 더 복잡한 알고리즘이 필요
    return progress < 0.5 ? path1 : path2;
  }

  /**
   * 애니메이션 적용
   */
  applyAnimation(element, animationType, progress, options = {}) {
    if (this.animationLibrary[animationType]) {
      return this.animationLibrary[animationType].call(this, element, progress, options);
    }
    return element;
  }
}

module.exports = { AdvancedAnimationEngine };
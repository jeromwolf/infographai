"use strict";
/**
 * 한국어 조사 처리기
 * 받침 유무에 따른 조사 자동 선택
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.particleExamples = exports.ParticleProcessor = void 0;
class ParticleProcessor {
    /**
     * 한글 문자의 받침 여부 확인
     */
    static hasJongsung(char) {
        const charCode = char.charCodeAt(0);
        // 한글 범위 체크 (가 ~ 힣)
        if (charCode < 0xAC00 || charCode > 0xD7A3) {
            // 한글이 아닌 경우 (숫자, 영어 등)
            // 영어는 받침 없음으로 처리, 숫자는 읽는 방식으로 판단
            if (/[0-9]/.test(char)) {
                const lastDigit = char[char.length - 1];
                const jongseongNumbers = ['1', '3', '6', '7', '8'];
                return jongseongNumbers.includes(lastDigit);
            }
            return false;
        }
        // 한글 유니코드 구조: ((초성 * 21) + 중성) * 28 + 종성 + 0xAC00
        const jongseong = (charCode - 0xAC00) % 28;
        return jongseong !== 0;
    }
    /**
     * 단어의 마지막 글자 받침 확인
     */
    static getLastCharHasJongsung(word) {
        if (!word || word.length === 0)
            return false;
        const lastChar = word[word.length - 1];
        return this.hasJongsung(lastChar);
    }
    /**
     * 조사 자동 선택
     */
    static selectParticle(word, particleType) {
        const hasJongsung = this.getLastCharHasJongsung(word);
        const particles = {
            subject: ['이', '가'], // 이/가
            topic: ['은', '는'], // 은/는
            object: ['을', '를'], // 을/를
            direction: ['으로', '로'], // 으로/로
            and: ['과', '와'], // 과/와
            from: ['으로부터', '로부터'], // 으로부터/로부터
            possession: ['의', '의'], // 의 (변화 없음)
            also: ['도', '도'], // 도 (변화 없음)
            only: ['만', '만'], // 만 (변화 없음)
        };
        const [withJongsung, withoutJongsung] = particles[particleType];
        return hasJongsung ? withJongsung : withoutJongsung;
    }
    /**
     * 문장에서 조사 자동 교정
     */
    static processText(text) {
        // 조사 패턴 정의
        const patterns = [
            { regex: /(\S+)(이|가)\b/g, type: 'subject' },
            { regex: /(\S+)(은|는)\b/g, type: 'topic' },
            { regex: /(\S+)(을|를)\b/g, type: 'object' },
            { regex: /(\S+)(으로|로)\b/g, type: 'direction' },
            { regex: /(\S+)(과|와)\b/g, type: 'and' },
        ];
        let processedText = text;
        patterns.forEach(({ regex, type }) => {
            processedText = processedText.replace(regex, (_match, word) => {
                const correctParticle = this.selectParticle(word, type);
                return word + correctParticle;
            });
        });
        return processedText;
    }
    /**
     * 기술 용어 + 조사 처리
     * 예: "React를", "Docker로", "Kubernetes는"
     */
    static attachParticle(word, particleType) {
        const particle = this.selectParticle(word, particleType);
        return `${word}${particle}`;
    }
}
exports.ParticleProcessor = ParticleProcessor;
// 사용 예시
exports.particleExamples = {
    // 받침 있는 경우
    "React": {
        subject: "React가", // 영어는 받침 없음
        topic: "React는",
        object: "React를",
    },
    "Python": {
        subject: "Python이", // n으로 끝나지만 영어라서 받침 없음으로 처리
        topic: "Python은",
        object: "Python을",
    },
    "개발": {
        subject: "개발이", // ㄹ 받침
        topic: "개발은",
        object: "개발을",
    },
    "코드": {
        subject: "코드가", // 받침 없음
        topic: "코드는",
        object: "코드를",
    }
};

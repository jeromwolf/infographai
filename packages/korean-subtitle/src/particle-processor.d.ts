/**
 * 한국어 조사 처리기
 * 받침 유무에 따른 조사 자동 선택
 */
export declare class ParticleProcessor {
    /**
     * 한글 문자의 받침 여부 확인
     */
    private static hasJongsung;
    /**
     * 단어의 마지막 글자 받침 확인
     */
    static getLastCharHasJongsung(word: string): boolean;
    /**
     * 조사 자동 선택
     */
    static selectParticle(word: string, particleType: ParticleType): string;
    /**
     * 문장에서 조사 자동 교정
     */
    static processText(text: string): string;
    /**
     * 기술 용어 + 조사 처리
     * 예: "React를", "Docker로", "Kubernetes는"
     */
    static attachParticle(word: string, particleType: ParticleType): string;
}
export type ParticleType = 'subject' | 'topic' | 'object' | 'direction' | 'and' | 'from' | 'possession' | 'also' | 'only';
export declare const particleExamples: {
    React: {
        subject: string;
        topic: string;
        object: string;
    };
    Python: {
        subject: string;
        topic: string;
        object: string;
    };
    개발: {
        subject: string;
        topic: string;
        object: string;
    };
    코드: {
        subject: string;
        topic: string;
        object: string;
    };
};
//# sourceMappingURL=particle-processor.d.ts.map
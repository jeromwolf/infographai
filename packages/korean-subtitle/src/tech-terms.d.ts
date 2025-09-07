/**
 * IT 기술 용어 사전
 * 한영 혼용 처리 및 번역 결정
 */
export interface TechTerm {
    english: string;
    korean?: string;
    pronunciation?: string;
    preferKorean: boolean;
    category: TermCategory;
    description?: string;
}
export type TermCategory = 'language' | 'framework' | 'database' | 'cloud' | 'devops' | 'concept' | 'pattern' | 'tool';
export declare class TechTermDictionary {
    private static terms;
    /**
     * 용어 검색
     */
    static lookup(term: string): TechTerm | undefined;
    /**
     * 용어 번역 결정
     */
    static translate(term: string, forceKorean?: boolean): string;
    /**
     * 문장에서 기술 용어 자동 처리
     */
    static processTermsInText(text: string): string;
    /**
     * 용어 추가
     */
    static addTerm(key: string, term: TechTerm): void;
    /**
     * 카테고리별 용어 목록
     */
    static getTermsByCategory(category: TermCategory): TechTerm[];
    /**
     * 용어 통계
     */
    static getStats(): {
        total: number;
        byCategory: Record<TermCategory, number>;
        preferKorean: number;
    };
}
//# sourceMappingURL=tech-terms.d.ts.map
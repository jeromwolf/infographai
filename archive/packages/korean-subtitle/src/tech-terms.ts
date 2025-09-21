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

export type TermCategory = 
  | 'language'
  | 'framework'
  | 'database'
  | 'cloud'
  | 'devops'
  | 'concept'
  | 'pattern'
  | 'tool';

export class TechTermDictionary {
  private static terms: Map<string, TechTerm> = new Map([
    // Programming Languages
    ['javascript', {
      english: 'JavaScript',
      korean: '자바스크립트',
      pronunciation: '자바스크립트',
      preferKorean: true,
      category: 'language'
    }],
    ['typescript', {
      english: 'TypeScript',
      korean: '타입스크립트',
      pronunciation: '타입스크립트',
      preferKorean: true,
      category: 'language'
    }],
    ['python', {
      english: 'Python',
      korean: '파이썬',
      pronunciation: '파이썬',
      preferKorean: true,
      category: 'language'
    }],
    
    // Frameworks
    ['react', {
      english: 'React',
      korean: '리액트',
      pronunciation: '리액트',
      preferKorean: true,
      category: 'framework'
    }],
    ['vue', {
      english: 'Vue',
      korean: '뷰',
      pronunciation: '뷰',
      preferKorean: false, // Vue는 영어 그대로가 더 자연스러움
      category: 'framework'
    }],
    ['nextjs', {
      english: 'Next.js',
      korean: '넥스트',
      pronunciation: '넥스트제이에스',
      preferKorean: false,
      category: 'framework'
    }],
    
    // Databases
    ['database', {
      english: 'Database',
      korean: '데이터베이스',
      pronunciation: '데이터베이스',
      preferKorean: true,
      category: 'database'
    }],
    ['postgresql', {
      english: 'PostgreSQL',
      korean: '포스트그레SQL',
      pronunciation: '포스트그레에스큐엘',
      preferKorean: false,
      category: 'database'
    }],
    ['mongodb', {
      english: 'MongoDB',
      korean: '몽고DB',
      pronunciation: '몽고디비',
      preferKorean: false,
      category: 'database'
    }],
    
    // Cloud & DevOps
    ['docker', {
      english: 'Docker',
      korean: '도커',
      pronunciation: '도커',
      preferKorean: true,
      category: 'devops'
    }],
    ['kubernetes', {
      english: 'Kubernetes',
      korean: '쿠버네티스',
      pronunciation: '쿠버네티스',
      preferKorean: true,
      category: 'devops'
    }],
    ['aws', {
      english: 'AWS',
      korean: 'AWS',
      pronunciation: '에이더블유에스',
      preferKorean: false,
      category: 'cloud'
    }],
    
    // Concepts
    ['api', {
      english: 'API',
      korean: 'API',
      pronunciation: '에이피아이',
      preferKorean: false,
      category: 'concept'
    }],
    ['frontend', {
      english: 'Frontend',
      korean: '프론트엔드',
      pronunciation: '프론트엔드',
      preferKorean: true,
      category: 'concept'
    }],
    ['backend', {
      english: 'Backend',
      korean: '백엔드',
      pronunciation: '백엔드',
      preferKorean: true,
      category: 'concept'
    }],
    ['server', {
      english: 'Server',
      korean: '서버',
      pronunciation: '서버',
      preferKorean: true,
      category: 'concept'
    }],
    ['client', {
      english: 'Client',
      korean: '클라이언트',
      pronunciation: '클라이언트',
      preferKorean: true,
      category: 'concept'
    }],
    
    // Patterns
    ['mvc', {
      english: 'MVC',
      korean: 'MVC',
      pronunciation: '엠브이씨',
      preferKorean: false,
      category: 'pattern'
    }],
    ['restful', {
      english: 'RESTful',
      korean: 'RESTful',
      pronunciation: '레스트풀',
      preferKorean: false,
      category: 'pattern'
    }],
    ['graphql', {
      english: 'GraphQL',
      korean: 'GraphQL',
      pronunciation: '그래프큐엘',
      preferKorean: false,
      category: 'pattern'
    }],
  ]);

  /**
   * 용어 검색
   */
  public static lookup(term: string): TechTerm | undefined {
    return this.terms.get(term.toLowerCase());
  }

  /**
   * 용어 번역 결정
   */
  public static translate(term: string, forceKorean: boolean = false): string {
    const entry = this.lookup(term);
    
    if (!entry) {
      return term; // 사전에 없으면 원본 반환
    }

    if (forceKorean && entry.korean) {
      return entry.korean;
    }

    return entry.preferKorean && entry.korean ? entry.korean : entry.english;
  }

  /**
   * 문장에서 기술 용어 자동 처리
   */
  public static processTermsInText(text: string): string {
    let processed = text;

    // 대소문자 구분 없이 찾되, 원본 케이스 유지
    this.terms.forEach((_term, key) => {
      const pattern = new RegExp(`\\b${key}\\b`, 'gi');
      processed = processed.replace(pattern, (match) => {
        return this.translate(match);
      });
    });

    return processed;
  }

  /**
   * 용어 추가
   */
  public static addTerm(key: string, term: TechTerm): void {
    this.terms.set(key.toLowerCase(), term);
  }

  /**
   * 카테고리별 용어 목록
   */
  public static getTermsByCategory(category: TermCategory): TechTerm[] {
    return Array.from(this.terms.values()).filter(term => term.category === category);
  }

  /**
   * 용어 통계
   */
  public static getStats(): {
    total: number;
    byCategory: Record<TermCategory, number>;
    preferKorean: number;
  } {
    const terms = Array.from(this.terms.values());
    const byCategory = {} as Record<TermCategory, number>;
    
    terms.forEach(term => {
      byCategory[term.category] = (byCategory[term.category] || 0) + 1;
    });

    return {
      total: terms.length,
      byCategory,
      preferKorean: terms.filter(t => t.preferKorean).length
    };
  }
}
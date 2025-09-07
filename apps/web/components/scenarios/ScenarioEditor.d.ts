/**
 * 시나리오 편집기 컴포넌트
 */
import React from 'react';
interface Scene {
    id?: string;
    title: string;
    content: string;
    duration: number;
    visualType: string;
    visualPrompt?: string;
    subtitles?: Array<{
        text: string;
        startTime: number;
        endTime: number;
    }>;
}
interface ScenarioData {
    id?: string;
    title: string;
    description: string;
    type: 'auto' | 'user' | 'hybrid';
    scenes: Scene[];
    metadata?: {
        keywords?: string[];
        targetAudience?: string;
        language?: string;
        style?: string;
    };
}
interface ScenarioEditorProps {
    scenarioId?: string;
    projectId: string;
    onSave?: (scenario: ScenarioData) => void;
    onCancel?: () => void;
}
export default function ScenarioEditor({ scenarioId, projectId, onSave, onCancel }: ScenarioEditorProps): React.JSX.Element;
export {};
//# sourceMappingURL=ScenarioEditor.d.ts.map
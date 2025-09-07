/**
 * 시나리오 템플릿 선택기 컴포넌트
 */
import React from 'react';
interface Template {
    id: string;
    name: string;
    displayName: string;
    description: string;
    category: string;
    structure: string[];
    defaultDuration: number;
    variables?: string[];
    icon?: React.ElementType;
}
interface ScenarioTemplateSelectorProps {
    projectId: string;
    onSelect: (template: Template, variables?: Record<string, any>) => void;
    onCancel?: () => void;
}
export default function ScenarioTemplateSelector({ projectId, onSelect, onCancel }: ScenarioTemplateSelectorProps): React.JSX.Element;
export {};
//# sourceMappingURL=ScenarioTemplateSelector.d.ts.map